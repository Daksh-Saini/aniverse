
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Producer } from '../types';
import { jikanApi } from '../services/api';
import { Building2, Heart } from 'lucide-react';

export const Producers: React.FC = () => {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await jikanApi.getProducers(1);
        setProducers(res.data || []);
      } catch (error) {
        console.error("Failed to fetch producers", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
         <Building2 className="text-primary" size={32} />
         <h1 className="text-3xl font-bold text-white">Top Anime Studios</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
            {producers.map(producer => (
                <div 
                  key={producer.mal_id}
                  onClick={() => navigate(`/search?producer=${producer.mal_id}`)}
                  className="bg-surface rounded-xl overflow-hidden cursor-pointer hover:bg-white/5 transition-all group border border-white/5 hover:border-primary/50 relative"
                >
                    <div className="p-6 flex flex-col items-center text-center space-y-3 h-full">
                        <div className="w-24 h-24 rounded-full bg-background overflow-hidden border-2 border-white/10 p-1">
                             <img 
                                src={producer.images?.jpg?.image_url || 'https://placehold.co/100x100?text=?'} 
                                alt={producer.titles[0]?.title} 
                                className="w-full h-full object-contain rounded-full"
                             />
                        </div>
                        
                        <div>
                             <h3 className="text-white font-bold text-lg group-hover:text-primary transition-colors">
                                {producer.titles[0]?.title}
                             </h3>
                             <p className="text-xs text-slate-400 mt-1">
                                Est. {producer.established ? new Date(producer.established).getFullYear() : 'Unknown'}
                             </p>
                        </div>
                        
                        <div className="mt-auto grid grid-cols-2 gap-4 w-full pt-4 border-t border-white/5">
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Anime</p>
                                <p className="text-white font-bold">{producer.count}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Likes</p>
                                <div className="flex items-center justify-center gap-1 text-secondary font-bold">
                                    <Heart size={12} fill="currentColor" />
                                    {producer.favorites.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};
