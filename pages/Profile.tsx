
import React, { useEffect, useState } from 'react';
import { LibraryItem } from '../types';
import { UserCircle, Trophy, Clock, PlayCircle, PieChart } from 'lucide-react';

interface Stats {
  totalAnime: number;
  episodesWatched: number;
  daysWatched: number;
  meanScore: number;
  statusCounts: {
    watching: number;
    completed: number;
    plan_to_watch: number;
    dropped: number;
  };
  topGenres: { name: string; count: number }[];
  level: string;
}

export const Profile: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [username, setUsername] = useState('Otaku');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load username
    const storedUser = localStorage.getItem('username');
    if (storedUser) setUsername(storedUser);

    // Calculate stats from library
    const libraryStr = localStorage.getItem('library');
    if (libraryStr) {
      const library: LibraryItem[] = Object.values(JSON.parse(libraryStr));
      
      let totalEps = 0;
      let totalMins = 0;
      let scoreSum = 0;
      let scoreCount = 0;
      const genres: Record<string, number> = {};
      const counts = { watching: 0, completed: 0, plan_to_watch: 0, dropped: 0, favorite: 0 };

      library.forEach(item => {
         // Count statuses
         if (counts[item.status] !== undefined) counts[item.status]++;

         // Genre analysis
         item.anime.genres.forEach(g => {
            genres[g.name] = (genres[g.name] || 0) + 1;
         });

         // Time calculation (Estimate)
         if (item.status === 'completed' || item.status === 'watching') {
             const eps = item.anime.episodes || 12; // fallback
             totalEps += eps;
             
             // Parse duration
             let mins = 24;
             if (item.anime.duration) {
                const match = item.anime.duration.match(/(\d+)\s*min/);
                if (match) mins = parseInt(match[1]);
                if (item.anime.duration.includes('hr')) mins += 60;
             }
             totalMins += mins * eps;
         }

         if (item.anime.score) {
            scoreSum += item.anime.score;
            scoreCount++;
         }
      });

      // Level Logic
      let level = "Novice Watcher";
      const totalCount = library.length;
      if (totalCount > 10) level = "Anime Fan";
      if (totalCount > 30) level = "Seasoned Otaku";
      if (totalCount > 70) level = "Weeb Lord";
      if (totalCount > 150) level = "Anime God";

      // Sort genres
      const sortedGenres = Object.entries(genres)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

      setStats({
        totalAnime: totalCount,
        episodesWatched: totalEps,
        daysWatched: parseFloat((totalMins / 60 / 24).toFixed(1)),
        meanScore: scoreCount ? parseFloat((scoreSum / scoreCount).toFixed(2)) : 0,
        statusCounts: counts,
        topGenres: sortedGenres,
        level
      });
    }
  }, []);

  const handleNameSave = () => {
    localStorage.setItem('username', username);
    setIsEditing(false);
  };

  if (!stats) return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
       {/* Profile Header */}
       <div className="bg-surface rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
          
          <div className="relative">
             <div className="w-32 h-32 rounded-full bg-background border-4 border-primary p-2">
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-primary">
                    <UserCircle size={64} />
                </div>
             </div>
             <div className="absolute -bottom-3 -right-3 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-background">
                Lvl. {Math.floor(stats.totalAnime / 5) + 1}
             </div>
          </div>

          <div className="flex-grow text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-3">
                 {isEditing ? (
                    <div className="flex gap-2">
                        <input 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-background border border-slate-600 rounded px-2 py-1 text-white"
                        />
                        <button onClick={handleNameSave} className="text-xs bg-primary px-3 rounded text-white">Save</button>
                    </div>
                 ) : (
                    <>
                        <h1 className="text-3xl font-bold text-white">{username}</h1>
                        <button onClick={() => setIsEditing(true)} className="text-slate-500 hover:text-white text-xs">Edit</button>
                    </>
                 )}
              </div>
              <p className="text-primary font-medium text-lg">{stats.level}</p>
              <p className="text-slate-400 text-sm max-w-md">
                 Currently tracking {stats.totalAnime} anime in the library.
              </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-background/50 p-4 rounded-xl min-w-[100px]">
                  <p className="text-xs text-slate-400 uppercase font-bold">Days</p>
                  <p className="text-xl font-bold text-white">{stats.daysWatched}</p>
              </div>
              <div className="bg-background/50 p-4 rounded-xl min-w-[100px]">
                  <p className="text-xs text-slate-400 uppercase font-bold">Mean Score</p>
                  <p className="text-xl font-bold text-yellow-400">{stats.meanScore}</p>
              </div>
          </div>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Status Distribution */}
           <div className="bg-surface rounded-xl p-6 border border-white/5">
               <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                   <PieChart size={18} /> Anime Status
               </h3>
               <div className="space-y-3">
                   <div className="flex justify-between text-sm">
                       <span className="text-blue-400">Watching</span>
                       <span className="text-white font-bold">{stats.statusCounts.watching}</span>
                   </div>
                   <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                       <div className="bg-blue-500 h-full" style={{ width: `${(stats.statusCounts.watching / stats.totalAnime) * 100}%` }}></div>
                   </div>

                   <div className="flex justify-between text-sm mt-2">
                       <span className="text-green-400">Completed</span>
                       <span className="text-white font-bold">{stats.statusCounts.completed}</span>
                   </div>
                   <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                       <div className="bg-green-500 h-full" style={{ width: `${(stats.statusCounts.completed / stats.totalAnime) * 100}%` }}></div>
                   </div>

                   <div className="flex justify-between text-sm mt-2">
                       <span className="text-yellow-400">Plan to Watch</span>
                       <span className="text-white font-bold">{stats.statusCounts.plan_to_watch}</span>
                   </div>
                   <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                       <div className="bg-yellow-500 h-full" style={{ width: `${(stats.statusCounts.plan_to_watch / stats.totalAnime) * 100}%` }}></div>
                   </div>
               </div>
           </div>

           {/* Watch Stats */}
           <div className="bg-surface rounded-xl p-6 border border-white/5">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                   <Clock size={18} /> Watch Time
               </h3>
               <div className="space-y-6 flex flex-col justify-center h-[80%]">
                   <div className="text-center">
                       <p className="text-4xl font-black text-white">{stats.episodesWatched}</p>
                       <p className="text-sm text-slate-400 mt-1">Episodes Watched</p>
                   </div>
                   <div className="text-center">
                       <p className="text-4xl font-black text-secondary">{stats.daysWatched}</p>
                       <p className="text-sm text-slate-400 mt-1">Days of Life Consumed</p>
                   </div>
               </div>
           </div>

           {/* Top Genres */}
           <div className="bg-surface rounded-xl p-6 border border-white/5">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                   <Trophy size={18} /> Top Genres
               </h3>
               <div className="space-y-3">
                   {stats.topGenres.map((g, i) => (
                       <div key={g.name} className="flex items-center gap-3">
                           <span className="w-6 text-slate-500 text-sm font-bold">#{i+1}</span>
                           <div className="flex-grow">
                               <div className="flex justify-between text-xs mb-1">
                                   <span className="text-slate-200">{g.name}</span>
                                   <span className="text-slate-400">{g.count}</span>
                               </div>
                               <div className="w-full bg-slate-700 h-1.5 rounded-full">
                                   <div className="bg-primary h-full rounded-full" style={{ width: `${(g.count / stats.topGenres[0].count) * 100}%` }}></div>
                               </div>
                           </div>
                       </div>
                   ))}
                   {stats.topGenres.length === 0 && <p className="text-slate-500 text-sm">Add anime to see your stats!</p>}
               </div>
           </div>
       </div>
    </div>
  );
};
