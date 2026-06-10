import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

interface SteamConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
}

interface SteamResponse<T> {
  data: T;
  status: number;
}

// Steam API Types
export interface SteamApp {
  appid: number;
  name: string;
}

export interface SteamAppDetails {
  appid: number;
  name: string;
  is_free: boolean;
  detailed_description: string;
  about_the_game: string;
  short_description: string;
  header_image: string;
  capsule_image: string;
  capsule_imagev5: string;
  logo: string;
  logo_color: string;
  icon: string;
  developers: string[];
  publishers: string[];
  price_overview?: {
    currency: string;
    initial: number;
    final: number;
    discount_percent: number;
  };
  platforms: {
    windows: boolean;
    mac: boolean;
    linux: boolean;
  };
  categories: Array<{
    id: number;
    description: string;
  }>;
  genres: Array<{
    id: string;
    description: string;
  }>;
  screenshots: Array<{
    id: number;
    path_thumbnail: string;
    path_full: string;
  }>;
  movies: Array<{
    id: number;
    mp4: {
      480: string;
      max: string;
    };
    webm: {
      480: string;
      max: string;
    };
  }>;
  release_date: {
    coming_soon: boolean;
    date: string;
  };
  support_info?: {
    url: string;
    email: string;
  };
  background: string;
  background_raw: string;
  content_descriptors?: {
    ids: number[];
    notes: string | null;
  };
}

export interface SteamPlayerCount {
  player_count: number;
  result: number;
}

export interface SteamNewsItem {
  gid: string;
  title: string;
  url: string;
  is_external_url: boolean;
  author: string;
  contents: string;
  feedlabel: string;
  date: number;
  feedname: string;
  feed_type: number;
  appid: number;
}

export interface SteamReview {
  recommendationid: number;
  author: {
    steamid: string;
    num_games_owned: number;
    num_reviews: number;
    playtime_forever: number;
    playtime_last_two_weeks: number;
    playtime_at_review: number;
    last_played: number;
  };
  voted_up: boolean;
  voted_down: boolean;
  vote_summary: string;
  comments: string;
  timestamp_created: number;
  timestamp_updated: number;
  reviewed_version: string;
  language: string;
}

export interface SteamAchievement {
  apiname: string;
  name: string;
  description: string;
  icon: string;
  icongray: string;
  hidden: number;
}

export interface SteamSale {
  id: number;
  discount_percent: number;
  discount_description: Array<{
    discount_percent: number;
    discount_type: string;
    description: string;
  }>;
}

export class SteamClient {
  private client: AxiosInstance;
  private config: SteamConfig;

  constructor(config: Partial<SteamConfig> = {}) {
    this.config = {
      baseUrl: "https://api.steampowered.com",
      apiKey: process.env.STEAM_API_KEY || "",
      timeout: 10000,
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      params: {
        key: this.config.apiKey,
      },
    });
  }

  private async request<T>(config: AxiosRequestConfig): Promise<SteamResponse<T>> {
    try {
      const response = await this.client.request<T>(config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Steam API Error: ${error.response?.status} - ${error.response?.statusText}`);
      }
      throw error;
    }
  }

  // App endpoints
  async getAppList(): Promise<SteamApp[]> {
    const response = await this.request<{
      applist: { apps: SteamApp[] };
    }>({
      method: "GET",
      url: "/ISteamApps/GetAppList/v2/",
    });

    return response.data.applist?.apps || [];
  }

  async getAppDetails(appId: number): Promise<SteamAppDetails | null> {
    const response = await this.request<{
      [appId: number]: SteamAppDetails;
    }>({
      method: "GET",
      url: "/ISteamApps/GetAppDetails/v1/",
      params: {
        appids: appId,
        filters: "basic,price_overview,platforms,categories,genres,screenshots,movies,release_date,support_info,content_descriptors",
      },
    });

    return response.data[appId] || null;
  }

  async getMultipleAppDetails(appIds: number[]): Promise<SteamAppDetails[]> {
    const response = await this.request<{
      [appId: number]: SteamAppDetails;
    }>({
      method: "GET",
      url: "/ISteamApps/GetAppDetails/v1/",
      params: {
        appids: appIds.join(","),
        filters: "basic,price_overview,platforms,categories,genres",
      },
    });

    return Object.values(response.data);
  }

  // Player count endpoints
  async getCurrentPlayerCount(appId: number): Promise<SteamPlayerCount | null> {
    const response = await this.request<{
      response: SteamPlayerCount;
    }>({
      method: "GET",
      url: "/ISteamUserStats/GetNumberOfCurrentPlayers/v1/",
      params: {
        appid: appId,
      },
    });

    return response.data.response || null;
  }

  // News endpoints
  async getAppNews(appId: number, count: number = 5): Promise<SteamNewsItem[]> {
    const response = await this.request<{
      appnews: {
        appid: number;
        newsitems: SteamNewsItem[];
      };
    }>({
      method: "GET",
      url: "/ISteamNews/GetNewsForApp/v2/",
      params: {
        appid: appId,
        count,
        maxlength: 300,
        format: "json",
      },
    });

    return response.data.appnews?.newsitems || [];
  }

  // Review endpoints
  async getAppReviews(appId: number, limit: number = 10): Promise<SteamReview[]> {
    const response = await this.request<{
      response: {
        reviews: SteamReview[];
        total_reviews: number;
      };
    }>({
      method: "GET",
      url: "/ISteamApps/GetAppReviews/v1/",
      params: {
        appid: appId,
        num_per_page: limit,
        language: "en",
      },
    });

    return response.data.response?.reviews || [];
  }

  // Achievement endpoints
  async getGlobalAchievementPercentages(appId: number): Promise<SteamAchievement[]> {
    const response = await this.request<{
      achievementpercentages: {
        achievements: SteamAchievement[];
      };
    }>({
      method: "GET",
      url: "/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/",
      params: {
        gameid: appId,
      },
    });

    return response.data.achievementpercentages?.achievements || [];
  }

  // Free games endpoints
  async getFreeGames(limit: number = 20): Promise<SteamAppDetails[]> {
    // Get a list of free games - this would typically be cached or from a known list
    const freeGameIds = [
      730, // CS:GO (was free)
      1250, // Team Fortress 2
      440, // Team Fortress 2
      570, // Dota 2
      218620, // Path of Exile
      270370, // Warframe
      359550, // Tom Clancy's Rainbow Six Siege
      397540, // Borderlands 2
    ];

    const details = await this.getMultipleAppDetails(freeGameIds.slice(0, limit));
    return details.filter((game) => game.is_free);
  }

  // Utility methods
  async searchGames(query: string, limit: number = 10): Promise<SteamAppDetails[]> {
    // Steam doesn't have a direct search API, so we need to use the app list
    // and filter client-side, or use a third-party service
    const appList = await this.getAppList();
    const matchingApps = appList.filter((app) =>
      app.name.toLowerCase().includes(query.toLowerCase())
    );

    const appIds = matchingApps.slice(0, limit).map((app) => app.appid);
    const details = await this.getMultipleAppDetails(appIds);

    return details;
  }

  async getPopularGames(limit: number = 20): Promise<SteamAppDetails[]> {
    // Get popular games by player count or top sellers
    // This is a simplified approach - in production you'd want to cache this
    const popularGameIds = [
      730, // CS:GO
      570, // Dota 2
      4000, // Cyberpunk 2077
      108420, // GTA V
      377160, // Fallout 4
      271590, // Grand Theft Auto V
      367520, // Hollow Knight
      286160, // Space Engineers
      250820, // Borderlands 2
      397540, // Borderlands: The Pre-Sequel
    ];

    return this.getMultipleAppDetails(popularGameIds.slice(0, limit));
  }

  // Image utilities
  getAppHeaderImage(appId: number): string {
    return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
  }

  getAppCapsuleImage(appId: number): string {
    return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/capsule_616x353.jpg`;
  }

  getAppLogo(appId: number): string {
    return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/logo.png`;
  }

  getAppIcon(appId: number): string {
    return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/icon.ico`;
  }
}

// Singleton instance
export const steamClient = new SteamClient();
