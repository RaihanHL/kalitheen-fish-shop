// Fish data
const fishData = [
    {
        id: 1,
        nameTamil: "சுறா",
        nameEnglish: "Shark",
        price: 850,
        image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400",
        available: true
    },
    {
        id: 2,
        nameTamil: "வஞ்சிரம்",
        nameEnglish: "Seer Fish",
        price: 950,
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400",
        available: true
    },
    {
        id: 3,
        nameTamil: "கெண்டை",
        nameEnglish: "Mackerel",
        price: 450,
        image: "https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=400",
        available: true
    },
    {
        id: 4,
        nameTamil: "சால்மன்",
        nameEnglish: "Salmon",
        price: 1200,
        image: "https://images.unsplash.com/photo-1485704686097-ed47f7263ca4?w=400",
        available: false
    },
    {
        id: 5,
        nameTamil: "ஆயிரா",
        nameEnglish: "Pomfret",
        price: 750,
        image: "https://images.unsplash.com/photo-1580950113276-f1b539d3b7be?w=400",
        available: true
    },
    {
        id: 6,
        nameTamil: "இறால்",
        nameEnglish: "Prawns",
        price: 1100,
        image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400",
        available: true
    }
];

// Cart array
let cart = [];

// Render fish cards
function renderFishCards() {
    const fishGrid = document.getElementById('fishGrid');
    fishGrid.innerHTML = '';

    fishData.forEach(fish => {
        const card = document.createElement('div');
        card.className = 'fish-card';
        card.innerHTML = `
            <img src="${fish.image}" alt="${fish.nameEnglish}" class="fish-image">
            <div class="fish-info">
                <h3 class="fish-name">${fish.nameTamil} | ${fish.nameEnglish}</h3>
                <p class="fish-price">Rs. ${fish.price}/Kg</p>
                <span class="fish-availability ${fish.available ? 'available' : 'out-of-stock'}">
                    ${fish.available ? 'இருப்பில் உள்ளது | Available' : 'இல்லை | Out of Stock'}
                </span>
                
                ${fish.available ? `
                    <div class="quantity-selector">
                        <label>அளவு | Quantity:</label>
                        <div class="quantity-buttons">
                            <button class="qty-btn" onclick="selectQuantity(${fish.id}, 0.25, this)">250g</button>
                            <button class="qty-btn" onclick="selectQuantity(${fish.id}, 0.5, this)">500g</button>
                            <button class="qty-btn" onclick="selectQuantity(${fish.id}, 0.75, this)">750g</button>
                            <button class="qty-btn" onclick="selectQuantity(${fish.id}, 1, this)">1Kg</button>
                            <button class="qty-btn" onclick="showCustomQuantity(${fish.id}, this)">More</button>
                        </div>
                        <div class="custom-qty" id="custom-${fish.id}">
                            <input type="number" step="0.25" min="0.25" placeholder="Enter Kg" 
                                   onchange="selectCustomQuantity(${fish.id}, this.value)">
                        </div>
                    </div>
                    
                    <div class="price-display">
                        <span class="calculated-price" id="price-${fish.id}">Select quantity</span>
                    </div>
                    
                    <button class="add-to-cart-btn" id="cart-btn-${fish.id}" disabled onclick="addToCart(${fish.id})">
                        <i class="fas fa-shopping-cart"></i>
                        கார்ட்டில் சேர் | Add to Cart
                    </button>
                ` : ''}
            </div>
        `;
        fishGrid.appendChild(card);
    });
}

// Selected quantities
let selectedQuantities = {};

// Select quantity
function selectQuantity(fishId, quantity, button) {
    // Remove active class from all buttons in this card
    const card = button.closest('.fish-card');
    card.querySelectorAll('.qty-btn').forEach(btn => btn.classList.remove('active'));
    
    // Hide custom input
    const customDiv = document.getElementById(`custom-${fishId}`);
    customDiv.style.display = 'none';
    
    // Add active class to clicked button
    button.classList.add('active');
    
    // Store quantity
    selectedQuantities[fishId] = quantity;
    
    // Update price display
    updatePriceDisplay(fishId, quantity);
    
    // Enable add to cart button
    document.getElementById(`cart-btn-${fishId}`).disabled = false;
}

// Show custom quantity input
function showCustomQuantity(fishId, button) {
    const card = button.closest('.fish-card');
    card.querySelectorAll('.qty-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    const customDiv = document.getElementById(`custom-${fishId}`);
    customDiv.style.display = 'block';
    customDiv.querySelector('input').focus();
}

// Select custom quantity
function selectCustomQuantity(fishId, quantity) {
    quantity = parseFloat(quantity);
    if (quantity >= 0.25) {
        selectedQuantities[fishId] = quantity;
        updatePriceDisplay(fishId, quantity);
        document.getElementById(`cart-btn-${fishId}`).disabled = false;
    }
}

// Update price display
function updatePriceDisplay(fishId, quantity) {
    const fish = fishData.find(f => f.id === fishId);
    const totalPrice = (fish.price * quantity).toFixed(2);
    document.getElementById(`price-${fishId}`).textContent = `Rs. ${totalPrice} (${quantity} Kg)`;
}

// Add to cart
function addToCart(fishId) {
    const fish = fishData.find(f => f.id === fishId);
    const quantity = selectedQuantities[fishId];
    
    if (!quantity) {
        alert('Please select quantity');
        return;
    }
    
    // Check if item already in cart
    const existingItem = cart.find(item => item.id === fishId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: fish.id,
            nameTamil: fish.nameTamil,
            nameEnglish: fish.nameEnglish,
            price: fish.price,
            quantity: quantity
        });
    }
    
    updateCart();
    openCart();
    
    // Reset selection
    delete selectedQuantities[fishId];
    const card = document.querySelector(`#cart-btn-${fishId}`).closest('.fish-card');
    card.querySelectorAll('.qty-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`price-${fishId}`).textContent = 'Select quantity';
    document.getElementById(`cart-btn-${fishId}`).disabled = true;
    const customDiv = document.getElementById(`custom-${fishId}`);
    customDiv.style.display = 'none';
    customDiv.querySelector('input').value = '';
}

// Update cart display
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.querySelector('.cart-count');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 10px;"></i><p>Your cart is empty</p></div>';
        cartCount.textContent = '0';
        document.querySelector('.total-price').textContent = 'Rs. 0';
        return;
    }
    
    let totalItems = 0;
    let totalPrice = 0;
    
    cartItems.innerHTML = '';
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalItems += item.quantity;
        totalPrice += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <button class="remove-item" onclick="removeFromCart(${index})">×</button>
            <h4>${item.nameTamil} | ${item.nameEnglish}</h4>
            <p>Quantity: ${item.quantity} Kg</p>
            <p>Price: Rs. ${item.price}/Kg</p>
            <p style="font-weight: bold; color: #667eea;">Total: Rs. ${itemTotal.toFixed(2)}</p>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartCount.textContent = Math.round(totalItems);
    document.querySelector('.total-price').textContent = `Rs. ${totalPrice.toFixed(2)}`;
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Open cart
function openCart() {
    document.getElementById('cartSidebar').classList.add('open');
}

// Close cart
function closeCart() {
    document.getElementById('cartSidebar').classList.remove('open');
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    let message = 'கலிதீன் மீன் கடை - Order:\n\n';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        message += `${item.nameTamil} (${item.nameEnglish})\n`;
        message += `Quantity: ${item.quantity} Kg × Rs. ${item.price} = Rs. ${itemTotal.toFixed(2)}\n\n`;
        total += itemTotal;
    });
    
    message += `Total: Rs. ${total.toFixed(2)}`;
    
    // WhatsApp link (replace with your number)
    const phone = '94771988353'; // Add your WhatsApp number
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
}

// Cart icon click
document.querySelector('.cart-icon').addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
});

// Initialize
renderFishCards();
