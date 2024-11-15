// Shopping Cart functionality
class ShoppingCart {
    constructor() {
        this.items = new Map();
        this.loadCart();
        this.updateCartCount();
        this.initializeCart();
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            const cartData = JSON.parse(savedCart);
            this.items = new Map(cartData.map(item => [item.id, item]));
        }
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(Array.from(this.items.values())));
        this.updateCartCount();
    }

    // Add item to cart
    addItem(item) {
        if (this.items.has(item.id)) {
            const existingItem = this.items.get(item.id);
            existingItem.quantity += 1;
        } else {
            item.quantity = 1;
            this.items.set(item.id, item);
        }
        this.saveCart();
        this.showToast(`${item.name} added to cart`);
    }

    // Remove item from cart
    removeItem(itemId) {
        this.items.delete(itemId);
        this.saveCart();
        this.renderCart();
    }

    // Update item quantity
    updateQuantity(itemId, newQuantity) {
        if (this.items.has(itemId)) {
            const item = this.items.get(itemId);
            item.quantity = Math.max(1, newQuantity);
            this.saveCart();
            this.renderCart();
        }
    }

    // Calculate cart totals
    calculateTotals() {
        let subtotal = 0;
        this.items.forEach(item => {
            subtotal += item.price * item.quantity;
        });

        const shipping = subtotal > 0 ? 10 : 0;
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + shipping + tax;

        return {
            subtotal,
            shipping,
            tax,
            total
        };
    }

    // Update cart count in header
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        let totalItems = 0;
        this.items.forEach(item => {
            totalItems += item.quantity;
        });
        cartCount.textContent = totalItems;
    }

    // Show toast notification
    showToast(message) {
        const toast = document.querySelector('.cart-toast');
        const toastMessage = toast.querySelector('.toast-message');
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Render cart items
    renderCart() {
        const cartItems = document.querySelector('.cart-items');
        const cartContent = document.querySelector('.cart-content');
        const emptyCart = document.querySelector('.empty-cart');

        if (this.items.size === 0) {
            cartContent.style.display = 'none';
            emptyCart.classList.add('show');
            return;
        }

        cartContent.style.display = 'grid';
        emptyCart.classList.remove('show');
        cartItems.innerHTML = '';

        this.items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>${item.specs || ''}</p>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="number" class="quantity" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <div class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });

        this.updateSummary();
        this.addCartEventListeners();
    }

    // Update order summary
    updateSummary() {
        const totals = this.calculateTotals();
        document.querySelector('.subtotal').textContent = `$${totals.subtotal.toFixed(2)}`;
        document.querySelector('.shipping').textContent = `$${totals.shipping.toFixed(2)}`;
        document.querySelector('.tax').textContent = `$${totals.tax.toFixed(2)}`;
        document.querySelector('.total-amount').textContent = `$${totals.total.toFixed(2)}`;
    }

    // Add event listeners to cart elements
    addCartEventListeners() {
        // Quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.id;
                const item = this.items.get(itemId);
                if (btn.classList.contains('minus')) {
                    this.updateQuantity(itemId, item.quantity - 1);
                } else {
                    this.updateQuantity(itemId, item.quantity + 1);
                }
            });
        });

        // Quantity input
        document.querySelectorAll('.quantity').forEach(input => {
            input.addEventListener('change', (e) => {
                const itemId = e.target.dataset.id;
                const newQuantity = parseInt(e.target.value);
                this.updateQuantity(itemId, newQuantity);
            });
        });

        // Remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.closest('.remove-item').dataset.id;
                this.removeItem(itemId);
            });
        });
    }

    // Initialize cart page
    initializeCart() {
        if (window.location.pathname.includes('cart.html')) {
            this.renderCart();
        }
    }
}

// Initialize shopping cart
const cart = new ShoppingCart();

// Add to cart functionality for product cards
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const product = {
                id: productCard.querySelector('.pc-builder-mark').dataset.id,
                name: productCard.querySelector('h3').textContent,
                price: parseFloat(productCard.querySelector('.price').textContent.replace('$', '')),
                image: productCard.querySelector('img').src,
                specs: productCard.querySelector('p').textContent
            };
            cart.addItem(product);
        });
    });

    // Add cart icon functionality
    document.querySelector('.cart').addEventListener('click', () => {
        window.location.href = 'cart.html';
    });
});
