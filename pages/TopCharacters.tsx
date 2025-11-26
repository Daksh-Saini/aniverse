
import React, { useEffect, useState } from 'react';
import { TopCharacter } from '../types';
import { jikanApi } from '../services/api';
import { UserSquare2, Heart } from 'lucide-react';

export const TopCharacters: React.FC = () => {
  const [characters, setCharacters] = useState<TopCharacter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await jikanApi.getTopCharacters(1);
        setCharacters(res.data || []);
      } catch (error) {
        console.error("Failed to fetch characters", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
         <UserSquare2 className="text-primary" size={32} />
         <h1 className="text-3xl font-bold text-white">Fan Favorite Characters</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
            {characters.map((char, index) => (
                <div key={char.mal_id} className="bg-surface rounded-xl overflow-hidden flex hover:bg-white/5 transition-colors group">
                    <div className="w-1/3 min-w-[100px] relative">
                        <img 
                            src={char.images.webp.image_url} 
                            alt={char.name} 
                            className="w-full h-full object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-500" 
                        />
                        <div className="absolute top-0 left-0 bg-black/70 px-2 py-1 rounded-br-lg text-xs font-bold text-white">
                            #{index + 1}
                        </div>
                    </div>
                    <div className="w-2/3 p-4 flex flex-col">
                        <h3 className="font-bold text-white text-lg line-clamp-1">{char.name}</h3>
                        <h4 className="text-slate-400 text-sm mb-2">{char.name_kanji}</h4>
                        
                        <div className="mt-auto flex items-center gap-2 text-secondary text-sm font-medium">
                            <Heart size={16} fill="currentColor" />
                            {char.favorites.toLocaleString()}
                        </div>
                        
                        {char.nicknames.length > 0 && (
                            <p className="text-xs text-slate-500 mt-2 line-clamp-1">
                                aka {char.nicknames[0]}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};
