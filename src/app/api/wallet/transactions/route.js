import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = Math.min(
      parseInt(url.searchParams.get("limit") || "20"),
      100,
    );
    const type = url.searchParams.get("type"); // Filter by transaction type
    const offset = (page - 1) * limit;

    // Build query with optional type filter
    let whereClause = "WHERE user_id = $1";
    let params = [userId];

    if (type) {
      whereClause += " AND type = $2";
      params.push(type);
    }

    // Get transactions
    const transactions = await sql(
      `SELECT 
        id,
        type,
        amount_cents,
        balance_after_cents,
        reference,
        created_at,
        metadata
      FROM transactions 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset],
    );

    // Get total count
    const [{ count }] = await sql(
      `SELECT COUNT(*) as count FROM transactions ${whereClause}`,
      params,
    );

    return Response.json({
      transactions: transactions.map((tx) => ({
        id: tx.id,
        type: tx.type,
        amount_cents: tx.amount_cents,
        amount: tx.amount_cents / 100,
        balance_after_cents: tx.balance_after_cents,
        balance_after: tx.balance_after_cents / 100,
        reference: tx.reference,
        created_at: tx.created_at,
        metadata: tx.metadata,
      })),
      pagination: {
        page,
        limit,
        total: parseInt(count),
        total_pages: Math.ceil(count / limit),
        has_next: page * limit < count,
        has_previous: page > 1,
      },
    });
  } catch (error) {
    console.error("GET /api/wallet/transactions error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
