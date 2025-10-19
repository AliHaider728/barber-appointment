import { NavLink } from "react-router-dom";

const Services = () => {
  const services = [
    {
      title: "Haircutting",
      description: "Lorem ipsum dolor sit amet, te duo labitur dolores.",
      icon: "/cutting.PNG",
      bgImage:
        "https://berger.themerex.net/wp-content/uploads/2016/07/1-370x493.jpg",
      link: "/services/haircutting",
    },
    {
      title: "Shaving",
      description:
        "Ut tristique pretium tellus, sed fermentum est vestibulum id.",
      icon: "/shaving.PNG",
      bgImage:
        "https://berger.themerex.net/wp-content/uploads/2016/07/3-370x493.jpg",
      link: "/services/shaving",
    },
    {
      title: "Styling",
      description: "Lorem ipsum dolor sit amet, te duo labitur dolores.",
      icon: "/styling.PNG",
      bgImage:
        "https://berger.themerex.net/wp-content/uploads/2016/07/4-370x493.jpg",
      link: "/services/styling",
    },
    {
      title: "Trimming",
      description:
        "Ut tristique pretium tellus, sed fermentum est vestibulum id.",
      icon: "/triming.PNG",
      bgImage:
        "https://berger.themerex.net/wp-content/uploads/2016/07/2-370x493.jpg",
      link: "/services/trimming",
    },
  ];

  return (
    <div className="py-20 px-6 md:px-12 bg-[#f9f6f2]" id="services">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 bg-[#D4AF37] rotate-45"></div>
            <div className="w-2 h-2 bg-[#D4AF37] rotate-45"></div>
            <div className="w-2 h-2 bg-[#D4AF37] rotate-45"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-4">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4D03F]">
              Services
            </span>
          </h2>
          <p className="text-gray-600 text-center font-serif max-w-2xl mx-auto">
            Berger Barbershop is an amazing barbershop located in the heart of
            Upper West Side of Manhattan, NY
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="relative bg-white group overflow-hidden">
              {/* Main Content */}
              <div className="relative z-10 p-8 shadow-lg text-center transition-all duration-300 ease-in-out group-hover:bg-transparent">
                <div className="flex justify-center mb-4">
                  <img
                    src={service.icon}
                    alt={service.title}
                    className="w-16 h-16 object-contain transition-all duration-100 ease-in-out group-hover:opacity-0"  
                  />
                </div>
                <h3 className="text-xl font-semibold text-black mb-2 group-hover:text-[#F4D03F] transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-100 transition-colors duration-300">
                  {service.description}
                </p>
                <NavLink
                  to={service.link}
                  className="inline-block text-[#d5a353] font-medium group-hover:text-[#F4D03F] transition-colors duration-300"
                >
                  Read more →
                </NavLink>
              </div>

              {/* Background Image on Hover */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ backgroundImage: `url(${service.bgImage})` }}
              >
                <div className="absolute inset-0 bg-black opacity-50"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <NavLink
            to="/services"
            className="inline-block px-8 py-3 bg-[#d5a353] text-black font-semibold uppercase hover:bg-[#c49343] transition-colors shadow-md"
          >
            Book A Appoientment
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Services;
