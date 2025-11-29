import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header/header.jsx";
import Home from "./components/Home/Home";
import Services from "./components/Service/Services.jsx";
import AnimatedFooter from "./components/Footer/footer.jsx";
import ServicesAvailable from "./components/Service/ServicesAvailable.jsx";
import PriceList from "./components/PriceList.jsx";
import BarbersPage from "./components/barbers/barberpage.jsx";
import AllBranchesPage from "./components/branches/AllBranchesPage.jsx";
import BranchDetailPage from "./components/branches/BranchDetailPage.jsx";
import BookingPage from "./components/Booking/BookingPage.jsx";
import LoginSignup from "./components/Admin/AdminLoginSignup.jsx";
import AdminLayout from "./components/Admin/AdminLayout.jsx";
import BarberLayout from "./components/Admin/BarberLayout.jsx";
import ScrollToTop from "./components/scrolltotop.jsx";
import AboutPage from "./components/aboutPage.jsx";
// Admin Pages
import Overview from "./components/Admin/Overview.jsx"
import Appointments from "./components/Admin/Appointments.jsx";
import Barbers from "./components/Admin/Barbers.jsx";
import Branches from "./components/Admin/Branches.jsx";
import ServicesAdmin from "./components/Admin/ServicesAdmin.jsx";
import BarberDashboard from "./components/Admin/BarberDashboard.jsx";
import OAuthCallback from "./components/OAuthCallback.jsx";
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isBarberRoute = location.pathname.startsWith('/barber');

  return (
    <>
      <ScrollToTop />
      {/* Header & Footer  */}
      {!isAdminRoute && !isBarberRoute && <Header />}
      <main className={!isAdminRoute && !isBarberRoute ? "pt-16" : ""}>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pricelist" element={<PriceList />} />
          <Route path="/services/all" element={<ServicesAvailable />} />
          <Route path="/barbers" element={<BarbersPage />} />
          <Route path="/branches" element={<AllBranchesPage />} />
          <Route path="/branches/:branchId" element={<BranchDetailPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/About" element={<AboutPage />} />
          {/* General Login/Signup */}
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/callback" element={<OAuthCallback />} />
          {/* Admin dashboard */}
          <Route path="/admin/dashboard" element={<AdminLayout />}>
            <Route index element={<Overview />} />
            <Route path="overview" element={<Overview />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="barbers" element={<Barbers />} />
            <Route path="branches" element={<Branches />} />
            <Route path="services" element={<ServicesAdmin />} />
          </Route>
          {/* Barber dashboard */}
          <Route path="/barber/dashboard" element={<BarberLayout />}>
            <Route index element={<BarberDashboard />} />
          </Route>
        </Routes>
      </main>
      {!isAdminRoute && !isBarberRoute && <AnimatedFooter />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;