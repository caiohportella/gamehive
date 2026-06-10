import { GameDetails } from "@/components/game/GameDetails";

// In a real app, this would fetch from our IGDB proxy
async function getGameData(id: string) {
  // Mock data for now since we need an actual IGDB Client ID and token
  // If we had the env vars, we would call: await fetch(`http://localhost:3000/api/games?q=${id}`)
  return {
    id: parseInt(id),
    name: `Game ${id}`,
    summary:
      "This is an amazing game that you should definitely play. It features cutting edge graphics, a gripping story, and innovative gameplay mechanics that will keep you engaged for hours.",
    first_release_date: Math.floor(Date.now() / 1000) - 31536000, // 1 year ago
    total_rating: 89.5,
  };
}

export default async function GamePage({ params }: { params: { id: string } }) {
  const game = await getGameData(params.id);

  return (
    <div className="max-w-5xl mx-auto">
      <GameDetails game={game} />
    </div>
  );
}
