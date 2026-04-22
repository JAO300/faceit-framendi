import { useState } from 'react';
import SearchBar from './components/searchbar/Searchbar';
import PlayerCard from './components/playercard/PlayerCard';
import { Routes, Route } from 'react-router-dom';
import PlayerStatsPage from './pages/PlayerStatsPage';

type Player = {
  nickname: string;
  country: string;
  elo: number | null;
  level: number | null;
};

function HomePage() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || '';

  async function handleSearch(nickname: string) {
    setError('');
    setPlayer(null);

    try {
      const res = await fetch(
        `${API_URL}/api/player?nickname=${encodeURIComponent(nickname)}`,
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      setPlayer(data);
    } catch {
      setError('Could not connect to server');
    }
  }

  return (
    <div className="container">
      <h1>FACEIT Player Stat Finder</h1>

      <SearchBar onSearch={handleSearch} />

      {!player && !error && (
        <div className="search-hint">
          <p>Search by nickname, FACEIT profile, or Steam profile.</p>
          <p>Example:</p>
          <ul>
            <li>faceit.com/players/...</li>
            <li>steamcommunity.com/id/...</li>
            <li>steamcommunity.com/profiles/...</li>
          </ul>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {player && <PlayerCard player={player} />}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/player/:nickname" element={<PlayerStatsPage />} />
    </Routes>
  );
}
