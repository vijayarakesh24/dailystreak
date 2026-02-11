import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // In a real app, you might validate the token with the backend here
            // For now, we'll assume if we have a user object in local storage it's valid, 
            // or we decode the token / fetch user profile. 
            // Since our login returns user info, let's try to grab it from storage too if we persisted it,
            // or just rely on the token. 
            // To keep it simple and robust, let's just persist user info in localStorage for now too.
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
        setLoading(false);
    }, [token]);

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", authToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
