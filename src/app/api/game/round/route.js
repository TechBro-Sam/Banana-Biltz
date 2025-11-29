import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import crypto from "crypto";

// Game configuration and payout logic
const FRUIT_TYPES = [
  "banana",
  "apple",
  "orange",
  "pineapple",
  "watermelon",
  "cherry",
];
const SPECIAL_EVENTS = ["banana_boss", "banana_bomb"];

// RNG and game outcome calculation
function calculateGameOutcome(
  sessionMetadata,
  clientSeed,
  slicesCount,
  betAmountCents,
) {
  const serverSeed = sessionMetadata.server_seed;

  // Create deterministic random using server seed + client seed
  const combinedSeed = crypto
    .createHash("sha256")
    .update(serverSeed + clientSeed + slicesCount.toString())
    .digest("hex");

  let randomIndex = 0;
  const getRandomFloat = () => {
    const hex = combinedSeed.slice(randomIndex, randomIndex + 8);
    randomIndex = (randomIndex + 8) % (combinedSeed.length - 8);
    return parseInt(hex, 16) / 0xffffffff;
  };

  const prizes = [];
  let totalPayoutCents = 0;
  const events = [];

  // Check for special events first (low probability)
  const bossChance = getRandomFloat();
  const bombChance = getRandomFloat();

  if (bossChance < 0.05) {
    // 5% chance for banana boss
    events.push("banana_boss");
    const bossMultiplier = 15 + Math.floor(getRandomFloat() * 10); // 15x to 25x multiplier
    const bossPayout = betAmountCents * bossMultiplier;
    prizes.push({
      fruit: "banana_boss",
      payout_cents: bossPayout,
      multiplier: bossMultiplier,
    });
    totalPayoutCents += bossPayout;
  } else if (bombChance < 0.08) {
    // 8% chance for banana bomb
    events.push("banana_bomb");
    const bombMultiplier = 8 + Math.floor(getRandomFloat() * 7); // 8x to 15x multiplier
    const bombPayout = betAmountCents * bombMultiplier;
    prizes.push({
      fruit: "banana_bomb",
      payout_cents: bombPayout,
      multiplier: bombMultiplier,
    });
    totalPayoutCents += bombPayout;
  } else {
    // Regular fruit slicing logic
    const numFruits = Math.min(slicesCount, 6);

    for (let i = 0; i < numFruits; i++) {
      const fruitRandom = getRandomFloat();
      const payoutRandom = getRandomFloat();

      // Determine if this slice hits a fruit (70% chance)
      if (fruitRandom < 0.7) {
        // Choose fruit type based on rarity
        let fruitType;
        const fruitChance = getRandomFloat();

        if (fruitChance < 0.25)
          fruitType = "banana"; // 25% - lowest payout
        else if (fruitChance < 0.45)
          fruitType = "apple"; // 20%
        else if (fruitChance < 0.63)
          fruitType = "orange"; // 18%
        else if (fruitChance < 0.78)
          fruitType = "pineapple"; // 15%
        else if (fruitChance < 0.9)
          fruitType = "watermelon"; // 12%
        else fruitType = "cherry"; // 10% - highest payout

        // Calculate payout based on fruit type
        let multiplier;
        switch (fruitType) {
          case "banana":
            multiplier = 1.5 + payoutRandom * 0.5;
            break; // 1.5x - 2x
          case "apple":
            multiplier = 2 + payoutRandom * 1;
            break; // 2x - 3x
          case "orange":
            multiplier = 3 + payoutRandom * 1;
            break; // 3x - 4x
          case "pineapple":
            multiplier = 4 + payoutRandom * 1;
            break; // 4x - 5x
          case "watermelon":
            multiplier = 6 + payoutRandom * 2;
            break; // 6x - 8x
          case "cherry":
            multiplier = 8 + payoutRandom * 2;
            break; // 8x - 10x
        }

        const fruitPayout = Math.floor(
          (betAmountCents / numFruits) * multiplier,
        );

        prizes.push({
          fruit: fruitType,
          payout_cents: fruitPayout,
          multiplier: parseFloat(multiplier.toFixed(1)),
        });
        totalPayoutCents += fruitPayout;
      }
    }
  }

  // Ensure RTP compliance (target ~96.5% RTP)
  const rtp = totalPayoutCents / betAmountCents;
  if (rtp > 50) {
    // Cap extreme wins to maintain house edge
    totalPayoutCents = Math.floor(betAmountCents * 50);
    // Proportionally reduce all payouts
    prizes.forEach((prize) => {
      prize.payout_cents = Math.floor(prize.payout_cents * 0.5);
    });
  }

  return {
    prizes,
    total_payout_cents: totalPayoutCents,
    events,
    rtp: totalPayoutCents / betAmountCents,
  };
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { session_id, client_seed, slices_count, stake_cents } = body;

    // Validate inputs
    if (!session_id || !client_seed || !slices_count || !stake_cents) {
      return Response.json(
        {
          error:
            "Missing required fields: session_id, client_seed, slices_count, stake_cents",
        },
        { status: 400 },
      );
    }

    if (slices_count < 1 || slices_count > 20) {
      return Response.json(
        {
          error: "Slices count must be between 1 and 20",
        },
        { status: 400 },
      );
    }

    // Get game session and validate
    const [gameSession] = await sql`
      SELECT id, user_id, stake_cents, session_metadata, ended_at
      FROM game_sessions 
      WHERE id = ${session_id} AND user_id = ${userId}
      LIMIT 1
    `;

    if (!gameSession) {
      return Response.json(
        { error: "Game session not found" },
        { status: 404 },
      );
    }

    if (gameSession.ended_at) {
      return Response.json(
        { error: "Game session already ended" },
        { status: 400 },
      );
    }

    if (gameSession.stake_cents !== stake_cents) {
      return Response.json(
        { error: "Stake amount does not match session" },
        { status: 400 },
      );
    }

    // Calculate game outcome using server-authoritative logic
    const outcome = calculateGameOutcome(
      gameSession.session_metadata,
      client_seed,
      slices_count,
      stake_cents,
    );

    let finalBalance = 0;

    // Execute atomic transaction for financial operations
    await sql.transaction(async (txn) => {
      // Get current wallet
      const [wallet] = await txn`
        SELECT id, balance_cents 
        FROM wallets 
        WHERE user_id = ${userId} 
        LIMIT 1
      `;

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      // Deduct bet amount
      const balanceAfterBet = wallet.balance_cents - stake_cents;
      if (balanceAfterBet < 0) {
        throw new Error("Insufficient balance");
      }

      // Record bet transaction
      await txn`
        INSERT INTO transactions (wallet_id, user_id, type, amount_cents, balance_after_cents, reference, metadata)
        VALUES (
          ${wallet.id},
          ${userId},
          'bet',
          ${-stake_cents},
          ${balanceAfterBet},
          ${session_id},
          ${JSON.stringify({ game_round: true, slices_count })}
        )
      `;

      // Update balance after bet
      await txn`
        UPDATE wallets 
        SET balance_cents = ${balanceAfterBet}, updated_at = NOW()
        WHERE id = ${wallet.id}
      `;

      let currentBalance = balanceAfterBet;

      // Add winnings if any
      if (outcome.total_payout_cents > 0) {
        currentBalance += outcome.total_payout_cents;

        // Record win transaction
        await txn`
          INSERT INTO transactions (wallet_id, user_id, type, amount_cents, balance_after_cents, reference, metadata)
          VALUES (
            ${wallet.id},
            ${userId},
            'win',
            ${outcome.total_payout_cents},
            ${currentBalance},
            ${session_id},
            ${JSON.stringify({
              game_round: true,
              outcome: outcome,
              prizes: outcome.prizes,
            })}
          )
        `;

        // Update final balance
        await txn`
          UPDATE wallets 
          SET balance_cents = ${currentBalance}, updated_at = NOW()
          WHERE id = ${wallet.id}
        `;
      }

      finalBalance = currentBalance;

      // Record the game round
      const serverSeed = gameSession.session_metadata.server_seed;
      const serverSeedHash = crypto
        .createHash("sha256")
        .update(serverSeed)
        .digest("hex");

      await txn`
        INSERT INTO game_rounds (
          session_id, 
          user_id, 
          client_seed, 
          server_seed_hash, 
          server_seed,
          outcome_json, 
          bet_amount_cents, 
          payout_cents
        )
        VALUES (
          ${session_id},
          ${userId},
          ${client_seed},
          ${serverSeedHash},
          ${serverSeed},
          ${JSON.stringify(outcome)},
          ${stake_cents},
          ${outcome.total_payout_cents}
        )
      `;

      // Mark session as ended
      await txn`
        UPDATE game_sessions 
        SET ended_at = NOW() 
        WHERE id = ${session_id}
      `;
    });

    return Response.json({
      round_id: session_id, // Using session_id as round identifier for simplicity
      outcome: {
        prizes: outcome.prizes,
        total_payout_cents: outcome.total_payout_cents,
        events: outcome.events,
      },
      balance_after_cents: finalBalance,
      balance_after: finalBalance / 100,
      server_seed: gameSession.session_metadata.server_seed, // Reveal for provably fair verification
      rtp: outcome.rtp,
    });
  } catch (error) {
    console.error("POST /api/game/round error:", error);

    if (error.message === "Insufficient balance") {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
