// src/AuthProvider.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
    currentUser: null,
    isAuthenticated: false,
    login: () => {},
    logout: () => {}
});

export default function AuthProvider({ children }) {
    // Храним объект текущего пользователя
    const [currentUser, setCurrentUser] = useState(null);

    // При монтировании пытаемся достать его из localStorage
    useEffect(() => {
        const stored = localStorage.getItem("currentUser");
        if (stored) {
            try {
                setCurrentUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem("currentUser");
            }
        }
    }, []);

    // Флаг, залогинен ли пользователь
    const isAuthenticated = Boolean(currentUser);

    // Сохраняем пользователя в state и в localStorage
    const login = (user) => {
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
    };

    // Очищаем state и localStorage
    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
    };

    return (
        <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
