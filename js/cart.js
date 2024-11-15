// Cart functionality
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.total = 0;
        this.count = 0;
        this.updateCartCount();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Listen for cart update events
        document.addEventListener('cartUpdate', (e) => {
            const { product, action } = e.detail;
            if (action === 'add') {
                this.addItem(product);
            } else if (action === 'remove') {
                this.removeItem(product.id);
            }
        });
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }

        this.updateCart();
    }

    removeItem(productId) {
        const index = this.items.findIndex(item => item.id === productId);
        if (index !== -1) {
            if (this.items[index].quantity > 1) {
                this.items[index].quantity -= 1;
            } else {
                this.items.splice(index, 1);
            }
            this.updateCart();
        }
    }

    updateCart() {
        // Update cart totals
        this.calculateTotals();
        
        // Update cart count display
        this.updateCartCount();
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(this.items));
        
        // Update cart dropdown if it exists
        this.updateCartDropdown();
    }

    calculateTotals() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.count = this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.count;
            cartCount.style.display = this.count > 0 ? 'block' : 'none';
        }
    }

    updateCartDropdown() {
        const cartDropdown = document.querySelector('.cart-dropdown');
        if (!cartDropdown) {
            this.createCartDropdown();
            return;
        }

        const cartContent = cartDropdown.querySelector('.cart-content');
        cartContent.innerHTML = this.items.length > 0 
            ? this.generateCartItemsHTML()
            : '<p class="empty-cart">Your cart is empty</p>';

        const cartTotal = cartDropdown.querySelector('.cart-total');
        if (cartTotal) {
            cartTotal.textContent = `Total: $${this.total.toFixed(2)}`;
        }
    }

    createCartDropdown() {
        const cartDropdown = document.createElement('div');
        cartDropdown.className = 'cart-dropdown';
        cartDropdown.innerHTML = `
            <div class="cart-content">
                ${this.items.length > 0 
                    ? this.generateCartItemsHTML()
                    : '<p class="empty-cart">Your cart is empty</p>'}
            </div>
            <div class="cart-footer">
                <div class="cart-total">Total: $${this.total.toFixed(2)}</div>
                <button class="checkout-btn">Checkout</button>
            </div>
        `;

        // Add event listener to checkout button
        const checkoutBtn = cartDropdown.querySelector('.checkout-btn');
        checkoutBtn.addEventListener('click', () => this.checkout());

        // Add the dropdown to the cart icon
        const cartIcon = document.querySelector('.cart');
        if (cartIcon) {
            cartIcon.appendChild(cartDropdown);

            // Show/hide dropdown on cart icon click
            cartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                cartDropdown.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!cartIcon.contains(e.target)) {
                    cartDropdown.classList.remove('show');
                }
            });
        }
    }

    generateCartItemsHTML() {
        return this.items.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <button class="remove-item" data-id="${item.id}">×</button>
            </div>
        `).join('');
    }

    checkout() {
        if (this.items.length === 0) {
            alert('Your cart is empty');
            return;
        }

        // Implement checkout functionality
        console.log('Proceeding to checkout with items:', this.items);
        alert('Proceeding to checkout... (This is a demo)');
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new Cart();
});
