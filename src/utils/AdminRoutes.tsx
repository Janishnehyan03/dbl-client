import AuthorsPage from "../pages/admin/authors/AuthorsPage";
import BooksPage from "../pages/admin/books/BooksPage";
import EditBook from "../pages/admin/books/edit-book/EditBook";
import Categories from "../pages/admin/categories/Categories";
import Dashboard from "../pages/admin/components/Dashboard";
import ConfigurationPage from "../pages/admin/configurations/ConfigurationPage";
import IssueBook from "../pages/admin/issues/IssueReturnSection";
import LanguageLocationPage from "../pages/admin/language-location/LanguageLocation";
import Publishers from "../pages/admin/publishers/Publishers";
import DailyQuotesAdmin from "../pages/admin/quotes/DailyQuotePage";
import SectionPage from "../pages/admin/sections/SectionPage";
import StudentsPage from "../pages/admin/students/StudentsPage";
import StudentProfile from "../pages/user/StudentProfile";

const AdminRoutes = [
  // admin
  {
    path: "/admin",
    element: <Dashboard />,
  },
  // books
  {
    path: "/books",
    element: <BooksPage />,
  },
  {
    path: "/edit-book/:bookId",
    element: <EditBook />,
  },
  //   publisher
  {
    path: "/publishers",
    element: <Publishers />,
  },
  //   students
  {
    path: "/students",
    element: <StudentsPage />,
  },
  // authors
  {
    path: "/authors",
    element: <AuthorsPage />,
  },
  {
    path: "/categories",
    element: <Categories />,
  },
  {
    path: "/language-location",
    element: <LanguageLocationPage />,
  },
  {
    path: "/sections",
    element: <SectionPage />,
  },
  {
    path: "/book-issue-return",
    element: <IssueBook />,
  },
  {
    path: "/daily-quotes",
    element: <DailyQuotesAdmin />,
  },
  {
    path: "/configurations",
    element: <ConfigurationPage />,
  },
  {
    path: "/profile/:memberId",
    element: <StudentProfile />,
  },
];

export default AdminRoutes;
