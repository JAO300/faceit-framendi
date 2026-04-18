import { useState } from "react";
import SearchBar from "./components/searchbar/Searchbar"
import PlayerCard from "./components/playercard/PlayerCard"

type Player = {
  nickname: string;
  country: string;
  elo: number | null;
  level: number | null;
};

export default function App() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [error, setError] = useState("");

  async function handleSearch(nickname: string) {
    setError("");
    setPlayer(null);

    try {
      const res = await fetch(
        `/api/player?nickname=${encodeURIComponent(nickname)}`
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setPlayer(data);
    } catch {
      setError("Could not connect to server");
    }
  }

  return (
    <div className="container">
      <h1>FACEIT Player Search</h1>

      <SearchBar onSearch={handleSearch} />

      {error && <p className="error">{error}</p>}

      {player && <PlayerCard player={player} />}
    </div>
  );
}