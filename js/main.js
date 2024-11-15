// Main JavaScript file

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    // Add animation classes to elements as they appear in viewport
    const animateElements = document.querySelectorAll('.hero-content, .category-card, .product-card, .offer-banner');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Search functionality
    const searchInput = document.querySelector('.search input');
    const searchButton = document.querySelector('.search button');

    const handleSearch = () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            // Implement search functionality
            console.log('Searching for:', searchTerm);
            // You would typically make an API call here
        }
    };

    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        if (email) {
            // Implement newsletter subscription
            console.log('Newsletter subscription for:', email);
            // You would typically make an API call here
            
            // Show success message
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
