import React, { useRef } from "react";
import { Link } from "react-router-dom";
import LaserFlow from '../LaserFlow';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const AnimatedFooter = () => {
  const revealImgRef = useRef(null);

  return (
    <div 
      style={{ 
        height: '700px', 
        position: 'relative', 
        overflow: 'hidden',
        backgroundColor: '#0a0a0a'
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty('--mx', `${x}px`);
          el.style.setProperty('--my', `${y + rect.height * 0.5}px`);
        }
      }}
      onMouseLeave={() => {
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty('--mx', '-9999px');
          el.style.setProperty('--my', '-9999px');
        }
      }}
    >
      <LaserFlow
        horizontalBeamOffset={0.1}
        verticalBeamOffset={0.0}
        color="#D4AF37"
      />
      
      {/* Main Footer Content */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        height: '80%',
        backgroundColor: 'rgba(10, 10, 10, 0.95)',
        borderRadius: '16px',
        border: '2px solid #D4AF37',
        boxShadow: '0 0 30px rgba(212, 175, 55, 0.4), inset 0 0 20px rgba(212, 175, 55, 0.1)',
        zIndex: 6,
        backdropFilter: 'blur(10px)',
        padding: '60px 40px 30px'
      }}>
        <div className="max-w-6xl mx-auto h-full flex flex-col justify-between">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand Section */}
            <div>
              <h3 className="text-3xl font-black uppercase mb-3" style={{ color: '#D4AF37' }}>
                Barber Shop
              </h3>
              <div style={{ width: '50px', height: '3px', background: '#D4AF37', marginBottom: '20px' }}></div>
              <p style={{ color: '#9ca3af', fontSize: '15px', lineHeight: '1.6' }}>
                Premium grooming and traditional barbering services. Book your appointment today for the ultimate grooming experience.
              </p>
              <button 
                onClick={() => window.location.href = '/booking'}
                className="mt-6"
                style={{
                  background: '#D4AF37',
                  color: '#000',
                  padding: '10px 20px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#fff';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#D4AF37';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Book Now
              </button>
            </div>

            {/* Branches */}
            <div>
              <h4 className="text-base font-bold uppercase mb-4" style={{ color: '#fff' }}>
                Our Branches
              </h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {[
                  { location: 'Downtown Manhattan', address: '123 Main St, NY' },
                  { location: 'Brooklyn Heights', address: '456 Park Ave, BK' },
                  { location: 'Queens Center', address: '789 Oak Rd, QN' },
                ].map((branch, idx) => (
                  <li key={idx} style={{ marginBottom: '14px' }}>
                    <div style={{ color: '#D4AF37', fontSize: '15px', fontWeight: '600', marginBottom: '2px' }}>
                      {branch.location}
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '11px' }}>
                      {branch.address}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Appointment Hours */}
            <div className="-ml-5 relative -left-16">
              <h4 className="text-base font-bold uppercase mb-4" style={{ color: '#fff' }}>
                Appointment Hours
              </h4>
              <div style={{ fontSize: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#9ca3af' }}>Monday - Friday</span>
                  <span style={{ color: '#D4AF37', fontWeight: '600' }}>9AM - 8PM</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#9ca3af' }}>Saturday</span>
                  <span style={{ color: '#D4AF37', fontWeight: '600' }}>10AM - 6PM</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ color: '#9ca3af' }}>Sunday</span>
                  <span style={{ color: '#D4AF37', fontWeight: '600' }}>10AM - 5PM</span>
                </div>
                <div style={{ padding: '12px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '6px', marginTop: '16px' }}>
                  <p style={{ color: '#D4AF37', fontSize: '12px', fontWeight: '600' }}>
                    Walk-ins Welcome
                  </p>
                  <p style={{ color: '#9ca3af', fontSize: '11px', marginTop: '4px' }}>
                    Or book online for guaranteed slot
                  </p>
                </div>
              </div>
            </div>

            {/* Contact & Location */}
            <div>
              <h4 className="text-base font-bold uppercase mb-4" style={{ color: '#fff' }}>
                Contact Us
              </h4>
              <div style={{ fontSize: '15px', marginBottom: '20px' }}>
                <p style={{ color: '#9ca3af', marginBottom: '8px' }}>
                  <strong style={{ color: '#D4AF37' }}>Address:</strong><br />
                  123 Main Street<br />
                  Downtown, NY 10001
                </p>
                <p style={{ color: '#9ca3af', marginBottom: '8px' }}>
                  <strong style={{ color: '#D4AF37' }}>Phone:</strong><br />
                  (555) 123-4567
                </p>
                <p style={{ color: '#9ca3af' }}>
                  <strong style={{ color: '#D4AF37' }}>Email:</strong><br />
                  booking@barbershop.com
                </p>
              </div>
              
              {/* Social Icons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                {[
                  { Icon: Facebook, name: 'Facebook', href: '#' },
                  { Icon: Instagram, name: 'Instagram', href: '#' },
                  { Icon: Twitter, name: 'Twitter', href: '#' },
                ].map(({ Icon, name, href }, idx) => (
                  <a 
                    key={idx}
                    href={href}
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: '#9ca3af',
                      textDecoration: 'none',
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#D4AF37';
                      e.target.style.color = '#000';
                      e.target.style.transform = 'translateY(-3px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.target.style.color = '#9ca3af';
                      e.target.style.transform = 'translateY(0)';
                    }}
                    aria-label={name}
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{ 
            borderTop: '1px solid rgba(212, 175, 55, 0.2)', 
            paddingTop: '20px',
            marginTop: '30px'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              <p style={{ color: '#6b7280', fontSize: '11px' }}>
                © 2025 Barber Shop. All Rights Reserved.
              </p>
              <div style={{ display: 'flex', gap: '20px' }}>
                <a 
                  href="#" 
                  style={{ color: '#6b7280', fontSize: '11px', textDecoration: 'none' }}
                  onMouseOver={(e) => e.target.style.color = '#D4AF37'}
                  onMouseOut={(e) => e.target.style.color = '#6b7280'}
                >
                  Privacy Policy
                </a>
                <a 
                  href="#" 
                  style={{ color: '#6b7280', fontSize: '11px', textDecoration: 'none' }}
                  onMouseOver={(e) => e.target.style.color = '#D4AF37'}
                  onMouseOut={(e) => e.target.style.color = '#6b7280'}
                >
                  Terms of Service
                </a>
                <a 
                  href="#" 
                  style={{ color: '#6b7280', fontSize: '11px', textDecoration: 'none' }}
                  onMouseOver={(e) => e.target.style.color = '#D4AF37'}
                  onMouseOut={(e) => e.target.style.color = '#6b7280'}
                >
                  Cancellation Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedFooter;
