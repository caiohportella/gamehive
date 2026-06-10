// API Clients
export { igdbClient, IGDBClient, IGDBGame, IGDBPlatform, IGDBGenre, IGDBCompany, IGDBSearchResult } from "./igdb";
export { itadClient, IsThereAnyDealClient, ITADGame, ITADShop, ITADPriceHistory, ITADDeal, ITADSearchResult } from "./isthereanydeal";
export { steamClient, SteamClient, SteamApp, SteamAppDetails, SteamPlayerCount, SteamNewsItem, SteamReview, SteamAchievement, SteamSale } from "./steam";

// Supabase
export { supabase, createServerClient, createBrowserClient } from "../supabase/client";
export type { Database, Tables, InsertTypes, UpdateTypes } from "../supabase/types";

// Combined Game Service
export * from "./game-service";
