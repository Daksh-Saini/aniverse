
import React, { useEffect, useState } from 'react';
import { Person } from '../types';
import { jikanApi } from '../services/api';
import { Users2, Heart } from 'lucide-react';

export const PeoplePage: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await jikanApi.getTopPeople(1);
        setPeople(res.data || []);
      } catch (error) {
        console.error("Failed to fetch people", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
         <Users2 className="text-primary" size={32} />
         <h1 className="text-3xl font-bold text-white">Industry Icons</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-in fade-in duration-500">
            {people.map(person => (
                <a 
                  key={person.mal_id}
                  href={person.url}
                  target="_blank"
                  rel="noreferrer" 
                  className="bg-surface rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 block"
                >
                    <div className="aspect-[3/4] overflow-hidden relative">
                        <img 
                            src={person.images.jpg.image_url} 
                            alt={person.name} 
                            className="w-full h-full object-cover" 
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-100 flex flex-col justify-end p-4">
                             <h3 className="text-white font-bold leading-tight">{person.name}</h3>
                             <p className="text-xs text-slate-300 mt-1">{person.given_name} {person.family_name}</p>
                             <div className="flex items-center gap-1 mt-2 text-secondary text-xs">
                                <Heart size={12} fill="currentColor" />
                                <span>{person.favorites.toLocaleString()}</span>
                             </div>
                         </div>
                    </div>
                </a>
            ))}
        </div>
      )}
    </div>
  );
};
