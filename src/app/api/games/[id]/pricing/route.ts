import { NextResponse } from "next/server";

const ITAD_API_KEY = process.env.ITAD_API_KEY || "YOUR_ISTHEREANYDEAL_API_KEY";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const gameId = params.id;

  try {
    // Note: ITAD requires mapping IGDB IDs or using text search, but for this proxy we use a placeholder endpoint pattern.
    const response = await fetch(
      `https://api.isthereanydeal.com/v01/game/prices/?key=${ITAD_API_KEY}&plains=${gameId}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error(`ITAD API responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("ITAD proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pricing info" },
      { status: 500 },
    );
  }
}
