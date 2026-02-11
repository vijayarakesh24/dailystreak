import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { takePledge } from "../services/api";

export default function Pledge() {
    const [loading, setLoading] = useState(false);
    const { login, user, token } = useAuth();
    const navigate = useNavigate();

    const handleAccept = async () => {
        setLoading(true);
        try {
            await takePledge();
            // Update local user state
            login({ ...user, hasPledged: true }, token);
            navigate("/");
        } catch (err) {
            alert("Failed to accept pledge. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4" style={{ fontFamily: "'Georgia', serif" }}>
            <div className="max-w-2xl mx-auto text-center space-y-8 p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 bg-clip-text text-transparent">
                    The Daily Pledge
                </h1>

                <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                    <p>
                        poi soldraven pondati siliku.
                    </p>
                    <p>
                        poi soldravanuku aanmai kuraipadu yearpadum.
                    </p>
                    <p>
                        poi soldraven place aaga maten.nasama poiduvaen.
                    </p>
                    <p>
                        poi sonna kottail kati varum.
                    </p>
                    <p>
                        aagaven na poi solla maten.
                    </p>
                </div>

                <button
                    onClick={handleAccept}
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-full font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-violet-500/25"
                >
                    {loading ? "Accepting..." : "I Accept the Pledge"}
                </button>
            </div>
        </div>
    );
}
