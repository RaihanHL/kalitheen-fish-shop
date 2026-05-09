// Fish data directly in JavaScript (NO JSON FILE NEEDED)
const fishData = [
    {
        id: 1,
        nameTamil: "கெண்டை",
        nameEnglish: "Catla",
        type: "river",
        price: 350,
        image: "https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=400",
        available: true,
        category: "regular",
        stock: "High"
    },
    {
        id: 2,
        nameTamil: "முரல்",
        nameEnglish: "Murrel / Snakehead",
        type: "river",
        price: 650,
        image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400",
        available: true,
        category: "premium",
        stock: "Medium"
    },
    {
        id: 3,
        nameTamil: "கெளுத்தி",
        nameEnglish: "Climbing Perch",
        type: "river",
        price: 450,
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400",
        available: true,
        category: "regular",
        stock: "High"
    },
    {
        id: 4,
        nameTamil: "வாலை",
        nameEnglish: "Wallago",
        type: "river",
        price: 550,
        image: "https://images.unsplash.com/photo-1580950113276-f1b539d3b7be?w=400",
        available: true,
        category: "premium",
        stock: "Low"
    },
    {
        id: 5,
        nameTamil: "விரால்",
        nameEnglish: "Eel",
        type: "river",
        price: 700,
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
        available: true,
        category: "premium",
        stock: "Medium"
    },
    {
        id: 6,
        nameTamil: "கெண்டை வகை",
        nameEnglish: "Rohu",
        type: "river",
        price: 380,
        image: "https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=400",
        available: true,
        category: "regular",
        stock: "High"
    },
    {
        id: 7,
        nameTamil: "நெத்தலி",
        nameEnglish: "Anchovy",
        type: "sea",
        price: 280,
        image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400",
        available: false,
        category: "regular",
        stock: "Out of Stock"
    }
];

let cart = [];
let selectedQuantities = {};

// Load fish immediately
function loadFishData() {
    console.log('Loading', fishData.length, 'fish items');
    renderFishCards(fishData);
}

// Render fish cards
function createFishCard(fish) {
  const card = document.createElement("div");
  card.className = "fish-card";
  card.setAttribute("data-category", fish.category || "regular");
  card.setAttribute("data-available", String(!!fish.available));
  card.setAttribute("data-type", fish.type || "river");

  const badgeClass = fish.available ? "badge-available" : "badge-out";
  const badgeText = fish.available ? `✓ ${fish.stock || "Available"}` : "✗ இல்லை | Out of Stock";
  const typeBadgeClass = (fish.type === "sea") ? "badge-sea" : "badge-river";
  const fishTypeText = (fish.type === "sea") ? "கடல் மீன் | Sea" : "ஆற்று மீன் | River";

  card.innerHTML = `
    <div class="fish-image-container">
      <img class="fish-image" src="${fish.image || ""}" alt="${fish.nameEnglish || fish.nameTamil || "Fish"}"
           onerror="this.src='https://via.placeholder.com/600x400?text=Fish'">
      <span class="fish-badge fish-type-badge ${typeBadgeClass}">${fishTypeText}</span>
      <span class="fish-badge ${badgeClass}" style="right: 15px;">${badgeText}</span>
    </div>

    <div class="fish-body">
      <h3 class="fish-name">${fish.nameTamil || ""}</h3>
      <p class="fish-name-en">${fish.nameEnglish || ""}</p>
      <div class="fish-price">ரூ. ${fish.price}<span style="font-size:16px">/கிலோ</span></div>

      ${
        fish.available
          ? `
        <div class="quantity-section">
          <label class="quantity-label">அளவு | Quantity</label>
          <div class="quantity-buttons">
            <button class="qty-btn" onclick="selectQuantity(${fish.id}, 0.25, this)">250g</button>
            <button class="qty-btn" onclick="selectQuantity(${fish.id}, 0.5, this)">500g</button>
            <button class="qty-btn" onclick="selectQuantity(${fish.id}, 0.75, this)">750g</button>
            <button class="qty-btn" onclick="selectQuantity(${fish.id}, 1, this)">1Kg</button>
            <button class="qty-btn" onclick="showCustomQuantity(${fish.id}, this)">More</button>
          </div>

          <div class="custom-quantity" id="custom-${fish.id}">
            <input
              type="number"
              class="custom-input"
              placeholder="பணத்தினை உள்ளிடவும் (ரூ.) | Enter Amount (Rs)"
              min="1"
              step="1"
              oninput="selectCustomAmount(${fish.id}, this.value)"
            >
            <small style="display:block;margin-top:6px;opacity:.75;">
              நீங்கள் உள்ளிடும் தொகைக்கு ஏற்ப கிலோ கணக்கிடப்படும்.
            </small>
          </div>
        </div>

        <div class="price-display">
          <div class="calculated-price" id="price-${fish.id}">
            விலை பார்க்க அளவு தேர்வு செய்க
          </div>
        </div>

        <button class="add-to-cart" id="cart-btn-${fish.id}" disabled onclick="addToCart(${fish.id})">
          கார்ட்டில் சேர் | Add to Cart
        </button>
        `
          : `
        <button class="add-to-cart" disabled>இல்லை | Out of Stock</button>
        `
      }
    </div>
  `;

  return card;
}
              
// Select quantity
function selectQuantity(fishId, quantity, button) {
    const card = button.closest('.fish-card');
    card.querySelectorAll('.qty-btn').forEach(btn => btn.classList.remove('active'));
    
    const customDiv = document.getElementById(`custom-${fishId}`);
    customDiv.classList.remove('show');
    
    button.classList.add('active');
    selectedQuantities[fishId] = quantity;
    updatePriceDisplay(fishId, quantity);
    
    const cartBtn = document.getElementById(`cart-btn-${fishId}`);
    if (cartBtn) cartBtn.disabled = false;
}

// Show custom quantity
function showCustomQuantity(fishId, button) {
    const card = button.closest('.fish-card');
    card.querySelectorAll('.qty-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    const customDiv = document.getElementById(`custom-${fishId}`);
    customDiv.classList.add('show');
    customDiv.querySelector('input').focus();
}

// Select custom quantity
function selectCustomQuantity(fishId, quantity) {
    quantity = parseFloat(quantity);
    if (quantity >= 0.25) {
        selectedQuantities[fishId] = quantity;
        updatePriceDisplay(fishId, quantity);
        const cartBtn = document.getElementById(`cart-btn-${fishId}`);
        if (cartBtn) cartBtn.disabled = false;
    }
}

// Update price display
function updatePriceDisplay(fishId, quantity) {
    const fish = fishData.find(f => f.id === fishId);
    if (!fish) return;
    
    const totalPrice = (fish.price * quantity).toFixed(2);
    const priceElement = document.getElementById(`price-${fishId}`);
    
    if (priceElement) {
        priceElement.innerHTML = `${quantity} கிலோ × ரூ. ${fish.price} = <strong>ரூ. ${totalPrice}</strong>`;
    }
}

// Add to cart
function amountEntered {
    const fish = fishData.find(f => f.id === fishId);
    const quantity = selectedQuantities[fishId];
    
    if (!fish || !quantity) {
        alert('Please select quantity');
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
  amountEntered: selectedAmounts[fishId] || null
});
    }
    
    updateCartUI();
    toggleCart();
    resetFishCard(fishId);
    alert('✓ Added to cart!');
}

// Reset fish card
function resetFishCard(fishId) {
    delete selectedAmounts[fishId];
    const card = document.querySelector(`#cart-btn-${fishId}`)?.closest('.fish-card');
    if (!card) return;
    
    card.querySelectorAll('.qty-btn').forEach(btn => btn.classList.remove('active'));
    const priceElement = document.getElementById(`price-${fishId}`);
    if (priceElement) priceElement.textContent = 'Select quantity';
    
    const cartBtn = document.getElementById(`cart-btn-${fishId}`);
    if (cartBtn) cartBtn.disabled = true;
    
    const customDiv = document.getElementById(`custom-${fishId}`);
    if (customDiv) {
        customDiv.classList.remove('show');
        customDiv.querySelector('input').value = '';
    }
}

// Update cart UI
function updateCartUI() {
    const cartBadge = document.querySelector('.cart-badge');
    const cartItems = document.getElementById('cartItems');
    const totalAmount = document.querySelector('.total-amount');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadge) cartBadge.textContent = Math.round(totalItems * 10) / 10;
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart"><p>Cart is empty</p></div>';
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
                            <button class="remove-item" onclick="removeFromCart(${index})">×</button>
                        </div>
                        <div class="cart-item-details">
                            <div>Quantity: ${item.quantity} Kg</div>
                            <div>Price: Rs. ${item.price}/Kg</div>
                        </div>
                        <div class="cart-item-total">Total: Rs. ${itemTotal}</div>
                    </div>
                `;
            }).join('');
        }
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (totalAmount) totalAmount.textContent = `Rs. ${total.toFixed(2)}`;
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// Toggle cart
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.toggle('open');
        cartOverlay.classList.toggle('show');
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }
    
    let message = '🐟 கலிதீன் மீன் கடை - New Order\n\n';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        message += `${index + 1}. ${item.nameTamil} (${item.nameEnglish})\n`;
        message += `   Quantity: ${item.quantity} Kg × Rs. ${item.price}\n`;
        message += `   Subtotal: Rs. ${itemTotal.toFixed(2)}\n\n`;
        total += itemTotal;
    });
    
    message += `Total: Rs. ${total.toFixed(2)}`;
    
    const phone = '94XXXXXXXXX'; // Replace with your number
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Filter fish
function filterFish(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded!');
    loadFishData();
    updateCartUI();
});

let selectedAmounts = {}; // NEW: store entered money for each fish

function selectCustomAmount(fishId, amountValue) {
  const fish = fishData.find(f => f.id === fishId);
  const amount = parseFloat(amountValue);

  const priceEl = document.getElementById(`price-${fishId}`);
  const cartBtn = document.getElementById(`cart-btn-${fishId}`);

  if (!fish || !isFinite(amount) || amount <= 0) {
    // invalid amount -> disable
    delete selectedQuantities[fishId];
    delete selectedAmounts[fishId];
    if (priceEl) priceEl.innerHTML = `பணத்தை உள்ளிடவும் | Enter amount`;
    if (cartBtn) cartBtn.disabled = true;
    return;
  }

  const qtyKg = amount / fish.price;   // quantity calculated from money
  selectedQuantities[fishId] = qtyKg;
  selectedAmounts[fishId] = amount;

  // display: amount + quantity
  const grams = Math.round(qtyKg * 1000);
  if (priceEl) {
    priceEl.innerHTML = `
      <div style="font-size:14px;opacity:.75;margin-bottom:6px;">
        ரூ. ${amount.toFixed(2)} / (ரூ. ${fish.price} ஒரு கிலோ)
      </div>
      <div style="font-size:18px;font-weight:700;">
        அளவு: ${qtyKg.toFixed(2)} கிலோ (சுமார் ${grams}g)
      </div>
    `;
  }

  if (cartBtn) cartBtn.disabled = false;
}
