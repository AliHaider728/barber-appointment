import { useState } from 'react';
import { Menu, X, Scissors, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Button } from  "../ui/button"

export default function BarberSideNav() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Book a Appointment', href: '#booking' },
    { name: 'About', href: '#about' },
    { name: 'Contact Us', href: '#contact' }
  ];

  const socialIcons = [
    { icon: <Facebook size={20} />, href: '#', label: 'Facebook' },
    { icon: <Instagram size={20} />, href: '#', label: 'Instagram' },
    { icon: <Twitter size={20} />, href: '#', label: 'Twitter' },
    { icon: <Youtube size={20} />, href: '#', label: 'Youtube' }
  ];

  return (
    <>
      {/* Header */}
      <header className="">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center mt-[50px] ">
            <div className="w-full rounded-full flex items-center justify-center">
             <img src="../../../public/logo.PNG" alt="" />
            </div>
           
          </div>

          {/* Menu Button */}
          <Button
            onClick={() => setIsOpen(!isOpen)}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-amber-600/20 hover:text-amber-600 transition-all"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </Button>
        </div>
      </header>

      {/* Side Navbar Overlay */}
      <div
        className={`fixed inset-0 bg-black/80 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Side Navbar */}
      <nav
        className={`fixed top-0 right-0 h-full w-80 bg-zinc-900 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close Button */}
          <div className="flex justify-end p-6 border-b border-amber-600/20">
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="text-white  hover:bg-amber-600/20 hover:text-amber-600"
            >
              <X size={28} />
            </Button>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 px-8 py-12">
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block py-4 px-6 text-lg font-medium text-white hover:text-amber-600 hover:bg-amber-600/10 rounded-lg transition-all duration-300 border-l-4 border-transparent hover:border-amber-600"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Icons */}
          <div className="px-8 py-8 border-t border-amber-600/20">
            <p className="text-gray-400 text-sm mb-4 tracking-wider">FOLLOW US</p>
            <div className="flex gap-3">
              {socialIcons.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-gray-400 hover:bg-amber-600 hover:text-black transition-all duration-300 hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      
    </>
  );
}