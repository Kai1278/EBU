// PC Build Templates
const buildTemplates = {
    budget: {
        name: 'Budget Build',
        priceRange: { min: 500, max: 800 },
        components: {
            cpu: { category: 'processors', maxBudget: 200, priority: 0.25 },
            gpu: { category: 'graphics-cards', maxBudget: 250, priority: 0.3 },
            motherboard: { category: 'motherboards', maxBudget: 100, priority: 0.1 },
            ram: { category: 'memory', maxBudget: 80, priority: 0.1 },
            storage: { category: 'storage', maxBudget: 70, priority: 0.1 },
            psu: { category: 'power-supplies', maxBudget: 60, priority: 0.08 },
            case: { category: 'cases', maxBudget: 40, priority: 0.07 }
        },
        performance: {
            gaming: 60,
            contentCreation: 50,
            productivity: 70
        }
    },
    midrange: {
        name: 'Mid-Range Build',
        priceRange: { min: 800, max: 1500 },
        components: {
            cpu: { category: 'processors', maxBudget: 350, priority: 0.25 },
            gpu: { category: 'graphics-cards', maxBudget: 500, priority: 0.3 },
            motherboard: { category: 'motherboards', maxBudget: 200, priority: 0.12 },
            ram: { category: 'memory', maxBudget: 150, priority: 0.1 },
            storage: { category: 'storage', maxBudget: 150, priority: 0.1 },
            psu: { category: 'power-supplies', maxBudget: 100, priority: 0.08 },
            case: { category: 'cases', maxBudget: 80, priority: 0.05 }
        },
        performance: {
            gaming: 80,
            contentCreation: 75,
            productivity: 85
        }
    },
    highend: {
        name: 'High-End Build',
        priceRange: { min: 1500, max: 3000 },
        components: {
            cpu: { category: 'processors', maxBudget: 600, priority: 0.25 },
            gpu: { category: 'graphics-cards', maxBudget: 1000, priority: 0.3 },
            motherboard: { category: 'motherboards', maxBudget: 300, priority: 0.12 },
            ram: { category: 'memory', maxBudget: 200, priority: 0.1 },
            storage: { category: 'storage', maxBudget: 300, priority: 0.1 },
            psu: { category: 'power-supplies', maxBudget: 200, priority: 0.08 },
            case: { category: 'cases', maxBudget: 150, priority: 0.05 }
        },
        performance: {
            gaming: 95,
            contentCreation: 90,
            productivity: 100
        }
    }
};

// Peripherals data
const peripherals = {
    monitors: [
        {
            id: 'mon1',
            name: 'Gaming Monitor 24" 144Hz',
            price: 199.99,
            image: 'images/monitor-1.jpg',
            category: 'monitors',
            specs: '1920x1080, 1ms response time'
        },
        {
            id: 'mon2',
            name: 'Ultra-wide 34" Monitor',
            price: 449.99,
            image: 'images/monitor-2.jpg',
            category: 'monitors',
            specs: '3440x1440, 144Hz'
        }
    ],
    keyboards: [
        {
            id: 'kb1',
            name: 'Mechanical Gaming Keyboard',
            price: 89.99,
            image: 'images/keyboard-1.jpg',
            category: 'keyboards',
            specs: 'RGB, Blue switches'
        },
        {
            id: 'kb2',
            name: 'Wireless Mechanical Keyboard',
            price: 129.99,
            image: 'images/keyboard-2.jpg',
            category: 'keyboards',
            specs: 'Brown switches, Bluetooth'
        }
    ],
    mice: [
        {
            id: 'mouse1',
            name: 'Gaming Mouse 16000 DPI',
            price: 59.99,
            image: 'images/mouse-1.jpg',
            category: 'mice',
            specs: 'RGB, 8 programmable buttons'
        },
        {
            id: 'mouse2',
            name: 'Wireless Gaming Mouse',
            price: 79.99,
            image: 'images/mouse-2.jpg',
            category: 'mice',
            specs: '20000 DPI, 70hr battery'
        }
    ],
    headsets: [
        {
            id: 'hs1',
            name: '7.1 Surround Gaming Headset',
            price: 69.99,
            image: 'images/headset-1.jpg',
            category: 'headsets',
            specs: 'USB, RGB, noise-canceling mic'
        },
        {
            id: 'hs2',
            name: 'Wireless Gaming Headset',
            price: 149.99,
            image: 'images/headset-2.jpg',
            category: 'headsets',
            specs: '24hr battery, Bluetooth'
        }
    ],
    speakers: [
        {
            id: 'spk1',
            name: '2.1 Gaming Speakers',
            price: 79.99,
            image: 'images/speakers-1.jpg',
            category: 'speakers',
            specs: '60W output, RGB'
        },
        {
            id: 'spk2',
            name: '5.1 Surround Speakers',
            price: 199.99,
            image: 'images/speakers-2.jpg',
            category: 'speakers',
            specs: '120W output, remote control'
        }
    ]
};

let selectedPeripherals = new Map();
let wishlistItems = new Map();
let currentCategory = 'all';

// Initialize the builder
document.addEventListener('DOMContentLoaded', () => {
    const budgetButtons = document.querySelectorAll('.budget-btn');
    const customBudgetInput = document.querySelector('.custom-budget-input');
    const applyBudgetBtn = document.getElementById('applyBudget');
    const buildComponents = document.querySelector('.build-components');
    const totalPrice = document.querySelector('.total-price');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');

    // Event listeners for budget buttons
    budgetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const budgetType = btn.dataset.budget;
            if (budgetType === 'custom') {
                customBudgetInput.style.display = 'flex';
            } else {
                customBudgetInput.style.display = 'none';
                generateBuild(budgetType);
            }
            
            // Update active state
            budgetButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Custom budget handler
    applyBudgetBtn.addEventListener('click', () => {
        const customBudget = parseFloat(document.getElementById('customBudget').value);
        if (customBudget) {
            generateCustomBuild(customBudget);
        }
    });

    initPeripherals();
});

// Initialize peripherals section
function initPeripherals() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const peripheralsGrid = document.querySelector('.peripherals-grid');

    // Add event listeners to category tabs
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.category;
            displayPeripherals();
        });
    });

    displayPeripherals();
}

// Display peripherals based on selected category
function displayPeripherals() {
    const peripheralsGrid = document.querySelector('.peripherals-grid');
    peripheralsGrid.innerHTML = '';

    let itemsToDisplay = [];
    if (currentCategory === 'all') {
        Object.values(peripherals).forEach(category => {
            itemsToDisplay = itemsToDisplay.concat(category);
        });
    } else {
        itemsToDisplay = peripherals[currentCategory] || [];
    }

    itemsToDisplay.forEach(item => {
        const card = createPeripheralCard(item);
        peripheralsGrid.appendChild(card);
    });
}

// Create peripheral card element
function createPeripheralCard(item) {
    const card = document.createElement('div');
    card.className = 'peripheral-card';
    if (selectedPeripherals.has(item.id)) {
        card.classList.add('selected');
    }

    const isWishlisted = wishlistItems.has(item.id);
    
    card.innerHTML = `
        <div class="wishlist-icon ${isWishlisted ? 'active' : ''}" data-id="${item.id}">
            <i class="fas fa-heart"></i>
        </div>
        <img src="${item.image}" alt="${item.name}">
        <div class="peripheral-info">
            <h3>${item.name}</h3>
            <p>${item.specs}</p>
            <div class="peripheral-price">$${item.price.toFixed(2)}</div>
        </div>
    `;

    // Add event listener for wishlist icon
    const wishlistIcon = card.querySelector('.wishlist-icon');
    wishlistIcon.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card selection when clicking wishlist
        toggleWishlist(item);
    });

    card.addEventListener('click', () => togglePeripheral(item));
    return card;
}

// Toggle peripheral selection
function togglePeripheral(item) {
    if (selectedPeripherals.has(item.id)) {
        selectedPeripherals.delete(item.id);
    } else {
        selectedPeripherals.set(item.id, item);
    }
    updatePeripheralsSummary();
    displayPeripherals();
}

// Update peripherals summary
function updatePeripheralsSummary() {
    const selectedItems = document.querySelector('.selected-items');
    const totalPriceElement = document.querySelector('.total-price');
    const grandTotalElement = document.querySelector('.grand-total');

    selectedItems.innerHTML = '';
    let totalPrice = 0;

    selectedPeripherals.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'selected-item';
        itemElement.innerHTML = `
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
        `;
        selectedItems.appendChild(itemElement);
        totalPrice += item.price;
    });

    totalPriceElement.textContent = `Peripherals Total: $${totalPrice.toFixed(2)}`;
    const pcTotal = calculatePCTotal(); // Get the current PC build total
    grandTotalElement.textContent = `Grand Total (with PC): $${(totalPrice + pcTotal).toFixed(2)}`;
}

// Toggle wishlist status
function toggleWishlist(item) {
    if (wishlistItems.has(item.id)) {
        wishlistItems.delete(item.id);
    } else {
        wishlistItems.set(item.id, item);
    }
    updateWishlistSection();
    displayPeripherals(); // Refresh peripheral cards to update wishlist icons
    
    // Save wishlist to localStorage
    saveWishlistToStorage();
}

// Update wishlist section
function updateWishlistSection() {
    const wishlistGrid = document.querySelector('.wishlist-grid');
    wishlistGrid.innerHTML = '';

    wishlistItems.forEach(item => {
        const wishlistItem = document.createElement('div');
        wishlistItem.className = 'wishlist-item';
        wishlistItem.innerHTML = `
            <div class="remove-wishlist" data-id="${item.id}">
                <i class="fas fa-times"></i>
            </div>
            <img src="${item.image}" alt="${item.name}">
            <div class="wishlist-item-info">
                <h4>${item.name}</h4>
                <div class="wishlist-item-price">$${item.price.toFixed(2)}</div>
            </div>
        `;

        // Add event listener for remove button
        const removeBtn = wishlistItem.querySelector('.remove-wishlist');
        removeBtn.addEventListener('click', () => {
            wishlistItems.delete(item.id);
            updateWishlistSection();
            displayPeripherals();
            saveWishlistToStorage();
        });

        wishlistGrid.appendChild(wishlistItem);
    });
}

// Save wishlist to localStorage
function saveWishlistToStorage() {
    const wishlistData = Array.from(wishlistItems.values());
    localStorage.setItem('peripheralsWishlist', JSON.stringify(wishlistData));
}

// Load wishlist from localStorage
function loadWishlistFromStorage() {
    const savedWishlist = localStorage.getItem('peripheralsWishlist');
    if (savedWishlist) {
        const wishlistData = JSON.parse(savedWishlist);
        wishlistItems = new Map(wishlistData.map(item => [item.id, item]));
        updateWishlistSection();
    }
}

// Initialize wishlist on page load
window.addEventListener('load', () => {
    loadWishlistFromStorage();
    initPeripherals();
});

// Generate a PC build based on template
function generateBuild(buildType) {
    const template = buildTemplates[buildType];
    if (!template) return;

    // Clear previous build
    clearBuildDisplay();

    // Generate components based on template
    let totalBuildPrice = 0;
    Object.entries(template.components).forEach(([part, specs]) => {
        const component = selectComponent(specs.category, specs.maxBudget);
        if (component) {
            displayComponent(component);
            totalBuildPrice += component.price;
        }
    });

    // Update total price
    updateTotalPrice(totalBuildPrice);

    // Update performance metrics
    updatePerformanceMetrics(template.performance);
}

// Generate a custom build based on budget
function generateCustomBuild(budget) {
    // Determine which template to base on
    let template;
    if (budget <= 800) {
        template = buildTemplates.budget;
    } else if (budget <= 1500) {
        template = buildTemplates.midrange;
    } else {
        template = buildTemplates.highend;
    }

    // Adjust component budgets based on custom total budget
    const adjustedTemplate = adjustBudgets(template, budget);
    
    // Generate build with adjusted budgets
    clearBuildDisplay();
    
    let totalBuildPrice = 0;
    Object.entries(adjustedTemplate.components).forEach(([part, specs]) => {
        const component = selectComponent(specs.category, specs.maxBudget);
        if (component) {
            displayComponent(component);
            totalBuildPrice += component.price;
        }
    });

    updateTotalPrice(totalBuildPrice);
    updatePerformanceMetrics(calculateCustomPerformance(budget));
}

// Helper functions
function selectComponent(category, maxBudget) {
    // This would normally fetch from your product database
    // For now, return a mock component
    return {
        name: `Sample ${category}`,
        price: maxBudget * 0.9,
        image: 'images/products/sample.jpg'
    };
}

function displayComponent(component) {
    const buildComponents = document.querySelector('.build-components');
    const componentElement = document.createElement('div');
    componentElement.className = 'component-card';
    componentElement.innerHTML = `
        <div class="component-image">
            <img src="${component.image}" alt="${component.name}">
        </div>
        <div class="component-info">
            <h3>${component.name}</h3>
            <p class="price">$${component.price.toFixed(2)}</p>
        </div>
    `;
    buildComponents.appendChild(componentElement);
}

function updateTotalPrice(total) {
    const totalPriceElement = document.querySelector('.total-price');
    totalPriceElement.textContent = `Total: $${total.toFixed(2)}`;
}

function updatePerformanceMetrics(performance) {
    Object.entries(performance).forEach(([metric, value]) => {
        const bar = document.querySelector(`.metric-card:has(h3:contains('${metric}')) .bar-fill`);
        if (bar) {
            bar.style.width = `${value}%`;
        }
    });
}

function clearBuildDisplay() {
    const buildComponents = document.querySelector('.build-components');
    buildComponents.innerHTML = '';
}

function adjustBudgets(template, totalBudget) {
    const adjusted = JSON.parse(JSON.stringify(template));
    Object.entries(adjusted.components).forEach(([part, specs]) => {
        specs.maxBudget = totalBudget * specs.priority;
    });
    return adjusted;
}

function calculateCustomPerformance(budget) {
    const maxBudget = 3000; // Maximum budget considered
    const percentage = Math.min((budget / maxBudget) * 100, 100);
    return {
        gaming: Math.round(percentage * 0.95), // Max 95%
        contentCreation: Math.round(percentage * 0.9), // Max 90%
        productivity: Math.round(percentage) // Max 100%
    };
}

function calculatePCTotal() {
    const totalPriceElement = document.querySelector('.total-price');
    return parseFloat(totalPriceElement.textContent.replace('Total: $', ''));
}
