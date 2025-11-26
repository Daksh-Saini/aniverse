
import React, { useEffect, useState } from 'react';
import { Manga } from '../types';
import { jikanApi } from '../services/api';
import { MangaCard } from '../components/MangaCard';
import { BookOpen } from 'lucide-react';

export const MangaPage: React.FC = () => {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await jikanApi.getTopManga(1);
        setMangaList(res.data || []);
      } catch (error) {
        console.error("Failed to fetch manga", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
         <BookOpen className="text-primary" size={32} />
         <h1 className="text-3xl font-bold text-white">Top Manga Series</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-in fade-in duration-500">
            {mangaList.map(manga => (
                <MangaCard key={manga.mal_id} manga={manga} />
            ))}
        </div>
      )}
    </div>
  );
};
