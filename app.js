// Global Variables
let fishData = [];
let cart = [];
let selectedQuantities = {};

// Load Fish Data from JSON
async function loadFishData() {
    try {
        const response = await fetch('fish-data.json');
        const data = await response.json();
        fishData = data.fishList;
        renderFishCards(fishData);
        updateLastUpdated(data.lastUpdated);
    } catch (error) {
        console.error('Error loading fish data:', error);
        // Fallback to sample data if JSON fails
        loadSampleData();
    }
}

// Fallback Sample Data
function loadSampleData() {
    fishData = [
        {
            id: 1,
            nameTamil: "சல்லல்/செத்தல்",
            nameEnglish: "Sardine",
            price: 350,
            image: "https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=400",
            available: true,
            category: "regular",
            stock: "High"
        },
        // Add more sample data...
    ];
    renderFishCards(fishData);
}

// Update Last Updated Date
function updateLastUpdated(date) {
    const dateElement = document.querySelector('.last-updated');
    if (dateElement) {
        dateElement.textContent = `Last Updated: ${date}`;
    }
}

// Render Fish Cards
function renderFishCards(fishList) {
    const fishGrid = document.getElementById('fishGrid');
    if (!fishGrid) return;

    fishGrid.innerHTML = '';

    fishList.forEach(fish => {
        const card = createFishCard(fish);
        fishGrid.appendChild(card);
    });
}

// Create Fish Card
function createFishCard(fish) {
    const card = document.createElement('div');
    card.className = 'fish-card';
    card.setAttribute('data-category', fish.category);
    card.setAttribute('data-available', fish.available);

    const badgeClass = fish.available ? 'badge-available' : 'badge-out';
    const badgeText = fish.available ? 
        `✓ ${fish.stock}` : 
        '✗ Out of Stock';

    const isPremium = fish.category === 'premium';

    card.innerHTML = `
        <div class="fish-image-container">
            <img src="${fish.image}" alt="${fish.nameEnglish}" class="fish-image">
            <span class="fish-badge ${badgeClass}">${badgeText}</span>
            ${isPremium ? '<span class="fish-badge badge-premium" style="left: 15px;">⭐ Premium</span>' : ''}
        </div>
        <div class="fish-body">
            <h3 class="fish-name">${fish.nameTamil}</h3>
            <p class="fish-name-en">${fish.nameEnglish}</p>
            <div class="fish-price">Rs. ${fish.price}<span style="font-size: 16px;">/Kg</span></div>
            
            ${fish.available ? `
                <div class="quantity-section">
                    <label class="quantity-label">
                        <i class="fas fa-weight"></i> அளவு | Quantity
                    </label>
                    <div class="quantity-buttons">
                        <button class="qty-btn" onclick="selectQuantity(${fish.id}, 0.25, this)">
                            250g
                        </button>
                        <button class="qty-btn" onclick="selectQuantity(${fish.id}, 0.5, this)">
                            500g
                        </button>
                        <button class="qty-btn" onclick="selectQuantity(${fish.id}, 0.75, this)">
                            750g
                        </button>
                        <button class="qty-btn" onclick="selectQuantity(${fish.id}, 1, this)">
                            1 Kg
                        </button>
                        <button class="qty-btn" onclick="selectQuantity(${fish.id}, 1.5, this)">
                            1.5 Kg
                        </button>
                        <button class="qty-btn" onclick="showCustomQuantity(${fish.id}, this)">
                            <i class="fas fa-plus"></i> More
                        </button>
                    </div>
                    <div class="custom-quantity" id="custom-${fish.id}">
                        <input type="number" 
                               class="custom-input" 
                               placeholder="Enter Kg (e.g., 2.5)" 
                               step="0.25" 
                               min="0.25"
                               onchange="selectCustomQuantity(${fish.id}, this.value)">
                    </div>
                </div>

                <div class="price-display">
                    <div class="calculated-price" id="price-${fish.id}">
                        Select quantity to see price
                    </div>
                </div>

                <button class="add-to-cart" 
                        id="cart-btn-${fish.id}" 
                        disabled 
                        onclick="addToCart(${fish.id})">
                    <i class="fas fa-shopping-cart"></i>
                    கார்ட்டில் சேர் | Add to Cart
                </button>
            ` : `
                <button class="add-to-cart" disabled>
                    <i class="fas fa-times-circle"></i>
                    Out of Stock
                </button>
            `}
        </div>
    `;

    return card;
}

// Select Quantity
function selectQuantity(fishId, quantity, button) {
    const card = button.closest('.fish-card');
    
    // Remove active class from all buttons
    card.querySelectorAll('.qty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Hide custom input
    const customDiv = document.getElementById(`custom-${fishId}`);
    customDiv.classList.remove('show');
    
    // Add active class to clicked button
    button.classList.add('active');
    
    // Store quantity
    selectedQuantities[fishId] = quantity;
    
    // Update price display
    updatePriceDisplay(fishId, quantity);
    
    // Enable add to cart button
    const cartBtn = document.getElementById(`cart-btn-${fishId}`);
    if (cartBtn) cartBtn.disabled = false;
}

// Show Custom Quantity Input
function showCustomQuantity(fishId, button) {
    const card = button.closest('.fish-card');
    
    // Remove active from other buttons
    card.querySelectorAll('.qty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    button.classList.add('active');
    
    // Show custom input
    const customDiv = document.getElementById(`custom-${fishId}`);
    customDiv.classList.add('show');
    customDiv.querySelector('input').focus();
}

// Select Custom Quantity
function selectCustomQuantity(fishId, quantity) {
    quantity = parseFloat(quantity);
    
    if (quantity >= 0.25) {
        selectedQuantities[fishId] = quantity;
        updatePriceDisplay(fishId, quantity);
        
        const cartBtn = document.getElementById(`cart-btn-${fishId}`);
        if (cartBtn) cartBtn.disabled = false;
    }
}

// Update Price Display
function updatePriceDisplay(fishId, quantity) {
    const fish = fishData.find(f => f.id === fishId);
    if (!fish) return;
    
    const totalPrice = (fish.price * quantity).toFixed(2);
    const priceElement = document.getElementById(`price-${fishId}`);
    
    if (priceElement) {
        priceElement.innerHTML = `
            <div style="font-size: 14px; color: #666; margin-bottom: 5px;">
                ${quantity} Kg × Rs. ${fish.price}
            </div>
            <div style="font-size: 24px; font-weight: 700;">
                Rs. ${totalPrice}
            </div>
        `;
    }
}

// Add to Cart
function addToCart(fishId) {
    const fish = fishData.find(f => f.id === fishId);
    const quantity = selectedQuantities[fishId];
    
    if (!fish || !quantity) {
        alert('Please select quantity');
        return;
    }
    
    // Check if item already in cart
    const existingItemIndex = cart.findIndex(item => item.id === fishId);
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({
            id: fish.id,
            nameTamil: fish.nameTamil,
            nameEnglish: fish.nameEnglish,
            price: fish.price,
            quantity: quantity,
            image: fish.image
        });
    }
    
    updateCartUI();
    toggleCart();
    resetFishCard(fishId);
    
    // Show success message
    showNotification('✓ Added to cart!');
}

// Reset Fish Card After Adding
function resetFishCard(fishId) {
    delete selectedQuantities[fishId];
    
    const card = document.querySelector(`#cart-btn-${fishId}`)?.closest('.fish-card');
    if (!card) return;
    
    card.querySelectorAll('.qty-btn').forEach(btn => btn.classList.remove('active'));
    
    const priceElement = document.getElementById(`price-${fishId}`);
    if (priceElement) {
        priceElement.textContent = 'Select quantity to see price';
    }
    
    const cartBtn = document.getElementById(`cart-btn-${fishId}`);
    if (cartBtn) cartBtn.disabled = true;
    
    const customDiv = document.getElementById(`custom-${fishId}`);
    if (customDiv) {
        customDiv.classList.remove('show');
        customDiv.querySelector('input').value = '';
    }
}

// Update Cart UI
function updateCartUI() {
    const cartBadge = document.querySelector('.cart-badge');
    const cartItems = document.getElementById('cartItems');
    const totalAmount = document.querySelector('.total-amount');
    
    // Update badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadge) {
        cartBadge.textContent = Math.round(totalItems * 10) / 10;
    }
    
    // Update cart items
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="#fish-list" class="btn btn-primary" onclick="toggleCart()">
                        Browse Fish
                    </a>
                </div>
            `;
        } else {
            cartItems.innerHTML = cart.map((item, index) => {
                const itemTotal = (item.price * item.quantity).toFixed(2);
                return `
                    <div class="cart-item">
                        <div class="cart-item-header">
                            <div>
                                <div class="cart-item-name">${item.nameTamil}</div>
                                <div class="cart-item-name-en">${item.nameEnglish}</div>
                            </div>
                            <button class="remove-item" onclick="removeFromCart(${index})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="cart-item-details">
                            <div><strong>Quantity:</strong> ${item.quantity} Kg</div>
                            <div><strong>Price:</strong> Rs. ${item.price}/Kg</div>
                        </div>
                        <div class="cart-item-total">
                            Total: Rs. ${itemTotal}
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (totalAmount) {
        totalAmount.textContent = `Rs. ${total.toFixed(2)}`;
    }
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
    showNotification('Item removed from cart');
}

// Toggle Cart Sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.toggle('open');
        cartOverlay.classList.toggle('show');
    }
}

// Checkout via WhatsApp
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    let message = '🐟 *கலிதீன் மீன் கடை - New Order*\n\n';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        message += `${index + 1}. *${item.nameTamil}* (${item.nameEnglish})\n`;
        message += `   Quantity: ${item.quantity} Kg\n`;
        message += `   Price: Rs. ${item.price}/Kg\n`;
        message += `   Subtotal: Rs. ${itemTotal.toFixed(2)}\n\n`;
        total += itemTotal;
    });
    
    message += `*Total Amount: Rs. ${total.toFixed(2)}*\n\n`;
    message += '📍 Please confirm this order.';
    
    // Replace with your WhatsApp number
    const phone = '94XXXXXXXXX';
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
}

// Filter Fish
function filterFish(category) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter cards
    const cards = document.querySelectorAll('.fish-card');
    
    cards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'block';
        } else if (category === 'available') {
            card.style.display = card.getAttribute('data-available') === 'true' ? 'block' : 'none';
        } else if (category === 'premium') {
            card.style.display = card.getAttribute('data-category') === 'premium' ? 'block' : 'none';
        }
    });
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('mobile-open');
    }
}

// Add Animation Keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
    loadFishData();
    updateCartUI();
});
