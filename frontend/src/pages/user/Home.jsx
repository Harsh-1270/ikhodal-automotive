// import React, { useEffect, useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import './Home.css';

// const Home = () => {
//     const navigate = useNavigate();
//     const [scrolled, setScrolled] = useState(false);
//     const [visibleSections, setVisibleSections] = useState(new Set());
//     const [initialLoadComplete, setInitialLoadComplete] = useState(false);
//     const hasScrolledDown = useRef(false);

//     // Refs for sections
//     const sectionRefs = {
//         hero: useRef(null),
//         about: useRef(null),
//         services: useRef(null),
//         howItWorks: useRef(null),
//         contact: useRef(null)
//     };

//     /* ==========================================
//        DELAYED INITIAL LOAD
//        ========================================== */
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setInitialLoadComplete(true);
//         }, 100);

//         return () => clearTimeout(timer);
//     }, []);

//     /* ==========================================
//        HANDLE SCROLL EFFECT FOR NAVBAR
//        ========================================== */
//     useEffect(() => {
//         const handleScroll = () => {
//             setScrolled(window.scrollY > 50);
//         };

//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);

//     /* ==========================================
//        INTERSECTION OBSERVER - SMOOTH SCROLL ANIMATIONS
//        ========================================== */
//     useEffect(() => {
//         if (!initialLoadComplete) return;

//         const observerOptions = {
//             root: null,
//             rootMargin: '-50px 0px -100px 0px',
//             threshold: [0, 0.05, 0.1]
//         };

//         const observerCallback = (entries) => {
//             entries.forEach((entry) => {
//                 if (entry.isIntersecting && entry.intersectionRatio >= 0.05) {
//                     const sectionName = entry.target.dataset.section;

//                     if (!hasScrolledDown.current || entry.boundingClientRect.top > 0) {
//                         hasScrolledDown.current = true;

//                         setTimeout(() => {
//                             setVisibleSections(prev => new Set([...prev, sectionName]));
//                         }, 100);
//                     }
//                 }
//             });
//         };

//         const observer = new IntersectionObserver(observerCallback, observerOptions);

//         Object.values(sectionRefs).forEach(ref => {
//             if (ref.current) {
//                 observer.observe(ref.current);
//             }
//         });

//         return () => {
//             Object.values(sectionRefs).forEach(ref => {
//                 if (ref.current) {
//                     observer.unobserve(ref.current);
//                 }
//             });
//         };
//     }, [initialLoadComplete]);

//     /* ==========================================
//        NAVIGATION HANDLERS
//        ========================================== */
//     const handleGetStarted = () => {
//         navigate('/register');
//     };

//     const handleSignIn = () => {
//         navigate('/login');
//     };

//     const scrollToSection = (id) => {
//         const element = document.getElementById(id);
//         if (element) {
//             element.scrollIntoView({ behavior: 'smooth' });
//         }
//     };

//     /* ==========================================
//        RENDER COMPONENT
//        ========================================== */
//     return (
//         <div className="landing-page no-select">
//             {/* ========== NAVIGATION BAR ========== */}
//             <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
//                 <div className="nav-container">
//                     <div className="nav-logo">
//                         <div className="logo-icon">
//                             <span>🚗</span>
//                         </div>
//                         <span className="logo-text">I Khodal Automotive</span>
//                     </div>

//                     <div className="nav-links">
//                         <button onClick={() => scrollToSection('about')} className="nav-link">About</button>
//                         <button onClick={() => scrollToSection('services')} className="nav-link">Services</button>
//                         <button onClick={() => scrollToSection('how-it-works')} className="nav-link">How It Works</button>
//                         <button onClick={() => scrollToSection('contact')} className="nav-link">Contact</button>
//                     </div>

//                     <div className="nav-actions">
//                         <button onClick={handleSignIn} className="btn-signin">Sign In</button>
//                         <button onClick={handleGetStarted} className="btn-get-started">Get Started</button>
//                     </div>
//                 </div>
//             </nav>

//             {/* ========== HERO SECTION ========== */}
//             <section
//                 ref={sectionRefs.hero}
//                 data-section="hero"
//                 className={`hero-section ${visibleSections.has('hero') ? 'section-visible' : ''}`}
//             >
//                 <div className="hero-background">
//                     <div className="gradient-orb orb-1"></div>
//                     <div className="gradient-orb orb-2"></div>
//                     <div className="gradient-orb orb-3"></div>
//                 </div>

//                 <div className="hero-content">
//                     <div className="hero-badge">
//                         <span className="badge-icon">✨</span>
//                         <span>Premium Car Service Platform</span>
//                     </div>

//                     <h1 className="hero-title">
//                         <span className="title-line">I Khodal</span>
//                         <span className="title-line gradient-text">Automotive</span>
//                     </h1>

//                     <p className="hero-subtitle">
//                         Experience excellence in car servicing.<br />
//                         Book appointments seamlessly and drive with confidence.
//                     </p>

//                     <div className="hero-buttons">
//                         <button onClick={handleGetStarted} className="btn-primary-large">
//                             Book Service Now
//                             <span className="btn-arrow">→</span>
//                         </button>
//                         {/* <button onClick={() => scrollToSection('how-it-works')} className="btn-secondary-large">
//                             Learn More
//                         </button> */}
//                     </div>

//                     <div className="hero-features">
//                         <div className="feature-item">
//                             <span className="feature-icon">🎯</span>
//                             <span>Expert Technicians</span>
//                         </div>
//                         <div className="feature-item">
//                             <span className="feature-icon">⚡</span>
//                             <span>Quick Booking</span>
//                         </div>
//                         <div className="feature-item">
//                             <span className="feature-icon">🏆</span>
//                             <span>Quality Service</span>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="scroll-indicator">
//                     <span className="scroll-text">Scroll to explore</span>
//                     <div className="scroll-arrow">↓</div>
//                 </div>
//             </section>

//             {/* ========== ABOUT SECTION ========== */}
//             <section
//                 id="about"
//                 ref={sectionRefs.about}
//                 data-section="about"
//                 className={`about-section ${visibleSections.has('about') ? 'section-visible' : ''}`}
//             >
//                 <div className="section-container">
//                     <div className="section-header">
//                         <span className="section-badge">Why Choose Us</span>
//                         <h2 className="section-title">Your Trusted Car Service Partner</h2>
//                         <p className="section-subtitle">
//                             Excellence in automotive care with cutting-edge technology and expert service
//                         </p>
//                     </div>

//                     <div className="about-grid">
//                         <div className="about-card">
//                             <div className="card-icon">
//                                 <span>👥</span>
//                             </div>
//                             <h3>Expert Team</h3>
//                             <p>Certified technicians with years of experience in automotive service and repair</p>
//                         </div>

//                         <div className="about-card">
//                             <div className="card-icon">
//                                 <span>🔧</span>
//                             </div>
//                             <h3>Quality Service</h3>
//                             <p>Premium parts and meticulous attention to detail in every service we provide</p>
//                         </div>

//                         <div className="about-card">
//                             <div className="card-icon">
//                                 <span>📱</span>
//                             </div>
//                             <h3>Easy Booking</h3>
//                             <p>Seamless online booking system to schedule your service at your convenience</p>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* ========== SERVICES SECTION ========== */}
//             <section
//                 id="services"
//                 ref={sectionRefs.services}
//                 data-section="services"
//                 className={`services-section ${visibleSections.has('services') ? 'section-visible' : ''}`}
//             >
//                 <div className="section-container">
//                     <div className="section-header">
//                         <span className="section-badge">Our Services</span>
//                         <h2 className="section-title">Comprehensive Car Care Solutions</h2>
//                     </div>

//                     <div className="services-grid">
//                         {[
//                             { icon: '🛠️', title: 'Regular Maintenance', desc: 'Oil changes, filter replacements, and routine checkups', featured: false },
//                             { icon: '🔍', title: 'Complete Inspection', desc: 'Thorough diagnostic and inspection services', featured: true },
//                             { icon: '⚙️', title: 'Engine Repair', desc: 'Expert engine diagnostics and repair services', featured: false },
//                             { icon: '🎨', title: 'Body Work', desc: 'Professional painting and body repair services', featured: false },
//                             { icon: '🚘', title: 'AC Service', desc: 'Air conditioning repair and maintenance', featured: false },
//                             { icon: '🔋', title: 'Battery Service', desc: 'Battery testing, replacement, and maintenance', featured: false }
//                         ].map((service, index) => (
//                             <div
//                                 key={index}
//                                 className={`service-card ${service.featured ? 'featured' : ''}`}
//                                 style={{
//                                     animationDelay: visibleSections.has('services') ? `${index * 0.15}s` : '0s'
//                                 }}
//                             >
//                                 {service.featured && <div className="featured-badge">Popular</div>}
//                                 <div className="service-icon">{service.icon}</div>
//                                 <h3>{service.title}</h3>
//                                 <p>{service.desc}</p>
//                                 {/* <button className="service-link">Learn More →</button> */}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* ========== HOW IT WORKS SECTION ========== */}
//             <section
//                 id="how-it-works"
//                 ref={sectionRefs.howItWorks}
//                 data-section="howItWorks"
//                 className={`how-it-works-section ${visibleSections.has('howItWorks') ? 'section-visible' : ''}`}
//             >
//                 <div className="section-container">
//                     <div className="section-header">
//                         <span className="section-badge">Simple Process</span>
//                         <h2 className="section-title">How It Works</h2>
//                         <p className="section-subtitle">Get your car serviced in three easy steps</p>
//                     </div>

//                     <div className="steps-container">
//                         <div className="step-card">
//                             <div className="step-number">1</div>
//                             <div className="step-icon">📅</div>
//                             <h3>Book Appointment</h3>
//                             <p>Choose your service and select a convenient date and time slot</p>
//                         </div>

//                         <div className="step-connector">→</div>

//                         <div className="step-card">
//                             <div className="step-number">2</div>
//                             <div className="step-icon">🔧</div>
//                             <h3>Service Your Car</h3>
//                             <p>Our expert technicians provide quality service at our facility</p>
//                         </div>

//                         <div className="step-connector">→</div>

//                         <div className="step-card">
//                             <div className="step-number">3</div>
//                             <div className="step-icon">✅</div>
//                             <h3>Drive Away Happy</h3>
//                             <p>Get your car back in perfect condition and hit the road</p>
//                         </div>
//                     </div>

//                     <div className="cta-box">
//                         <h3>Ready to get started?</h3>
//                         <p>Book your appointment today and experience the difference</p>
//                         <button onClick={handleGetStarted} className="btn-cta">
//                             Book Now
//                             <span>→</span>
//                         </button>
//                     </div>
//                 </div>
//             </section>

//             {/* ========== CONTACT SECTION ========== */}
//             <section
//                 id="contact"
//                 ref={sectionRefs.contact}
//                 data-section="contact"
//                 className={`contact-section ${visibleSections.has('contact') ? 'section-visible' : ''}`}
//             >
//                 <div className="section-container">
//                     <div className="section-header">
//                         <span className="section-badge">Get In Touch</span>
//                         <h2 className="section-title">Contact Us</h2>
//                     </div>

//                     <div className="contact-grid">
//                         <div className="contact-info">
//                             <h3>Visit Our Service Center</h3>
//                             <div className="info-item">
//                                 <span className="info-icon">📍</span>
//                                 <div>
//                                     <h4>Address</h4>
//                                     <p>Surat, Gujarat, India</p>
//                                 </div>
//                             </div>

//                             <div className="info-item">
//                                 <span className="info-icon">📞</span>
//                                 <div>
//                                     <h4>Phone</h4>
//                                     <p>+91 98765 43210</p>
//                                 </div>
//                             </div>

//                             <div className="info-item">
//                                 <span className="info-icon">✉️</span>
//                                 <div>
//                                     <h4>Email</h4>
//                                     <p>service@ikhodalautomotive.com</p>
//                                 </div>
//                             </div>

//                             <div className="info-item">
//                                 <span className="info-icon">🕐</span>
//                                 <div>
//                                     <h4>Working Hours</h4>
//                                     <p>Mon - Sat: 9:00 AM - 7:00 PM</p>
//                                     <p>Sunday: Closed</p>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="contact-form-box">
//                             <h3>Send us a message</h3>
//                             <form className="contact-form">
//                                 <input type="text" placeholder="Your Name" className="form-input" />
//                                 <input type="email" placeholder="Your Email" className="form-input" />
//                                 <textarea placeholder="Your Message" rows="4" className="form-textarea"></textarea>
//                                 <button type="submit" className="btn-submit">Send Message</button>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* ========== FOOTER ========== */}
//             <footer className="landing-footer">
//                 <div className="footer-content">
//                     <div className="footer-brand">
//                         <div className="footer-logo">
//                             <span className="logo-icon">🚗</span>
//                             <span className="logo-text">I Khodal Automotive</span>
//                         </div>
//                         <p>Your trusted partner for premium car service and maintenance</p>
//                     </div>

//                     <div className="footer-links">
//                         <div className="footer-column">
//                             <h4>Quick Links</h4>
//                             <button onClick={() => scrollToSection('about')}>About Us</button>
//                             <button onClick={() => scrollToSection('services')}>Services</button>
//                             <button onClick={() => scrollToSection('how-it-works')}>How It Works</button>
//                         </div>

//                         <div className="footer-column">
//                             <h4>Support</h4>
//                             <button onClick={() => scrollToSection('contact')}>Contact</button>
//                             <a href="#">FAQs</a>
//                             <a href="#">Privacy Policy</a>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="footer-bottom">
//                     <p>&copy; 2026 I Khodal Automotive. All rights reserved.</p>
//                 </div>
//             </footer>
//         </div>
//     );
// };

// export default Home;



import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [visibleSections, setVisibleSections] = useState(new Set());
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const hasScrolledDown = useRef(false);

    // Refs for sections
    const sectionRefs = {
        hero: useRef(null),
        about: useRef(null),
        services: useRef(null),
        howItWorks: useRef(null),
        contact: useRef(null)
    };

    /* ==========================================
       SVG ICONS COMPONENT
       ========================================== */
    const Icons = {
        Car: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
        ),
        Sparkles: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/>
                <path d="M5 5l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z"/>
                <path d="M19 19l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z"/>
            </svg>
        ),
        Target: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
            </svg>
        ),
        Lightning: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
            </svg>
        ),
        Trophy: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
            </svg>
        ),
        Users: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),
        Wrench: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
            </svg>
        ),
        Phone: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
        ),
        Tool: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
            </svg>
        ),
        Magnifier: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
            </svg>
        ),
        Gear: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
        ),
        Paint: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 4V3c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V6h1v4H9v11c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-9h8V4h-3z"/>
            </svg>
        ),
        CarFront: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
        ),
        Battery: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>
            </svg>
        ),
        Calendar: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
        ),
        Check: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
        ),
        MapPin: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
            </svg>
        ),
        Mail: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
            </svg>
        ),
        Clock: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
            </svg>
        ),
        ChevronDown: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"/>
            </svg>
        ),
        ArrowRight: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
            </svg>
        )
    };

    /* ==========================================
       DELAYED INITIAL LOAD
       ========================================== */
    useEffect(() => {
        const timer = setTimeout(() => {
            setInitialLoadComplete(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    /* ==========================================
       HANDLE SCROLL EFFECT FOR NAVBAR
       ========================================== */
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    /* ==========================================
       INTERSECTION OBSERVER - SMOOTH SCROLL ANIMATIONS
       ========================================== */
    useEffect(() => {
        if (!initialLoadComplete) return;

        const observerOptions = {
            root: null,
            rootMargin: '-50px 0px -100px 0px',
            threshold: [0, 0.05, 0.1]
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.05) {
                    const sectionName = entry.target.dataset.section;

                    if (!hasScrolledDown.current || entry.boundingClientRect.top > 0) {
                        hasScrolledDown.current = true;

                        setTimeout(() => {
                            setVisibleSections(prev => new Set([...prev, sectionName]));
                        }, 100);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        Object.values(sectionRefs).forEach(ref => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        return () => {
            Object.values(sectionRefs).forEach(ref => {
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            });
        };
    }, [initialLoadComplete]);

    /* ==========================================
       NAVIGATION HANDLERS
       ========================================== */
    const handleGetStarted = () => {
        navigate('/register');
    };

    const handleSignIn = () => {
        navigate('/login');
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    /* ==========================================
       RENDER COMPONENT
       ========================================== */
    return (
        <div className="landing-page no-select">
            {/* ========== NAVIGATION BAR ========== */}
            <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-container">
                    <div className="nav-logo">
                        <div className="logo-icon">
                            <Icons.Car />
                        </div>
                        <div className="logo-text-stacked">
                            <span className="logo-line-top">I Khodal</span>
                            <span className="logo-line-bottom">Automotive</span>
                        </div>
                    </div>

                    <div className="nav-links">
                        <button onClick={() => scrollToSection('about')} className="nav-link">About</button>
                        <button onClick={() => scrollToSection('services')} className="nav-link">Services</button>
                        <button onClick={() => scrollToSection('how-it-works')} className="nav-link">How It Works</button>
                        <button onClick={() => scrollToSection('contact')} className="nav-link">Contact</button>
                    </div>

                    <div className="nav-actions">
                        <button onClick={handleSignIn} className="btn-signin">Sign In</button>
                        <button onClick={handleGetStarted} className="btn-get-started">Get Started</button>
                    </div>
                </div>
            </nav>

            {/* ========== HERO SECTION ========== */}
            <section
                ref={sectionRefs.hero}
                data-section="hero"
                className={`hero-section ${visibleSections.has('hero') ? 'section-visible' : ''}`}
            >
                <div className="hero-background">
                    <div className="gradient-orb orb-1"></div>
                    <div className="gradient-orb orb-2"></div>
                    <div className="gradient-orb orb-3"></div>
                </div>

                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-icon">
                            <Icons.Sparkles />
                        </span>
                        <span>Premium Car Service Platform</span>
                    </div>

                    <h1 className="hero-title">
                        <span className="title-line">I Khodal</span>
                        <span className="title-line gradient-text">Automotive</span>
                    </h1>

                    <p className="hero-subtitle">
                        Experience excellence in car servicing.<br />
                        Book appointments seamlessly and drive with confidence.
                    </p>

                    <div className="hero-buttons">
                        <button onClick={handleGetStarted} className="btn-primary-large">
                            Book Service Now
                            <span className="btn-arrow">
                                <Icons.ArrowRight />
                            </span>
                        </button>
                    </div>

                    <div className="hero-features">
                        <div className="feature-item">
                            <span className="feature-icon">
                                <Icons.Target />
                            </span>
                            <span>Expert Technicians</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">
                                <Icons.Lightning />
                            </span>
                            <span>Quick Booking</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">
                                <Icons.Trophy />
                            </span>
                            <span>Quality Service</span>
                        </div>
                    </div>
                </div>

                <div className="scroll-indicator">
                    <span className="scroll-text">Scroll to explore</span>
                    <div className="scroll-arrow">
                        <Icons.ChevronDown />
                    </div>
                </div>
            </section>

            {/* ========== ABOUT SECTION ========== */}
            <section
                id="about"
                ref={sectionRefs.about}
                data-section="about"
                className={`about-section ${visibleSections.has('about') ? 'section-visible' : ''}`}
            >
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-badge">Why Choose Us</span>
                        <h2 className="section-title">Your Trusted Car Service Partner</h2>
                        <p className="section-subtitle">
                            Excellence in automotive care with cutting-edge technology and expert service
                        </p>
                    </div>

                    <div className="about-grid">
                        <div className="about-card">
                            <div className="card-icon">
                                <Icons.Users />
                            </div>
                            <h3>Expert Team</h3>
                            <p>Certified technicians with years of experience in automotive service and repair</p>
                        </div>

                        <div className="about-card">
                            <div className="card-icon">
                                <Icons.Wrench />
                            </div>
                            <h3>Quality Service</h3>
                            <p>Premium parts and meticulous attention to detail in every service we provide</p>
                        </div>

                        <div className="about-card">
                            <div className="card-icon">
                                <Icons.Phone />
                            </div>
                            <h3>Easy Booking</h3>
                            <p>Seamless online booking system to schedule your service at your convenience</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== SERVICES SECTION ========== */}
            <section
                id="services"
                ref={sectionRefs.services}
                data-section="services"
                className={`services-section ${visibleSections.has('services') ? 'section-visible' : ''}`}
            >
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-badge">Our Services</span>
                        <h2 className="section-title">Comprehensive Car Care Solutions</h2>
                    </div>

                    <div className="services-grid">
                        {[
                            { icon: <Icons.Tool />, title: 'Regular Maintenance', desc: 'Oil changes, filter replacements, and routine checkups', featured: false },
                            { icon: <Icons.Magnifier />, title: 'Complete Inspection', desc: 'Thorough diagnostic and inspection services', featured: true },
                            { icon: <Icons.Gear />, title: 'Engine Repair', desc: 'Expert engine diagnostics and repair services', featured: false },
                            { icon: <Icons.Paint />, title: 'Body Work', desc: 'Professional painting and body repair services', featured: false },
                            { icon: <Icons.CarFront />, title: 'AC Service', desc: 'Air conditioning repair and maintenance', featured: false },
                            { icon: <Icons.Battery />, title: 'Battery Service', desc: 'Battery testing, replacement, and maintenance', featured: false }
                        ].map((service, index) => (
                            <div
                                key={index}
                                className={`service-card ${service.featured ? 'featured' : ''}`}
                                style={{
                                    animationDelay: visibleSections.has('services') ? `${index * 0.15}s` : '0s'
                                }}
                            >
                                {service.featured && <div className="featured-badge">Popular</div>}
                                <div className="service-icon">{service.icon}</div>
                                <h3>{service.title}</h3>
                                <p>{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== HOW IT WORKS SECTION ========== */}
            <section
                id="how-it-works"
                ref={sectionRefs.howItWorks}
                data-section="howItWorks"
                className={`how-it-works-section ${visibleSections.has('howItWorks') ? 'section-visible' : ''}`}
            >
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-badge">Simple Process</span>
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-subtitle">Get your car serviced in three easy steps</p>
                    </div>

                    <div className="steps-container">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <div className="step-icon">
                                <Icons.Calendar />
                            </div>
                            <h3>Book Appointment</h3>
                            <p>Choose your service and select a convenient date and time slot</p>
                        </div>

                        <div className="step-connector">
                            <Icons.ArrowRight />
                        </div>

                        <div className="step-card">
                            <div className="step-number">2</div>
                            <div className="step-icon">
                                <Icons.Wrench />
                            </div>
                            <h3>Service Your Car</h3>
                            <p>Our expert technicians provide quality service at our facility</p>
                        </div>

                        <div className="step-connector">
                            <Icons.ArrowRight />
                        </div>

                        <div className="step-card">
                            <div className="step-number">3</div>
                            <div className="step-icon">
                                <Icons.Check />
                            </div>
                            <h3>Drive Away Happy</h3>
                            <p>Get your car back in perfect condition and hit the road</p>
                        </div>
                    </div>

                    <div className="cta-box">
                        <h3>Ready to get started?</h3>
                        <p>Book your appointment today and experience the difference</p>
                        <button onClick={handleGetStarted} className="btn-cta">
                            Book Now
                            <span>
                                <Icons.ArrowRight />
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* ========== CONTACT SECTION ========== */}
            <section
                id="contact"
                ref={sectionRefs.contact}
                data-section="contact"
                className={`contact-section ${visibleSections.has('contact') ? 'section-visible' : ''}`}
            >
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-badge">Get In Touch</span>
                        <h2 className="section-title">Contact Us</h2>
                    </div>

                    <div className="contact-grid">
                        <div className="contact-info">
                            <h3>Visit Our Service Center</h3>
                            <div className="info-item">
                                <span className="info-icon">
                                    <Icons.MapPin />
                                </span>
                                <div>
                                    <h4>Address</h4>
                                    <p>Surat, Gujarat, India</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <span className="info-icon">
                                    <Icons.Phone />
                                </span>
                                <div>
                                    <h4>Phone</h4>
                                    <p>+91 98765 43210</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <span className="info-icon">
                                    <Icons.Mail />
                                </span>
                                <div>
                                    <h4>Email</h4>
                                    <p>service@ikhodalautomotive.com</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <span className="info-icon">
                                    <Icons.Clock />
                                </span>
                                <div>
                                    <h4>Working Hours</h4>
                                    <p>Mon - Sat: 9:00 AM - 7:00 PM</p>
                                    <p>Sunday: Closed</p>
                                </div>
                            </div>
                        </div>

                        <div className="contact-form-box">
                            <h3>Send us a message</h3>
                            <form className="contact-form">
                                <input type="text" placeholder="Your Name" className="form-input" />
                                <input type="email" placeholder="Your Email" className="form-input" />
                                <textarea placeholder="Your Message" rows="4" className="form-textarea"></textarea>
                                <button type="submit" className="btn-submit">Send Message</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== FOOTER ========== */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <span className="logo-icon">
                                <Icons.Car />
                            </span>
                            <div className="logo-text-stacked">
                                <span className="logo-line-top">I Khodal</span>
                                <span className="logo-line-bottom">Automotive</span>
                            </div>
                        </div>
                        <p>Your trusted partner for premium car service and maintenance</p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-column">
                            <h4>Quick Links</h4>
                            <button onClick={() => scrollToSection('about')}>About Us</button>
                            <button onClick={() => scrollToSection('services')}>Services</button>
                            <button onClick={() => scrollToSection('how-it-works')}>How It Works</button>
                        </div>

                        <div className="footer-column">
                            <h4>Support</h4>
                            <button onClick={() => scrollToSection('contact')}>Contact</button>
                            <a href="#">FAQs</a>
                            <a href="#">Privacy Policy</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2026 I Khodal Automotive. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;