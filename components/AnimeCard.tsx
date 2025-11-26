import React from 'react';
import { Anime } from '../types';
import { Star, Calendar, Users } from 'lucide-react';

interface AnimeCardProps {
  anime: Anime;
  onClick: (id: number) => void;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onClick }) => {
  return (
    <div 
      onClick={() => onClick(anime.mal_id)}
      className="group relative bg-surface rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-primary/20 h-full flex flex-col"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={anime.images.webp.large_image_url || anime.images.jpg.large_image_url} 
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <p className="text-white text-sm line-clamp-3 font-medium">
            {anime.synopsis || "No synopsis available."}
          </p>
        </div>
        
        {/* Score Badge */}
        {anime.score && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-yellow-400 px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold shadow-sm">
            <Star size={12} fill="currentColor" />
            <span>{anime.score}</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-white font-semibold text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {anime.title_english || anime.title}
        </h3>
        
        <div className="mt-auto flex items-center justify-between text-slate-400 text-xs">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{anime.year || "TBA"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>{anime.members ? (anime.members / 1000).toFixed(0) + 'k' : 'N/A'}</span>
          </div>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1">
            {anime.genres.slice(0, 2).map(g => (
                <span key={g.mal_id} className="text-[10px] uppercase tracking-wider bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                    {g.name}
                </span>
            ))}
        </div>
      </div>
    </div>
  );
};