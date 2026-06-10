import { NextResponse } from "next/server";

const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID || "YOUR_IGDB_CLIENT_ID";
const IGDB_ACCESS_TOKEN =
  process.env.IGDB_ACCESS_TOKEN || "YOUR_IGDB_ACCESS_TOKEN";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": IGDB_CLIENT_ID,
        Authorization: `Bearer ${IGDB_ACCESS_TOKEN}`,
        "Content-Type": "text/plain",
      },
      body: `search "${query}"; fields name, cover.image_id, first_release_date, total_rating; limit 10;`,
    });

    if (!response.ok) {
      throw new Error(`IGDB API responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("IGDB proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 },
    );
  }
}
