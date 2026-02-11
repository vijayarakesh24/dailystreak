import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as apiLogin } from "../services/api";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await apiLogin(username, password);
            login(data.user, data.token);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl w-full max-w-md backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center text-gray-500 mt-4 text-sm">
                    Don't have an account? <Link to="/register" className="text-violet-400 hover:text-violet-300">Register</Link>
                </p>
            </div>
        </div>
    );
}
