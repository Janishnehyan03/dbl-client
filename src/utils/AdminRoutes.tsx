import Dashboard from "../pages/admin/components/dashboard/Dashboard";
import AuthorsPage from "../pages/authors/AuthorsPage";
import AddNewBookPage from "../pages/catalog/AddNewBook";
import CatalogBooksPage from "../pages/catalog/BooksPage";
import BulkImportPage from "../pages/catalog/BulkImportPage";
import EditBookForm from "../pages/catalog/EditBookPage";
import CategoriesPage from "../pages/categories/CategoriesPage";
import CirculationPage from "../pages/circulation/CirculationPage";
import AcademicMangement from "../pages/classes/AcademicManagement";
import FinesPage from "../pages/fines/FinesPage";
import LanguagesPage from "../pages/languages/Languages";
import LocationsPage from "../pages/locations/Locations";
import PatronDetails from "../pages/patrons/PatronDetails";
import PatronsPage from "../pages/patrons/PatronsPage";
import Publishers from "../pages/publishers/Publishers";
import QuotesPage from "../pages/quotes/Quotes";
import SectionsPage from "../pages/sections/SectionsPage";
import AccessControlPage from "../pages/settings/AccessControlPage";
import GeneralSettings from "../pages/settings/GeneralSettings";
import ReportPage from "../pages/settings/ReportPage";
import UserSettings from "../pages/settings/UserSettings";

const AdminRoutes = [
  // admin
  {
    path: "/admin",
    element: <Dashboard />,
  },

  //   publisher
  {
    path: "/publishers",
    element: <Publishers />,
  },
  // authors
  {
    path: "/authors",
    element: <AuthorsPage />,
  },

  {
    path: "/circulation",
    element: <CirculationPage />,
  },

  {
    path: "/patrons",
    element: <PatronsPage />,
  },
  {
    path: "/patrons/:id",
    element: <PatronDetails />,
  },
  {
    path: "/catalog/books",
    element: <CatalogBooksPage />,
  },
  {
    path: "/catalog/books/new",
    element: <AddNewBookPage />,
  },
  {
    path: "/catalog/import",
    element: <BulkImportPage />,
  },
  {
    path: "/categories-page",
    element: <CategoriesPage />,
  },
  {
    path: "/setup/locations",
    element: <LocationsPage />,
  },
  {
    path: "/setup/languages",
    element: <LanguagesPage />,
  },
  {
    path: "/setup/sections",
    element: <SectionsPage />,
  },
  {
    path: "/fines",
    element: <FinesPage />,
  },
  {
    path: "/quotes",
    element: <QuotesPage />,
  },
  {
    path: "/settings/general",
    element: <GeneralSettings />,
  },
  {
    path: "/settings/users",
    element: <UserSettings />,
  },
  {
    path: "/settings/reports",
    element: <ReportPage />,
  },
  {
    path: "/settings/access-control",
    element: <AccessControlPage />,
  },
  {
    path: "/settings/academics",
    element: <AcademicMangement />,
  },
  {
    path: "/catalog/books/:id",
    element: <EditBookForm />,
  },
];

export default AdminRoutes;
