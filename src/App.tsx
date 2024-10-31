import Layout from "./pages/user/components/Layout";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import ErrorPage from "./pages/ErrorPage";
import AdminPage from "./pages/admin/AdminPage";
import LoginPage from "./pages/admin/LoginPage";
import HomePage from "./pages/homepage/Homepage";
import AdminRoutes from "./utils/AdminRoutes";
import ProtectedRoutes from "./utils/ProtectedRoute";

export default function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={true} />

      <Routes>
        <Route path="*" element={<ErrorPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoutes />}>
          <Route element={<AdminPage />}>
            {AdminRoutes.map((route, index) => (
              <Route path={route.path} element={route.element} key={index} />
            ))}
          </Route>
        </Route>
      </Routes>
    </>
  );
}
