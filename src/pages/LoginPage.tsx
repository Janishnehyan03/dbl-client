import React, { useState } from "react";
import classNames from "classnames";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const loginToken = localStorage.getItem("login_token");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    // Perform form validation here (e.g., check for empty fields)
    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }
    try {
      let response = await Axios.post("/auth/login", { username, password });
      if (response.data.token) {
        localStorage.setItem("login_token", response.data.token);
        setLoading(false);
        toast.success("Login Successful");
        window.location.href = "/admin";
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  if (loginToken) {
    return <Navigate to={"/admin"} />;
  }
  return (
    <div
      className={classNames(
        "min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat",
        { "bg-[url(https://images.pexels.com/photos/2041540/pexels-photo-2041540.jpeg?auto=compress&cs=tinysrgb&w=6000)]": true } // Update with your background image path
      )}
    >
      <div className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-white/20">
        <div className="text-center">
          <img
            className="mx-auto h-16 w-auto"
            src="/logo.png" // Update with your library logo path
            alt="Library Logo"
          />
          <h2 className="mt-6 text-4xl font-bold text-gray-900">
            Dr. U Bapputty Haji Library
          </h2>
          <p className="mt-2 text-lg text-gray-600">Welcome Back!</p>
          <p className="mt-1 text-sm text-gray-500">
            Please sign in to access your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={classNames(
                  "mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                  {
                    "border-red-500": error,
                  }
                )}
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={classNames(
                  "mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                  {
                    "border-red-500": error,
                  }
                )}
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          <div>
            {loading ? (
              <button
                disabled
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 opacity-50 cursor-not-allowed"
              >
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </button>
            ) : (
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                Sign in
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
