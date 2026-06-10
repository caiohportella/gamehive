import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";

export interface UserProfile {
  id: string;
  email: string;
}

export interface GameListEntry {
  gameId: number;
  status: "wishlist" | "playing" | "completed" | "dropped";
}

interface UserStore {
  user: UserProfile | null;
  gameList: GameListEntry[];
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  setGameList: (list: GameListEntry[]) => void;
  fetchUser: () => Promise<void>;
  updateGameStatus: (
    gameId: number,
    status: GameListEntry["status"] | "remove",
  ) => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  gameList: [],
  isLoading: true,
  setUser: (user) => set({ user }),
  setGameList: (gameList) => set({ gameList }),

  fetchUser: async () => {
    set({ isLoading: true });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      set({ user: { id: session.user.id, email: session.user.email || "" } });

      // Fetch user's game list from Supabase
      const { data, error } = await supabase
        .from("user_games")
        .select("*")
        .eq("user_id", session.user.id);

      if (!error && data) {
        set({
          gameList: data.map((item) => ({
            gameId: item.game_id,
            status: item.status,
          })),
        });
      }
    } else {
      set({ user: null, gameList: [] });
    }
    set({ isLoading: false });
  },

  updateGameStatus: async (gameId, status) => {
    const { user, gameList } = get();
    if (!user) return; // Must be logged in

    // Optimistic update
    const newList = [...gameList.filter((g) => g.gameId !== gameId)];
    if (status !== "remove") {
      newList.push({ gameId, status });
    }
    set({ gameList: newList });

    // Sync with Supabase
    if (status === "remove") {
      await supabase
        .from("user_games")
        .delete()
        .eq("user_id", user.id)
        .eq("game_id", gameId);
    } else {
      await supabase
        .from("user_games")
        .upsert(
          { user_id: user.id, game_id: gameId, status },
          { onConflict: "user_id, game_id" },
        );
    }
  },
}));
