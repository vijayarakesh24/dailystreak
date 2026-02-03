export default function Leaderboard({ data }) {
  return (
    <div>
      <h2>Leaderboard</h2>
      <ul>
        {data.map((u, i) => (
          <li key={u.username}>
            #{i + 1} {u.username} — 🔥 {u.currentStreak}
          </li>
        ))}
      </ul>
    </div>
  );
}
