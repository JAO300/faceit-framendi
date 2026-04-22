import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PlayerStatsPage.scss';
import Button from '../components/button/Button';
type Match = {
  matchId: string | null;
  gameMode: string | null;
  result: string | null;
  kd: number | null;
  kda: string | null;
  adr: number | null;
  kills: number | null;
  deaths: number | null;
  assists: number | null;
  map: unknown;
  score: unknown;
};

type Props = {
  player: {
    player_id: string;
    nickname: string;
    avatar: string;
    country: string;
    elo: number | null;
    level: number | null;
    steamId: string | null;
  };
  recent: {
    matchesPlayed: number;
    winRate: number;
    avgKd: number | null;
    avgKda: string | null;
    matches: Match[];
  };
};

export default function PlayerStatsPage() {
  const { nickname } = useParams();
  const [data, setData] = useState<Props | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    async function fetchPlayerDetails() {
      if (!nickname) {
        setError('No nickname provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const res = await fetch(
          `${API_URL}/api/player-details?nickname=${encodeURIComponent(nickname)}`,
        );

        const json = await res.json();

        if (!res.ok) {
          setError(json.error || 'Something went wrong');
          setData(null);
          return;
        }

        setData(json);
      } catch {
        setError('Could not connect to server');
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayerDetails();
  }, [nickname]);

  if (loading) {
    return <p className="state loading">Loading...</p>;
  }

  if (error) {
    return (
      <div className="state error">
        <Button to="/">Back</Button>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="state empty">
        <Button to="/">Back</Button>
        <p>No player data found.</p>
      </div>
    );
  }

  return (
    <div className="player-stat-page">
      <Button to="/">Back</Button>

      <div className="stat-card">
        <h1>{data.player.nickname}</h1>

        <div className="stat-card-body">
          {data.player.avatar && (
            <img
              src={data.player.avatar}
              alt={data.player.nickname}
              width="120"
            />
          )}

          <div className="stat-card-details">
            <div>
              <p>Nationality: {data.player.country}</p>
              <p>ELO: {data.player.elo ?? 'N/A'}</p>
              <p>Level: {data.player.level ?? 'N/A'}</p>
            </div>

            <div>
              <p>Win rate: {data.recent.winRate}%</p>
              <p>KD: {data.recent.avgKd ?? 'N/A'}</p>
              <p>K/D/A: {data.recent.avgKda ?? 'N/A'}</p>
            </div>

            <div className="linkar">
              <p>
                <a
                  href={`https://steamcommunity.com/profiles/${data.player.steamId}`}
                  target="_blank"
                >
                  Steam
                </a>
              </p>

              <p>
                <a
                  href={`http://faceit.com/players/${data.player.nickname}`}
                  target="_blank"
                >
                  FACEIT
                </a>
              </p>

              <p>
                <a
                  href={`https://cs.ninja/player/${data.player.steamId}`}
                  target="_blank"
                >
                  Trust Factor
                </a>
              </p>
            </div>

            <p className="stat-card-footer">
              All stats are calculated from players last 10 games
            </p>
          </div>
        </div>
      </div>

      <h2>Last 10 games</h2>

      {data.recent.matches.length === 0 ? (
        <p>No recent matches found.</p>
      ) : (
        <ul className="match-list">
          {data.recent.matches.map((match, index) => (
            <li
              className={`match-card ${
                match.result?.toUpperCase() === 'WIN'
                  ? 'match-card-win'
                  : 'match-card-loss'
              }`}
              key={match.matchId ?? index}
            >
              <div className="match-card-top">
                <p>Map: {String(match.map ?? 'N/A')}</p>
                <p>Result: {match.result ?? 'N/A'}</p>
                <p>Score: {String(match.score ?? 'N/A')}</p>
              </div>

              <details className="match-card-dropdown">
                <summary className="match-card-stats">Show stats</summary>

                <div className="match-card-item">
                  <p>K/D/A: {match.kda ?? 'N/A'}</p>
                  <p>KD: {match.kd ?? 'N/A'}</p>
                  <p>ADR: {match.adr ?? 'N/A'}</p>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
