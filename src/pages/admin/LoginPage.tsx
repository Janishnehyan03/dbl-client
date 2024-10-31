import React, { useState } from "react";
import classNames from "classnames";
import Axios from "../../utils/Axios";
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
      let response = await Axios.post("/users/login", { username, password });
      if (response.status === 200) {
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
        { "bg-[url(/path/to/library-background.jpg)]": true } // Update with your background image path
      )}
    >
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <img
            className="mx-auto h-12 w-auto"
            src="/vite.svg" // Update with your library logo path
            alt="Library Logo"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Dr. U Bapputty Haji Library
          </h2>
          <p className="mt-2 text-sm text-gray-600">Welcome, member!</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="my-2">
              <label htmlFor="refNumber" className="sr-only">
                Reference Number
              </label>
              <input
                id="refNumber"
                name="refNumber"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={classNames(
                  "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm",
                  {
                    "border-red-500": error,
                  }
                )}
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={classNames(
                  "appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm",
                  {
                    "border-red-500": error,
                  }
                )}
                placeholder="Password"
              />
            </div>
          </div>

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          <div>
            {loading ? (
              <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Processing...
              </button>
            ) : (
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
