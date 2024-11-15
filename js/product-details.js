// Product Details Page Functionality
class ProductDetails {
    constructor() {
        this.productId = new URLSearchParams(window.location.search).get('id');
        this.quantity = 1;
        this.product = null;
        this.init();
    }

    async init() {
        if (!this.productId) {
            window.location.href = 'pc-parts.html';
            return;
        }

        await this.loadProductData();
        this.setupEventListeners();
    }

    async loadProductData() {
        try {
            // In a real application, this would be an API call
            // For now, we'll use mock data
            this.product = this.getMockProduct(this.productId);
            this.updateUI();
        } catch (error) {
            console.error('Error loading product data:', error);
        }
    }

    getMockProduct(id) {
        // Mock product data for demonstration
        return {
            id: id,
            name: 'AMD Ryzen 9 5950X',
            sku: 'CPU-R9-5950X',
            category: 'Processors',
            price: 799.99,
            originalPrice: 899.99,
            discount: 11,
            stock: 15,
            description: `
                <p>The AMD Ryzen 9 5950X is a high-performance desktop processor that delivers exceptional multi-threaded performance for demanding users.</p>
                <ul>
                    <li>16 cores and 32 threads for extreme multitasking</li>
                    <li>Up to 4.9 GHz max boost clock</li>
                    <li>Large 72MB cache</li>
                    <li>PCIe 4.0 support</li>
                </ul>
            `,
            specs: [
                { name: 'Cores', value: '16' },
                { name: 'Threads', value: '32' },
                { name: 'Base Clock', value: '3.4 GHz' },
                { name: 'Max Boost Clock', value: '4.9 GHz' },
                { name: 'Total L2 Cache', value: '8MB' },
                { name: 'Total L3 Cache', value: '64MB' },
                { name: 'Default TDP', value: '105W' },
                { name: 'Processor Technology', value: '7nm' },
                { name: 'Socket Type', value: 'AM4' }
            ],
            images: [
                'images/products/ryzen-9-5950x-1.jpg',
                'images/products/ryzen-9-5950x-2.jpg',
                'images/products/ryzen-9-5950x-3.jpg',
                'images/products/ryzen-9-5950x-4.jpg'
            ],
            relatedProducts: [
                {
                    id: '2',
                    name: 'AMD Ryzen 7 5800X',
                    price: 449.99,
                    image: 'images/products/ryzen-7-5800x.jpg',
                    category: 'Processors'
                },
                {
                    id: '3',
                    name: 'Intel Core i9-12900K',
                    price: 589.99,
                    image: 'images/products/core-i9-12900k.jpg',
                    category: 'Processors'
                }
            ]
        };
    }

    updateUI() {
        // Update breadcrumb
        document.querySelector('.breadcrumb .product-name').textContent = this.product.name;

        // Update product gallery
        const mainImage = document.querySelector('#main-product-image');
        mainImage.src = this.product.images[0];
        mainImage.alt = this.product.name;

        // Update thumbnails
        const thumbnailList = document.querySelector('.thumbnail-list');
        thumbnailList.innerHTML = this.product.images.map((image, index) => `
            <div class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
                <img src="${image}" alt="${this.product.name} - Image ${index + 1}">
            </div>
        `).join('');

        // Update product info
        document.querySelector('.product-title').textContent = this.product.name;
        document.querySelector('.sku-value').textContent = this.product.sku;
        document.querySelector('.category-value').textContent = this.product.category;
        document.querySelector('.current-price').textContent = `$${this.product.price.toFixed(2)}`;
        
        if (this.product.originalPrice > this.product.price) {
            document.querySelector('.original-price').textContent = `$${this.product.originalPrice.toFixed(2)}`;
            document.querySelector('.discount-badge').textContent = `-${this.product.discount}%`;
        }

        // Update stock status
        const stockStatus = document.querySelector('.stock-status');
        if (this.product.stock > 0) {
            stockStatus.textContent = `In Stock (${this.product.stock} available)`;
            stockStatus.style.color = 'var(--accent-color)';
        } else {
            stockStatus.textContent = 'Out of Stock';
            stockStatus.style.color = 'var(--error-color)';
        }

        // Update description
        document.querySelector('.description-content').innerHTML = this.product.description;

        // Update specifications
        const specsTable = document.querySelector('.specs-table');
        specsTable.innerHTML = this.product.specs.map(spec => `
            <tr>
                <th>${spec.name}</th>
                <td>${spec.value}</td>
            </tr>
        `).join('');

        // Update related products
        const relatedProductsGrid = document.querySelector('.related-products .products-grid');
        relatedProductsGrid.innerHTML = this.product.relatedProducts.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3><a href="product-details.html?id=${product.id}">${product.name}</a></h3>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="add-to-wishlist">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Thumbnail click handler
        document.querySelector('.thumbnail-list').addEventListener('click', (e) => {
            const thumbnail = e.target.closest('.thumbnail');
            if (!thumbnail) return;

            document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
            thumbnail.classList.add('active');

            const mainImage = document.querySelector('#main-product-image');
            mainImage.src = thumbnail.querySelector('img').src;
        });

        // Quantity controls
        document.querySelector('.quantity-btn.minus').addEventListener('click', () => {
            this.updateQuantity(Math.max(1, this.quantity - 1));
        });

        document.querySelector('.quantity-btn.plus').addEventListener('click', () => {
            this.updateQuantity(Math.min(this.product.stock, this.quantity + 1));
        });

        document.querySelector('.quantity').addEventListener('change', (e) => {
            const newQuantity = parseInt(e.target.value);
            if (isNaN(newQuantity)) return;
            this.updateQuantity(Math.min(this.product.stock, Math.max(1, newQuantity)));
        });

        // Add to cart button
        document.querySelector('.add-to-cart-btn').addEventListener('click', () => {
            if (this.product.stock === 0) return;

            const item = {
                id: this.product.id,
                name: this.product.name,
                price: this.product.price,
                image: this.product.images[0],
                quantity: this.quantity
            };

            cart.addItem(item);
        });

        // Add to wishlist button
        document.querySelector('.add-to-wishlist-btn').addEventListener('click', () => {
            // Implement wishlist functionality
            console.log('Add to wishlist clicked');
        });
    }

    updateQuantity(newQuantity) {
        this.quantity = newQuantity;
        document.querySelector('.quantity').value = this.quantity;
    }
}

// Initialize product details page
document.addEventListener('DOMContentLoaded', () => {
    new ProductDetails();
});
