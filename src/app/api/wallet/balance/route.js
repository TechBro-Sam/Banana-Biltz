import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get or create wallet for user
    let wallet = await sql`
      SELECT id, balance_cents, currency 
      FROM wallets 
      WHERE user_id = ${userId} 
      LIMIT 1
    `;

    if (wallet.length === 0) {
      // Create new wallet with $100 welcome bonus
      const welcomeBonus = 10000; // 10000 cents = $100

      await sql.transaction(async (txn) => {
        const [newWallet] = await txn`
          INSERT INTO wallets (user_id, balance_cents, currency)
          VALUES (${userId}, ${welcomeBonus}, 'USD')
          RETURNING id, balance_cents, currency
        `;

        // Record the welcome bonus transaction
        await txn`
          INSERT INTO transactions (wallet_id, user_id, type, amount_cents, balance_after_cents, reference, metadata)
          VALUES (
            ${newWallet.id},
            ${userId},
            'deposit',
            ${welcomeBonus},
            ${welcomeBonus},
            'welcome_bonus',
            '{"description": "Welcome bonus for new player"}'
          )
        `;

        wallet = [newWallet];
      });
    }

    const userWallet = wallet[0];

    return Response.json({
      balance_cents: userWallet.balance_cents,
      balance: userWallet.balance_cents / 100,
      currency: userWallet.currency,
    });
  } catch (error) {
    console.error("GET /api/wallet/balance error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
