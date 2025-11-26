import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Anime } from '../types';
import { AnimeCard } from '../components/AnimeCard';
import { Heart } from 'lucide-react';

export const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Anime[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // We stored metadata in 'favMeta' to avoid fetching details for every favorite item individually on load.
    // In a real app with auth, this would be an API call.
    // In a no-auth app, we rely on local storage cache or would have to fetch ID by ID (slow).
    const favMeta = JSON.parse(localStorage.getItem('favMeta') || '{}');
    const favList = Object.values(favMeta) as Anime[];
    setFavorites(favList);
  }, []);

  const handleAnimeClick = (id: number) => {
    navigate(`/anime/${id}`);
  };

  return (
    <div className="space-y-8 min-h-[60vh]">
       <div className="flex items-center gap-3">
          <Heart className="text-secondary" size={32} fill="currentColor" />
          <h1 className="text-3xl font-bold text-white">Your Favorites</h1>
       </div>

       {favorites.length === 0 ? (
           <div className="text-center py-20 text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl">
               <p className="text-xl font-medium">No favorites yet!</p>
               <p className="mt-2 text-sm">Browse anime and click the heart icon to add them here.</p>
               <button 
                onClick={() => navigate('/search')}
                className="mt-6 text-primary hover:underline"
               >
                   Start Searching
               </button>
           </div>
       ) : (
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
               {favorites.map(anime => (
                   <AnimeCard key={anime.mal_id} anime={anime} onClick={handleAnimeClick} />
               ))}
           </div>
       )}
    </div>
  );
};