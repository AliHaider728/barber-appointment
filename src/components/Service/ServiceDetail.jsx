import { useParams, NavLink } from "react-router-dom";
import bannerBg from "/gallery5..jpg"; // Import background image

const ServiceDetail = () => {
  const { serviceId } = useParams();

  const services = [
    {
      id: "haircutting",
      title: "Haircutting",
      description: "Our expert barbers provide precision haircuts tailored to your style, ensuring a sharp and polished look. Whether you prefer a classic cut or a modern fade, we've got you covered with top-notch service.",
      icon: "/cutting.PNG",
      image: "https://berger.themerex.net/wp-content/uploads/2016/07/1-370x493.jpg",
      features: ["Classic Cuts", "Modern Fades", "Beard Trimming", "Hot Towel Service"]
    },
    {
      id: "shaving",
      title: "Shaving",
      description: "Experience a smooth and refreshing shave with our traditional hot towel and straight razor techniques. Perfect for a clean, professional appearance.",
      icon: "/shaving.PNG",
      image: "https://berger.themerex.net/wp-content/uploads/2016/07/3-370x493.jpg",
      features: ["Hot Towel Treatment", "Straight Razor", "Pre-Shave Oil", "Aftershave Balm"]
    },
    {
      id: "styling",
      title: "Styling",
      description: "Transform your look with our professional styling services. From sleek to voluminous, our stylists create the perfect look for any occasion.",
      icon: "/styling.PNG",
      image: "https://berger.themerex.net/wp-content/uploads/2016/07/4-370x493.jpg",
      features: ["Event Styling", "Daily Grooming", "Product Selection", "Style Consultation"]
    },
    {
      id: "trimming",
      title: "Trimming",
      description: "Keep your beard or hair in top shape with our precise trimming services. We focus on the details to maintain your signature style.",
      icon: "/triming.PNG",
      image: "https://berger.themerex.net/wp-content/uploads/2016/07/2-370x493.jpg",
      features: ["Beard Shaping", "Neckline Cleanup", "Edge-Up", "Mustache Styling"]
    },
  ];

  const service = services.find((s) => s.id === serviceId) || {
    title: "Service Not Found",
    description: "The service you are looking for is not available.",
    image: "",
    features: []
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Banner Section - Fixed at top */}
      <div
        className="relative bg-cover bg-center h-80 flex items-center justify-center"
        style={{
          backgroundImage: `url(${bannerBg})`,
          backgroundAttachment: "fixed"
        }}
      >
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)"
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl">
           

          {/* Title with text shadow */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            {service.title}
          </h1>

          {/* Breadcrumb navigation */}
          <nav className="text-sm md:text-base text-gray-200 flex items-center justify-center gap-2 flex-wrap">
            <NavLink 
              to="/" 
              className="hover:text-yellow-400 transition-colors duration-200 font-medium"
            >
              Home
            </NavLink>
            <span className="text-yellow-400">/</span>
            <NavLink 
              to="/services" 
              className="hover:text-yellow-400 transition-colors duration-200 font-medium"
            >
              All Services
            </NavLink>
            <span className="text-yellow-400">/</span>
            <span className="text-yellow-400 font-semibold">{service.title}</span>
          </nav>

          {/* Decorative line */}
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-24 bg-yellow-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Professional Content Layout */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Elegant Image Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white p-2">
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Refined Price Card */}
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Starting From</p>
                    <p className="text-4xl font-bold text-gray-900 mt-1">$25</p>
                  </div>
                  <div className="bg-yellow-500/10 p-3 rounded-2xl">
                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-400 italic">*Prices vary by complexity</p>
              </div>
            </div>
          </div>

          {/* Sophisticated Content Section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Main Content Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
              
              {/* Professional Title */}
              <div className="mb-8 pb-6 border-b border-gray-100">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h2>
                <div className="w-20 h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
              </div>
              
              {/* Description */}
              <p className="text-gray-600 leading-relaxed text-lg mb-10">
                {service.description}
              </p>

              {/* Refined Features Grid */}
              {service.features && service.features.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Service Includes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.features.map((feature, index) => (
                      <div 
                        key={index} 
                        className="group flex items-center gap-4 bg-gradient-to-r from-gray-50 to-white p-5 rounded-2xl border border-gray-100 hover:border-yellow-400 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium text-base">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Professional CTA Section */}
              <div className="pt-8 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4">
                  <NavLink
                    to="/appointment"
                    className="flex-1 group relative px-8 py-5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold text-lg rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      Book Appointment
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  </NavLink>
                  
                  <button
                    className="flex-1 group px-8 py-5 bg-gray-900 text-white font-bold text-lg rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-xl hover:shadow-2xl"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      Contact Us
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Elegant Info Banner */}
            <div className="bg-gradient-to-r from-yellow-50 via-yellow-50 to-orange-50 rounded-3xl p-6 border border-yellow-200/50 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Walk-ins Welcome</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    We accept walk-in clients, however appointments are highly recommended to guarantee your preferred time slot and minimize wait times.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;