import "./PlayerCard.scss";

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
    <div className="player-card">
      <h2>{player.nickname}</h2>
      <p>Country: {player.country}</p>
      <p>ELO: {player.elo ?? "N/A"}</p>
      <p>Level: {player.level ?? "N/A"}</p>
    </div>
  );
}