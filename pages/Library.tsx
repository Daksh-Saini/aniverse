import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LibraryItem, LibraryStatus } from '../types';
import { AnimeCard } from '../components/AnimeCard';
import { Library, CheckCircle, Clock, Play, EyeOff } from 'lucide-react';

export const LibraryPage: React.FC = () => {
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [filter, setFilter] = useState<LibraryStatus | 'all'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    const loadLibrary = () => {
        const libraryStr = localStorage.getItem('library');
        if (libraryStr) {
            const libObj = JSON.parse(libraryStr);
            setLibrary(Object.values(libObj));
        }
    };
    loadLibrary();
  }, []);

  const filteredItems = filter === 'all' 
    ? library 
    : library.filter(item => item.status === filter);

  const tabs = [
    { id: 'all', label: 'All', icon: Library },
    { id: 'watching', label: 'Watching', icon: Play },
    { id: 'completed', label: 'Completed', icon: CheckCircle },
    { id: 'plan_to_watch', label: 'Plan to Watch', icon: Clock },
    { id: 'dropped', label: 'Dropped', icon: EyeOff },
  ];

  return (
    <div className="space-y-8 min-h-[60vh]">
       <div className="flex items-center gap-3">
          <Library className="text-primary" size={32} />
          <h1 className="text-3xl font-bold text-white">My Library</h1>
       </div>

       {/* Status Tabs */}
       <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
          {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id as any)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all border border-transparent ${
                        filter === tab.id 
                        ? 'bg-primary text-white border-primary/50' 
                        : 'bg-surface text-slate-400 hover:text-white hover:bg-white/10 border-white/5'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                    <span className="bg-black/20 px-2 py-0.5 rounded-full text-xs ml-1">
                        {tab.id === 'all' 
                            ? library.length 
                            : library.filter(i => i.status === tab.id).length}
                    </span>
                  </button>
              );
          })}
       </div>

       {filteredItems.length === 0 ? (
           <div className="text-center py-20 text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl">
               <p className="text-xl font-medium">Nothing here yet!</p>
               <p className="mt-2 text-sm">Add anime to your library from their details page.</p>
               <button 
                onClick={() => navigate('/search')}
                className="mt-6 text-primary hover:underline"
               >
                   Discover Anime
               </button>
           </div>
       ) : (
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-in slide-in-from-bottom-4 duration-300">
               {filteredItems.map(item => (
                   <div key={item.anime.mal_id} className="relative">
                       <AnimeCard anime={item.anime} onClick={(id) => navigate(`/anime/${id}`)} />
                       <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase border border-white/10">
                           {item.status.replace(/_/g, ' ')}
                       </div>
                   </div>
               ))}
           </div>
       )}
    </div>
  );
};