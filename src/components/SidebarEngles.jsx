import React, { useEffect, useState } from "react";

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

      const isVisible =
        scrollY > bannerHeight - 100 &&
        scrollY + windowHeight < footerTop - 100;

      setVisible(isVisible);

      const sections = [
        "about",
        "services",
        "Testimonials",
        "Branches",
        "OurStaff",
        "PriceList",
        "VisitUs",
      ];
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

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.querySelector(`#${id}`);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const navItems = [
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "Testimonials", label: "Testimonials" },
    { id: "Branches", label: "Branches" },
    { id: "OurStaff", label: "Our Staff" },
    { id: "PriceList", label: "Price List" },
    { id: "VisitUs", label: "Visit Us" },
  ];

  return (
    <nav
      className={`hidden md:flex fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-50 transition-all duration-500 ${
        visible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-6 pointer-events-none"
      }`}
      aria-label="Section navigation"
    >
      <div className="flex flex-col items-center gap-5">
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
              <span className="absolute right-7 top-1/2 -translate-y-1/2 bg-[#1a1a1a] text-[#D4AF37] px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
                {item.label}
              </span>

              <div
                className={`w-2.5 h-2.5 border-2 rotate-45 transition-all duration-300 ${
                  isActive
                    ? "bg-[#D4AF37] border-[#D4AF37] scale-125"
                    : "border-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:scale-125"
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