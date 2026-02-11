import { useState, useEffect } from "react";
import { clickName, getLeaderboard, getCurrentUser } from "../services/api"; // our backend calls
import { useAuth } from "../context/AuthContext";

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
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [particles, setParticles] = useState([]);
  const { user, logout } = useAuth(); // User from context

  const loadData = async () => {
    try {
      const [lbData, uData] = await Promise.all([getLeaderboard(), getCurrentUser()]);
      setLeaderboard(lbData);
      setUserData(uData);
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const spawnParticles = () => {
    const colors = ["#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#10b981"];
    const burst = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
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

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    spawnParticles();

    try {
      await clickName(); // backend handles streak & one-click-per-day via token
      setClicked(true);
      await loadData(); // refresh all data
      setTimeout(() => setClicked(false), 600);
    } catch (err) {
      alert(err.message || "Already clicked today");
    } finally {
      setLoading(false);
    }
  };

  const maxStreak =
    leaderboard.length > 0
      ? Math.max(...leaderboard.map((u) => u.currentStreak), 1)
      : 1;

  // Use fetched user data for history, fallback to context user for basic info
  const displayUser = userData || user;

  // Check if clicked today logic (rudimentary client-side check for UI)
  const today = new Date();
  const lastVisit = displayUser.lastVisit ? new Date(displayUser.lastVisit) : null;
  const isClickedToday = lastVisit &&
    lastVisit.getDate() === today.getDate() &&
    lastVisit.getMonth() === today.getMonth() &&
    lastVisit.getFullYear() === today.getFullYear();

  return (
    <div
      className="min-h-screen bg-gray-950 text-white relative overflow-hidden pb-20"
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
        <div className="flex justify-between items-center mb-10">
          <div>
            <p className="text-xs tracking-widest uppercase text-gray-500 mb-1 letterSpacing-wider">
              Daily Engagement
            </p>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome, <span className="text-violet-400">{user.username}</span>
            </h1>
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-white border border-white/10 px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Action Area */}
        <div className="flex flex-col items-center justify-center mb-12 relative">
          <div className="relative flex flex-col items-center">
            {/* Particle burst */}
            {particles.map((p) => (
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
            <div className="text-center mb-4">
              <div className="text-4xl font-bold mb-2">{displayUser.currentStreak || 0}</div>
              <div className="text-sm text-gray-500 uppercase tracking-widest">Current Streak</div>
            </div>

            <button
              onClick={handleClick}
              disabled={loading}
              className={`group relative flex flex-col items-center justify-center w-32 h-32 rounded-full border transition-all duration-300 
                  ${clicked ? "scale-110 border-violet-500/50" : "scale-100 border-white/10"}
                  ${loading ? "opacity-80 cursor-wait" : "cursor-pointer hover:scale-105 active:scale-95 hover:border-violet-500/30"}
                  bg-gradient-to-br ${user.color || "from-rose-400 to-pink-500"} shadow-lg
                `}
            >
              <div className="absolute inset-0 rounded-full bg-black/10 group-hover:bg-transparent transition-colors" />
              <span className="text-3xl filter drop-shadow-md z-10">🔥</span>
              <span className="text-xs font-bold text-white mt-1 uppercase z-10">Click</span>

              {loading && (
                <div className="absolute inset-0 rounded-full border-4 border-white/30 border-t-white animate-spin" />
              )}
            </button>
            <div className="text-center mt-6 h-6">
              {isClickedToday ? (
                <span className="text-emerald-400 text-sm font-medium animate-pulse">
                  Thinking recorded at {lastVisit.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              ) : (
                <span className="text-amber-400/80 text-sm font-medium">
                  Not clicked today
                </span>
              )}
            </div>
          </div>
        </div>

        {/* History Section */}
        {displayUser.history && displayUser.history.length > 0 && (
          <div className="mb-8 p-6 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm">
            <h3 className="text-sm font-bold tracking-wider uppercase text-gray-300 mb-4 flex items-center gap-2">
              <span className="text-lg">🕒</span> History
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {[...displayUser.history].reverse().map((dateStr, idx) => {
                const date = new Date(dateStr);
                return (
                  <div key={idx} className="flex justify-between text-sm py-2 border-b border-white/5 last:border-0 text-gray-400 hover:text-gray-200 transition-colors">
                    <span>{date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    <span className="font-mono text-xs bg-white/5 px-2 py-0.5 rounded text-gray-500">
                      {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
            {leaderboard.map((u, i) => {
              const barWidth = (u.currentStreak / maxStreak) * 100;
              const isCurrentUser = u.username === user.username;
              return (
                <div
                  key={u.username}
                  className={`flex items-center gap-3 px-5 py-3.5 transition-all duration-500 ${isCurrentUser ? "bg-violet-500/10" : i === 0 ? "bg-yellow-400/[0.04]" : ""
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
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${u.color || "from-gray-400 to-gray-600"
                      } flex items-center justify-center text-xs font-bold text-white shadow-md flex-shrink-0`}
                  >
                    {(u.avatar || u.username[0]).toUpperCase()}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-sm font-semibold ${isCurrentUser ? "text-violet-300" : "text-gray-200"}`}
                        style={{ fontFamily: "'Georgia', serif" }}
                      >
                        {u.username} {isCurrentUser && "(You)"}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        🔥{" "}
                        <span className="text-gray-300 font-bold">
                          {u.currentStreak}
                        </span>{" "}
                        <span className="text-gray-600">day streak</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${u.color || "from-gray-400 to-gray-600"
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

        <div className="mt-12 p-6 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm text-center">
          <h3 className="text-lg font-semibold text-amber-400 mb-2">My Daily Pledge</h3>
          <p className="text-sm text-gray-400 italic">
            "I commit to showing up every day. I understand that consistency is the key to mastery. I will only track my own progress."
          </p>
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
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
