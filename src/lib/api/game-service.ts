import { igdbClient, type IGDBGame, type IGDBSearchResult } from "./igdb";
import { itadClient, type ITADGame, type ITADShop, type ITADDeal, type ITADPriceHistory } from "./isthereanydeal";
import { steamClient, type SteamAppDetails } from "./steam";
import { supabase } from "../supabase/client";
import type { Database } from "../supabase/types";

// Unified Game Type
export interface UnifiedGame {
  id: string;
  name: string;
  slug: string;
  summary: string | null;
  coverImage: string | null;
  releaseDate: string | null;
  rating: number | null;
  platforms: string[];
  genres: string[];
  developers: string[];
  publishers: string[];
  isFree: boolean;
  currentPrice: number | null;
  discount: number | null;
  lowestPrice: number | null;
  stores: Array<{
    id: string;
    name: string;
    price: number;
    discount: number | null;
    url: string;
  }>;
  metacriticScore: number | null;
  steamAppId: number | null;
  igdbId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  id: string;
  name: string;
  slug: string;
  coverImage: string | null;
  releaseDate: string | null;
  rating: number | null;
  platforms: string[];
  currentPrice: number | null;
  discount: number | null;
}

export class GameService {
  // Search games across all APIs
  async searchGames(query: string, limit: number = 10): Promise<SearchResult[]> {
    try {
      // Search IGDB
      const igdbResults = await igdbClient.searchGames(query, limit);
      
      // Search IsThereAnyDeal
      const itadResults = await itadClient.searchGames(query, limit);
      
      // Search Steam (limited)
      const steamResults = await steamClient.searchGames(query, limit);

      // Combine and deduplicate results
      const combinedResults: SearchResult[] = [];
      const seenIds = new Set<string>();

      // Process IGDB results
      for (const game of igdbResults) {
        if (seenIds.has(game.id.toString())) continue;
        seenIds.add(game.id.toString());
        
        combinedResults.push({
          id: game.id.toString(),
          name: game.name,
          slug: game.slug,
          coverImage: game.cover?.url || null,
          releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000).toISOString() : null,
          rating: game.total_rating || null,
          platforms: [],
          currentPrice: null,
          discount: null,
        });
      }

      // Process IsThereAnyDeal results
      for (const game of itadResults) {
        if (seenIds.has(game.id)) continue;
        seenIds.add(game.id);
        
        combinedResults.push({
          id: game.id,
          name: game.title,
          slug: game.title.toLowerCase().replace(/\s+/g, "-"),
          coverImage: game.thumb || null,
          releaseDate: null,
          rating: null,
          platforms: [],
          currentPrice: null,
          discount: null,
        });
      }

      // Process Steam results
      for (const game of steamResults) {
        if (seenIds.has(game.appid.toString())) continue;
        seenIds.add(game.appid.toString());
        
        combinedResults.push({
          id: game.appid.toString(),
          name: game.name,
          slug: game.name.toLowerCase().replace(/\s+/g, "-"),
          coverImage: game.header_image || game.capsule_image || null,
          releaseDate: game.release_date?.date || null,
          rating: null,
          platforms: Object.keys(game.platforms || {}).filter(key => game.platforms?.[key as keyof typeof game.platforms]),
          currentPrice: game.price_overview?.final || null,
          discount: game.price_overview?.discount_percent || null,
        });
      }

      return combinedResults.slice(0, limit);
    } catch (error) {
      console.error("Error searching games:", error);
      return [];
    }
  }

  // Get game details by ID
  async getGameById(id: string): Promise<UnifiedGame | null> {
    try {
      // Try to get from Supabase first
      const { data: dbGame, error: dbError } = await supabase
        .from("games")
        .select("*")
        .eq("id", id)
        .single();

      if (dbGame) {
        return this.formatDbGame(dbGame);
      }

      // Try IGDB
      const igdbId = parseInt(id);
      if (!isNaN(igdbId)) {
        const igdbGame = await igdbClient.getGameById(igdbId);
        if (igdbGame) {
          const unifiedGame = await this.convertIGDBToUnified(igdbGame);
          // Cache in Supabase
          await this.cacheGame(unifiedGame);
          return unifiedGame;
        }
      }

      // Try IsThereAnyDeal
      const itadGame = await itadClient.getGameById(id);
      if (itadGame) {
        const unifiedGame = await this.convertITADToUnified(itadGame);
        await this.cacheGame(unifiedGame);
        return unifiedGame;
      }

      // Try Steam
      const steamId = parseInt(id);
      if (!isNaN(steamId)) {
        const steamGame = await steamClient.getAppDetails(steamId);
        if (steamGame) {
          const unifiedGame = await this.convertSteamToUnified(steamGame);
          await this.cacheGame(unifiedGame);
          return unifiedGame;
        }
      }

      return null;
    } catch (error) {
      console.error("Error getting game by ID:", error);
      return null;
    }
  }

  // Get game details by slug
  async getGameBySlug(slug: string): Promise<UnifiedGame | null> {
    try {
      // Try to get from Supabase first
      const { data: dbGame, error: dbError } = await supabase
        .from("games")
        .select("*")
        .eq("slug", slug)
        .single();

      if (dbGame) {
        return this.formatDbGame(dbGame);
      }

      // Try IGDB
      const igdbGame = await igdbClient.getGameBySlug(slug);
      if (igdbGame) {
        const unifiedGame = await this.convertIGDBToUnified(igdbGame);
        await this.cacheGame(unifiedGame);
        return unifiedGame;
      }

      return null;
    } catch (error) {
      console.error("Error getting game by slug:", error);
      return null;
    }
  }

  // Get popular games
  async getPopularGames(limit: number = 20): Promise<UnifiedGame[]> {
    try {
      // Try to get from Supabase first
      const { data: dbGames, error: dbError } = await supabase
        .from("games")
        .select("*")
        .order("rating", { ascending: false })
        .limit(limit);

      if (dbGames && dbGames.length > 0) {
        return dbGames.map((game) => this.formatDbGame(game));
      }

      // Fallback to IGDB
      const igdbGames = await igdbClient.getPopularGames(limit);
      const unifiedGames = await Promise.all(
        igdbGames.map((game) => this.convertIGDBToUnified(game))
      );

      // Cache in Supabase
      await Promise.all(unifiedGames.map((game) => this.cacheGame(game)));

      return unifiedGames;
    } catch (error) {
      console.error("Error getting popular games:", error);
      return [];
    }
  }

  // Get new releases
  async getNewReleases(limit: number = 20): Promise<UnifiedGame[]> {
    try {
      const igdbGames = await igdbClient.getNewReleases(limit);
      const unifiedGames = await Promise.all(
        igdbGames.map((game) => this.convertIGDBToUnified(game))
      );

      return unifiedGames;
    } catch (error) {
      console.error("Error getting new releases:", error);
      return [];
    }
  }

  // Get upcoming games
  async getUpcomingGames(limit: number = 20): Promise<UnifiedGame[]> {
    try {
      const igdbGames = await igdbClient.getUpcomingGames(limit);
      const unifiedGames = await Promise.all(
        igdbGames.map((game) => this.convertIGDBToUnified(game))
      );

      return unifiedGames;
    } catch (error) {
      console.error("Error getting upcoming games:", error);
      return [];
    }
  }

  // Get free games
  async getFreeGames(limit: number = 20): Promise<UnifiedGame[]> {
    try {
      // Get from IsThereAnyDeal
      const itadGames = await itadClient.getFreeGames(limit);
      const unifiedGames = await Promise.all(
        itadGames.map((game) => this.convertITADToUnified(game))
      );

      // Also get from Steam
      const steamGames = await steamClient.getFreeGames(limit);
      const steamUnified = await Promise.all(
        steamGames.map((game) => this.convertSteamToUnified(game))
      );

      // Combine and deduplicate
      const combined = [...unifiedGames, ...steamUnified];
      const uniqueGames = combined.filter(
        (game, index, self) => index === self.findIndex((g) => g.id === game.id)
      );

      return uniqueGames.slice(0, limit);
    } catch (error) {
      console.error("Error getting free games:", error);
      return [];
    }
  }

  // Get games on sale
  async getGamesOnSale(limit: number = 20): Promise<UnifiedGame[]> {
    try {
      // Get deals from IsThereAnyDeal
      const deals = await itadClient.getBestDeals(limit);
      
      const unifiedGames: UnifiedGame[] = [];
      
      for (const deal of deals) {
        // Get game details from IGDB or Steam
        let game: UnifiedGame | null = null;
        
        // Try to find by name in IGDB
        const igdbGames = await igdbClient.searchGames(deal.title, 1);
        if (igdbGames.length > 0) {
          game = await this.convertIGDBToUnified(igdbGames[0]);
        }
        
        // If not found in IGDB, create a basic game object
        if (!game) {
          game = {
            id: deal.thumb || deal.title,
            name: deal.title,
            slug: deal.title.toLowerCase().replace(/\s+/g, "-"),
            summary: null,
            coverImage: deal.thumb || null,
            releaseDate: null,
            rating: null,
            platforms: [],
            genres: [],
            developers: [],
            publishers: [],
            isFree: false,
            currentPrice: parseFloat(deal.salePrice),
            discount: parseFloat(deal.savings),
            lowestPrice: null,
            stores: [
              {
                id: deal.shop.id,
                name: deal.shop.name,
                price: parseFloat(deal.salePrice),
                discount: parseFloat(deal.savings),
                url: deal.urls.buy,
              },
            ],
            metacriticScore: null,
            steamAppId: null,
            igdbId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
        
        // Update with deal information
        if (game) {
          game.currentPrice = parseFloat(deal.salePrice);
          game.discount = parseFloat(deal.savings);
          game.stores = [
            ...(game.stores || []),
            {
              id: deal.shop.id,
              name: deal.shop.name,
              price: parseFloat(deal.salePrice),
              discount: parseFloat(deal.savings),
              url: deal.urls.buy,
            },
          ];
          unifiedGames.push(game);
        }
      }

      return unifiedGames.slice(0, limit);
    } catch (error) {
      console.error("Error getting games on sale:", error);
      return [];
    }
  }

  // Get price history for a game
  async getPriceHistory(gameId: string): Promise<ITADPriceHistory[]> {
    try {
      return await itadClient.getPriceHistory(gameId);
    } catch (error) {
      console.error("Error getting price history:", error);
      return [];
    }
  }

  // Get current deals
  async getCurrentDeals(limit: number = 20): Promise<ITADDeal[]> {
    try {
      return await itadClient.getCurrentDeals(limit);
    } catch (error) {
      console.error("Error getting current deals:", error);
      return [];
    }
  }

  // Private helper methods
  private async convertIGDBToUnified(game: IGDBGame): Promise<UnifiedGame> {
    // Get additional data from other APIs
    let steamData: SteamAppDetails | null = null;
    let itadData: ITADGame | null = null;
    let priceHistory: ITADPriceHistory[] = [];

    try {
      // Try to get Steam data if we have a Steam ID mapping
      if (game.steam_id) {
        steamData = await steamClient.getAppDetails(game.steam_id);
      }

      // Try to get IsThereAnyDeal data
      if (game.igdb_id) {
        itadData = await itadClient.getGameById(game.igdb_id.toString());
        priceHistory = await itadClient.getPriceHistory(game.igdb_id.toString());
      }
    } catch (error) {
      console.warn("Error fetching additional game data:", error);
    }

    // Get platforms
    const platforms = game.platforms ? await this.getPlatformNames(game.platforms) : [];

    // Get genres
    const genres = game.genres ? await this.getGenreNames(game.genres) : [];

    // Get developers and publishers
    const developers: string[] = [];
    const publishers: string[] = [];

    if (game.involved_companies) {
      for (const company of game.involved_companies) {
        if (company.developer) {
          const companyName = await this.getCompanyName(company.company);
          if (companyName) developers.push(companyName);
        }
        if (company.publisher) {
          const companyName = await this.getCompanyName(company.company);
          if (companyName) publishers.push(companyName);
        }
      }
    }

    // Get current price and stores
    let currentPrice: number | null = null;
    let discount: number | null = null;
    let lowestPrice: number | null = null;
    const stores: UnifiedGame["stores"] = [];

    if (itadData && itadData.shops) {
      for (const shop of itadData.shops) {
        const price = parseFloat(shop.price.price);
        const shopDiscount = shop.price.discount ? parseFloat(shop.price.discount) : null;
        
        stores.push({
          id: shop.shop.id,
          name: shop.shop.name,
          price,
          discount: shopDiscount,
          url: shop.urls.buy,
        });

        if (price < (lowestPrice || Infinity)) {
          lowestPrice = price;
        }
        
        if (shopDiscount && shopDiscount > 0) {
          currentPrice = price;
          discount = shopDiscount;
        }
      }
    }

    // Fallback to Steam price
    if (!currentPrice && steamData?.price_overview) {
      currentPrice = steamData.price_overview.final / 100;
      discount = steamData.price_overview.discount_percent;
      lowestPrice = steamData.price_overview.initial / 100;
    }

    // Get lowest price from history
    if (priceHistory.length > 0) {
      const lowest = priceHistory.reduce((lowest, current) => {
        const currentPrice = parseFloat(current.price.price);
        const lowestPrice = parseFloat(lowest.price.price);
        return currentPrice < lowestPrice ? current : lowest;
      });
      lowestPrice = parseFloat(lowest.price.price);
    }

    return {
      id: game.id.toString(),
      name: game.name,
      slug: game.slug,
      summary: game.summary || null,
      coverImage: game.cover?.url || null,
      releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000).toISOString() : null,
      rating: game.total_rating || null,
      platforms,
      genres,
      developers,
      publishers,
      isFree: currentPrice === 0 || (steamData?.is_free || false),
      currentPrice,
      discount,
      lowestPrice,
      stores,
      metacriticScore: null, // Would need to fetch from Metacritic API
      steamAppId: game.steam_id || null,
      igdbId: game.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private async convertITADToUnified(game: ITADGame): Promise<UnifiedGame> {
    // Get additional data from IGDB or Steam
    let igdbData: IGDBGame | null = null;
    let steamData: SteamAppDetails | null = null;

    try {
      if (game.steamAppID) {
        const steamId = parseInt(game.steamAppID);
        steamData = await steamClient.getAppDetails(steamId);
        
        // Try to find in IGDB
        const igdbGames = await igdbClient.searchGames(game.title, 1);
        if (igdbGames.length > 0) {
          igdbData = await igdbClient.getGameById(igdbGames[0].id);
        }
      }
    } catch (error) {
      console.warn("Error fetching additional ITAD game data:", error);
    }

    // Extract price information
    let currentPrice: number | null = null;
    let discount: number | null = null;
    let lowestPrice: number | null = null;
    const stores: UnifiedGame["stores"] = [];

    if (game.shops) {
      for (const shop of game.shops) {
        const price = parseFloat(shop.price.price);
        const shopDiscount = shop.price.discount ? parseFloat(shop.price.discount) : null;
        
        stores.push({
          id: shop.shop.id,
          name: shop.shop.name,
          price,
          discount: shopDiscount,
          url: shop.urls.buy,
        });

        if (price < (lowestPrice || Infinity)) {
          lowestPrice = price;
        }
        
        if (shopDiscount && shopDiscount > 0) {
          currentPrice = price;
          discount = shopDiscount;
        }
      }
    }

    // Fallback to Steam price
    if (!currentPrice && steamData?.price_overview) {
      currentPrice = steamData.price_overview.final / 100;
      discount = steamData.price_overview.discount_percent;
      lowestPrice = steamData.price_overview.initial / 100;
    }

    // Get platforms from Steam
    const platforms = steamData?.platforms 
      ? Object.keys(steamData.platforms).filter(key => steamData.platforms[key as keyof typeof steamData.platforms])
      : [];

    // Get genres from Steam
    const genres = steamData?.genres ? steamData.genres.map(g => g.description) : [];

    // Get developers and publishers from Steam
    const developers = steamData?.developers || [];
    const publishers = steamData?.publishers || [];

    return {
      id: game.id,
      name: game.title,
      slug: game.title.toLowerCase().replace(/\s+/g, "-"),
      summary: null,
      coverImage: game.thumb || null,
      releaseDate: null,
      rating: null,
      platforms,
      genres,
      developers,
      publishers,
      isFree: game.bundle === 1 || currentPrice === 0 || (steamData?.is_free || false),
      currentPrice,
      discount,
      lowestPrice,
      stores,
      metacriticScore: null,
      steamAppId: game.steamAppID ? parseInt(game.steamAppID) : null,
      igdbId: igdbData?.id || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private async convertSteamToUnified(game: SteamAppDetails): Promise<UnifiedGame> {
    // Get additional data from IGDB or IsThereAnyDeal
    let igdbData: IGDBGame | null = null;
    let itadData: ITADGame | null = null;

    try {
      // Try to find in IGDB
      const igdbGames = await igdbClient.searchGames(game.name, 1);
      if (igdbGames.length > 0) {
        igdbData = await igdbClient.getGameById(igdbGames[0].id);
      }

      // Try to find in IsThereAnyDeal
      itadData = await itadClient.getGameBySteamId(game.appid.toString());
    } catch (error) {
      console.warn("Error fetching additional Steam game data:", error);
    }

    // Extract price information
    let currentPrice: number | null = null;
    let discount: number | null = null;
    let lowestPrice: number | null = null;
    const stores: UnifiedGame["stores"] = [];

    if (game.price_overview) {
      currentPrice = game.price_overview.final / 100;
      discount = game.price_overview.discount_percent;
      lowestPrice = game.price_overview.initial / 100;
      
      stores.push({
        id: "steam",
        name: "Steam",
        price: currentPrice,
        discount,
        url: `https://store.steampowered.com/app/${game.appid}/`,
      });
    }

    // Get platforms
    const platforms = Object.keys(game.platforms || {}).filter(
      key => game.platforms?.[key as keyof typeof game.platforms]
    );

    // Get genres
    const genres = game.genres ? game.genres.map(g => g.description) : [];

    // Get developers and publishers
    const developers = game.developers || [];
    const publishers = game.publishers || [];

    // Get cover image
    let coverImage = game.header_image || game.capsule_image || game.capsule_imagev5 || null;
    if (coverImage) {
      coverImage = `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/${coverImage}`;
    }

    return {
      id: game.appid.toString(),
      name: game.name,
      slug: game.name.toLowerCase().replace(/\s+/g, "-"),
      summary: game.short_description || game.detailed_description || null,
      coverImage,
      releaseDate: game.release_date?.date || null,
      rating: null, // Would need to get from reviews
      platforms,
      genres,
      developers,
      publishers,
      isFree: game.is_free || currentPrice === 0,
      currentPrice,
      discount,
      lowestPrice,
      stores,
      metacriticScore: null, // Would need to fetch from Metacritic API
      steamAppId: game.appid,
      igdbId: igdbData?.id || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private formatDbGame(game: Database["public"]["Tables"]["games"]["Row"]): UnifiedGame {
    return {
      id: game.id,
      name: game.name,
      slug: game.slug,
      summary: game.summary || null,
      coverImage: game.cover_image || null,
      releaseDate: game.release_date || null,
      rating: game.rating || null,
      platforms: game.platforms as string[] || [],
      genres: game.genres as string[] || [],
      developers: game.developers as string[] || [],
      publishers: game.publishers as string[] || [],
      isFree: false, // Would need to check price
      currentPrice: null,
      discount: null,
      lowestPrice: null,
      stores: [],
      metacriticScore: null,
      steamAppId: game.steam_id || null,
      igdbId: game.igdb_id || null,
      createdAt: game.created_at,
      updatedAt: game.updated_at,
    };
  }

  private async cacheGame(game: UnifiedGame): Promise<void> {
    try {
      const { error } = await supabase.from("games").upsert({
        id: game.id,
        igdb_id: game.igdbId,
        steam_id: game.steamAppId,
        name: game.name,
        slug: game.slug,
        summary: game.summary,
        cover_image: game.coverImage,
        release_date: game.releaseDate,
        rating: game.rating,
        platforms: game.platforms,
        genres: game.genres,
        developers: game.developers,
        publishers: game.publishers,
        created_at: game.createdAt,
        updated_at: game.updatedAt,
      });

      if (error) {
        console.warn("Error caching game:", error);
      }
    } catch (error) {
      console.warn("Error caching game:", error);
    }
  }

  private async getPlatformNames(platformIds: number[]): Promise<string[]> {
    try {
      const platforms = await igdbClient.getPlatforms();
      return platformIds
        .map((id) => platforms.find((p) => p.id === id)?.name || "Unknown")
        .filter((name) => name !== "Unknown");
    } catch (error) {
      console.warn("Error getting platform names:", error);
      return [];
    }
  }

  private async getGenreNames(genreIds: number[]): Promise<string[]> {
    try {
      const genres = await igdbClient.getGenres();
      return genreIds
        .map((id) => genres.find((g) => g.id === id)?.name || "Unknown")
        .filter((name) => name !== "Unknown");
    } catch (error) {
      console.warn("Error getting genre names:", error);
      return [];
    }
  }

  private async getCompanyName(companyId: number): Promise<string | null> {
    try {
      const companies = await igdbClient.getCompanies();
      const company = companies.find((c) => c.id === companyId);
      return company?.name || null;
    } catch (error) {
      console.warn("Error getting company name:", error);
      return null;
    }
  }
}

// Singleton instance
export const gameService = new GameService();
