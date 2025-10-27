import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/header.jsx";
import Home from "./components/Home/Home";
import Services from "./components/Service/Services.jsx";
import ServiceDetail from "./components/Service/ServiceDetail.jsx";
import AnimatedFooter from "./components/Footer/footer.jsx";
import ServicesAvailable from "./components/Service/ServicesAvailable.jsx";
import PriceList from "./components/PriceList.jsx";
import BarbersPage from "./components/barbers/barberpage.jsx";
import AllBranchesPage from "./components/branches/AllBranchesPage.jsx";
import BranchDetailPage from "./components/branches/BranchDetailPage.jsx";
 

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:serviceId" element={<ServiceDetail />} />
          <Route path="/pricelist" element={<PriceList />} />
          <Route path="/services/all" element={<ServicesAvailable />} />
          <Route path="/barbers" element={<BarbersPage/>} />
          <Route path="/branches" element={<AllBranchesPage />} />
          <Route path="/branches/:branchId" element={<BranchDetailPage />} />
        </Routes>
      </main>
      <AnimatedFooter />
    </BrowserRouter>
  );
}

export default App;