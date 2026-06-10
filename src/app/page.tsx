import { GameCard } from "@/components/game/GameCard";

// Mock data for trending games (since we don't have a direct endpoint for it yet, or we could fetch from IGDB)
const TRENDING_MOCK = [
  { id: 1011, name: "Trending Game 1", rating: 95 },
  { id: 1012, name: "Trending Game 2", rating: 88 },
  { id: 1013, name: "Trending Game 3", rating: 92 },
  { id: 1014, name: "Trending Game 4", rating: 85 },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      <section className="text-center py-20 px-4 rounded-3xl bg-secondary/5 border border-secondary/10">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">
          Welcome to <span className="text-secondary">GameHive</span>
        </h1>
        <p className="text-xl text-secondary max-w-2xl mx-auto">
          Discover new releases, track your backlog, and find the best deals
          across all stores.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          Trending This Week
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {TRENDING_MOCK.map((game) => (
            <GameCard key={game.id} {...game} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          Upcoming Releases
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {TRENDING_MOCK.map((game) => (
            <GameCard
              key={game.id}
              id={game.id + 10}
              name={`Upcoming Game ${game.id}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
