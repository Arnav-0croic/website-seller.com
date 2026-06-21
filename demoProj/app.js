/* ==========================================
   INTERACTIVE LOGIC - WEBSITE DEVELOPER HUB
   ========================================== */

// Base Plan Prices
const PLAN_PRICES = {
  simple: 1500,
  city: 2000,
  industrial: 5000,
  ecommerce: 7500,
  enterprise: 10000
};

// Plan Labels for Summary
const PLAN_LABELS = {
  simple: "Simple Industrial Website",
  city: "Local City Advanced Website",
  industrial: "High-Scale Industrial Web App",
  ecommerce: "E-Commerce Retail Store",
  enterprise: "Custom Enterprise Platform"
};

// Addon Prices
const ADDON_PRICES = {
  features: 400,
  testimonials: 500,
  pricing: 400,
  contact: 500
};

// Addon Labels
const ADDON_LABELS = {
  features: "Features Grid Section",
  testimonials: "Testimonials Slider Pack",
  pricing: "Interactive Pricing Cards",
  contact: "Interactive Lead Contact Form"
};

// Current active configuration (defaults match High-Scale Industrial setup)
let currentConfig = {
  plan: 'industrial',
  theme: 'cyan',
  addons: {
    features: true,
    testimonials: true,
    pricing: false,
    contact: true
  }
};

// Global Checkout Configuration
let checkoutPackage = {
  type: 'custom', // 'custom' (from builder) or specific plan keys like 'simple', 'city'
  label: '',
  price: 0,
  itemsList: []
};

// Initialize once document loads
document.addEventListener("DOMContentLoaded", () => {
  updateBuilderPrice();
  changePreviewTheme(currentConfig.theme);
});

// Helper: Scroll to element on page
function scrollToElement(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// Update sandbox builder pricing calculations
function updateBuilderPrice() {
  const planSelect = document.getElementById("plan-select");
  if (!planSelect) return;

  const planVal = planSelect.value;
  currentConfig.plan = planVal;

  // Read toggle checkboxes
  const hasFeatures = document.getElementById("toggle-features").checked;
  const hasTestimonials = document.getElementById("toggle-testimonials").checked;
  const hasPricing = document.getElementById("toggle-pricing").checked;
  const hasContact = document.getElementById("toggle-contact").checked;

  currentConfig.addons.features = hasFeatures;
  currentConfig.addons.testimonials = hasTestimonials;
  currentConfig.addons.pricing = hasPricing;
  currentConfig.addons.contact = hasContact;

  // Update Marketplace buttons active state
  syncMarketplaceButton('features', hasFeatures);
  syncMarketplaceButton('testimonials', hasTestimonials);
  syncMarketplaceButton('pricing', hasPricing);
  syncMarketplaceButton('contact', hasContact);

  // Compute Base Cost
  const baseCost = PLAN_PRICES[planVal] || 0;
  
  // Compute Addons Cost
  let addonsCost = 0;
  if (hasFeatures) addonsCost += ADDON_PRICES.features;
  if (hasTestimonials) addonsCost += ADDON_PRICES.testimonials;
  if (hasPricing) addonsCost += ADDON_PRICES.pricing;
  if (hasContact) addonsCost += ADDON_PRICES.contact;

  const grandTotal = baseCost + addonsCost;

  // Update UI texts
  document.getElementById("base-plan-cost").innerText = `₹${baseCost.toLocaleString()}`;
  document.getElementById("addons-cost").innerText = `₹${addonsCost.toLocaleString()}`;
  document.getElementById("grand-total-cost").innerHTML = `₹<span>${grandTotal.toLocaleString()}</span>`;

  // Update preview URL address bar as cosmetic highlight
  const urlBar = document.getElementById("preview-url");
  if (urlBar) {
    if (planVal === 'simple') urlBar.innerText = "basic-utility-site.in";
    else if (planVal === 'city') urlBar.innerText = "local-store.city";
    else if (planVal === 'industrial') urlBar.innerText = "highscale-system.io";
    else if (planVal === 'ecommerce') urlBar.innerText = "buy-retail-store.com";
    else urlBar.innerText = "enterprise-platform.org";
  }
}

// Change Visual Preview Theme
function changePreviewTheme(themeName) {
  currentConfig.theme = themeName;
  
  // Set theme class on body
  document.body.className = '';
  document.body.classList.add(`theme-${themeName}`);

  // Apply colors to the mock preview frame
  const canvas = document.getElementById("preview-canvas");
  if (canvas) {
    canvas.className = 'preview-body';
    canvas.classList.add(`theme-${themeName}`);
  }
}

// Toggle display of preview elements inside canvas
function togglePreviewBlock(blockId, isVisible) {
  const block = document.getElementById(blockId);
  if (block) {
    block.style.display = isVisible ? "flex" : "none";
  }

  // Update equivalent switch if toggled from marketplace
  const addonKey = blockId.replace('block-', '');
  const toggleSwitch = document.getElementById(`toggle-${addonKey}`);
  if (toggleSwitch) {
    toggleSwitch.checked = isVisible;
  }

  updateBuilderPrice();
}

// Toggles Marketplace elements and links them to Sidebar controls
function toggleMarketItem(itemName, price) {
  const btn = document.getElementById(`btn-market-${itemName}`);
  if (!btn) return;

  const isActive = btn.classList.contains("active");
  const willBeActive = !isActive;

  // Update Visual State
  togglePreviewBlock(`block-${itemName}`, willBeActive);
}

// Synchronize marketplace button highlight classes
function syncMarketplaceButton(itemName, isActive) {
  const btn = document.getElementById(`btn-market-${itemName}`);
  if (btn) {
    if (isActive) {
      btn.classList.add("active");
      btn.innerText = "In Sandbox";
    } else {
      btn.classList.remove("active");
      btn.innerText = "Add to Sandbox";
    }
  }
}

// Trigger bookings directly from pricing cards
function triggerCardBooking(planKey, priceVal) {
  checkoutPackage.type = planKey;
  checkoutPackage.label = PLAN_LABELS[planKey];
  checkoutPackage.price = priceVal;
  checkoutPackage.itemsList = [
    { name: "Complete Website Plan", desc: PLAN_LABELS[planKey], price: priceVal }
  ];

  openOrderModalUI();
}

// Open booking modal
function openOrderModal(sourceType) {
  if (sourceType === 'custom') {
    checkoutPackage.type = 'custom';
    checkoutPackage.label = "Custom Coded Sandbox Package";
    
    // Calculate current values
    const baseCost = PLAN_PRICES[currentConfig.plan];
    checkoutPackage.itemsList = [
      { name: `Base: ${PLAN_LABELS[currentConfig.plan]}`, desc: "Chosen Tier", price: baseCost }
    ];

    let totalVal = baseCost;

    // Check addons
    for (const [addonKey, isActive] of Object.entries(currentConfig.addons)) {
      if (isActive) {
        const addonPrice = ADDON_PRICES[addonKey];
        checkoutPackage.itemsList.push({
          name: `Add-on: ${ADDON_LABELS[addonKey]}`,
          desc: "Section Component",
          price: addonPrice
        });
        totalVal += addonPrice;
      }
    }

    checkoutPackage.price = totalVal;
  }

  openOrderModalUI();
}

// Fill order summary inside checkout modal
function openOrderModalUI() {
  const listContainer = document.getElementById("modal-summary-list");
  if (!listContainer) return;

  listContainer.innerHTML = '';
  
  checkoutPackage.itemsList.forEach(item => {
    const row = document.createElement("div");
    row.className = "summary-item-row";
    row.innerHTML = `
      <span class="summary-item-name">${item.name}</span>
      <span class="summary-item-price">₹${item.price.toLocaleString()}</span>
    `;
    listContainer.appendChild(row);
  });

  document.getElementById("modal-total-price").innerText = `₹${checkoutPackage.price.toLocaleString()}`;

  // Display Modal
  const modal = document.getElementById("order-modal");
  if (modal) {
    modal.classList.add("active");
  }
}

// Close order modal
function closeOrderModal() {
  const modal = document.getElementById("order-modal");
  if (modal) {
    modal.classList.remove("active");
  }
}

// Close modal if user clicks background overlay
window.onclick = function(event) {
  const modal = document.getElementById("order-modal");
  if (event.target === modal) {
    closeOrderModal();
  }
};

// FAQ Accordion Trigger
function toggleFaq(btn) {
  const item = btn.parentElement;
  const isActive = item.classList.contains("active");
  
  // Close other open FAQs
  document.querySelectorAll(".faq-item").forEach(faq => {
    faq.classList.remove("active");
  });

  if (!isActive) {
    item.classList.add("active");
  }
}

// Compile order values and trigger WhatsApp redirection
function submitWhatsAppOrder(event) {
  event.preventDefault();

  const bizName = document.getElementById("form-biz-name").value.trim();
  const contactName = document.getElementById("form-contact-name").value.trim();
  const contactPhone = document.getElementById("form-contact-phone").value.trim();
  const userNotes = document.getElementById("form-notes").value.trim();

  if (!bizName || !contactName || !contactPhone) {
    alert("Please fill in all required fields marked with *");
    return;
  }

  // Format order items list text
  let itemsDetailText = "";
  checkoutPackage.itemsList.forEach((item, index) => {
    itemsDetailText += `  ${index + 1}. ${item.name} (₹${item.price.toLocaleString()})\n`;
  });

  // Construct message template
  const waMessage = 
`🛍️ NEW ORDER: WEBSITE DEVELOPER HUB
-----------------------------------------
🏢 Business Name: ${bizName}
👤 Contact Person: ${contactName}
📞 Phone: ${contactPhone}

📋 ORDER ITEMS:
${itemsDetailText}
🎨 Preferred Theme Color: ${currentConfig.theme.toUpperCase()}
📝 Instructions/Notes: ${userNotes ? userNotes : "None provided"}
-----------------------------------------
💵 Estimated Total Price: ₹${checkoutPackage.price.toLocaleString()}

👉 Hello Developer, I would like to purchase these website services for my retail store/business. Please connect to confirm timeline and deployment details!`;

  // Encoded URL format
  const encodedText = encodeURIComponent(waMessage);
  
  // WhatsApp Number targeting +91 7990683527
  const whatsappUrl = `https://wa.me/917990683527?text=${encodedText}`;

  // Redirect to WhatsApp API
  window.open(whatsappUrl, "_blank");

  // Close checkout modal
  closeOrderModal();
}
