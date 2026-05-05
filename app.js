const CONFIG = {
  shopNameTa: "காலிதீன் மீன் கடை",
  shopSubNameTa: "(சாதிக் மீன் கடை)",
  address: "Baduriya Road, Kattankudy, Batticaloa, Sri Lanka",
  takeawayOnly: true,
  openingHours: "06:30 AM - 12:00 PM",
  phone: "+94771988353",
  whatsappBase: "https://wa.me/94771988353",
  mapLink: "https://maps.app.goo.gl/SKHM7fahTSM2FwdFA?g_st=aw",
};

const fallbackFishData = [
  { id: "sallal-seththal", name_ta: "சல்லல் / செத்தல்", name_en: "Sallal / Seththal", price_lkr_per_kg: 1400, available: true },
  { id: "golden-japan", name_ta: "கோல்டன் / ஜப்பான்", name_en: "Golden / Japan", price_lkr_per_kg: 1200, available: true },
  { id: "mural", name_ta: "முரல்", name_en: "Murrel (Snakehead)", price_lkr_per_kg: 2800, available: true },
  { id: "otti", name_ta: "ஒட்டி", name_en: "Otti", price_lkr_per_kg: 1600, available: true },
  { id: "velraal", name_ta: "வெள்றால்", name_en: "Velraal", price_lkr_per_kg: 1900, available: true },
  { id: "manaraal", name_ta: "மனறால்", name_en: "Manaraal", price_lkr_per_kg: 1800, available: true },
  { id: "semperaal", name_ta: "சேம்புறால்", name_en: "Semberaal", price_lkr_per_kg: 2200, available: true },
  { id: "kilakkan", name_ta: "கிழக்கன்", name_en: "Kilakkan", price_lkr_per_kg: 1500, available: true },
  { id: "madraal", name_ta: "மட்றால்", name_en: "Madraal", price_lkr_per_kg: 1700, available: true },
  { id: "neththali-ayyammaasi", name_ta: "நெத்தலி / அய்யம்மாசி", name_en: "Anchovy", price_lkr_per_kg: 1300, available: true },
];

let fishItems = [];
const qtyState = {};

const elements = {
  fishTableWrap: document.getElementById("fishTableWrap"),
  fishCardsWrap: document.getElementById("fishCardsWrap"),
  reserveBtn: document.getElementById("reserveBtn"),
  reserveForm: document.getElementById("reserveForm"),
  formError: document.getElementById("formError"),
  pickupTime: document.getElementById("pickupTime"),
  cuttingOption: document.getElementById("cuttingOption"),
  customerName: document.getElementById("customerName"),
  whatsappHeaderBtn: document.getElementById("whatsappHeaderBtn"),
  callHeaderBtn: document.getElementById("callHeaderBtn"),
  mapHeaderBtn: document.getElementById("mapHeaderBtn"),
  directionBtn: document.getElementById("directionBtn"),
  footerPhone: document.getElementById("footerPhone"),
  heroHours: document.getElementById("heroHours"),
  heroAddress: document.getElementById("heroAddress"),
  locationAddress: document.getElementById("locationAddress"),
  footerHours: document.getElementById("footerHours"),
  footerAddress: document.getElementById("footerAddress"),
};

function setStaticLinks() {
  elements.whatsappHeaderBtn.href = CONFIG.whatsappBase;
  elements.whatsappHeaderBtn.target = "_blank";
  elements.whatsappHeaderBtn.rel = "noopener noreferrer";
  elements.callHeaderBtn.href = `tel:${CONFIG.phone}`;
  elements.footerPhone.href = `tel:${CONFIG.phone}`;
  elements.footerPhone.textContent = CONFIG.phone;
  elements.mapHeaderBtn.href = CONFIG.mapLink;
  elements.mapHeaderBtn.target = "_blank";
  elements.mapHeaderBtn.rel = "noopener noreferrer";
  elements.directionBtn.href = CONFIG.mapLink;
  elements.heroHours.textContent = CONFIG.openingHours;
  elements.footerHours.textContent = CONFIG.openingHours;
  elements.heroAddress.textContent = CONFIG.address;
  elements.locationAddress.textContent = CONFIG.address;
  elements.footerAddress.textContent = CONFIG.address;
}

async function loadFishData() {
  try {
    const response = await fetch('fish.json?v=' + Date.now(), { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load fish.json");
    }
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid fish data");
    }
    fishItems = data;
  } catch (error) {
    fishItems = fallbackFishData;
  }

  fishItems.forEach((item) => {
    qtyState[item.id] = 0;
  });
}

function availabilityBadge(available) {
  if (available) {
    return '<span class="badge available">இன்று உள்ளது | Available</span>';
  }
  return '<span class="badge unavailable">இன்று இல்லை | Not available</span>';
}

function tableMarkup(items) {
  const rows = items
    .map((item) => {
      const isDisabled = !item.available ? "disabled" : "";
      return `
        <tr>
          <td>
            ${item.name_ta}
            <span class="name-en">${item.name_en || ""}</span>
          </td>
          <td>Rs ${Number(item.price_lkr_per_kg).toLocaleString()}</td>
          <td>${availabilityBadge(item.available)}</td>
          <td>
            <input class="qty-input" type="number" min="0" step="0.25" value="0" data-id="${item.id}" ${isDisabled} aria-label="${item.name_ta} quantity in KG" />
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <table>
      <thead>
        <tr>
          <th>மீன் பெயர் | Fish</th>
          <th>விலை (Rs/Kg) | Price (Rs/Kg)</th>
          <th>இருப்பு | Availability</th>
          <th>அளவு (Kg) | Quantity (Kg)</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function cardMarkup(items) {
  return items
    .map((item) => {
      const isDisabled = !item.available ? "disabled" : "";
      return `
      <article class="fish-item">
        <p><strong>${item.name_ta}</strong> <span class="name-en">${item.name_en || ""}</span></p>
        <p>விலை | Price: Rs ${Number(item.price_lkr_per_kg).toLocaleString()} / Kg</p>
        <p>${availabilityBadge(item.available)}</p>
        <label>
          அளவு (Kg) | Quantity (Kg)
          <input class="qty-input" type="number" min="0" step="0.25" value="0" data-id="${item.id}" ${isDisabled} aria-label="${item.name_ta} quantity in KG" />
        </label>
      </article>
      `;
    })
    .join("");
}

function renderFish() {
  elements.fishTableWrap.innerHTML = tableMarkup(fishItems);
  elements.fishCardsWrap.innerHTML = cardMarkup(fishItems);
}

function syncQtyInputs(itemId, value) {
  document.querySelectorAll(`.qty-input[data-id="${itemId}"]`).forEach((input) => {
    if (document.activeElement !== input) {
      input.value = value;
    }
  });
}

function handleQtyInput(event) {
  const target = event.target;
  if (!target.classList.contains("qty-input")) {
    return;
  }

  const itemId = target.dataset.id;
  let value = Number.parseFloat(target.value);
  if (!Number.isFinite(value) || value < 0) {
    value = 0;
  }

  const normalized = Math.round(value * 100) / 100;
  qtyState[itemId] = normalized;
  syncQtyInputs(itemId, normalized.toString());
}

function selectedItemsWithTotal() {
  const selected = fishItems
    .map((item) => {
      const qty = qtyState[item.id] || 0;
      const lineTotal = qty * Number(item.price_lkr_per_kg);
      return { ...item, qty, lineTotal };
    })
    .filter((item) => item.qty > 0);

  const total = selected.reduce((sum, item) => sum + item.lineTotal, 0);
  return { selected, total };
}

function buildWhatsAppMessage() {
  const orderDay = elements.reserveForm.querySelector('input[name="orderDay"]:checked')?.value || "இன்று | Today";
  const pickupTime = elements.pickupTime.value.trim() || "06:30 - 12:00";
  const cuttingOption = elements.cuttingOption.value;
  const customerName = elements.customerName.value.trim();
  const { selected, total } = selectedItemsWithTotal();

  if (selected.length === 0) {
    elements.formError.textContent = "குறைந்தது ஒரு மீன் அளவு தேர்வு செய்யவும் | Please select at least one fish quantity.";
    return null;
  }

  elements.formError.textContent = "";

  const itemLines = selected
    .map((item, index) => {
      return `${index + 1}. ${item.name_ta} (${item.name_en || "Fish"}) - ${item.qty} Kg x Rs ${item.price_lkr_per_kg} = Rs ${item.lineTotal.toFixed(2)}`;
    })
    .join("\n");

  const message = [
    `வணக்கம் ${CONFIG.shopNameTa} ${CONFIG.shopSubNameTa}`,
    "",
    "முன்பதிவு விவரம் | Reserve Details",
    `Takeaway மட்டும்: ${CONFIG.takeawayOnly ? "ஆம் (Delivery இல்லை)" : "இல்லை"}`,
    `எப்போது | Day: ${orderDay}`,
    `எடுத்துச் செல்லும் நேரம் | Pickup Time: ${pickupTime}`,
    `வெட்டும் வகை | Cutting: ${cuttingOption}`,
    `வாடிக்கையாளர் பெயர் | Customer: ${customerName || "-"}`,
    "",
    "தேர்ந்தெடுத்த மீன்கள் | Selected Fish:",
    itemLines,
    "",
    `மொத்த கணக்கீடு | Total Estimate: Rs ${total.toFixed(2)}`,
    "",
    `கடை | Shop: ${CONFIG.shopNameTa} ${CONFIG.shopSubNameTa}`,
    `முகவரி | Address: ${CONFIG.address}`,
  ].join("\n");

  return message;
}

function submitReserve() {
  const message = buildWhatsAppMessage();
  if (!message) {
    return;
  }
  const url = `${CONFIG.whatsappBase}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function attachEvents() {
  elements.fishTableWrap.addEventListener("input", handleQtyInput);
  elements.fishCardsWrap.addEventListener("input", handleQtyInput);
  elements.reserveBtn.addEventListener("click", submitReserve);
}

async function init() {
  setStaticLinks();
  await loadFishData();
  renderFish();
  attachEvents();
}

init();
