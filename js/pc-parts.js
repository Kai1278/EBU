// PC Builder functionality for PC Parts page
let pcBuilderItems = new Set();

// Load PC Builder items from localStorage
function loadPCBuilderItems() {
    const savedItems = localStorage.getItem('pcBuilderItems');
    if (savedItems) {
        pcBuilderItems = new Set(JSON.parse(savedItems));
        updatePCBuilderMarks();
    }
}

// Save PC Builder items to localStorage
function savePCBuilderItems() {
    localStorage.setItem('pcBuilderItems', JSON.stringify(Array.from(pcBuilderItems)));
}

// Update PC Builder mark icons
function updatePCBuilderMarks() {
    document.querySelectorAll('.pc-builder-mark').forEach(mark => {
        const productId = mark.dataset.id;
        if (pcBuilderItems.has(productId)) {
            mark.classList.add('active');
        } else {
            mark.classList.remove('active');
        }
    });
}

// Toggle PC Builder item
function togglePCBuilderItem(productId, productName) {
    if (pcBuilderItems.has(productId)) {
        pcBuilderItems.delete(productId);
        showToast(`${productName} removed from PC Builder`);
    } else {
        pcBuilderItems.add(productId);
        showToast(`${productName} added to PC Builder`);
    }
    savePCBuilderItems();
    updatePCBuilderMarks();
}

// Show toast notification
function showToast(message) {
    const toast = document.querySelector('.pc-builder-toast');
    const toastMessage = toast.querySelector('.toast-message');
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize product cards with PC Builder marks
function initializeProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const pcBuilderMark = card.querySelector('.pc-builder-mark');
        const productId = pcBuilderMark.dataset.id;
        const productName = card.querySelector('h3').textContent;

        pcBuilderMark.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePCBuilderItem(productId, productName);
        });
    });
}

// Add to cart functionality
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.action-btn.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const productCard = e.target.closest('.product-card');
            const product = {
                id: productCard.querySelector('.pc-builder-mark').dataset.id,
                name: productCard.querySelector('h3').textContent,
                price: parseFloat(productCard.querySelector('.current-price').textContent.replace('$', '')),
                image: productCard.querySelector('img').src,
                specs: productCard.querySelector('.product-category').textContent
            };
            cart.addItem(product);
        });
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadPCBuilderItems();
    initializeProductCards();
});
