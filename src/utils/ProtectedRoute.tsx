import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Axios from "./Axios";
import { useAuth } from "./contexts/userContext";

const ProtectedRoutes: React.FC = () => {
  const loginToken = localStorage.getItem("login_token");
  const { setUser } = useAuth();

  useEffect(() => {
    const checkLoggedIn = async () => {
      if (!loginToken) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await Axios.post("/auth/check-login", {
          token: loginToken,
        });
        if (response.data.loggedIn) {
          setUser(response.data.user);
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("Login check failed:", error);
        handleLogout();
      }
    };

    const handleLogout = () => {
      localStorage.clear();
      window.location.href = "/login";
    };

    checkLoggedIn();
  }, [loginToken, setUser]);

  return loginToken ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoutes;
