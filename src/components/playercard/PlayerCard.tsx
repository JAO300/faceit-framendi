import './PlayerCard.scss';
import { Link } from 'react-router-dom';

type Player = {
  nickname: string;
  country: string;
  elo: number | null;
  level: number | null;
};

type Props = {
  player: Player;
};

export default function PlayerCard({ player }: Props) {
  return (
    <Link to={`/player/${player.nickname}`} className="player-card-link">
      <div className="player-card">
        <h2>{player.nickname}</h2>
        <p>Country: {player.country}</p>
        <p>ELO: {player.elo ?? 'N/A'}</p>
        <p>Level: {player.level ?? 'N/A'}</p>
      </div>
    </Link>
  );
}
