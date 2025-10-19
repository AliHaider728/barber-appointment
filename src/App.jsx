import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import Services from "./components/Service/Services.jsx";
import ServiceDetail from "./components/Service/ServiceDetail.jsx"
import StaffDetail from "./components/Staffs/StaffDetail.jsx";
import AnimatedFooter from "./components/Footer/footer.jsx";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:serviceId" element={<ServiceDetail />} />
          <Route path="/staff/:staffId" element={<StaffDetail />} />
        </Routes>
      </main>
      <AnimatedFooter  />
    </BrowserRouter>
  );
}

export default App;