import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

interface ITADConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
}

interface ITADResponse<T> {
  data: T;
  status: number;
}

// IsThereAnyDeal API Types
export interface ITADGame {
  id: string;
  title: string;
  steamAppID: string | null;
  bundle: number | null;
  drm: string[];
  shops: ITADShop[];
  external: string | null;
  thumb: string | null;
}

export interface ITADShop {
  shop: {
    id: string;
    name: string;
  };
  drm: string[];
  price: {
    price: string;
    discount: string;
    currency: string;
    cut: number | null;
  };
  urls: {
    buy: string;
    game: string;
  };
  vouchers: boolean;
}

export interface ITADPriceHistory {
  id: string;
  price: {
    price: string;
    discount: string;
    currency: string;
    cut: number | null;
  };
  date: number;
}

export interface ITADDeal {
  shop: {
    id: string;
    name: string;
  };
  title: string;
  salePrice: string;
  normalPrice: string;
  savings: string;
  drm: string[];
  thumb: string | null;
  urls: {
    buy: string;
    game: string;
  };
}

export interface ITADSearchResult {
  id: string;
  title: string;
  thumb: string | null;
}

export class IsThereAnyDealClient {
  private client: AxiosInstance;
  private config: ITADConfig;

  constructor(config: Partial<ITADConfig> = {}) {
    this.config = {
      baseUrl: "https://api.isthereanydeal.com",
      apiKey: process.env.ITAD_API_KEY || "",
      timeout: 10000,
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        "X-RapidAPI-Key": this.config.apiKey,
        "X-RapidAPI-Host": "isthereanydeal.p.rapidapi.com",
        Accept: "application/json",
      },
    });
  }

  private async request<T>(config: AxiosRequestConfig): Promise<ITADResponse<T>> {
    try {
      const response = await this.client.request<T>(config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`IsThereAnyDeal API Error: ${error.response?.status} - ${error.response?.statusText}`);
      }
      throw error;
    }
  }

  // Game endpoints
  async searchGames(query: string, limit: number = 10): Promise<ITADSearchResult[]> {
    const response = await this.request<{
      data: { results: ITADSearchResult[] };
    }>({
      method: "GET",
      url: "/search/search",
      params: {
        q: query,
        limit,
      },
    });

    return response.data.data?.results || [];
  }

  async getGameById(id: string): Promise<ITADGame | null> {
    const response = await this.request<{
      data: { game: ITADGame };
    }>({
      method: "GET",
      url: "/games/game",
      params: {
        id,
      },
    });

    return response.data.data?.game || null;
  }

  async getGameBySteamId(steamId: string): Promise<ITADGame | null> {
    const response = await this.request<{
      data: { game: ITADGame };
    }>({
      method: "GET",
      url: "/games/game",
      params: {
        shop: "steam",
        id: steamId,
      },
    });

    return response.data.data?.game || null;
  }

  // Price endpoints
  async getCurrentPrices(gameId: string): Promise<ITADShop[]> {
    const response = await this.request<{
      data: { shops: ITADShop[] };
    }>({
      method: "GET",
      url: "/games/prices",
      params: {
        id: gameId,
      },
    });

    return response.data.data?.shops || [];
  }

  async getPriceHistory(gameId: string): Promise<ITADPriceHistory[]> {
    const response = await this.request<{
      data: { history: ITADPriceHistory[] };
    }>({
      method: "GET",
      url: "/games/history",
      params: {
        id: gameId,
      },
    });

    return response.data.data?.history || [];
  }

  async getLowestPriceEver(gameId: string): Promise<ITADPriceHistory | null> {
    const history = await this.getPriceHistory(gameId);
    if (history.length === 0) return null;

    return history.reduce((lowest, current) => {
      const currentPrice = parseFloat(current.price.price);
      const lowestPrice = parseFloat(lowest.price.price);
      return currentPrice < lowestPrice ? current : lowest;
    });
  }

  // Deal endpoints
  async getCurrentDeals(limit: number = 20): Promise<ITADDeal[]> {
    const response = await this.request<{
      data: { deals: ITADDeal[] };
    }>({
      method: "GET",
      url: "/deals/deals",
      params: {
        limit,
      },
    });

    return response.data.data?.deals || [];
  }

  async getDealsByShop(shopId: string, limit: number = 20): Promise<ITADDeal[]> {
    const response = await this.request<{
      data: { deals: ITADDeal[] };
    }>({
      method: "GET",
      url: "/deals/deals",
      params: {
        shop: shopId,
        limit,
      },
    });

    return response.data.data?.deals || [];
  }

  // Free games endpoints
  async getFreeGames(limit: number = 20): Promise<ITADGame[]> {
    const response = await this.request<{
      data: { games: ITADGame[] };
    }>({
      method: "GET",
      url: "/games/free",
      params: {
        limit,
      },
    });

    return response.data.data?.games || [];
  }

  // Shop endpoints
  async getShops(): Promise<
    Array<{
      id: string;
      name: string;
      isActive: boolean;
    }>
  > {
    const response = await this.request<{
      data: { shops: Array<{ id: string; name: string; isActive: boolean }> };
    }>({
      method: "GET",
      url: "/shops/shops",
    });

    return response.data.data?.shops || [];
  }

  // Utility methods
  async getBestDeals(limit: number = 10): Promise<ITADDeal[]> {
    const deals = await this.getCurrentDeals(limit * 3); // Get more to filter
    return deals
      .sort((a, b) => {
        const aSavings = parseFloat(a.savings) || 0;
        const bSavings = parseFloat(b.savings) || 0;
        return bSavings - aSavings;
      })
      .slice(0, limit);
  }

  async getSteamDeals(limit: number = 10): Promise<ITADDeal[]> {
    return this.getDealsByShop("steam", limit);
  }
}

// Singleton instance
export const itadClient = new IsThereAnyDealClient();
