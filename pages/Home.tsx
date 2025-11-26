
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Anime } from '../types';
import { jikanApi } from '../services/api';
import { AnimeCard } from '../components/AnimeCard';
import { ArrowRight, Star, History, Film } from 'lucide-react';

export const Home: React.FC = () => {
  const [topAnime, setTopAnime] = useState<Anime[]>([]);
  const [seasonalAnime, setSeasonalAnime] = useState<Anime[]>([]);
  const [topMovies, setTopMovies] = useState<Anime[]>([]);
  const [heroAnime, setHeroAnime] = useState<Anime | null>(null);
  const [recentAnime, setRecentAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load recent
    const recentStr = localStorage.getItem('recentlyViewed');
    if (recentStr) {
        setRecentAnime(JSON.parse(recentStr));
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        // Parallel fetch for speed
        const [topRes, seasonRes, moviesRes] = await Promise.all([
          jikanApi.getTopAnime('airing', 1),
          jikanApi.getSeasonNow(1),
          jikanApi.getTopMovies(1)
        ]);

        const top = topRes.data || [];
        const season = seasonRes.data || [];
        const movies = moviesRes.data || [];

        setTopAnime(top);
        setSeasonalAnime(season);
        setTopMovies(movies);
        
        // Pick a random high-quality anime for hero section from Top 5
        if (top.length > 0) {
           setHeroAnime(top[Math.floor(Math.random() * Math.min(5, top.length))]);
        }

      } catch (error) {
        console.error("Failed to load home data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAnimeClick = (id: number) => {
    navigate(`/anime/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      {heroAnime && (
        <div className="relative rounded-2xl overflow-hidden h-[500px] shadow-2xl">
          <img 
            src={heroAnime.images.webp.large_image_url} 
            alt={heroAnime.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3 lg:w-1/2 space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold tracking-wider text-sm uppercase">
               <Star size={16} fill="currentColor" />
               #{heroAnime.rank} Top Ranked
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
              {heroAnime.title_english || heroAnime.title}
            </h1>
            <p className="text-slate-300 line-clamp-3 text-lg">
              {heroAnime.synopsis}
            </p>
            <button 
              onClick={() => handleAnimeClick(heroAnime.mal_id)}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 inline-flex items-center gap-2 mt-4"
            >
              View Details <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Recently Viewed */}
      {recentAnime.length > 0 && (
          <section>
             <div className="flex items-center gap-2 mb-4 text-slate-400">
                <History size={18} />
                <h3 className="font-bold uppercase tracking-wider text-sm">Recently Viewed</h3>
             </div>
             <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                 {recentAnime.map(anime => (
                     <div 
                        key={anime.mal_id} 
                        onClick={() => handleAnimeClick(anime.mal_id)}
                        className="w-[140px] flex-shrink-0 cursor-pointer group"
                    >
                        <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2 relative">
                            <img src={anime.images.webp.large_image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-300 line-clamp-1 group-hover:text-primary">{anime.title}</h4>
                     </div>
                 ))}
             </div>
          </section>
      )}

      {/* Trending Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-8 bg-primary rounded-full block"></span>
            Top Airing Now
          </h2>
          <button onClick={() => navigate('/search')} className="text-primary text-sm font-medium hover:underline">View All</button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {topAnime.slice(0, 10).map(anime => (
            <AnimeCard key={anime.mal_id} anime={anime} onClick={handleAnimeClick} />
          ))}
        </div>
      </section>

      {/* Seasonal Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-8 bg-secondary rounded-full block"></span>
            This Season
          </h2>
          <button onClick={() => navigate('/seasonal')} className="text-secondary text-sm font-medium hover:underline">View All</button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {seasonalAnime.slice(0, 10).map(anime => (
            <AnimeCard key={anime.mal_id} anime={anime} onClick={handleAnimeClick} />
          ))}
        </div>
      </section>

      {/* Top Movies */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-8 bg-blue-500 rounded-full block"></span>
            Top Anime Movies
          </h2>
          <button onClick={() => navigate('/search')} className="text-blue-500 text-sm font-medium hover:underline">View All</button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {topMovies.slice(0, 5).map(anime => (
            <AnimeCard key={anime.mal_id} anime={anime} onClick={handleAnimeClick} />
          ))}
        </div>
      </section>
    </div>
  );
};
