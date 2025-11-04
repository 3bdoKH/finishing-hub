import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import PrivateRoute from "./utils/PrivateRoute";
import "./utils/i18n"; // Import i18n configuration
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";

// Lazy load pages
const Home = React.lazy(() => import("./pages/Home/Home"));
const About = React.lazy(() => import("./pages/About/About"));
const Companies = React.lazy(() => import("./pages/Companies/Companies"));
const CompanyDetails = React.lazy(() =>
  import("./pages/CompanyDetails/CompanyDetails")
);
const Blog = React.lazy(() => import("./pages/Blog/Blog"));
const BlogPost = React.lazy(() => import("./pages/BlogPost/BlogPost"));
const Contact = React.lazy(() => import("./pages/Contact/Contact"));
const Login = React.lazy(() => import("./pages/Login/Login"));
const NotFound = React.lazy(() => import("./pages/NotFound/NotFound"));
const AdminDashboard = React.lazy(() =>
  import("./pages/AdminDashboard/AdminDashboard")
);
const CompanyDashboard = React.lazy(() =>
  import("./pages/CompanyDashboard/CompanyDashboard")
);

function App() {
  // Set document direction for RTL
  useEffect(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
  }, []);

  return (
    <AuthProvider>
      <Router>
        <React.Suspense
          fallback={<div className="loading-spinner">جاري التحميل...</div>}
        >
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="companies" element={<Companies />} />
              <Route path="companies/:id" element={<CompanyDetails />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:id" element={<BlogPost />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login/:type" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Protected company routes */}
            <Route element={<PrivateRoute requiredRole="company" />}>
              <Route path="company/dashboard" element={<CompanyDashboard />} />
            </Route>

            {/* Protected admin routes */}
            <Route element={<PrivateRoute requiredRole="admin" />}>
              <Route path="admin/dashboard" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </React.Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
