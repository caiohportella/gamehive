"use client";

import Image from "next/image";
import { type GameListEntry, useUserStore } from "@/store/useUserStore";

interface GameDetailsProps {
  game: any;
  pricing?: any;
}

export function GameDetails({ game, pricing }: GameDetailsProps) {
  const { user, gameList, updateGameStatus } = useUserStore();

  const currentStatus = gameList.find((g) => g.gameId === game.id)?.status;

  const handleStatusChange = (status: GameListEntry["status"] | "remove") => {
    if (!user) {
      alert("Please login to manage your games!");
      return;
    }
    updateGameStatus(game.id, status);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 mt-8">
      {/* Left Column: Cover */}
      <div className="w-full md:w-1/3 flex-shrink-0">
        <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-secondary/10 border border-secondary/20 shadow-lg">
          {game.cover?.image_id ? (
            <Image
              src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`}
              alt={game.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-secondary">
              No Cover
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Details */}
      <div className="w-full md:w-2/3 flex flex-col gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
            {game.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-secondary">
            {game.first_release_date && (
              <span>
                Released:{" "}
                {new Date(game.first_release_date * 1000).toLocaleDateString()}
              </span>
            )}
            {game.total_rating && (
              <span className="flex items-center gap-1">
                <span className="bg-foreground text-background px-2 py-0.5 rounded-full font-bold">
                  {Math.round(game.total_rating)}
                </span>
                Rating
              </span>
            )}
          </div>
        </div>

        {game.summary && (
          <div>
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-secondary leading-relaxed">{game.summary}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-4 border-t border-secondary/20">
          <button
            type="button"
            onClick={() =>
              handleStatusChange(
                currentStatus === "wishlist" ? "remove" : "wishlist",
              )
            }
            className={`px-4 py-2 rounded-md font-medium transition-colors ${currentStatus === "wishlist" ? "bg-foreground text-background" : "bg-secondary/10 hover:bg-secondary/20 text-foreground"}`}
          >
            {currentStatus === "wishlist"
              ? "★ On Wishlist"
              : "☆ Add to Wishlist"}
          </button>
          <button
            type="button"
            onClick={() =>
              handleStatusChange(
                currentStatus === "playing" ? "remove" : "playing",
              )
            }
            className={`px-4 py-2 rounded-md font-medium transition-colors ${currentStatus === "playing" ? "bg-foreground text-background" : "bg-secondary/10 hover:bg-secondary/20 text-foreground"}`}
          >
            {currentStatus === "playing" ? "▶ Playing" : "▷ Mark Playing"}
          </button>
          <button
            type="button"
            onClick={() =>
              handleStatusChange(
                currentStatus === "completed" ? "remove" : "completed",
              )
            }
            className={`px-4 py-2 rounded-md font-medium transition-colors ${currentStatus === "completed" ? "bg-foreground text-background" : "bg-secondary/10 hover:bg-secondary/20 text-foreground"}`}
          >
            {currentStatus === "completed" ? "✓ Completed" : "Mark Completed"}
          </button>
          <button
            type="button"
            onClick={() =>
              handleStatusChange(
                currentStatus === "dropped" ? "remove" : "dropped",
              )
            }
            className={`px-4 py-2 rounded-md font-medium transition-colors ${currentStatus === "dropped" ? "bg-foreground text-background" : "bg-secondary/10 hover:bg-secondary/20 text-foreground"}`}
          >
            {currentStatus === "dropped" ? "✕ Dropped" : "Mark Dropped"}
          </button>
        </div>
      </div>
    </div>
  );
}
