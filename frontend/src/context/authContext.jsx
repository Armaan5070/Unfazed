import { createContext, useState, useEffect } from "react";
import api from "../api/axiosInstance";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({ isLoggedIn: false });
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function GetUserData() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await api.get('/therapist/profile/me');
          setUserData(res.data);
          setCurrentUser({ isLoggedIn: true });
        }
        catch (err) {
          if (err.response && err.response.status === 401) {
            console.warn("Session expired");
            localStorage.removeItem("token");
            setUserData(null);
          } else {
            console.error("API Error:", err);
          }
        }

      }
      setLoading(false);
    }

    GetUserData();

  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setCurrentUser({ isLoggedIn: true });
    setUserData(userData)
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser({ isLoggedIn: false });
    setUserData(null);
  };

  return (

    <AuthContext.Provider value={{ currentUser, login, logout, userData, setUserData }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};