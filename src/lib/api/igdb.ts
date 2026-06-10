import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

interface IGDBConfig {
  baseUrl: string;
  apiKey: string;
  clientId: string;
  timeout: number;
}

interface IGDBResponse<T> {
  data: T;
  status: number;
}

// IGDB API Types
export interface IGDBGame {
  id: number;
  name: string;
  slug: string;
  summary: string | null;
  cover?: {
    id: number;
    url: string;
  };
  first_release_date?: number;
  total_rating?: number;
  platforms?: number[];
  genres?: number[];
  involved_companies?: Array<{
    id: number;
    company: number;
    publisher: boolean;
    developer: boolean;
  }>;
}

export interface IGDBPlatform {
  id: number;
  name: string;
  slug: string;
  abbreviation: string;
}

export interface IGDBGenre {
  id: number;
  name: string;
  slug: string;
}

export interface IGDBCompany {
  id: number;
  name: string;
  slug: string;
}

export interface IGDBSearchResult {
  id: number;
  name: string;
  slug: string;
  cover?: {
    id: number;
    url: string;
  };
  first_release_date?: number;
  total_rating?: number;
}

export class IGDBClient {
  private client: AxiosInstance;
  private config: IGDBConfig;

  constructor(config: Partial<IGDBConfig> = {}) {
    this.config = {
      baseUrl: "https://api.igdb.com/v4",
      apiKey: process.env.IGDB_API_KEY || "",
      clientId: process.env.IGDB_CLIENT_ID || "",
      timeout: 10000,
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        "Client-ID": this.config.clientId,
        Authorization: `Bearer ${this.config.apiKey}`,
        Accept: "application/json",
      },
    });
  }

  private async request<T>(config: AxiosRequestConfig): Promise<IGDBResponse<T>> {
    try {
      const response = await this.client.request<T>(config);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`IGDB API Error: ${error.response?.status} - ${error.response?.statusText}`);
      }
      throw error;
    }
  }

  // Game endpoints
  async searchGames(query: string, limit: number = 10): Promise<IGDBSearchResult[]> {
    const fields = "id,name,slug,cover.url,first_release_date,total_rating";
    const searchQuery = `search "${query}"; fields ${fields}; limit ${limit};`;

    const response = await this.request<IGDBSearchResult[]>({
      method: "POST",
      url: "/games",
      data: searchQuery,
    });

    return response.data;
  }

  async getGameById(id: number): Promise<IGDBGame | null> {
    const fields = `id,name,slug,summary,cover.url,first_release_date,total_rating,platforms,genres,involved_companies.company`;
    const query = `fields ${fields}; where id = ${id};`;

    const response = await this.request<IGDBGame[]>({
      method: "POST",
      url: "/games",
      data: query,
    });

    return response.data[0] || null;
  }

  async getGameBySlug(slug: string): Promise<IGDBGame | null> {
    const fields = `id,name,slug,summary,cover.url,first_release_date,total_rating,platforms,genres,involved_companies.company`;
    const query = `fields ${fields}; where slug = "${slug}";`;

    const response = await this.request<IGDBGame[]>({
      method: "POST",
      url: "/games",
      data: query,
    });

    return response.data[0] || null;
  }

  async getPopularGames(limit: number = 20): Promise<IGDBGame[]> {
    const fields = "id,name,slug,cover.url,first_release_date,total_rating";
    const query = `fields ${fields}; sort total_rating desc; limit ${limit};`;

    const response = await this.request<IGDBGame[]>({
      method: "POST",
      url: "/games",
      data: query,
    });

    return response.data;
  }

  async getNewReleases(limit: number = 20): Promise<IGDBGame[]> {
    const fields = "id,name,slug,cover.url,first_release_date,total_rating";
    const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;
    const query = `fields ${fields}; where first_release_date > ${thirtyDaysAgo}; sort first_release_date desc; limit ${limit};`;

    const response = await this.request<IGDBGame[]>({
      method: "POST",
      url: "/games",
      data: query,
    });

    return response.data;
  }

  async getUpcomingGames(limit: number = 20): Promise<IGDBGame[]> {
    const fields = "id,name,slug,cover.url,first_release_date,total_rating";
    const today = Math.floor(Date.now() / 1000);
    const query = `fields ${fields}; where first_release_date > ${today}; sort first_release_date asc; limit ${limit};`;

    const response = await this.request<IGDBGame[]>({
      method: "POST",
      url: "/games",
      data: query,
    });

    return response.data;
  }

  // Platform endpoints
  async getPlatforms(): Promise<IGDBPlatform[]> {
    const fields = "id,name,slug,abbreviation";
    const query = `fields ${fields};`;

    const response = await this.request<IGDBPlatform[]>({
      method: "POST",
      url: "/platforms",
      data: query,
    });

    return response.data;
  }

  // Genre endpoints
  async getGenres(): Promise<IGDBGenre[]> {
    const fields = "id,name,slug";
    const query = `fields ${fields};`;

    const response = await this.request<IGDBGenre[]>({
      method: "POST",
      url: "/genres",
      data: query,
    });

    return response.data;
  }

  // Company endpoints
  async getCompanies(): Promise<IGDBCompany[]> {
    const fields = "id,name,slug";
    const query = `fields ${fields};`;

    const response = await this.request<IGDBCompany[]>({
      method: "POST",
      url: "/companies",
      data: query,
    });

    return response.data;
  }

  // Cover endpoints
  async getCoverImage(coverId: number): Promise<string> {
    return `https://images.igdb.com/igdb/image/upload/t_cover_big/${coverId}.jpg`;
  }

  // Artwork endpoints
  async getArtworks(gameId: number, limit: number = 5): Promise<string[]> {
    const fields = "id,url";
    const query = `fields ${fields}; where game = ${gameId}; limit ${limit};`;

    const response = await this.request<Array<{ id: number; url: string }>>({
      method: "POST",
      url: "/artworks",
      data: query,
    });

    return response.data.map((artwork) => artwork.url);
  }

  // Screenshot endpoints
  async getScreenshots(gameId: number, limit: number = 5): Promise<string[]> {
    const fields = "id,url";
    const query = `fields ${fields}; where game = ${gameId}; limit ${limit};`;

    const response = await this.request<Array<{ id: number; url: string }>>({
      method: "POST",
      url: "/screenshots",
      data: query,
    });

    return response.data.map((screenshot) => screenshot.url);
  }
}

// Singleton instance
export const igdbClient = new IGDBClient();
