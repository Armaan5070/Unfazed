import { createContext, useState, useEffect } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({isLoggedIn:false});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setCurrentUser({ isLoggedIn: true }); 
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setCurrentUser({ isLoggedIn: true });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser({isLoggedIn:false});
  };

  return (

    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};