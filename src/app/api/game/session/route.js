import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import crypto from "crypto";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { stake_cents } = body;

    // Validate stake amount
    if (!stake_cents || stake_cents < 10 || stake_cents > 100000) {
      return Response.json(
        {
          error: "Invalid stake amount. Must be between $0.10 and $1000.00",
        },
        { status: 400 },
      );
    }

    // Check if user has sufficient balance
    const [wallet] = await sql`
      SELECT id, balance_cents 
      FROM wallets 
      WHERE user_id = ${userId} 
      LIMIT 1
    `;

    if (!wallet || wallet.balance_cents < stake_cents) {
      return Response.json(
        {
          error: "Insufficient balance",
        },
        { status: 400 },
      );
    }

    // Generate server seed for provably fair gaming
    const serverSeed = crypto.randomBytes(32).toString("hex");
    const serverSeedHash = crypto
      .createHash("sha256")
      .update(serverSeed)
      .digest("hex");

    // Create game session
    const [gameSession] = await sql`
      INSERT INTO game_sessions (user_id, stake_cents, session_metadata)
      VALUES (
        ${userId},
        ${stake_cents},
        ${JSON.stringify({
          server_seed: serverSeed,
          server_seed_hash: serverSeedHash,
          created_at: new Date().toISOString(),
        })}
      )
      RETURNING id, created_at
    `;

    return Response.json({
      session_id: gameSession.id,
      server_seed_hash: serverSeedHash,
      stake_cents,
      created_at: gameSession.created_at,
    });
  } catch (error) {
    console.error("POST /api/game/session error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("session_id");

    if (!sessionId) {
      // Get recent sessions
      const sessions = await sql`
        SELECT id, stake_cents, created_at, ended_at
        FROM game_sessions 
        WHERE user_id = ${userId}
        ORDER BY created_at DESC 
        LIMIT 10
      `;

      return Response.json({
        sessions: sessions.map((s) => ({
          id: s.id,
          stake_cents: s.stake_cents,
          stake: s.stake_cents / 100,
          created_at: s.created_at,
          ended_at: s.ended_at,
          status: s.ended_at ? "completed" : "active",
        })),
      });
    } else {
      // Get specific session
      const [gameSession] = await sql`
        SELECT id, stake_cents, created_at, ended_at, session_metadata
        FROM game_sessions 
        WHERE id = ${sessionId} AND user_id = ${userId}
        LIMIT 1
      `;

      if (!gameSession) {
        return Response.json({ error: "Session not found" }, { status: 404 });
      }

      return Response.json({
        id: gameSession.id,
        stake_cents: gameSession.stake_cents,
        stake: gameSession.stake_cents / 100,
        created_at: gameSession.created_at,
        ended_at: gameSession.ended_at,
        status: gameSession.ended_at ? "completed" : "active",
        metadata: gameSession.session_metadata,
      });
    }
  } catch (error) {
    console.error("GET /api/game/session error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
