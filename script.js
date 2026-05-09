/* =========================
   Kalitheen Fish Shop - script.js
   Working version (no JSON)
   "More" = Enter Amount (Rs) => auto-calc Kg
========================= */

console.log("script.js loaded ✅");

// --- Fish Data (edit daily here) ---
const fishData = [
  { id: 1, nameTamil: "சல்லல்/செத்தல்", nameEnglish: "Sardine", type: "river", price: 350, image: "https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=1200", available: true, category: "regular", stock: "High" },
  { id: 2, nameTamil: "கோல்டன்/ஜப்பான்", nameEnglish: "Golden/Japan", type: "river", price: 450, image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=1200", available: true, category: "premium", stock: "Medium" },
  { id: 3, nameTamil: "முரல்", nameEnglish: "Murrel", type: "river", price: 650, image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=1200", available: true, category: "premium", stock: "Low" },
  { id: 4, nameTamil: "ஒட்டி", nameEnglish: "Otti", type: "river", price: 400, image: "https://images.unsplash.com/photo-1580950113276-f1b539d3b7be?w=1200", available: true, category: "regular", stock: "High" },
  { id: 5, nameTamil: "வெள்ளறால்", nameEnglish: "White Prawns", type: "river", price: 850, image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=1200", available: true, category: "premium", stock: "Medium" },
  { id: 6, nameTamil: "மனறால்", nameEnglish: "Tiger Prawns", type: "river", price: 1100, image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200", available: true, category: "premium", stock: "Low" },
  { id: 7, nameTamil: "சேம்புறால்", nameEnglish: "Flower Prawns", type: "river", price: 950, image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=1200", available: true, category: "premium", stock: "Medium" },
  { id: 8, nameTamil: "கிழக்கன்", nameEnglish: "Kilakkan", type: "river", price: 500, image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=1200", available: true, category: "regular", stock: "High" },
  { id: 9, nameTamil: "மட்டறால்", nameEnglish: "Mud Crab", type: "river", price: 1200, image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200", available: false, category: "premium", stock: "Out" },
  { id: 10, nameTamil: "நெத்தலி/அய்யம்மாசி", nameEnglish: "Anchovy", type: "sea", price: 280, image: "https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=1200", available: true, category: "regular", stock: "High" }
];

// --- State ---
let cart = [];
let selectedQuantities = {}; // fishId -> Kg
let selectedAmounts = {};    // fishId -> Rs (only for More option)

// --- Helpers ---
function money(n) { return `ரூ. ${Number(n).toFixed(2)}`; }
function typeText(type) { return type === "sea" ? "கடல் மீன் | Sea" : "ஆற்று மீன் | River"; }

// --- Render list ---
function renderFishCards(list) {
  const grid = document.getElementById("fishGrid");
  if (!grid) {
    console.error("❌ fishGrid not found. Ensure <div id='fishGrid'></div> exists.");
    return;
  }

  grid.innerHTML = "";

  if (!list || list.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;">No fish</div>`;
    return;
  }

  list.forEach(fish => grid.appendChild(createFishCard(fish)));
}

function createFishCard(fish) {
  const card = document.createElement("div");
  card.className = "fish-card";
  card.dataset.category = fish.category || "regular";
  card.dataset.available = String(!!fish.available);
  card.dataset.type = fish.type || "river";

  const badgeClass = fish.available ? "badge-available" : "badge-out";
  const badgeText = fish.available ? `✓ ${fish.stock || "Available"}` : "✗ இல்லை | Out of Stock";
  const typeBadgeClass = fish.type === "sea" ? "badge-sea" : "badge-river";

  card.innerHTML = `
    <div class="fish-image-container">
      <img class="fish-image"
           src="${fish.image || ""}"
           alt="${fish.nameEnglish || fish.nameTamil || "Fish"}"
           onerror="this.src='https://via.placeholder.com/900x600?text=Fish'">
      <span class="fish-badge fish-type-badge ${typeBadgeClass}">${typeText(fish.type)}</span>
      <span class="fish-badge ${badgeClass}" style="right:15px;">${badgeText}</span>
      ${fish.category === "premium" ? `<span class="fish-badge badge-premium" style="bottom:15px;left:15px;top:auto;">⭐ சிறப்பு | Premium</span>` : ""}
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
              <button class="qty-btn" onclick="showCustomAmountInput(${fish.id}, this)">More</button>
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

// --- Quantity buttons (Kg) ---
function selectQuantity(fishId, qtyKg, button) {
  const fish = fishData.find(f => f.id === fishId);
  if (!fish) return;

  // active button UI
  const card = button.closest(".fish-card");
  card.querySelectorAll(".qty-btn").forEach(b => b.classList.remove("active"));
  button.classList.add("active");

  // hide custom input
  const customDiv = document.getElementById(`custom-${fishId}`);
  if (customDiv) customDiv.classList.remove("show");

  // set selection
  selectedQuantities[fishId] = qtyKg;
  delete selectedAmounts[fishId];

  // update price display
  const total = fish.price * qtyKg;
  const priceEl = document.getElementById(`price-${fishId}`);
  if (priceEl) priceEl.innerHTML = `${qtyKg} Kg × ரூ. ${fish.price} = <strong>${money(total)}</strong>`;

  const cartBtn = document.getElementById(`cart-btn-${fishId}`);
  if (cartBtn) cartBtn.disabled = false;
}

// --- More button shows amount input (Rs) ---
function showCustomAmountInput(fishId, button) {
  const card = button.closest(".fish-card");
  card.querySelectorAll(".qty-btn").forEach(b => b.classList.remove("active"));
  button.classList.add("active");

  const customDiv = document.getElementById(`custom-${fishId}`);
  if (customDiv) {
    customDiv.classList.add("show");
    const input = customDiv.querySelector("input");
    if (input) input.focus();
  }

  // disable until amount entered
  const cartBtn = document.getElementById(`cart-btn-${fishId}`);
  if (cartBtn) cartBtn.disabled = true;

  const priceEl = document.getElementById(`price-${fishId}`);
  if (priceEl) priceEl.textContent = "பணத்தை உள்ளிடவும் | Enter amount";
}

// --- Amount input => compute Kg ---
function selectCustomAmount(fishId, amountValue) {
  const fish = fishData.find(f => f.id === fishId);
  const amount = parseFloat(amountValue);

  const priceEl = document.getElementById(`price-${fishId}`);
  const cartBtn = document.getElementById(`cart-btn-${fishId}`);

  if (!fish || !isFinite(amount) || amount <= 0) {
    delete selectedQuantities[fishId];
    delete selectedAmounts[fishId];
    if (priceEl) priceEl.textContent = "பணத்தை உள்ளிடவும் | Enter amount";
    if (cartBtn) cartBtn.disabled = true;
    return;
  }

  const qtyKg = amount / fish.price;
  selectedQuantities[fishId] = qtyKg;
  selectedAmounts[fishId] = amount;

  const grams = Math.round(qtyKg * 1000);

  if (priceEl) {
    priceEl.innerHTML = `
      <div style="font-size:14px;opacity:.75;margin-bottom:6px;">
        ${money(amount)} / (ரூ. ${fish.price} ஒரு கிலோ)
      </div>
      <div style="font-size:18px;font-weight:700;">
        அளவு: ${qtyKg.toFixed(2)} Kg (சுமார் ${grams}g)
      </div>
    `;
  }

  if (cartBtn) cartBtn.disabled = false;
}

// --- Cart ---
function addToCart(fishId) {
  const fish = fishData.find(f => f.id === fishId);
 
   const qty = selectedQuantities[fishId];
  if (!fish || !qty)
  
  {
    alert("அளவு தேர்வு செய்யவும் | Select quantity");
    return;
  }
   
  const existing = cart.find(i => i.id === fishId);
  if (existing) {
    existing.quantity += qty;
    if (selectedAmounts[fishId]) existing.amountEntered = (existing.amountEntered || 0) + selectedAmounts[fishId];
  } else {
    cart.push({
      id: fish.id,
      nameTamil: fish.nameTamil,
      nameEnglish: fish.nameEnglish,
      price: fish.price,
      quantity: qty,
      amountEntered: selectedAmounts[fishId] || null
    });
  }

  resetFishCard(fishId);
  updateCartUI();
  toggleCart(true);
}

function resetFishCard(fishId) {
  delete selectedQuantities[fishId];
  delete selectedAmounts[fishId];

  const cardBtn = document.getElementById(`cart-btn-${fishId}`);
  if (cardBtn) cardBtn.disabled = true;

  const priceEl = document.getElementById(`price-${fishId}`);
  if (priceEl) priceEl.textContent = "விலை பார்க்க அளவு தேர்வு செய்க";

  const customDiv = document.getElementById(`custom-${fishId}`);
  if (customDiv) {
    customDiv.classList.remove("show");
    const input = customDiv.querySelector("input");
    if (input) input.value = "";
  }

  // remove active selection buttons
  const card = cardBtn ? cardBtn.closest(".fish-card") : null;
  if (card) card.querySelectorAll(".qty-btn").forEach(b => b.classList.remove("active"));
}

function updateCartUI() {
  const badge = document.querySelector(".cart-badge");
  const itemsDiv = document.getElementById("cartItems");
  const totalEl = document.querySelector(".total-amount");

  const totalKg = cart.reduce((s, i) => s + i.quantity, 0);
  if (badge) badge.textContent = Math.round(totalKg * 10) / 10;

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  if (totalEl) totalEl.textContent = money(total);

  if (!itemsDiv) return;

  if (cart.length === 0) {
    itemsDiv.innerHTML = `<div class="empty-cart"><p>உங்கள் கார்ட் காலியாக உள்ளது | Your cart is empty</p></div>`;
    return;
  }

  itemsDiv.innerHTML = cart.map((item, idx) => {
    const itemTotal = item.price * item.quantity;
    return `
      <div class="cart-item">
        <div class="cart-item-header">
          <div>
            <div class="cart-item-name">${item.nameTamil}</div>
            <div class="cart-item-name-en">${item.nameEnglish}</div>
          </div>
          <button class="remove-item" onclick="removeFromCart(${idx})">×</button>
        </div>

        <div class="cart-item-details">
          <div><strong>அளவு:</strong> ${item.quantity.toFixed(2)} Kg</div>
          <div><strong>விலை:</strong> ரூ. ${item.price}/Kg</div>
          ${item.amountEntered ? `<div><strong>தொகை:</strong> ${money(item.amountEntered)}</div>` : ""}
        </div>

        <div class="cart-item-total">மொத்தம் | Total: ${money(itemTotal)}</div>
      </div>
    `;
  }).join("");
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function toggleCart(forceOpen) {
  const sidebar = document.getElementById("cartSidebar");
  const overlay = document.getElementById("cartOverlay");
  if (!sidebar || !overlay) return;

  if (forceOpen === true) {
    sidebar.classList.add("open");
    overlay.classList.add("show");
    return;
  }

  sidebar.classList.toggle("open");
  overlay.classList.toggle("show");
}

function checkout() {
  if (cart.length === 0) {
    alert("உங்கள் கார்ட் காலியாக உள்ளது | Your cart is empty");
    return;
  }

  let msg = "*கலிதீன் மீன் கடை - ஆர்டர் | Order*\n\n";
  let total = 0;

  cart.forEach((i, n) => {
    const sub = i.price * i.quantity;
    total += sub;
    msg += `${n + 1}. ${i.nameTamil} (${i.nameEnglish})\n`;
    msg += `   அளவு: ${i.quantity.toFixed(2)} Kg\n`;
    msg += `   விலை: ரூ. ${i.price}/Kg\n`;
    if (i.amountEntered) msg += `   தொகை: ரூ. ${Number(i.amountEntered).toFixed(2)}\n`;
    msg += `   துணை மொத்தம்: ரூ. ${sub.toFixed(2)}\n\n`;
  });

  msg += `*மொத்தம் | Total: ரூ. ${total.toFixed(2)}*`;

  const phone = "94XXXXXXXXX"; // TODO: set your WhatsApp number
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
}

// --- Filters ---
function filterFish(category) {
  const cards = document.querySelectorAll(".fish-card");
  cards.forEach(card => {
    const available = card.dataset.available === "true";
    const type = card.dataset.type;
    const isPremium = card.dataset.category === "premium";

    let show = true;
    if (category === "available") show = available;
    else if (category === "river") show = type === "river";
    else if (category === "sea") show = type === "sea";
    else if (category === "premium") show = isPremium;

    card.style.display = show ? "block" : "none";
  });

  // update active button (works even if event is not available)
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  const btns = Array.from(document.querySelectorAll(".filter-btn"));
  const btn = btns.find(b => (b.textContent || "").toLowerCase().includes(category)) || null;
  if (btn) btn.classList.add("active");
}

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
  renderFishCards(fishData);
  updateCartUI();
});
