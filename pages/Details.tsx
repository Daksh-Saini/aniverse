
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Anime, Character, LibraryItem, LibraryStatus, StreamingLink, AnimeTheme, Review, Relation, JikanPicture } from '../types';
import { jikanApi } from '../services/api';
import { Star, Clock, Calendar, PlayCircle, Users, Check, Plus, Monitor, Music2, MessageSquare, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

export const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [recommendations, setRecommendations] = useState<{ entry: Anime }[]>([]);
  const [streaming, setStreaming] = useState<StreamingLink[]>([]);
  const [themes, setThemes] = useState<AnimeTheme | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relations, setRelations] = useState<Relation[]>([]);
  const [pictures, setPictures] = useState<JikanPicture[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<LibraryStatus | ''>('');

  useEffect(() => {
    if (!id) return;
    
    // Check library status
    const libraryStr = localStorage.getItem('library');
    if (libraryStr) {
        const library: Record<string, LibraryItem> = JSON.parse(libraryStr);
        if (library[id]) {
            setStatus(library[id].status);
        } else {
            setStatus('');
        }
    }

    const fetchDetails = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const numId = Number(id);
        const [detailsRes, charsRes, recsRes, streamRes, themeRes, reviewsRes, relRes, picsRes] = await Promise.all([
            jikanApi.getAnimeDetails(numId),
            jikanApi.getAnimeCharacters(numId),
            jikanApi.getAnimeRecommendations(numId),
            jikanApi.getAnimeStreaming(numId).catch(() => ({ data: [] })),
            jikanApi.getAnimeThemes(numId).catch(() => ({ data: { openings: [], endings: [] } })),
            jikanApi.getAnimeReviews(numId).catch(() => ({ data: [] })),
            jikanApi.getAnimeRelations(numId).catch(() => ({ data: [] })),
            jikanApi.getAnimePictures(numId).catch(() => ({ data: [] })),
        ]);

        const animeData = detailsRes.data;
        setAnime(animeData);
        setCharacters(charsRes.data || []);
        setRecommendations(recsRes.data || []);
        setStreaming(streamRes.data || []);
        setThemes(themeRes.data || null);
        setReviews(reviewsRes.data || []);
        setRelations(relRes.data || []);
        setPictures(picsRes.data || []);

        // Save to recently viewed
        if (animeData) {
            const recentStr = localStorage.getItem('recentlyViewed');
            let recent: Anime[] = recentStr ? JSON.parse(recentStr) : [];
            // Remove if exists then add to front
            recent = recent.filter(a => a.mal_id !== animeData.mal_id);
            recent.unshift(animeData);
            // Keep max 10
            if (recent.length > 10) recent.pop();
            localStorage.setItem('recentlyViewed', JSON.stringify(recent));
        }

      } catch (error) {
        console.error("Error fetching details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleStatusChange = (newStatus: string) => {
    if (!anime) return;
    
    const libraryStr = localStorage.getItem('library');
    let library: Record<string, LibraryItem> = libraryStr ? JSON.parse(libraryStr) : {};
    
    if (newStatus === '') {
        // Remove from library
        delete library[anime.mal_id];
        setStatus('');
    } else {
        const item: LibraryItem = {
            anime: anime,
            status: newStatus as LibraryStatus,
            addedAt: Date.now()
        };
        library[anime.mal_id] = item;
        setStatus(newStatus as LibraryStatus);
    }
    
    localStorage.setItem('library', JSON.stringify(library));
  };

  const handleRelationClick = (url: string, type: string, mal_id: number) => {
    if (type === 'anime') {
        navigate(`/anime/${mal_id}`);
    } else {
        window.open(url, '_blank');
    }
  };

  if (loading || !anime) {
     return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      {/* Header / Backdrop */}
      <div className="relative">
        <div className="h-[300px] md:h-[400px] w-full overflow-hidden rounded-2xl relative">
             <img 
                src={anime.images.webp.large_image_url} 
                className="w-full h-full object-cover blur-sm opacity-50 scale-110"
                alt="Backdrop"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
        
        <div className="absolute -bottom-20 md:bottom-0 left-0 w-full p-6 md:p-12 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-48 md:w-64 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl border-4 border-surface">
                <img src={anime.images.webp.large_image_url} className="w-full h-full object-cover" alt={anime.title} />
            </div>
            
            <div className="flex-grow pt-4 md:pt-0">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{anime.title_english || anime.title}</h1>
                <h2 className="text-xl text-slate-400 mb-4">{anime.title_japanese}</h2>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-lg">
                        <Star size={18} fill="currentColor" />
                        <span className="font-bold">{anime.score || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-surface px-3 py-1 rounded-lg text-slate-300">
                        <Clock size={18} />
                        <span>{anime.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-surface px-3 py-1 rounded-lg text-slate-300">
                        <Calendar size={18} />
                        <span>{anime.year || "Unknown"}</span>
                    </div>
                    
                    {/* Library Status Dropdown */}
                    <div className="relative group">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${status ? 'bg-primary text-white' : 'bg-surface text-slate-300 hover:bg-slate-700'}`}>
                            {status ? <Check size={18} /> : <Plus size={18} />}
                            <select 
                                value={status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            >
                                <option value="">Add to Library</option>
                                <option value="watching">Watching</option>
                                <option value="completed">Completed</option>
                                <option value="plan_to_watch">Plan to Watch</option>
                                <option value="dropped">Dropped</option>
                            </select>
                            <span className="capitalize">{status ? status.replace(/_/g, ' ') : 'Add to Library'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {anime.genres.map(g => (
                        <span key={g.mal_id} className="text-xs font-bold uppercase tracking-wide bg-primary/20 text-primary px-3 py-1 rounded-full">
                            {g.name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Spacer for the overlapping image on mobile */}
      <div className="h-24 md:h-0"></div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-10">
            <section>
                <h3 className="text-2xl font-bold text-white mb-4">Synopsis</h3>
                <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-line">
                    {anime.synopsis}
                </p>
            </section>

             {/* Relations Section */}
            {relations.length > 0 && (
                <section>
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <LinkIcon /> Related Anime
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {relations.map((rel, i) => (
                             rel.entry.map(entry => (
                                <button 
                                    key={entry.mal_id}
                                    onClick={() => handleRelationClick(entry.url, entry.type, entry.mal_id)}
                                    className="bg-surface border border-white/5 hover:border-primary/50 px-4 py-2 rounded-lg text-left transition-colors flex flex-col group"
                                >
                                    <span className="text-xs text-slate-400 group-hover:text-primary uppercase tracking-wider font-bold mb-1">{rel.relation}</span>
                                    <span className="text-sm text-white font-medium line-clamp-1">{entry.name}</span>
                                </button>
                             ))
                        ))}
                    </div>
                </section>
            )}

            {anime.trailer.embed_url && (
                <section>
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <PlayCircle /> Trailer
                    </h3>
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-surface">
                        <iframe 
                            src={anime.trailer.embed_url} 
                            title="Trailer"
                            className="w-full h-full"
                            allowFullScreen
                        ></iframe>
                    </div>
                </section>
            )}

            <section>
                 <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Users /> Main Cast
                 </h3>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {characters.slice(0, 8).map(char => (
                        <div key={char.character.mal_id + char.role} className="flex gap-3 items-center bg-surface p-2 rounded-lg">
                            <img src={char.character.images.webp.image_url} alt={char.character.name} className="w-12 h-12 rounded-full object-cover" />
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-white truncate">{char.character.name}</p>
                                <p className="text-xs text-slate-400 truncate">{char.role}</p>
                            </div>
                        </div>
                    ))}
                 </div>
            </section>

             {/* Gallery Section */}
             {pictures.length > 0 && (
                 <section>
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <ImageIcon /> Gallery
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {pictures.slice(0, 10).map((pic, idx) => (
                            <div key={idx} className="aspect-[2/3] rounded-lg overflow-hidden group cursor-pointer bg-surface">
                                <img 
                                    src={pic.jpg.large_image_url} 
                                    alt={`Gallery ${idx}`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                />
                            </div>
                        ))}
                    </div>
                 </section>
             )}

             {/* Themes Section */}
             {(themes?.openings?.length || themes?.endings?.length) && (
                <section>
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <Music2 /> Themes
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {themes.openings.length > 0 && (
                            <div className="bg-surface p-6 rounded-xl">
                                <h4 className="font-bold text-primary mb-3">Openings</h4>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    {themes.openings.map((op, i) => (
                                        <li key={i} className="line-clamp-1">🎵 {op}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {themes.endings.length > 0 && (
                            <div className="bg-surface p-6 rounded-xl">
                                <h4 className="font-bold text-secondary mb-3">Endings</h4>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    {themes.endings.map((ed, i) => (
                                        <li key={i} className="line-clamp-1">🎵 {ed}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </section>
             )}

             {/* Reviews Section */}
             {reviews.length > 0 && (
                <section>
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <MessageSquare /> Reviews
                    </h3>
                    <div className="space-y-4">
                        {reviews.slice(0, 3).map((review) => (
                            <div key={review.mal_id} className="bg-surface p-6 rounded-xl space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src={review.user.images.jpg.image_url} alt={review.user.username} className="w-8 h-8 rounded-full" />
                                        <span className="font-bold text-white">{review.user.username}</span>
                                    </div>
                                    <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-bold">
                                        Score: {review.score}
                                    </span>
                                </div>
                                <p className="text-slate-300 text-sm line-clamp-4">
                                    {review.review}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
             )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
             <div className="bg-surface p-6 rounded-xl space-y-4">
                <h3 className="text-lg font-bold text-white">Information</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-400">Status</span>
                        <span className="text-white">{anime.status}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-400">Episodes</span>
                        <span className="text-white">{anime.episodes || "?"}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-400">Source</span>
                        <span className="text-white">{anime.source}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-400">Season</span>
                        <span className="text-white capitalize">{anime.season} {anime.year}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-400">Studio</span>
                        <span className="text-white">{anime.studios.map(s => s.name).join(', ')}</span>
                    </div>
                    <div className="flex justify-between pb-2">
                        <span className="text-slate-400">Rating</span>
                        <span className="text-white">{anime.rating}</span>
                    </div>
                </div>
             </div>

             {/* Streaming Links */}
             {streaming.length > 0 && (
                 <div className="bg-surface p-6 rounded-xl space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Monitor size={18} /> Where to Watch
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {streaming.map((link) => (
                            <a 
                                key={link.url}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="block w-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors text-center border border-white/5"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                 </div>
             )}

             {/* Recommendations Mini Grid */}
             {recommendations.length > 0 && (
                 <div>
                    <h3 className="text-lg font-bold text-white mb-4">You Might Like</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {recommendations.slice(0, 4).map(rec => (
                            <div 
                                key={rec.entry.mal_id} 
                                onClick={() => navigate(`/anime/${rec.entry.mal_id}`)}
                                className="relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer group"
                            >
                                <img src={rec.entry.images.webp.large_image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                                    <span className="text-xs text-white font-bold">{rec.entry.title}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};
