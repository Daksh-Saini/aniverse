
import { JikanResponse, Anime, Character, JikanGenre, TopCharacter, StreamingLink, AnimeTheme, Review, Manga, Person, Relation, JikanPicture, Producer } from '../types';

const BASE_URL = 'https://api.jikan.moe/v4';

// Helper to handle rate limits slightly better by adding a minimal delay or retry logic if needed.
// Jikan allows ~3 requests per second.
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url: string, retries = 2): Promise<Response> {
  try {
    const response = await fetch(url);
    if (response.status === 429 && retries > 0) {
      // Too Many Requests - wait and retry
      await delay(1000);
      return fetchWithRetry(url, retries - 1);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      await delay(1000);
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
}

export const jikanApi = {
  getTopAnime: async (filter: string = 'airing', page: number = 1): Promise<JikanResponse<Anime[]>> => {
    const res = await fetchWithRetry(`${BASE_URL}/top/anime?filter=${filter}&page=${page}&limit=20`);
    if (!res.ok) throw new Error('Failed to fetch top anime');
    return res.json();
  },

  getTopMovies: async (page: number = 1): Promise<JikanResponse<Anime[]>> => {
    const res = await fetchWithRetry(`${BASE_URL}/top/anime?type=movie&filter=bypopularity&page=${page}&limit=20`);
    if (!res.ok) throw new Error('Failed to fetch top movies');
    return res.json();
  },

  getSeasonNow: async (page: number = 1): Promise<JikanResponse<Anime[]>> => {
    const res = await fetchWithRetry(`${BASE_URL}/seasons/now?page=${page}&limit=20`);
    if (!res.ok) throw new Error('Failed to fetch seasonal anime');
    return res.json();
  },

  getSeasonUpcoming: async (page: number = 1): Promise<JikanResponse<Anime[]>> => {
    const res = await fetchWithRetry(`${BASE_URL}/seasons/upcoming?page=${page}&limit=20`);
    if (!res.ok) throw new Error('Failed to fetch upcoming anime');
    return res.json();
  },

  getSchedule: async (day: string, page: number = 1): Promise<JikanResponse<Anime[]>> => {
    const res = await fetchWithRetry(`${BASE_URL}/schedules?filter=${day}&page=${page}&limit=20&sfw=true`);
    if (!res.ok) throw new Error('Failed to fetch schedule');
    return res.json();
  },

  searchAnime: async (query: string, page: number = 1, genreId?: string, producerId?: string): Promise<JikanResponse<Anime[]>> => {
    let url = `${BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=20&sfw=true&order_by=popularity&sort=asc`;
    if (genreId) {
        url += `&genres=${genreId}`;
    }
    if (producerId) {
        url += `&producers=${producerId}`;
    }
    const res = await fetchWithRetry(url);
    if (!res.ok) throw new Error('Failed to search anime');
    return res.json();
  },

  getGenres: async (): Promise<JikanResponse<JikanGenre[]>> => {
    const res = await fetchWithRetry(`${BASE_URL}/genres/anime`);
    if (!res.ok) throw new Error('Failed to fetch genres');
    return res.json();
  },

  getProducers: async (page: number = 1): Promise<JikanResponse<Producer[]>> => {
    const res = await fetchWithRetry(`${BASE_URL}/producers?order_by=favorites&sort=desc&page=${page}&limit=20`);
    if (!res.ok) throw new Error('Failed to fetch producers');
    return res.json();
  },

  getRandomAnime: async (): Promise<JikanResponse<Anime>> => {
    const res = await fetchWithRetry(`${BASE_URL}/random/anime`);
    if (!res.ok) throw new Error('Failed to fetch random anime');
    return res.json();
  },

  getAnimeDetails: async (id: number): Promise<JikanResponse<Anime>> => {
    const res = await fetchWithRetry(`${BASE_URL}/anime/${id}`);
    if (!res.ok) throw new Error('Failed to fetch anime details');
    return res.json();
  },

  getAnimeCharacters: async (id: number): Promise<JikanResponse<Character[]>> => {
    const res = await fetchWithRetry(`${BASE_URL}/anime/${id}/characters`);
    if (!res.ok) throw new Error('Failed to fetch characters');
    return res.json();
  },

  getAnimeRecommendations: async (id: number): Promise<JikanResponse<{ entry: Anime }[]>> => {
    const res = await fetchWithRetry(`${BASE_URL}/anime/${id}/recommendations`);
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
  },

  getAnimeStreaming: async (id: number): Promise<JikanResponse<StreamingLink[]>> => {
    const res = await fetchWithRetry(`${BASE_URL}/anime/${id}/streaming`);
    if (!res.ok) throw new Error('Failed to fetch streaming links');
    return res.json();
  },

  getAnimeThemes: async (id: number): Promise<JikanResponse<AnimeTheme>> => {
    const res = await fetchWithRetry(`${BASE_URL}/anime/${id}/themes`);
    if (!res.ok) throw new Error('Failed to fetch themes');
    return res.json();
  },

  getAnimeReviews: async (id: number): Promise<JikanResponse<Review[]>> => {
    const res = await fetchWithRetry(`${BASE_URL}/anime/${id}/reviews`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
  },

  getAnimeRelations: async (id: number): Promise<JikanResponse<Relation[]>> => {
    const res = await fetchWithRetry(`${BASE_URL}/anime/${id}/relations`);
    if (!res.ok) throw new Error('Failed to fetch relations');
    return res.json();
  },

  getAnimePictures: async (id: number): Promise<JikanResponse<JikanPicture[]>> => {
    const res = await fetchWithRetry(`${BASE_URL}/anime/${id}/pictures`);
    if (!res.ok) throw new Error('Failed to fetch pictures');
    return res.json();
  },

  getTopCharacters: async (page: number = 1): Promise<JikanResponse<TopCharacter[]>> => {
    const res = await fetchWithRetry(`${BASE_URL}/top/characters?page=${page}&limit=20`);
    if (!res.ok) throw new Error('Failed to fetch top characters');
    return res.json();
  },

  getTopManga: async (page: number = 1): Promise<JikanResponse<Manga[]>> => {
    const res = await fetchWithRetry(`${BASE_URL}/top/manga?page=${page}&limit=20`);
    if (!res.ok) throw new Error('Failed to fetch top manga');
    return res.json();
  },

  getTopPeople: async (page: number = 1): Promise<JikanResponse<Person[]>> => {
    const res = await fetchWithRetry(`${BASE_URL}/top/people?page=${page}&limit=20`);
    if (!res.ok) throw new Error('Failed to fetch top people');
    return res.json();
  }
};
