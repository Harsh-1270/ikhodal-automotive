/* ============================================
   HOME PAGE - LANDING PAGE (BEFORE LOGIN)
   Professional, scrollable, eye-catching design
   ============================================ */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

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
        <div className="landing-page">
            {/* ========== NAVIGATION BAR ========== */}
            <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-container">
                    <div className="nav-logo">
                        <div className="logo-icon">
                            <span>🚗</span>
                        </div>
                        <span className="logo-text">I Khodal Automotive</span>
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
            <section className="hero-section">
                <div className="hero-background">
                    <div className="gradient-orb orb-1"></div>
                    <div className="gradient-orb orb-2"></div>
                    <div className="gradient-orb orb-3"></div>
                </div>

                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-icon">✨</span>
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
                            <span className="btn-arrow">→</span>
                        </button>
                        <button onClick={() => scrollToSection('how-it-works')} className="btn-secondary-large">
                            Learn More
                        </button>
                    </div>

                    <div className="hero-features">
                        <div className="feature-item">
                            <span className="feature-icon">🎯</span>
                            <span>Expert Technicians</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">⚡</span>
                            <span>Quick Booking</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🏆</span>
                            <span>Quality Service</span>
                        </div>
                    </div>
                </div>

                <div className="scroll-indicator">
                    <span className="scroll-text">Scroll to explore</span>
                    <div className="scroll-arrow">↓</div>
                </div>
            </section>

            {/* ========== ABOUT SECTION ========== */}
            <section id="about" className="about-section">
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
                                <span>👥</span>
                            </div>
                            <h3>Expert Team</h3>
                            <p>Certified technicians with years of experience in automotive service and repair</p>
                        </div>

                        <div className="about-card">
                            <div className="card-icon">
                                <span>🔧</span>
                            </div>
                            <h3>Quality Service</h3>
                            <p>Premium parts and meticulous attention to detail in every service we provide</p>
                        </div>

                        <div className="about-card">
                            <div className="card-icon">
                                <span>📱</span>
                            </div>
                            <h3>Easy Booking</h3>
                            <p>Seamless online booking system to schedule your service at your convenience</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== SERVICES SECTION ========== */}
            <section id="services" className="services-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-badge">Our Services</span>
                        <h2 className="section-title">Comprehensive Car Care Solutions</h2>
                    </div>

                    <div className="services-grid">
                        <div className="service-card">
                            <div className="service-icon">🛠️</div>
                            <h3>Regular Maintenance</h3>
                            <p>Oil changes, filter replacements, and routine checkups</p>
                            <button className="service-link">Learn More →</button>
                        </div>

                        <div className="service-card featured">
                            <div className="featured-badge">Popular</div>
                            <div className="service-icon">🔍</div>
                            <h3>Complete Inspection</h3>
                            <p>Thorough diagnostic and inspection services</p>
                            <button className="service-link">Learn More →</button>
                        </div>

                        <div className="service-card">
                            <div className="service-icon">⚙️</div>
                            <h3>Engine Repair</h3>
                            <p>Expert engine diagnostics and repair services</p>
                            <button className="service-link">Learn More →</button>
                        </div>

                        <div className="service-card">
                            <div className="service-icon">🎨</div>
                            <h3>Body Work</h3>
                            <p>Professional painting and body repair services</p>
                            <button className="service-link">Learn More →</button>
                        </div>

                        <div className="service-card">
                            <div className="service-icon">🚘</div>
                            <h3>AC Service</h3>
                            <p>Air conditioning repair and maintenance</p>
                            <button className="service-link">Learn More →</button>
                        </div>

                        <div className="service-card">
                            <div className="service-icon">🔋</div>
                            <h3>Battery Service</h3>
                            <p>Battery testing, replacement, and maintenance</p>
                            <button className="service-link">Learn More →</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== HOW IT WORKS SECTION ========== */}
            <section id="how-it-works" className="how-it-works-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-badge">Simple Process</span>
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-subtitle">Get your car serviced in three easy steps</p>
                    </div>

                    <div className="steps-container">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <div className="step-icon">📅</div>
                            <h3>Book Appointment</h3>
                            <p>Choose your service and select a convenient date and time slot</p>
                        </div>

                        <div className="step-connector">→</div>

                        <div className="step-card">
                            <div className="step-number">2</div>
                            <div className="step-icon">🔧</div>
                            <h3>Service Your Car</h3>
                            <p>Our expert technicians provide quality service at our facility</p>
                        </div>

                        <div className="step-connector">→</div>

                        <div className="step-card">
                            <div className="step-number">3</div>
                            <div className="step-icon">✅</div>
                            <h3>Drive Away Happy</h3>
                            <p>Get your car back in perfect condition and hit the road</p>
                        </div>
                    </div>

                    <div className="cta-box">
                        <h3>Ready to get started?</h3>
                        <p>Book your appointment today and experience the difference</p>
                        <button onClick={handleGetStarted} className="btn-cta">
                            Book Now
                            <span>→</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* ========== CONTACT SECTION ========== */}
            <section id="contact" className="contact-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-badge">Get In Touch</span>
                        <h2 className="section-title">Contact Us</h2>
                    </div>

                    <div className="contact-grid">
                        <div className="contact-info">
                            <h3>Visit Our Service Center</h3>
                            <div className="info-item">
                                <span className="info-icon">📍</span>
                                <div>
                                    <h4>Address</h4>
                                    <p>Surat, Gujarat, India</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <span className="info-icon">📞</span>
                                <div>
                                    <h4>Phone</h4>
                                    <p>+91 98765 43210</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <span className="info-icon">✉️</span>
                                <div>
                                    <h4>Email</h4>
                                    <p>service@ikhodalautomotive.com</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <span className="info-icon">🕐</span>
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
                            <span className="logo-icon">🚗</span>
                            <span className="logo-text">I Khodal Automotive</span>
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
