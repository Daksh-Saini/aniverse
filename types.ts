
// Jikan API Types

export interface JikanImage {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface JikanImages {
  jpg: JikanImage;
  webp: JikanImage;
}

export interface JikanTrailer {
  youtube_id: string | null;
  url: string | null;
  embed_url: string | null;
}

export interface JikanGenre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Producer {
  mal_id: number;
  url: string;
  titles: { type: string; title: string }[];
  images: {
    jpg: {
      image_url: string;
    };
  };
  favorites: number;
  count: number;
  established: string;
  about: string;
}

export interface Anime {
  mal_id: number;
  url: string;
  images: JikanImages;
  trailer: JikanTrailer;
  approved: boolean;
  titles: { type: string; title: string }[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string;
  source: string;
  episodes: number | null;
  status: string;
  airing: boolean;
  aired: {
    from: string | null;
    to: string | null;
    string: string | null;
  };
  duration: string;
  rating: string;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  synopsis: string | null;
  background: string | null;
  season: string | null;
  year: number | null;
  genres: JikanGenre[];
  studios: JikanGenre[];
  broadcast?: {
    day: string | null;
    time: string | null;
    timezone: string | null;
    string: string | null;
  };
}

export interface Manga {
  mal_id: number;
  url: string;
  images: JikanImages;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string;
  chapters: number | null;
  volumes: number | null;
  status: string;
  publishing: boolean;
  published: {
    from: string | null;
    to: string | null;
    string: string | null;
  };
  score: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  synopsis: string | null;
  authors: { mal_id: number; type: string; name: string; url: string }[];
  genres: JikanGenre[];
}

export interface Person {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
    }
  };
  name: string;
  given_name: string | null;
  family_name: string | null;
  favorites: number;
  about: string | null;
}

export interface RelationEntry {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Relation {
  relation: string;
  entry: RelationEntry[];
}

export interface JikanPicture {
    jpg: {
        image_url: string;
        large_image_url: string;
    }
}

export interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface JikanResponse<T> {
  data: T;
  pagination?: Pagination;
}

export interface Character {
  character: {
    mal_id: number;
    url: string;
    images: {
      jpg: {
        image_url: string;
      };
      webp: {
        image_url: string;
        small_image_url: string;
      };
    };
    name: string;
  };
  role: string;
  favorites: number;
}

export interface TopCharacter {
  mal_id: number;
  url: string;
  images: {
    jpg: { image_url: string };
    webp: { image_url: string; small_image_url: string };
  };
  name: string;
  name_kanji: string;
  nicknames: string[];
  favorites: number;
  about: string;
}

export interface StreamingLink {
  name: string;
  url: string;
}

export interface AnimeTheme {
  openings: string[];
  endings: string[];
}

export interface Review {
  mal_id: number;
  url: string;
  type: string;
  date: string;
  review: string;
  score: number;
  tags: string[];
  is_spoiler: boolean;
  user: {
    url: string;
    username: string;
    images: {
      jpg: {
        image_url: string;
      }
    }
  }
}

// App Specific Types
export type ViewMode = 'grid' | 'list';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type LibraryStatus = 'watching' | 'completed' | 'plan_to_watch' | 'dropped' | 'favorite';

export interface LibraryItem {
  anime: Anime;
  status: LibraryStatus;
  addedAt: number;
}
