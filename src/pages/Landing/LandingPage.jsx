import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/UI/Button';
import styles from './LandingPage.module.css';
import { 
  FaDumbbell, 
  FaHeartbeat, 
  FaChartLine, 
  FaRegCalendarAlt,
  FaArrowRight
} from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className={styles.landingContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>Fit-N</h1>
        </div>
        <nav className={styles.nav}>
          <Link to="/features" className={styles.navLink}>Features</Link>
          <Link to="/pricing" className={styles.navLink}>Pricing</Link>
          <Link to="/about" className={styles.navLink}>About</Link>
          <Link to="/login" className={styles.navLink}>Login</Link>
          <Button 
            onClick={() => navigate('/signup')} 
            className={styles.signupButton}
          >
            Sign Up Free
          </Button>
        </nav>
      </header>
      
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Track Your Fitness Journey <span className={styles.highlight}>Effortlessly</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Monitor your workouts, track progress, and achieve your fitness goals with our intuitive dashboard.
          </p>
          <div className={styles.heroCta}>
            <Button 
              onClick={() => navigate('/signup')} 
              size="large"
            >
              Get Started Free
            </Button>
            <Button 
              onClick={() => navigate('/login')} 
              variant="secondary" 
              size="large"
            >
              Log In
            </Button>
          </div>
        </div>
        <div className={styles.heroImageContainer}>
          <div className={styles.heroImage}></div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2>Everything You Need to Succeed</h2>
          <p>Fit-N provides all the tools to help you track, analyze, and improve your fitness journey.</p>
        </div>
        
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ backgroundColor: 'rgba(0, 198, 173, 0.1)' }}>
              <FaDumbbell style={{ color: 'var(--color-teal)' }} />
            </div>
            <h3>Workout Tracking</h3>
            <p>Log and monitor your workouts with detailed statistics and history.</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ backgroundColor: 'rgba(255, 175, 122, 0.1)' }}>
              <FaHeartbeat style={{ color: 'var(--color-orange)' }} />
            </div>
            <h3>Health Metrics</h3>
            <p>Track vital statistics like heart rate, calories, steps, and sleep.</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ backgroundColor: 'rgba(136, 111, 234, 0.1)' }}>
              <FaChartLine style={{ color: 'var(--color-purple)' }} />
            </div>
            <h3>Progress Analytics</h3>
            <p>Visualize your progress with intuitive charts and data analysis.</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ backgroundColor: 'rgba(255, 122, 159, 0.1)' }}>
              <FaRegCalendarAlt style={{ color: 'var(--color-pink)' }} />
            </div>
            <h3>Goal Setting</h3>
            <p>Set achievable fitness goals and track your journey to success.</p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Ready to Transform Your Fitness Journey?</h2>
          <p>Join thousands of users already tracking their progress with Fit-N.</p>
          <Button 
            onClick={() => navigate('/signup')} 
            size="large"
            className={styles.ctaButton}
          >
            Start Your Journey <FaArrowRight className={styles.ctaIcon} />
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <h2>Fit-N</h2>
            <p>Your fitness journey, simplified.</p>
          </div>
          
          <div className={styles.footerLinks}>
            <div className={styles.linkGroup}>
              <h3>Product</h3>
              <Link to="/features">Features</Link>
              <Link to="/pricing">Pricing</Link>
              <Link to="/testimonials">Testimonials</Link>
            </div>
            
            <div className={styles.linkGroup}>
              <h3>Company</h3>
              <Link to="/about">About</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/contact">Contact</Link>
            </div>
            
            <div className={styles.linkGroup}>
              <h3>Resources</h3>
              <Link to="/blog">Blog</Link>
              <Link to="/guides">Guides</Link>
              <Link to="/help">Help Center</Link>
            </div>
            
            <div className={styles.linkGroup}>
              <h3>Legal</h3>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/cookies">Cookies</Link>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} Fit-N. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 