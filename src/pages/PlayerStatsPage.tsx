import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

type Match = {
  matchId: string | null;
  gameMode: string | null;
  result: string | null;
  kd: number | null;
  kills: number | null;
  deaths: number | null;
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
  };
  recent: {
    matchesPlayed: number;
    winRate: number;
    avgKd: number | null;
    matches: Match[];
  };
};

export default function PlayerStatsPage() {
  const { nickname } = useParams();
  const [data, setData] = useState<Props | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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
          `/api/player-details?nickname=${encodeURIComponent(nickname)}`,
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
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div>
        <Link to="/">Back</Link>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <Link to="/">Back</Link>
        <p>No player data found.</p>
      </div>
    );
  }

  return (
    <div>
      <Link to="/">Back</Link>

      <h1>{data.player.nickname}</h1>

      {data.player.avatar && (
        <img src={data.player.avatar} alt={data.player.nickname} width="120" />
      )}

      <p>Nationality: {data.player.country}</p>
      <p>ELO: {data.player.elo ?? 'N/A'}</p>
      <p>Level: {data.player.level ?? 'N/A'}</p>
      <p>Win rate of last 10 matches: {data.recent.winRate}%</p>
      <p>KD of last 10 games: {data.recent.avgKd ?? 'N/A'}</p>

      <h2>Last 10 games</h2>

      {data.recent.matches.length === 0 ? (
        <p>No recent matches found.</p>
      ) : (
        <ul>
          {data.recent.matches.map((match) => (
            <li key={match.matchId}>
              <p>Result: {match.result ?? 'N/A'}</p>
              <p>Map: {String(match.map ?? 'N/A')}</p>
              <p>Score: {String(match.score ?? 'N/A')}</p>
              <p>KD: {match.kd ?? 'N/A'}</p>
              <p>Kills: {match.kills ?? 'N/A'}</p>
              <p>Deaths: {match.deaths ?? 'N/A'}</p>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
