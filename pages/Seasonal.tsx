import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Anime } from '../types';
import { jikanApi } from '../services/api';
import { AnimeCard } from '../components/AnimeCard';
import { Calendar, Sparkles } from 'lucide-react';

type SeasonType = 'now' | 'upcoming';

export const Seasonal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SeasonType>('now');
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = activeTab === 'now' 
            ? await jikanApi.getSeasonNow()
            : await jikanApi.getSeasonUpcoming();
        setAnimeList(res.data || []);
      } catch (error) {
        console.error("Failed to fetch seasonal data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
         <div className="flex items-center gap-3">
             <Calendar className="text-secondary" size={32} />
             <h1 className="text-3xl font-bold text-white">Seasonal Anime</h1>
         </div>

         {/* Tabs */}
         <div className="flex bg-surface p-1 rounded-full w-fit">
            <button
                onClick={() => setActiveTab('now')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                    activeTab === 'now' ? 'bg-secondary text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
            >
                Airing Now
            </button>
            <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${
                    activeTab === 'upcoming' ? 'bg-secondary text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
            >
                <Sparkles size={14} /> Upcoming
            </button>
         </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
            <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-in fade-in duration-500">
            {animeList.map(anime => (
                <AnimeCard key={anime.mal_id} anime={anime} onClick={(id) => navigate(`/anime/${id}`)} />
            ))}
        </div>
      )}
    </div>
  );
};