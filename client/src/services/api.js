const BASE = import.meta.env.VITE_API_URL;

export const clickName = async (username) => {
  const res = await fetch(`${BASE}/visit/${username}`, {
    method: "POST"
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

export const getLeaderboard = async () => {
  const res = await fetch(`${BASE}/leaderboard`);
  return res.json();
};
