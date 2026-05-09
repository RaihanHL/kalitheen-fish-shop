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
        console.log('Loaded fish data:', fishData); // Debug
        renderFishCards(fishData);
        updateLastUpdated(data.lastUpdated);
    } catch (error) {
        console.error('Error loading fish data:', error);
        showError();
    }
}

// Show Error Message
function showError() {
    const fishGrid = document.getElementById('fishGrid');
    if (fishGrid) {
        fishGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>பிழை | Error Loading Fish List</h3>
                <p>மீன் பட்டியலை ஏற்ற முடியவில்லை. பக்கத்தை புதுப்பிக்கவும்.<br>
                Unable to load fish list. Please refresh the page.</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    <i class="fas fa-redo"></i> புதுப்பிக்க | Refresh
                </button>
            </div>
        `;
    }
}

// Update Last Updated Date
function updateLastUpdated(date) {
    const dateElement = document.querySelector('.last-updated');
    if (dateElement) {
        dateElement.textContent = `கடைசி புதுப்பிப்பு | Last Updated: ${date}`;
    }
}

// Render Fish Cards
function renderFishCards(fishList) {
    const fishGrid = document.getElementById('fishGrid');
    if (!fishGrid) {
        console.error('Fish grid element not found!');
        return;
    }

    console.log('Rendering', fishList.length, 'fish cards'); // Debug

    if (fishList.length === 0) {
        fishGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-fish"></i>
                <h3>மீன் இல்லை | No Fish Available</h3>
                <p>தற்போது மீன் இல்லை. விரைவில் புதுப்பிக்கப்படும்.<br>
                No fish available at the moment. Check back soon!</p>
            </div>
        `;
        return;
    }

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
    card.setAttribute('data-type', fish.type);

    const badgeClass = fish.available ? 'badge-available' : 'badge-out';
    const badgeText = fish.available ? 
        `✓ ${fish.stock}` : 
        '✗ இல்லை | Out of Stock';

    const isPremium = fish.category === 'premium';
    const fishType = fish.type === 'river' ? 'ஆற்று மீன் | River' : 'கடல் மீன் | Sea';
    const typeBadgeClass = fish.type === 'river' ? 'badge-river' : 'badge-sea';

    card.innerHTML = `
        <div class="fish-image-container">
            <img src="${fish.image}" alt="${fish.nameEnglish}" class="fish-image" onerror="this.src='https://via.placeholder.com/400x220?text=Fish+Image'">
            <span class="fish-badge fish-type-badge ${typeBadgeClass}">
                <i class="fas fa-${fish.type === 'river' ? 'water' : 'fish'}"></i> ${fishType}
            </span>
            <span class="fish-badge ${badgeClass}" style="right: 15px;">${badgeText}</span>
            ${isPremium ? '<span class="fish-badge badge-premium" style="bottom: 15px; left: 15px; top: auto;">⭐ சிறப்பு | Premium</span>' : ''}
        </div>
        <div class="fish-body">
            <h3 class="fish-name">${fish.nameTamil}</h3>
            <p class="fish-name-en">${fish.nameEnglish}</p>
            <div class="fish-price">ரூ. ${fish.price}<span style="font-size: 16px;">/கிலோ</span></div>
            
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
                            1 கிலோ
                        </button>
                        <button class="qty-btn" onclick="selectQuantity(${fish.id}, 1.5, this)">
                            1.5 கிலோ
                        </button>
                        <button class="qty-btn" onclick="showCustomQuantity(${fish.id}, this)">
                            <i class="fas fa-plus"></i> அதிகம்
                        </button>
                    </div>
                    <div class="custom-quantity" id="custom-${fish.id}">
                        <input type="number" 
                               class="custom-input" 
                               placeholder="கிலோ உள்ளிடவும் (உ.ம். 2.5)" 
                               step="0.25" 
                               min="0.25"
                               onchange="selectCustomQuantity(${fish.id}, this.value)">
                    </div>
                </div>

                <div class="price-display">
                    <div class="calculated-price" id="price-${fish.id}">
                        விலை பார்க்க அளவு தேர்வு செய்க<br>
                        <small>Select quantity to see price</small>
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
                    இல்லை | Out of Stock
                </button>
            `}
        </div>
    `;

    return card;
}

// Select Quantity
function selectQuantity(fishId, quantity, button) {
    const card = button.closest('.fish-card');
    
    card.querySelectorAll('.qty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const customDiv = document.getElementById(`custom-${fishId}`);
    customDiv.classList.remove('show');
    
    button.classList.add('active');
    selectedQuantities[fishId] = quantity;
    updatePriceDisplay(fishId, quantity);
    
    const cartBtn = document.getElementById(`cart-btn-${fishId}`);
    if (cartBtn) cartBtn.disabled = false;
}

// Show Custom Quantity Input
function showCustomQuantity(fishId, button) {
    const card = button.closest('.fish-card');
    
    card.querySelectorAll('.qty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    button.classList.add('active');
    
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
                ${quantity} கிலோ × ரூ. ${fish.price}
            </div>
            <div style="font-size: 24px; font-weight: 700;">
                ரூ. ${totalPrice}
            </div>
        `;
    }
}

// Add to Cart
function addToCart(fishId) {
    const fish = fishData.find(f => f.id === fishId);
    const quantity = selectedQuantities[fishId];
    
    if (!fish || !quantity) {
        alert('தயவுசெய்து அளவு தேர்வு செய்யவும் | Please select quantity');
        return;
    }
    
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
    
    showNotification('✓ கார்ட்டில் சேர்க்கப்பட்டது! | Added to cart!');
}

// Reset Fish Card After Adding
function resetFishCard(fishId) {
    delete selectedQuantities[fishId];
    
    const card = document.querySelector(`#cart-btn-${fishId}`)?.closest('.fish-card');
    if (!card) return;
    
    card.querySelectorAll('.qty-btn').forEach(btn => btn.classList.remove('active'));
    
    const priceElement = document.getElementById(`price-${fishId}`);
    if (priceElement) {
        priceElement.innerHTML = 'விலை பார்க்க அளவு தேர்வு செய்க<br><small>Select quantity to see price</small>';
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
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadge) {
        cartBadge.textContent = Math.round(totalItems * 10) / 10;
    }
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>உங்கள் கார்ட் காலியாக உள்ளது<br>Your cart is empty</p>
                    <a href="#fish-list" class="btn btn-primary" onclick="toggleCart()">
                        மீன் பார்க்க | Browse Fish
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
                            <button class="remove-item" onclick="removeFromCart(${index})" title="நீக்கு | Remove">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="cart-item-details">
                            <div><strong>அளவு:</strong> ${item.quantity} கிலோ</div>
                            <div><strong>விலை:</strong> ரூ. ${item.price}/கிலோ</div>
                        </div>
                        <div class="cart-item-total">
                            மொத்தம் | Total: ரூ. ${itemTotal}
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (totalAmount) {
        totalAmount.textContent = `ரூ. ${total.toFixed(2)}`;
    }
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
    showNotification('நீக்கப்பட்டது | Item removed');
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
        alert('உங்கள் கார்ட் காலியாக உள்ளது! | Your cart is empty!');
        return;
    }
    
    let message = '🐟 *கலிதீன் மீன் கடை - புதிய ஆர்டர் | New Order*\n\n';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        message += `${index + 1}. *${item.nameTamil}* (${item.nameEnglish})\n`;
        message += `   அளவு | Quantity: ${item.quantity} கிலோ\n`;
        message += `   விலை | Price: ரூ. ${item.price}/கிலோ\n`;
        message += `   துணை மொத்தம் | Subtotal: ரூ. ${itemTotal.toFixed(2)}\n\n`;
        total += itemTotal;
    });
    
    message += `*மொத்தம் | Total Amount: ரூ. ${total.toFixed(2)}*\n\n`;
    message += '📍 இந்த ஆர்டரை உறுதிப்படுத்தவும் | Please confirm this order.';
    
    const phone = '94XXXXXXXXX'; // Replace with your number
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
}

// Filter Fish
function filterFish(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const cards = document.querySelectorAll('.fish-card');
    
    cards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'block';
        } else if (category === 'available') {
            card.style.display = card.getAttribute('data-available') === 'true' ? 'block' : 'none';
        } else if (category === 'premium') {
            card.style.display = card.getAttribute('data-category') === 'premium' ? 'block' : 'none';
        } else if (category === 'river' || category === 'sea') {
            card.style.display = card.getAttribute('data-type') === category ? 'block' : 'none';
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
    }, 3000);
}

// Smooth Scroll
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

// Add Animations
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
    console.log('Page loaded, initializing...');
    loadFishData();
    updateCartUI();
});
