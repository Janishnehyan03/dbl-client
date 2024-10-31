import React, { ReactNode, createContext, useContext, useState } from "react";
import Axios from "../Axios";

interface User {
  name: string;
  email: string;
  role: string;
  profileImage: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  checkUserLoggedIn: () => Promise<void>;
}

// Create the context with a default value of null

const AuthContext = createContext<AuthContextType | null>(null);
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const checkUserLoggedIn = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await Axios.post("/teacher/check-login", { token });
      setUser(response.data.user);
      if (!response.data.loggedIn) {
        localStorage.clear();
        setUser(null);
        window.location.href = "/login";
      }
    } catch (error: any) {
      console.log(error.response);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, checkUserLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
