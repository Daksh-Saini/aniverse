
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Flame, Calendar, Library, Bot, Menu, X, MonitorPlay, Clock, Shuffle, UserSquare2, BookOpen, Users2, Building2, UserCircle } from 'lucide-react';
import { jikanApi } from '../services/api';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', path: '/', icon: <MonitorPlay size={18} /> },
    { label: 'Search', path: '/search', icon: <Search size={18} /> },
    { label: 'Seasonal', path: '/seasonal', icon: <Calendar size={18} /> },
    { label: 'Schedule', path: '/schedule', icon: <Clock size={18} /> },
    { label: 'Studios', path: '/producers', icon: <Building2 size={18} /> },
    { label: 'Manga', path: '/manga', icon: <BookOpen size={18} /> },
    { label: 'People', path: '/people', icon: <Users2 size={18} /> },
    { label: 'Library', path: '/library', icon: <Library size={18} /> },
    { label: 'AI', path: '/ai-assistant', icon: <Bot size={18} /> },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const handleRandom = async () => {
    try {
        const res = await jikanApi.getRandomAnime();
        if (res.data && res.data.mal_id) {
            navigate(`/anime/${res.data.mal_id}`);
            setMobileMenuOpen(false);
        }
    } catch (e) {
        console.error("Failed to get random anime", e);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-tr from-primary to-secondary p-2 rounded-lg group-hover:rotate-12 transition-transform">
              <Flame size={24} className="text-white" fill="currentColor" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              AniVerse
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs lg:text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-primary/20 text-primary'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <button 
                onClick={handleRandom}
                className="ml-2 p-2 text-slate-400 hover:text-secondary hover:bg-white/5 rounded-full transition-colors"
                title="Random Anime"
            >
                <Shuffle size={18} />
            </button>
            <Link 
                to="/profile"
                className={`ml-2 p-2 rounded-full transition-colors ${isActive('/profile') ? 'text-primary bg-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                title="Your Profile"
            >
                <UserCircle size={20} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="xl:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-surface border-b border-white/10 absolute w-full left-0 top-16 animate-in slide-in-from-top-5 max-h-[80vh] overflow-y-auto z-50 shadow-2xl">
            <div className="flex flex-col p-4 gap-2">
              <Link 
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/profile') ? 'bg-primary/20 text-primary' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <UserCircle size={18} />
                My Profile
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary/20 text-primary'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              <button 
                onClick={handleRandom}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-left"
              >
                <Shuffle size={18} />
                Random Anime
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="border-t border-white/10 bg-surface/50 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            Data provided by <a href="https://jikan.moe/" target="_blank" rel="noreferrer" className="text-primary hover:underline">Jikan API</a>. 
            This is an unofficial project.
          </p>
          <p className="text-slate-600 text-xs mt-2">
            &copy; {new Date().getFullYear()} AniVerse. Built with React & Tailwind.
          </p>
        </div>
      </footer>
    </div>
  );
};
