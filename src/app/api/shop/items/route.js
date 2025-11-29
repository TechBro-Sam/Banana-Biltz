import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all active shop items
    const items = await sql`
      SELECT id, key, name, price_cents, description, active, created_at
      FROM shop_items 
      WHERE active = true
      ORDER BY price_cents ASC
    `;

    return Response.json({
      items: items.map((item) => ({
        id: item.id,
        key: item.key,
        name: item.name,
        price_cents: item.price_cents,
        price: item.price_cents / 100,
        description: item.description,
        created_at: item.created_at,
      })),
    });
  } catch (error) {
    console.error("GET /api/shop/items error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const [user] = await sql`
      SELECT role FROM auth_users WHERE id = ${session.user.id} LIMIT 1
    `;

    if (!user || user.role !== "admin") {
      return Response.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { key, name, price_cents, description } = body;

    // Validate inputs
    if (!key || !name || !price_cents) {
      return Response.json(
        {
          error: "Missing required fields: key, name, price_cents",
        },
        { status: 400 },
      );
    }

    if (price_cents < 1 || price_cents > 100000) {
      return Response.json(
        {
          error: "Price must be between $0.01 and $1000.00",
        },
        { status: 400 },
      );
    }

    // Create new shop item
    const [newItem] = await sql`
      INSERT INTO shop_items (key, name, price_cents, description)
      VALUES (${key}, ${name}, ${price_cents}, ${description || ""})
      RETURNING id, key, name, price_cents, description, active, created_at
    `;

    return Response.json(
      {
        item: {
          id: newItem.id,
          key: newItem.key,
          name: newItem.name,
          price_cents: newItem.price_cents,
          price: newItem.price_cents / 100,
          description: newItem.description,
          active: newItem.active,
          created_at: newItem.created_at,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/shop/items error:", error);

    if (error.constraint === "shop_items_key_key") {
      return Response.json(
        { error: "Item key already exists" },
        { status: 409 },
      );
    }

    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
