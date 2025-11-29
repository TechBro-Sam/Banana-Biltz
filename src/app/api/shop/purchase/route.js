import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { item_key, quantity = 1 } = body;

    // Validate inputs
    if (!item_key) {
      return Response.json(
        {
          error: "Missing required field: item_key",
        },
        { status: 400 },
      );
    }

    if (quantity < 1 || quantity > 10) {
      return Response.json(
        {
          error: "Quantity must be between 1 and 10",
        },
        { status: 400 },
      );
    }

    // Get shop item
    const [item] = await sql`
      SELECT id, key, name, price_cents, description, active
      FROM shop_items 
      WHERE key = ${item_key} AND active = true
      LIMIT 1
    `;

    if (!item) {
      return Response.json(
        { error: "Item not found or not available" },
        { status: 404 },
      );
    }

    const totalCost = item.price_cents * quantity;

    // Execute purchase transaction
    let finalBalance = 0;
    let purchaseId = "";

    await sql.transaction(async (txn) => {
      // Get user's wallet
      const [wallet] = await txn`
        SELECT id, balance_cents 
        FROM wallets 
        WHERE user_id = ${userId} 
        LIMIT 1
      `;

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      if (wallet.balance_cents < totalCost) {
        throw new Error("Insufficient balance");
      }

      // Deduct cost from wallet
      const newBalance = wallet.balance_cents - totalCost;

      // Record purchase transaction
      const [transaction] = await txn`
        INSERT INTO transactions (wallet_id, user_id, type, amount_cents, balance_after_cents, reference, metadata)
        VALUES (
          ${wallet.id},
          ${userId},
          'adjustment',
          ${-totalCost},
          ${newBalance},
          'shop_purchase',
          ${JSON.stringify({
            item_key: item_key,
            item_name: item.name,
            quantity: quantity,
            unit_price_cents: item.price_cents,
            purchase_type: "shop_item",
          })}
        )
        RETURNING id
      `;

      purchaseId = transaction.id;

      // Update wallet balance
      await txn`
        UPDATE wallets 
        SET balance_cents = ${newBalance}, updated_at = NOW()
        WHERE id = ${wallet.id}
      `;

      finalBalance = newBalance;
    });

    return Response.json({
      purchase_id: purchaseId,
      item: {
        key: item.key,
        name: item.name,
        price_cents: item.price_cents,
        price: item.price_cents / 100,
      },
      quantity,
      total_cost_cents: totalCost,
      total_cost: totalCost / 100,
      balance_after_cents: finalBalance,
      balance_after: finalBalance / 100,
      message: `Successfully purchased ${quantity}x ${item.name}!`,
    });
  } catch (error) {
    console.error("POST /api/shop/purchase error:", error);

    if (error.message === "Insufficient balance") {
      return Response.json({ error: error.message }, { status: 400 });
    }

    if (error.message === "Wallet not found") {
      return Response.json({ error: "Wallet not found" }, { status: 404 });
    }

    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
