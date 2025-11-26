import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Anime } from '../types';
import { jikanApi } from '../services/api';
import { AnimeCard } from '../components/AnimeCard';
import { Clock } from 'lucide-react';

export const Schedule: React.FC = () => {
  const [activeDay, setActiveDay] = useState<string>('monday');
  const [schedule, setSchedule] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  useEffect(() => {
    // Set default day to today
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    if (days.includes(today)) {
        setActiveDay(today);
    }
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const res = await jikanApi.getSchedule(activeDay);
        setSchedule(res.data || []);
      } catch (error) {
        console.error("Failed to fetch schedule", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [activeDay]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
         <Clock className="text-primary" size={32} />
         <h1 className="text-3xl font-bold text-white">Weekly Schedule</h1>
      </div>

      {/* Day Tabs */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-white/10">
        {days.map(day => (
            <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-6 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                    activeDay === day 
                    ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105' 
                    : 'bg-surface text-slate-400 hover:text-white hover:bg-white/10'
                }`}
            >
                {day}
            </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
            {schedule.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                    No anime found airing on this day.
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {schedule.map(anime => (
                        <AnimeCard key={anime.mal_id} anime={anime} onClick={(id) => navigate(`/anime/${id}`)} />
                    ))}
                </div>
            )}
        </>
      )}
    </div>
  );
};