// Sample product data (in a real application, this would come from a backend)
const products = {
    processors: [
        {
            id: 1,
            name: 'Intel Core i9-13900K',
            category: 'Processors',
            brand: 'Intel',
            price: 599.99,
            originalPrice: 649.99,
            rating: 5,
            ratingCount: 24,
            image: 'images/products/processor.jpg',
            isNew: true
        },
        {
            id: 2,
            name: 'AMD Ryzen 9 7950X',
            category: 'Processors',
            brand: 'AMD',
            price: 549.99,
            originalPrice: 599.99,
            rating: 5,
            ratingCount: 18,
            image: 'images/products/processor-amd.jpg',
            isNew: true
        }
    ],
    'graphics-cards': [
        {
            id: 3,
            name: 'NVIDIA RTX 4090',
            category: 'Graphics Cards',
            brand: 'NVIDIA',
            price: 1599.99,
            originalPrice: 1699.99,
            rating: 5,
            ratingCount: 32,
            image: 'images/products/gpu.jpg',
            isNew: true
        },
        {
            id: 4,
            name: 'ASUS ROG STRIX RTX 4080',
            category: 'Graphics Cards',
            brand: 'ASUS',
            price: 1199.99,
            originalPrice: 1299.99,
            rating: 4,
            ratingCount: 15,
            image: 'images/products/gpu-asus.jpg',
            isNew: false
        },
        {
            id: 5,
            name: 'MSI Gaming X RTX 4070 Ti',
            category: 'Graphics Cards',
            brand: 'MSI',
            price: 799.99,
            originalPrice: 849.99,
            rating: 4,
            ratingCount: 28,
            image: 'images/products/gpu-msi.jpg',
            isNew: false
        }
    ],
    motherboards: [
        {
            id: 6,
            name: 'ASUS ROG Maximus Z790',
            category: 'Motherboards',
            brand: 'ASUS',
            price: 499.99,
            originalPrice: 549.99,
            rating: 4,
            ratingCount: 15,
            image: 'images/products/motherboard.jpg',
            isNew: false
        },
        {
            id: 7,
            name: 'MSI MPG B650 CARBON',
            category: 'Motherboards',
            brand: 'MSI',
            price: 299.99,
            originalPrice: 329.99,
            rating: 4,
            ratingCount: 12,
            image: 'images/products/motherboard-msi.jpg',
            isNew: false
        }
    ]
};

// Function to get URL parameters
function getUrlParameter(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

// Function to generate star rating HTML
function generateStarRating(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

// Function to create a product card
function createProductCard(product) {
    return `
        <div class="product-card">
            ${product.isNew ? '<div class="product-badge">New</div>' : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-actions">
                    <button class="action-btn wishlist"><i class="far fa-heart"></i></button>
                    <button class="action-btn quickview"><i class="far fa-eye"></i></button>
                    <button class="action-btn add-to-cart"><i class="fas fa-shopping-cart"></i></button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    <span class="stars">${generateStarRating(product.rating)}</span>
                    <span class="rating-count">(${product.ratingCount})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

// Function to get selected brands
function getSelectedBrands() {
    const brandCheckboxes = document.querySelectorAll('input[name="brand"]:checked');
    return Array.from(brandCheckboxes).map(cb => cb.value);
}

// Function to get price range
function getPriceRange() {
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    return { min: minPrice, max: maxPrice };
}

// Function to filter products
function filterProducts(products) {
    const selectedBrands = getSelectedBrands();
    const priceRange = getPriceRange();
    
    return products.filter(product => {
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand.toLowerCase());
        const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
        return matchesBrand && matchesPrice;
    });
}

// Function to sort products
function sortProducts(products, sortBy) {
    const sortedProducts = [...products];
    
    switch (sortBy) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            sortedProducts.sort((a, b) => b.isNew - a.isNew);
            break;
        case 'featured':
        default:
            // For featured, sort by isNew
            sortedProducts.sort((a, b) => b.isNew - a.isNew);
            break;
    }
    
    return sortedProducts;
}

// Function to update product list
function updateProductList() {
    const category = getUrlParameter('category');
    const productsList = document.querySelector('.products-list');
    const productsFound = document.querySelector('.products-found');
    const sortSelect = document.getElementById('sortSelect');
    
    if (!productsList) return;

    // Clear current products
    productsList.innerHTML = '';

    // Get products based on category
    let displayProducts = [];
    if (category && products[category]) {
        displayProducts = products[category];
    } else {
        // Show all products if no category selected
        displayProducts = Object.values(products).flat();
    }

    // Apply filters
    displayProducts = filterProducts(displayProducts);

    // Apply sorting
    if (sortSelect) {
        displayProducts = sortProducts(displayProducts, sortSelect.value);
    }

    // Update products found count
    if (productsFound) {
        productsFound.innerHTML = `<span>Showing 1-${displayProducts.length} of ${displayProducts.length} products</span>`;
    }

    // Add products to the list
    displayProducts.forEach(product => {
        productsList.innerHTML += createProductCard(product);
    });

    // Update active category in sidebar
    const categoryLinks = document.querySelectorAll('.filter-list a');
    categoryLinks.forEach(link => {
        const linkCategory = new URLSearchParams(link.search).get('category');
        if ((category === null && link.search === '') || linkCategory === category) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Function to handle price range input
function handlePriceRangeInput() {
    const rangeInput = document.getElementById('priceRange');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');

    if (rangeInput && minPriceInput && maxPriceInput) {
        // Update min/max inputs when range slider changes
        rangeInput.addEventListener('input', function() {
            const value = parseInt(this.value);
            maxPriceInput.value = value;
            updateProductList();
        });

        // Update products when min/max inputs change
        minPriceInput.addEventListener('input', updateProductList);
        maxPriceInput.addEventListener('input', updateProductList);
    }
}

// Initialize product list when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateProductList();

    // Add event listeners for brand checkboxes
    const brandCheckboxes = document.querySelectorAll('input[name="brand"]');
    brandCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateProductList);
    });

    // Initialize price range handlers
    handlePriceRangeInput();

    // Add event listeners for sorting
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', updateProductList);
    }
});
