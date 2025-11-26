
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Details } from './pages/Details';
import { Assistant } from './pages/Assistant';
import { LibraryPage } from './pages/Library';
import { Schedule } from './pages/Schedule';
import { Seasonal } from './pages/Seasonal';
import { TopCharacters } from './pages/TopCharacters';
import { MangaPage } from './pages/Manga';
import { PeoplePage } from './pages/People';
import { Producers } from './pages/Producers';
import { Profile } from './pages/Profile';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/anime/:id" element={<Details />} />
          <Route path="/seasonal" element={<Seasonal />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/characters" element={<TopCharacters />} />
          <Route path="/manga" element={<MangaPage />} />
          <Route path="/people" element={<PeoplePage />} />
          <Route path="/producers" element={<Producers />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Navigate to="/library" replace />} />
          <Route path="/ai-assistant" element={<Assistant />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
