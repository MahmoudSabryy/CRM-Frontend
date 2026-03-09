import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUserData(null);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        setUserData(null);
      } else {
        setUserData(decoded);
      }
    } catch {
      localStorage.removeItem("token");
      setUserData(null);
    }

    setLoading(false);
  };

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUserData(decoded);
  };

  const logOut = () => {
    localStorage.removeItem("token");
    setUserData(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ userData, login, logOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
