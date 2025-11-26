
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Anime, JikanGenre } from '../types';
import { jikanApi } from '../services/api';
import { AnimeCard } from '../components/AnimeCard';
import { Search as SearchIcon, Loader2, Filter } from 'lucide-react';

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [genres, setGenres] = useState<JikanGenre[]>([]);
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const initialProducer = searchParams.get('producer');

  const debouncedQuery = useDebounce(query, 600);
  const debouncedGenre = useDebounce(selectedGenre, 600);

  // Load genres on mount
  useEffect(() => {
    jikanApi.getGenres().then(res => setGenres(res.data || [])).catch(console.error);
  }, []);

  const performSearch = useCallback(async (q: string, genreId: string, producerId?: string) => {
    if (!q.trim() && !genreId && !producerId) {
       // If empty, load top
       setLoading(true);
       try {
           const res = await jikanApi.getTopAnime('bypopularity');
           setResults(res.data || []);
       } catch(e) { console.error(e); }
       finally { setLoading(false); }
       return;
    }
    
    setLoading(true);
    setSearched(true);
    try {
      const res = await jikanApi.searchAnime(q, 1, genreId, producerId);
      setResults(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to trigger search when inputs change
  useEffect(() => {
    // If producer param is present, it overrides normal flow slightly or works with it
    performSearch(debouncedQuery, debouncedGenre, initialProducer || undefined);
  }, [debouncedQuery, debouncedGenre, performSearch, initialProducer]);

  const handleAnimeClick = (id: number) => {
    navigate(`/anime/${id}`);
  };

  return (
    <div className="space-y-8 min-h-[80vh]">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Find Your Next Obsession</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
                <input
                    type="text"
                    placeholder="Search for anime..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-surface border border-slate-700 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-lg"
                />
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
            </div>

            <div className="relative min-w-[200px]">
                <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full appearance-none bg-surface border border-slate-700 text-white pl-12 pr-8 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-lg cursor-pointer"
                >
                    <option value="">All Genres</option>
                    {genres.map(g => (
                        <option key={g.mal_id} value={g.mal_id}>{g.name}</option>
                    ))}
                </select>
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            </div>
        </div>
        
        {initialProducer && (
             <div className="text-sm text-slate-400 bg-surface inline-block px-3 py-1 rounded-full border border-primary/20">
                Filtering by Producer ID: {initialProducer}
             </div>
        )}

        {loading && (
             <div className="flex justify-center p-4">
                <Loader2 className="text-primary animate-spin" size={32} />
             </div>
        )}
      </div>

      <div className="pt-4">
        {!loading && results.length === 0 && searched ? (
            <div className="text-center text-slate-400 py-12">
                <p>No results found. Try different keywords or filters.</p>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {results.map(anime => (
                    <AnimeCard key={anime.mal_id} anime={anime} onClick={handleAnimeClick} />
                ))}
            </div>
        )}
      </div>
    </div>
  );
};
