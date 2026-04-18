import { useState } from "react";
import "./Searchbar.scss";

type Props = {
  onSearch: (nickname: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [nickname, setNickname] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nickname.trim()) return;

    onSearch(nickname);
  }

  return (
    <div className="searchbar">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search player"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}