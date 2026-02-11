const BASE = import.meta.env.VITE_API_URL;

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const register = async (username, password, avatar, color) => {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, avatar, color })
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

export const login = async (username, password) => {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

export const clickName = async () => {
  const res = await fetch(`${BASE}/visit`, {
    method: "POST",
    headers: getHeaders()
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

export const takePledge = async () => {
  const res = await fetch(`${BASE}/pledge`, {
    method: "POST",
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

export const getCurrentUser = async () => {
  const res = await fetch(`${BASE}/me`, {
    headers: getHeaders()
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const getLeaderboard = async () => {
  const res = await fetch(`${BASE}/leaderboard`);
  return res.json();
};
