import React, { lazy, useEffect, useState } from "react";

const SidebarEngles = () => {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  
useEffect(() => {
  const handleScroll = () => {
    const banner = document.querySelector("#banner");
    const footer = document.querySelector("footer");

    const bannerHeight = banner ? banner.offsetHeight : 600;
    const footerTop = footer ? footer.offsetTop : document.body.scrollHeight;

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // Show only between banner end and before footer
    const isVisible =
      scrollY > bannerHeight - 100 && scrollY + windowHeight < footerTop - 100;

    setVisible(isVisible);

    // Determine active section
    const sections = ["about", "services", "gallery", "contact"];
    const current = sections.find((id) => {
      const el = document.querySelector(`#${id}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        return rect.top <= 150 && rect.bottom >= 150;
      }
      return false;
    });

    setActiveSection(current || "");
  };

  handleScroll(); // Initial check
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.querySelector(`#${id}`);
    if (el) {
      const offset = 80; // Adjust for fixed headers
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const navItems = [
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "Testimonials", label: "Testimonials" },
    { id: "OurStaff", label: "Our Staff" },
    { id:"PriceList",  label:"Price List" },
    { id:"VisitUs",  label:"Visit Us" }
  ];

  return (
    <nav
      className={`fixed right-8 md:right-14 top-1/2 -translate-y-1/2 z-50 transition-all duration-500 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"
      }`}
      aria-label="Section navigation"
    >
      <div className="flex flex-col items-center gap-6">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className="group relative"
              aria-label={`Navigate to ${item.label}`}
              aria-current={isActive ? "true" : undefined}
            >
              {/* Tooltip */}
              <span className="absolute right-8 top-1/2 -translate-y-1/2 bg-[#1a1a1a] text-[#D4AF37] px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                {item.label}
              </span>

              {/* Diamond indicator */}
              <div
                className={`w-3 h-3 border-2 rotate-45 transition-all duration-300 ${
                  isActive
                    ? "bg-[#D4AF37] border-[#D4AF37] scale-110"
                    : "border-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:scale-110"
                }`}
              />
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default SidebarEngles;