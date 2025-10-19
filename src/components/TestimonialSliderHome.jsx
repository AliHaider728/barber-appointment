import React, { useState, useEffect } from "react";

const testimonials = [
{
name: "David Johnson",
text: "Absolutely the best barbershop in town! My fade was perfect, and the attention to detail was next level. Booking online was super easy too!",
},
{
name: "Michael Carter",
text: "From the moment I stepped in, I felt like royalty. The team is professional, friendly, and knows exactly how to deliver a clean, stylish cut every time.",
},
{
name: "Alex Brown",
text: "I booked my beard trim through the appointment system — smooth process and zero waiting time. The ambiance is amazing!",
},
{
name: "James Wilson",
text: "The precision and craftsmanship here are unmatched. My stylist really took the time to understand what I wanted. Highly recommended!",
},
{
name: "Robert Lee",
text: "A luxury barbershop experience! The interior, the music, the skill — all premium. Booking again for sure!",
},
];

const TestimonialSliderHome = () => {
  const [active, setActive] = useState(2);
  const [isAnimating, setIsAnimating] = useState(false);

  const loadShow = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const items = document.querySelectorAll(".slider-item");
    items.forEach((item, index) => {
      const cardWidth = window.innerWidth < 640 ? 320 : 380;
      const centerOffset = cardWidth / 2;

      if (index === active) {
        // Active card (gold gradient)
        item.style.transform = `translateX(calc(50% - ${centerOffset}px)) scale(1.05)`;
        item.style.zIndex = 20;
        item.style.opacity = 1;
        item.style.background =
          "linear-gradient(135deg, #D4AF37, #B76E79)";
        item.style.color = "white";
        item.style.boxShadow = "0 20px 40px rgba(212, 175, 55, 0.3)";
      } else if (index > active) {
        // Right cards
        const stt = index - active;
        const offset = window.innerWidth < 640 ? 90 * stt : 110 * stt;
        item.style.transform = `translateX(calc(50% - ${centerOffset}px + ${offset}px)) scale(${
          1 - 0.08 * stt
        })`;
        item.style.zIndex = 20 - stt;
        item.style.opacity = stt > 2 ? 0 : 0.7;
        item.style.background = "rgba(255,255,255,0.9)";
        item.style.color = "#333";
        item.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
      } else {
        // Left cards
        const stt = active - index;
        const offset = window.innerWidth < 640 ? 90 * stt : 110 * stt;
        item.style.transform = `translateX(calc(50% - ${centerOffset}px - ${offset}px)) scale(${
          1 - 0.08 * stt
        })`;
        item.style.zIndex = 20 - stt;
        item.style.opacity = stt > 2 ? 0 : 0.7;
        item.style.background = "rgba(255,255,255,0.9)";
        item.style.color = "#333";
        item.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
      }
    });

    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    loadShow();
    window.addEventListener("resize", loadShow);
    return () => window.removeEventListener("resize", loadShow);
  }, [active]);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setActive((prev) => (prev + 1 < testimonials.length ? prev + 1 : 0));
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [active, isAnimating]);

  const nextSlide = () => {
    if (isAnimating) return;
    setActive((prev) => (prev + 1 < testimonials.length ? prev + 1 : 0));
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setActive((prev) => (prev - 1 >= 0 ? prev - 1 : testimonials.length - 1));
  };

  const goToSlide = (index) => {
    if (isAnimating || index === active) return;
    setActive(index);
  };

  return (
    <section
      className="w-full py-16 relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/gallery5.jpg')",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        
      }}
      id="Testimonials"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center text-white">
        <h3 className="text-xl text-[#D4AF37] font-semibold mb-2 uppercase tracking-wider">
          Testimonials
        </h3>
        <h1 className="text-4xl md:text-5xl font-bold mb-10">
          What Our Clients Say
        </h1>

        {/* Slider Container */}
        <div className="relative w-full h-[340px] flex justify-center items-center overflow-hidden">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="slider-item absolute w-[320px] sm:w-[360px] md:w-[460px] h-[260px] sm:h-[280px] rounded-xl p-6 transition-all duration-500 ease-out cursor-pointer border border-[#D4AF37]/20 flex flex-col justify-center items-center text-center"
              onClick={() => goToSlide(index)}
            >
              <p className="text-base leading-relaxed italic line-clamp-4 mb-6">
                “{testimonial.text}”
              </p>
              <h2 className="text-lg font-bold">{testimonial.name}</h2>
            </div>
          ))}

          {/* Prev Button */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 -translate-y-1/2 left-6 md:left-10 text-white w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 z-30"
            style={{
              background:
                "linear-gradient(135deg, #D4AF37 0%, #B76E79 100%)",
              boxShadow: "0 6px 20px rgba(212,175,55,0.4)",
            }}
          >
            ←
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="absolute top-1/2 -translate-y-1/2 right-6 md:right-10 text-white w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 z-30"
            style={{
              background:
                "linear-gradient(135deg, #D4AF37 0%, #B76E79 100%)",
              boxShadow: "0 6px 20px rgba(212,175,55,0.4)",
            }}
          >
            →
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <div
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                active === index ? "scale-125" : "scale-100"
              }`}
              style={{
                backgroundColor:
                  active === index ? "#D4AF37" : "rgba(255,255,255,0.4)",
                boxShadow:
                  active === index
                    ? "0 4px 12px rgba(212,175,55,0.6)"
                    : "none",
              }}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSliderHome;
