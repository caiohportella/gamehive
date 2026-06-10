import { NextResponse } from "next/server";

const STEAM_API_KEY = process.env.STEAM_API_KEY || "YOUR_STEAM_API_KEY";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const appId = params.id;

  try {
    const response = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appId}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error(`Steam API responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Steam proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Steam info" },
      { status: 500 },
    );
  }
}
