// Enhanced Portfolio Script
document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const progressBar = document.getElementById('progress-bar');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  // Smooth scrolling for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Calculate offset for fixed navbar
        const navbarHeight = navbar.offsetHeight;
        const elementPosition = targetElement.offsetTop;
        const offsetPosition = elementPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }

      // Close mobile menu if open
      if (navMenu.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // Mobile navigation toggle
  function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !navToggle.contains(e.target)) {
      toggleMobileMenu();
    }
  });

  // Scroll-based effects
  let ticking = false;
  
  function updateOnScroll() {
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Update progress bar
    if (progressBar) {
      const progress = (scrollY / documentHeight) * 100;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
    
    // Navbar background on scroll
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Show/hide scroll to top button
    if (scrollTopBtn) {
      if (scrollY > 300) {
        scrollTopBtn.style.display = 'block';
        setTimeout(() => {
          scrollTopBtn.style.opacity = '1';
          scrollTopBtn.style.transform = 'scale(1)';
        }, 10);
      } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.transform = 'scale(0.8)';
        setTimeout(() => {
          if (scrollY <= 300) {
            scrollTopBtn.style.display = 'none';
          }
        }, 300);
      }
    }
    
    // Update active navigation link
    updateActiveNavLink();
    
    // Animate elements on scroll
    animateOnScroll();
    
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true });

  // Scroll to top functionality
  if (scrollTopBtn) {
    scrollTopBtn.style.display = 'none';
    scrollTopBtn.style.opacity = '0';
    scrollTopBtn.style.transform = 'scale(0.8)';
    scrollTopBtn.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Update active navigation link based on scroll position
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navbarHeight = navbar.offsetHeight;
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - navbarHeight - 100;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
        currentSection = section.id;
      }
    });

    // Special case for hero section
    if (window.scrollY < 100) {
      currentSection = 'home';
    }

    navLinks.forEach(link => {
      const href = link.getAttribute('href').substring(1);
      if (href === currentSection) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Animate elements when they come into view
  function animateOnScroll() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    animatedElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('visible');
      }
    });
  }

  // Contact form handling
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');
      
      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      // Hide any previous status messages
      if (formStatus) {
        formStatus.style.display = 'none';
        formStatus.className = '';
      }
      
      try {
        // Simulate form submission (replace with actual endpoint)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // For demo purposes, we'll show success
        // In real implementation, replace this with actual form submission
        /*
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, message })
        });
        
        if (!response.ok) {
          throw new Error('Failed to send message');
        }
        */
        
        // Show success message
        showFormStatus('success', 'Thank you! Your message has been sent successfully.');
        contactForm.reset();
        
      } catch (error) {
        console.error('Form submission error:', error);
        showFormStatus('error', 'Sorry, there was an error sending your message. Please try again.');
      } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  function showFormStatus(type, message) {
    if (formStatus) {
      formStatus.textContent = message;
      formStatus.className = type;
      formStatus.style.display = 'block';
      
      // Auto-hide success messages after 5 seconds
      if (type === 'success') {
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 5000);
      }
    }
  }

  // Keyboard navigation support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      toggleMobileMenu();
    }
  });

  // Enhanced card hover effects
  const cards = document.querySelectorAll('.skill-card, .project-card, .stat-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Parallax effect for hero section
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallax = heroSection.querySelector('.hero-container');
      if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
      }
    }, { passive: true });
  }

  // Typing animation for hero text (optional enhancement)
  const heroTitle = document.querySelector('.hero-container h1 span');
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;
    
    function typeWriter() {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    }
    
    // Start typing animation after a delay
    setTimeout(typeWriter, 1000);
  }

  // Initialize animations and effects
  updateOnScroll();
  animateOnScroll();

  // Performance optimization: Intersection Observer for animations
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optional: Stop observing after animation
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  // Add loading states and transitions
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Remove any loading classes
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(el => {
      el.classList.remove('loading');
    });
  });

  // Handle resize events
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Close mobile menu on resize to desktop
      if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        toggleMobileMenu();
      }
      // Reset body overflow
      document.body.style.overflow = '';
    }, 250);
  });

  // Add smooth reveal animations with stagger
  const staggerElements = document.querySelectorAll('.skills-grid .skill-card, .projects-grid .project-card');
  staggerElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.1}s`;
  });

  console.log('Portfolio script loaded successfully! 🚀');
});

