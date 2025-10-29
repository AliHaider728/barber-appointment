import React from 'react';
import { Scissors, Award, Users, Clock, Sparkles, CheckCircle, Star } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const AboutPage = () => {
    const stats = [
        { number: '15+', label: 'Years Experience', icon: Award },
        { number: '50K+', label: 'Happy Clients', icon: Users },
        { number: '100%', label: 'Satisfaction', icon: Star },
        { number: '24/7', label: 'Support', icon: Clock }
    ];

    const values = [
        {
            icon: Scissors,
            title: 'Master Craftsmanship',
            description: 'Every cut is executed with precision and artistic flair by our expert barbers'
        },
        {
            icon: Sparkles,
            title: 'Premium Experience',
            description: 'Luxury service in an elegant atmosphere designed for your comfort'
        },
        {
            icon: Award,
            title: 'Excellence Standard',
            description: 'We maintain the highest standards in grooming and customer service'
        }
    ];

    const features = [
        'Professional licensed barbers',
        'Premium grooming products',
        'Modern luxury facilities',
        'Personalized consultations',
        'Flexible appointment booking',
        'Complimentary refreshments'
    ];

    return (
        <div className="bg-gradient-to-br from-[#faf7f2] via-[#f5f1ea] to-[#faf7f2] min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200)',
                        filter: 'brightness(0.4)'
                    }}
                ></div>

                <div className="relative max-w-7xl mx-auto px-4 py-32">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-16 h-0.5 bg-[#D4AF37]"></div>
                            <Scissors className="w-8 h-8 text-[#D4AF37]" />
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black text-white mb-6 uppercase tracking-tight leading-none">
                            Welcome to<br />
                            <span className="text-[#D4AF37]">Berger</span>
                        </h1>
                        <p className="text-xl text-gray-200 leading-relaxed font-light">
                            An amazing barbershop located in the heart of the Upper West Side Manhattan
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 text-center shadow-xl border-2 border-gray-100 hover:border-[#D4AF37] transition-all duration-300 hover:scale-105"
                            >
                                <Icon className="w-10 h-10 text-[#D4AF37] mx-auto mb-4" />
                                <div className="text-4xl font-black text-black mb-2">{stat.number}</div>
                                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Main Story Section */}
            <section className="max-w-7xl mx-auto px-4 py-24">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div>
                        <div className="inline-block mb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-0.5 bg-[#D4AF37]"></div>
                                <Award className="w-6 h-6 text-[#D4AF37]" />
                            </div>
                        </div>

                        <h2 className="text-5xl font-black text-black mb-6 uppercase tracking-tight">
                            Our Story
                        </h2>

                        <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                            <p>
                                Founded with passion and precision, our barbershop began as a small dream to redefine men’s grooming.
                                What started as a humble corner shop has now become a modern space where craftsmanship meets creativity.
                            </p>
                            <p>
                                Every cut, every shave, and every style we create reflects our dedication to detail and individuality.
                                Our expert barbers combine traditional techniques with the latest trends to ensure you leave feeling confident
                                and refreshed.
                            </p>
                            <p>
                                At the heart of our story is one simple goal — to make every client look sharp and feel their best.
                                Whether it’s your weekly trim or a complete transformation, we welcome you to experience the art of grooming done right.
                            </p>
                        </div>

                        <NavLink
                            to="/booking"
                            className="mt-8 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black font-bold px-10 py-4 rounded-full uppercase tracking-wider hover:from-black hover:to-gray-900 hover:text-white transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 inline-flex items-center gap-3"
                        >
                            <Scissors className="w-5 h-5" />
                            Book Your Appointment
                        </NavLink>
                    </div>

                    {/* Right Image Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div className="h-64 rounded-2xl overflow-hidden shadow-lg">
                                <img
                                    src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400"
                                    alt="Barbershop interior"
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="h-48 rounded-2xl overflow-hidden shadow-lg">
                                <img
                                    src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400"
                                    alt="Barber tools"
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-6 pt-12">
                            <div className="h-48 rounded-2xl overflow-hidden shadow-lg">
                                <img
                                    src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400"
                                    alt="Haircut process"
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="h-64 rounded-2xl overflow-hidden shadow-lg">
                                <img
                                    src="https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400"
                                    alt="Professional barber"
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-black py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-block mb-6">
                            <div className="flex items-center justify-center gap-3 mb-3">
                                <div className="w-12 h-0.5 bg-[#D4AF37]"></div>
                                <Sparkles className="w-8 h-8 text-[#D4AF37]" />
                                <div className="w-12 h-0.5 bg-[#D4AF37]"></div>
                            </div>
                        </div>
                        <h2 className="text-5xl lg:text-6xl font-black text-white mb-6 uppercase tracking-tight">
                            What Sets Us Apart
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Excellence in every detail, luxury in every experience
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border-2 border-gray-700 hover:border-[#D4AF37] transition-all duration-300 hover:scale-105"
                                >
                                    <div className="bg-[#D4AF37] w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                        <Icon className="w-8 h-8 text-black" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-4 py-24">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1">
                        <div className="bg-white rounded-3xl p-12 shadow-2xl border-2 border-gray-100">
                            <h3 className="text-3xl font-black text-black mb-8 uppercase tracking-tight">
                                Why Choose Berger
                            </h3>
                            <div className="grid gap-4">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-4 group">
                                        <div className="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] p-2 rounded-lg group-hover:scale-110 transition-transform">
                                            <CheckCircle className="w-5 h-5 text-black" />
                                        </div>
                                        <span className="text-gray-800 font-semibold text-lg">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="inline-block mb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-0.5 bg-[#D4AF37]"></div>
                                <Star className="w-6 h-6 text-[#D4AF37]" />
                            </div>
                        </div>
                        <h2 className="text-5xl font-black text-black mb-6 uppercase tracking-tight">
                            Experience<br />Premium Grooming
                        </h2>
                        <p className="text-gray-700 text-lg leading-relaxed mb-8">
                            At Berger, we believe that grooming is an art form. Our skilled barbers combine traditional techniques with modern trends to deliver exceptional results that exceed your expectations.
                        </p>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            Step into our luxurious space and discover why thousands of clients trust us with their grooming needs. From classic cuts to contemporary styles, we bring your vision to life.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-4 pb-24">
                <div className="bg-gradient-to-r from-black to-gray-900 rounded-3xl p-16 text-center shadow-2xl border-2 border-[#D4AF37]">
                    <Scissors className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
                    <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 uppercase tracking-tight">
                        Ready for the Ultimate Grooming Experience?
                    </h2>
                    <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                        Book your appointment today and discover why Berger is Manhattan's premier destination for men's grooming
                    </p>
                    <NavLink to="/booking" className="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black font-bold px-12 py-5 rounded-full uppercase tracking-wider text-lg hover:from-white hover:to-gray-100 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 inline-flex items-center gap-3">
                        Book Now
                        <Scissors className="w-6 h-6" />
                    </NavLink>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;