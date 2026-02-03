import { useState, useEffect } from "react";
import { clickName, getLeaderboard } from "../services/api"; // our backend calls

const USERS = [
  { name: "Alice", avatar: "A", color: "from-rose-400 to-pink-500" },
  { name: "Bob", avatar: "B", color: "from-amber-400 to-orange-500" },
  { name: "Charlie", avatar: "C", color: "from-emerald-400 to-teal-500" },
  { name: "David", avatar: "D", color: "from-sky-400 to-blue-500" },
  { name: "Eve", avatar: "E", color: "from-violet-400 to-purple-500" },
];

const medalColor = (i) =>
  i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-amber-600" : "text-gray-500";
const medalBg = (i) =>
  i === 0
    ? "bg-yellow-400/10 border-yellow-400/30"
    : i === 1
    ? "bg-gray-300/10 border-gray-300/30"
    : i === 2
    ? "bg-amber-600/10 border-amber-600/30"
    : "bg-white/5 border-white/10";

export default function Home() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(null);
  const [clicked, setClicked] = useState(null);
  const [particles, setParticles] = useState([]);

  // fetch leaderboard from backend
  const loadLeaderboard = async () => {
    try {
      const data = await getLeaderboard();
      setLeaderboard(data);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const spawnParticles = (name) => {
    const colors = ["#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#10b981"];
    const burst = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      name,
      color: colors[i % colors.length],
      angle: (i / 12) * 360,
      dist: 40 + Math.random() * 40,
    }));
    setParticles((prev) => [...prev, ...burst]);
    setTimeout(
      () =>
        setParticles((prev) =>
          prev.filter((p) => !burst.find((b) => b.id === p.id))
        ),
      700
    );
  };

  const handleClick = async (name) => {
    if (loading) return;
    setLoading(name);
    spawnParticles(name);

    try {
      await clickName(name); // backend handles streak & one-click-per-day
      setClicked(name);
      await loadLeaderboard(); // refresh leaderboard
      setTimeout(() => setClicked(null), 600);
    } catch (err) {
      alert(err.message || "Already clicked today");
    } finally {
      setLoading(null);
    }
  };

  const maxStreak =
    leaderboard.length > 0
      ? Math.max(...leaderboard.map((u) => u.currentStreak), 1)
      : 1;

  return (
    <div
      className="min-h-screen bg-gray-950 text-white relative overflow-hidden"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {/* Deep background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[30%] w-[500px] h-[500px] bg-violet-600 opacity-10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-sky-600 opacity-8 rounded-full blur-3xl" />
        <div className="absolute top-[50%] left-[-10%] w-[300px] h-[300px] bg-rose-600 opacity-8 rounded-full blur-3xl" />
      </div>

      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      <div className="relative z-10 max-w-lg mx-auto px-5 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs tracking-widest uppercase text-gray-500 mb-2 letterSpacing-wider">
            Daily Engagement
          </p>
          <h1
            className="text-4xl font-bold tracking-tight"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            <span
              className="bg-gradient-to-r from-amber-300 via-rose-400 to-violet-400 bg-clip-text"
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Click Your Name
            </span>
          </h1>
          <div className="mt-3 mx-auto w-16 h-0.5 bg-gradient-to-r from-transparent via-violet-500 to-transparent rounded-full" />
        </div>

        {/* Name Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 relative">
          {USERS.map((user) => {
            const isLoading = loading === user.name;
            const wasClicked = clicked === user.name;
            return (
              <div key={user.name} className="relative">
                {/* Particle burst */}
                {particles
                  .filter((p) => p.name === user.name)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        width: 6,
                        height: 6,
                        background: p.color,
                        top: "50%",
                        left: "50%",
                        boxShadow: `0 0 6px ${p.color}`,
                        animation: "particleBurst 0.7s ease-out forwards",
                        "--tx": `${Math.cos((p.angle * Math.PI) / 180) * p.dist}px`,
                        "--ty": `${Math.sin((p.angle * Math.PI) / 180) * p.dist}px`,
                      }}
                    />
                  ))}
                <button
                  onClick={() => handleClick(user.name)}
                  disabled={!!loading}
                  className={`relative group flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300 
                    ${wasClicked ? "scale-110" : "scale-100"}
                    ${!!loading && !isLoading ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:scale-105 active:scale-95"}
                    bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10 backdrop-blur-sm
                  `}
                  style={{
                    transition:
                      "transform 0.2s cubic-bezier(.34,1.56,.64,1), opacity 0.3s",
                  }}
                >
                  {/* Avatar circle */}
                  <span
                    className={`w-7 h-7 rounded-full bg-gradient-to-br ${user.color} flex items-center justify-center text-xs font-bold text-white shadow-md`}
                  >
                    {user.avatar}
                  </span>
                  <span
                    className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {user.name}
                  </span>
                  {isLoading && (
                    <span
                      className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
                      style={{ animation: "spin 0.6s linear infinite" }}
                    />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Leaderboard */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <span className="text-lg">🏆</span>
              <h2
                className="text-sm font-bold tracking-wider uppercase text-gray-300"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Leaderboard
              </h2>
            </div>
            <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">
              {leaderboard.length} players
            </span>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {leaderboard.map((user, i) => {
              const barWidth = (user.currentStreak / maxStreak) * 100;
              const matchedUser = USERS.find((u) => u.name === user.username);
              return (
                <div
                  key={user.username}
                  className={`flex items-center gap-3 px-5 py-3.5 transition-all duration-500 ${
                    i === 0 ? "bg-yellow-400/[0.04]" : ""
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold ${medalBg(
                      i
                    )} ${medalColor(i)}`}
                  >
                    {i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1}
                  </div>

                  <span
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${
                      matchedUser?.color || "from-gray-400 to-gray-600"
                    } flex items-center justify-center text-xs font-bold text-white shadow-md flex-shrink-0`}
                  >
                    {user.username[0]}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="text-sm font-semibold text-gray-200"
                        style={{ fontFamily: "'Georgia', serif" }}
                      >
                        {user.username}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        🔥{" "}
                        <span className="text-gray-300 font-bold">
                          {user.currentStreak}
                        </span>{" "}
                        <span className="text-gray-600">day streak</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${
                          matchedUser?.color || "from-gray-400 to-gray-600"
                        } transition-all duration-700 ease-out`}
                        style={{ width: `${barWidth}%`, boxShadow: `0 0 8px currentColor` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-8">
          One click per day • Keep your streak alive
        </p>
      </div>

      <style>{`
        @keyframes particleBurst {
          0% { transform: translate(-50%, -50%) translate(0px, 0px) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
