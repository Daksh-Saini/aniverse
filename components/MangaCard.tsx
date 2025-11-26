
import React from 'react';
import { Manga } from '../types';
import { Star, Book, Users } from 'lucide-react';

interface MangaCardProps {
  manga: Manga;
}

export const MangaCard: React.FC<MangaCardProps> = ({ manga }) => {
  return (
    <a 
      href={manga.url}
      target="_blank"
      rel="noreferrer"
      className="group relative bg-surface rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-primary/20 h-full flex flex-col"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={manga.images.webp.large_image_url || manga.images.jpg.large_image_url} 
          alt={manga.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <p className="text-white text-sm line-clamp-3 font-medium">
            {manga.synopsis || "No synopsis available."}
          </p>
        </div>
        
        {/* Score Badge */}
        {manga.score && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-yellow-400 px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold shadow-sm">
            <Star size={12} fill="currentColor" />
            <span>{manga.score}</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-white font-semibold text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {manga.title_english || manga.title}
        </h3>
        
        <div className="mt-auto flex items-center justify-between text-slate-400 text-xs">
          <div className="flex items-center gap-1">
            <Book size={12} />
            <span>{manga.volumes ? `${manga.volumes} Vols` : 'Publishing'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>{manga.members ? (manga.members / 1000).toFixed(0) + 'k' : 'N/A'}</span>
          </div>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1">
            {manga.genres.slice(0, 2).map(g => (
                <span key={g.mal_id} className="text-[10px] uppercase tracking-wider bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                    {g.name}
                </span>
            ))}
        </div>
      </div>
    </a>
  );
};
