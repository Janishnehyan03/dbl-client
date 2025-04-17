import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import ErrorPage from "./pages/ErrorPage";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";
import AdminPage from "./pages/admin/AdminPage";
import HomePage from "./pages/homepage/Homepage";
import AnnouncementsPage from "./pages/user/Announcements";
import CategoriesPage from "./pages/user/Categories";
import ContactUsPage from "./pages/user/ContactUs";
import Layout from "./pages/user/components/Layout";
import AdminRoutes from "./utils/AdminRoutes";
import ProtectedRoutes from "./utils/ProtectedRoute";
import { ConfigurationProvider } from "./utils/contexts/configurationContext";

export default function App() {
  return (
    <ConfigurationProvider>
      <Toaster position="top-center" reverseOrder={true} />

      <Routes>
        <Route path="*" element={<ErrorPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/categories" element={<CategoriesPage/>} />
          <Route path="/announcements" element={<AnnouncementsPage/>} />
          <Route path="/contact-us" element={<ContactUsPage/>} />

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
    </ConfigurationProvider>
  );
}
