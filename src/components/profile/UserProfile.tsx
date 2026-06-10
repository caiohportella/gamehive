"use client";

import { useEffect, useState } from "react";
import { GameCard } from "@/components/game/GameCard";
import { supabase } from "@/lib/supabase/client";
import { useUserStore } from "@/store/useUserStore";

export function UserProfile() {
  const { user, gameList, fetchUser, isLoading } = useUserStore();
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Optionally fetch game metadata for the IDs in the list
  // Note: For a real app, you would bulk fetch from IGDB proxy.
  // Here we just map the IDs for now.

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github", // Or standard email/password
      options: { redirectTo: window.location.origin + "/profile" },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    fetchUser(); // refresh state
  };

  if (isLoading) {
    return (
      <div className="text-secondary py-10 text-center animate-pulse">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Gaming Profile</h1>
        <p className="text-secondary mb-8">
          Sign in to sync your wishlist, currently playing, and completed games
          across all devices.
        </p>
        <button
          type="button"
          onClick={handleLogin}
          className="bg-foreground text-background px-6 py-3 rounded-md font-semibold hover:bg-secondary transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  const wishlist = gameList.filter((g) => g.status === "wishlist");
  const playing = gameList.filter((g) => g.status === "playing");
  const completed = gameList.filter((g) => g.status === "completed");
  const dropped = gameList.filter((g) => g.status === "dropped");

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between border-b border-secondary/20 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{user.email}</h1>
          <p className="text-secondary mt-1">Manage your collection</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="px-4 py-2 rounded-md font-medium text-secondary hover:text-foreground hover:bg-secondary/10 transition-colors"
        >
          Sign Out
        </button>
      </div>

      <Section title="Currently Playing" games={playing} />
      <Section title="Wishlist" games={wishlist} />
      <Section title="Completed" games={completed} />
      <Section title="Dropped" games={dropped} />
    </div>
  );
}

function Section({ title, games }: { title: string; games: any[] }) {
  if (games.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">
        {title} ({games.length})
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {games.map((game) => (
          <GameCard
            key={game.gameId}
            id={game.gameId}
            name={`Game #${game.gameId}`}
          />
        ))}
      </div>
    </section>
  );
}
