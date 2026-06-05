// =============================================
// PEAKYSHOP — Application State & Logic
// =============================================

let state = {
  products: [],
  cart: [],
  wishlist: JSON.parse(localStorage.getItem('peaky_wishlist')) || [],
  currency: localStorage.getItem('peaky_currency') || 'INR',
  theme: localStorage.getItem('peaky_theme') || 'dark',
  activeTab: 'shop-view',
  appliedPromo: null,
  discountPercent: 0,
  orderHistory: JSON.parse(localStorage.getItem('peaky_orders')) || [],
  productReviews: JSON.parse(localStorage.getItem('peaky_reviews')) || {
    1: [
      { name: 'Aditya K.', rating: 5, text: 'Excellent build quality. Great value for the price.' },
      { name: 'Priya M.', rating: 4, text: 'Very comfortable, fits perfectly for long work sessions.' }
    ],
    2: [
      { name: 'Rahul S.', rating: 5, text: 'Battery life is amazing, easily lasts two full days.' }
    ],
    3: [
      { name: 'Sneha T.', rating: 4, text: 'Setup was simple and the color range is beautiful.' }
    ]
  },
  currencyRates: {
    INR: 83.5,
    USD: 1.0,
    EUR: 0.92
  },
  currencySymbols: {
    INR: '₹',
    USD: '$',
    EUR: '€'
  },
  activeCategory: 'all',
  searchQuery: ''
};

// =============================================
// ELEMENT BINDINGS
// =============================================
const productGrid = document.getElementById('product-grid');
const wishlistGrid = document.getElementById('wishlist-grid');
const cartOverlay = document.getElementById('cart-overlay');
const cartDrawer = document.getElementById('cart-drawer');
const cartToggleBtn = document.getElementById('cart-toggle-btn');
const cartCloseBtn = document.getElementById('cart-close-btn');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');
const cartFooter = document.getElementById('cart-footer');
const shopNowBtn = document.getElementById('shop-now-btn');
const checkoutBtn = document.getElementById('checkout-btn');
const searchInput = document.getElementById('search-input');
const categoryButtons = document.querySelectorAll('.filter-chip');

const navLinks = document.querySelectorAll('.nav-link');
const appViews = document.querySelectorAll('.app-view');
const navSearchBar = document.getElementById('nav-search-bar');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const currencySelect = document.getElementById('currency-select');

const modalOverlay = document.getElementById('product-modal-overlay');
const modalCloseBtn = document.getElementById('product-modal-close');
const modalContent = document.getElementById('product-modal-content');

const compareSelect1 = document.getElementById('compare-select-1');
const compareSelect2 = document.getElementById('compare-select-2');
const compareMatrixWrapper = document.getElementById('compare-matrix-wrapper');
const compareEmptyState = document.getElementById('compare-empty-state');

const checkoutForm = document.getElementById('checkout-form');
const checkoutSummaryItems = document.getElementById('checkout-summary-items');
const checkoutSubtotal = document.getElementById('checkout-subtotal');
const checkoutDiscountRow = document.getElementById('checkout-discount-row');
const checkoutDiscountAmount = document.getElementById('checkout-discount-amount');
const checkoutTotal = document.getElementById('checkout-total');
const checkoutSuccessScreen = document.getElementById('checkout-success-screen');

const promoInput = document.getElementById('promo-input');
const applyPromoBtn = document.getElementById('apply-promo-btn');
const promoAppliedMsg = document.getElementById('promo-applied-msg');
const discountRow = document.getElementById('discount-row');
const discountPercentSpan = document.getElementById('discount-percent');
const discountAmountSpan = document.getElementById('discount-amount');

const orderTimeline = document.getElementById('order-timeline');

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  init();
});

async function init() {
  initTheme();
  currencySelect.value = state.currency;

  await Promise.all([fetchProducts(), fetchCart()]);

  setupEventListeners();
  populateCompareDropdowns();
  renderOrderHistory();

  lucide.createIcons();
}

// =============================================
// THEME
// =============================================
function initTheme() {
  if (state.theme === 'light') {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
  }
}

// =============================================
// API CALLS
// =============================================
async function fetchProducts() {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Failed to load products');
    state.products = await res.json();
    renderProducts();
  } catch (err) {
    console.error('Error fetching products:', err);
    renderErrorState();
  }
}

async function fetchCart() {
  try {
    const res = await fetch('/api/cart');
    if (!res.ok) throw new Error('Failed to load cart');
    state.cart = await res.json();
    updateCartUI();
  } catch (err) {
    console.error('Error fetching cart:', err);
  }
}

// =============================================
// PRICE FORMATTING
// =============================================
function formatPrice(usdAmount) {
  const converted = usdAmount * state.currencyRates[state.currency];
  const symbol = state.currencySymbols[state.currency];
  if (state.currency === 'INR') {
    return `${symbol}${Math.round(converted).toLocaleString('en-IN')}`;
  }
  return `${symbol}${converted.toFixed(2)}`;
}

// =============================================
// STAR RATINGS
// =============================================
function renderStars(rating) {
  const full = Math.round(rating);
  let html = '<div class="rating-stars">';
  for (let i = 1; i <= 5; i++) {
    html += `<i data-lucide="star"${i > full ? ' class="empty"' : ''}></i>`;
  }
  html += '</div>';
  return html;
}

function getAverageRating(productId) {
  const reviews = state.productReviews[productId] || [];
  if (reviews.length === 0) return 5.0;
  return reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
}

// =============================================
// EVENT LISTENERS
// =============================================
function setupEventListeners() {
  // Cart drawer
  cartToggleBtn.addEventListener('click', toggleCartDrawer);
  cartCloseBtn.addEventListener('click', toggleCartDrawer);
  cartOverlay.addEventListener('click', toggleCartDrawer);

  if (shopNowBtn) {
    shopNowBtn.addEventListener('click', () => {
      toggleCartDrawer();
      switchTab('shop-view');
      document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Shop CTA
  const shopCta = document.getElementById('shop-collection-cta');
  if (shopCta) {
    shopCta.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Navigation tabs
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(link.dataset.tab);
    });
  });

  // Theme toggle
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    state.theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('peaky_theme', state.theme);
    showToast(`Switched to ${state.theme} mode`, 'success');
  });

  // Currency
  currencySelect.addEventListener('change', (e) => {
    state.currency = e.target.value;
    localStorage.setItem('peaky_currency', state.currency);
    renderProducts();
    renderWishlist();
    updateCartUI();
    updateCompareView();
    updateCheckoutSummary();
    showToast(`Prices updated to ${state.currency}`, 'success');
  });

  // Category filters
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeCategory = btn.dataset.category;
      renderProducts();
    });
  });

  // Search
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.toLowerCase().trim();
    renderProducts();
  });

  // Checkout
  checkoutBtn.addEventListener('click', () => {
    if (state.cart.length === 0) return;
    toggleCartDrawer();
    switchTab('checkout-view');
    updateCheckoutSummary();
  });

  // Modal
  modalCloseBtn.addEventListener('click', closeProductModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeProductModal();
  });

  // Promo
  applyPromoBtn.addEventListener('click', handleApplyPromo);

  // Compare
  compareSelect1.addEventListener('change', updateCompareView);
  compareSelect2.addEventListener('change', updateCompareView);

  // Checkout form
  checkoutForm.addEventListener('submit', handleCheckoutSubmit);
}

// =============================================
// TAB / VIEW SWITCHING
// =============================================
function switchTab(viewId) {
  state.activeTab = viewId;

  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.tab === viewId);
  });

  appViews.forEach(view => {
    view.classList.toggle('active', view.id === viewId);
  });

  if (viewId === 'wishlist-view') renderWishlist();

  // Show search bar only on Shop
  if (navSearchBar) {
    navSearchBar.style.display = viewId === 'shop-view' ? '' : 'none';
  }

  window.scrollTo({ top: 0, behavior: 'instant' });
}

function toggleCartDrawer() {
  cartDrawer.classList.toggle('open');
  cartOverlay.classList.toggle('open');
}

// =============================================
// RENDER PRODUCTS
// =============================================
function renderProducts() {
  const filtered = state.products.filter(p => {
    const matchCat = state.activeCategory === 'all' || p.category.toLowerCase() === state.activeCategory.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(state.searchQuery) || p.description.toLowerCase().includes(state.searchQuery);
    return matchCat && matchSearch;
  });

  // Update count label
  const countLabel = document.getElementById('product-count-label');
  if (countLabel) countLabel.textContent = `${filtered.length} items`;

  if (filtered.length === 0) {
    productGrid.innerHTML = `
      <div class="empty-state">
        <i data-lucide="package-search" class="empty-icon"></i>
        <h3>No products found</h3>
        <p>Try adjusting your search or category filter.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  productGrid.innerHTML = filtered.map(p => {
    const avgRating = getAverageRating(p.id);
    const isWished = state.wishlist.includes(p.id);
    return `
      <div class="product-card" id="product-${p.id}">
        <div class="product-img-wrapper">
          <img class="product-img" src="${p.image}" alt="${p.name}" onclick="openProductModal(${p.id})">
          <span class="product-category-tag">${p.category}</span>
          <div class="card-actions-top">
            <button class="wishlist-heart-btn${isWished ? ' active' : ''}" onclick="toggleWishlist(${p.id}, this)" aria-label="Save to wishlist">
              <i data-lucide="heart"></i>
            </button>
          </div>
        </div>
        <div class="product-info">
          <h3 class="product-title" onclick="openProductModal(${p.id})">${p.name}</h3>
          <div class="rating-container">${renderStars(avgRating)}</div>
          <p class="product-desc">${p.description}</p>
          <div class="product-footer">
            <span class="product-price">${formatPrice(p.price)}</span>
            <button class="add-to-cart-btn" onclick="handleAddToCart(${p.id})">
              <i data-lucide="shopping-cart"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function renderErrorState() {
  productGrid.innerHTML = `
    <div class="empty-state">
      <i data-lucide="wifi-off" class="empty-icon" style="color:var(--accent-red)"></i>
      <h3>Could not load products</h3>
      <p>The product catalog service could not be reached. Please try again.</p>
      <button class="retry-btn" onclick="fetchProducts()">Retry</button>
    </div>
  `;
  lucide.createIcons();
}

// =============================================
// WISHLIST
// =============================================
function toggleWishlist(productId, btn) {
  const idx = state.wishlist.indexOf(productId);
  if (idx > -1) {
    state.wishlist.splice(idx, 1);
    btn.classList.remove('active');
    showToast('Removed from Wishlist', 'success');
  } else {
    state.wishlist.push(productId);
    btn.classList.add('active');
    showToast('Saved to Wishlist', 'success');
  }
  localStorage.setItem('peaky_wishlist', JSON.stringify(state.wishlist));
  if (state.activeTab === 'wishlist-view') renderWishlist();
}

function renderWishlist() {
  const wished = state.products.filter(p => state.wishlist.includes(p.id));
  if (wished.length === 0) {
    wishlistGrid.innerHTML = `
      <div class="empty-state">
        <i data-lucide="heart" class="empty-icon"></i>
        <h3>Your Wishlist is empty</h3>
        <p>Browse the catalog and save your favourite items here.</p>
        <button class="btn-primary-sm" onclick="switchTab('shop-view')">Browse Catalog</button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  wishlistGrid.innerHTML = wished.map(p => `
    <div class="product-card">
      <div class="product-img-wrapper">
        <img class="product-img" src="${p.image}" alt="${p.name}" onclick="openProductModal(${p.id})">
        <span class="product-category-tag">${p.category}</span>
        <div class="card-actions-top">
          <button class="wishlist-heart-btn active" onclick="toggleWishlist(${p.id}, this)" aria-label="Remove from wishlist">
            <i data-lucide="heart"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <h3 class="product-title" onclick="openProductModal(${p.id})">${p.name}</h3>
        <div class="rating-container">${renderStars(getAverageRating(p.id))}</div>
        <p class="product-desc">${p.description}</p>
        <div class="product-footer">
          <span class="product-price">${formatPrice(p.price)}</span>
          <button class="add-to-cart-btn" onclick="handleAddToCart(${p.id})">
            <i data-lucide="shopping-cart"></i> Add to Cart
          </button>
        </div>
      </div>
    </div>
  `).join('');
  lucide.createIcons();
}

// =============================================
// CART
// =============================================
async function handleAddToCart(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  try {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: product.id, name: product.name, price: product.price, quantity: 1 })
    });
    if (!res.ok) throw new Error('Cart error');
    state.cart = await res.json();
    updateCartUI();
    showToast(`${product.name} added to bag`, 'success');
    cartCount.classList.add('pop');
    setTimeout(() => cartCount.classList.remove('pop'), 300);
  } catch (err) {
    console.error(err);
    showToast('Failed to add item to cart.', 'error');
  }
}

async function handleRemoveFromCart(productId) {
  try {
    const res = await fetch(`/api/cart/${productId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Remove error');
    state.cart = await res.json();
    updateCartUI();
    showToast('Item removed from bag.', 'success');
  } catch (err) {
    console.error(err);
    showToast('Failed to remove item.', 'error');
  }
}

function updateCartUI() {
  const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.innerText = totalCount;

  if (state.cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart-state">
        <i data-lucide="shopping-basket" class="empty-cart-icon"></i>
        <p>Your bag is empty</p>
        <button class="btn-primary-sm" id="shop-now-btn-empty">Start Shopping</button>
      </div>
    `;
    cartFooter.style.display = 'none';

    const btn = document.getElementById('shop-now-btn-empty');
    if (btn) {
      btn.addEventListener('click', () => {
        toggleCartDrawer();
        switchTab('shop-view');
      });
    }
  } else {
    cartFooter.style.display = 'block';
    cartItemsContainer.innerHTML = state.cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatPrice(item.price)}</div>
          <div class="cart-item-qty">Qty: ${item.quantity}</div>
        </div>
        <button class="item-remove-btn" onclick="handleRemoveFromCart(${item.id})" aria-label="Remove item">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    `).join('');

    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartSubtotal.innerText = formatPrice(subtotal);

    if (state.discountPercent > 0) {
      const discount = subtotal * (state.discountPercent / 100);
      discountPercentSpan.innerText = `${state.discountPercent}%`;
      discountAmountSpan.innerText = `-${formatPrice(discount)}`;
      discountRow.style.display = 'flex';
      cartTotal.innerText = formatPrice(subtotal - discount);
    } else {
      discountRow.style.display = 'none';
      cartTotal.innerText = formatPrice(subtotal);
    }
  }

  lucide.createIcons();
}

// =============================================
// PROMO CODES
// =============================================
function handleApplyPromo() {
  const code = promoInput.value.toUpperCase().trim();
  if (code === 'PEAKY10') {
    state.appliedPromo = 'PEAKY10';
    state.discountPercent = 10;
    promoAppliedMsg.className = 'promo-status success';
    promoAppliedMsg.innerText = 'Code applied — 10% discount active.';
    showToast('10% discount applied!', 'success');
  } else if (code === 'DEVOPS') {
    state.appliedPromo = 'DEVOPS';
    state.discountPercent = 20;
    promoAppliedMsg.className = 'promo-status success';
    promoAppliedMsg.innerText = 'Code applied — 20% discount active.';
    showToast('20% discount applied!', 'success');
  } else if (code === '') {
    promoAppliedMsg.className = 'promo-status';
    promoAppliedMsg.innerText = '';
  } else {
    state.appliedPromo = null;
    state.discountPercent = 0;
    promoAppliedMsg.className = 'promo-status error';
    promoAppliedMsg.innerText = 'Invalid code. Try PEAKY10 or DEVOPS.';
    showToast('Invalid promo code.', 'error');
  }
  updateCartUI();
}

// =============================================
// PRODUCT COMPARE
// =============================================
function populateCompareDropdowns() {
  const options = state.products.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  compareSelect1.innerHTML = '<option value="">-- Choose Product 1 --</option>' + options;
  compareSelect2.innerHTML = '<option value="">-- Choose Product 2 --</option>' + options;
}

function updateCompareView() {
  const id1 = parseInt(compareSelect1.value);
  const id2 = parseInt(compareSelect2.value);

  if (isNaN(id1) || isNaN(id2)) {
    compareMatrixWrapper.style.display = 'none';
    compareEmptyState.style.display = 'flex';
    return;
  }

  const p1 = state.products.find(p => p.id === id1);
  const p2 = state.products.find(p => p.id === id2);
  if (!p1 || !p2) return;

  compareEmptyState.style.display = 'none';
  compareMatrixWrapper.style.display = 'block';

  document.getElementById('compare-header-1').innerText = p1.name;
  document.getElementById('compare-header-2').innerText = p2.name;
  document.getElementById('compare-img-1').innerHTML = `<img src="${p1.image}" alt="${p1.name}">`;
  document.getElementById('compare-img-2').innerHTML = `<img src="${p2.image}" alt="${p2.name}">`;
  document.getElementById('compare-price-1').innerText = formatPrice(p1.price);
  document.getElementById('compare-price-2').innerText = formatPrice(p2.price);
  document.getElementById('compare-cat-1').innerText = p1.category;
  document.getElementById('compare-cat-2').innerText = p2.category;
  document.getElementById('compare-rating-1').innerHTML = renderStars(getAverageRating(p1.id));
  document.getElementById('compare-rating-2').innerHTML = renderStars(getAverageRating(p2.id));
  document.getElementById('compare-desc-1').innerText = p1.description;
  document.getElementById('compare-desc-2').innerText = p2.description;
  document.getElementById('compare-action-1').innerHTML = `<button class="back-to-shop-btn" onclick="handleAddToCart(${p1.id})">Add to Cart</button>`;
  document.getElementById('compare-action-2').innerHTML = `<button class="back-to-shop-btn" onclick="handleAddToCart(${p2.id})">Add to Cart</button>`;

  lucide.createIcons();
}

// =============================================
// PRODUCT MODAL
// =============================================
function openProductModal(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  const avgRating = getAverageRating(product.id);
  const reviews = state.productReviews[product.id] || [];

  const reviewsHtml = reviews.length === 0
    ? '<p style="font-size:0.82rem;color:var(--text-muted)">No reviews yet. Be the first!</p>'
    : reviews.map(r => `
        <div class="review-item">
          <div class="review-header">
            <span class="reviewer-name">${r.name}</span>
            ${renderStars(r.rating)}
          </div>
          <p class="review-content">${r.text}</p>
        </div>
      `).join('');

  modalContent.innerHTML = `
    <div class="modal-img-wrapper">
      <img class="modal-img" src="${product.image}" alt="${product.name}">
    </div>
    <div class="modal-info-panel">
      <span class="modal-cat">${product.category}</span>
      <h3 class="modal-title">${product.name}</h3>
      <div style="margin-bottom:1rem">${renderStars(avgRating)}</div>
      <p class="modal-desc">${product.description}</p>
      <div class="modal-footer">
        <span class="modal-price">${formatPrice(product.price)}</span>
        <button class="modal-add-btn" onclick="handleAddToCartFromModal(${product.id})">
          <i data-lucide="shopping-cart"></i> Add to Bag
        </button>
      </div>
      <div class="modal-reviews-section">
        <h4>Customer Reviews (${reviews.length})</h4>
        <div class="reviews-list">${reviewsHtml}</div>
        <form class="write-review-form" onsubmit="handleReviewSubmit(event, ${product.id})">
          <div class="review-input-row">
            <input type="text" id="review-name-input" placeholder="Your name" required />
            <select id="review-stars-select">
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
          <div class="review-input-row">
            <input type="text" id="review-text-input" placeholder="Write your review..." required />
            <button type="submit" class="submit-review-btn">Submit</button>
          </div>
        </form>
      </div>
    </div>
  `;

  modalOverlay.classList.add('open');
  lucide.createIcons();
}

function closeProductModal() {
  modalOverlay.classList.remove('open');
}

function handleAddToCartFromModal(productId) {
  handleAddToCart(productId);
  closeProductModal();
}

function handleReviewSubmit(event, productId) {
  event.preventDefault();
  const name = document.getElementById('review-name-input').value.trim();
  const rating = parseInt(document.getElementById('review-stars-select').value);
  const text = document.getElementById('review-text-input').value.trim();

  if (!state.productReviews[productId]) state.productReviews[productId] = [];
  state.productReviews[productId].push({ name, rating, text });
  localStorage.setItem('peaky_reviews', JSON.stringify(state.productReviews));

  showToast('Review submitted. Thank you!', 'success');
  openProductModal(productId);
  renderProducts();
}

// =============================================
// CHECKOUT
// =============================================
function updateCheckoutSummary() {
  checkoutSummaryItems.innerHTML = state.cart.map(item => `
    <div class="summary-item-card">
      <div>
        <span class="summary-item-name">${item.name}</span>
        <span class="summary-item-qty">x${item.quantity}</span>
      </div>
      <span class="summary-item-price">${formatPrice(item.price * item.quantity)}</span>
    </div>
  `).join('');

  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  checkoutSubtotal.innerText = formatPrice(subtotal);

  if (state.discountPercent > 0) {
    const discount = subtotal * (state.discountPercent / 100);
    checkoutDiscountAmount.innerText = `-${formatPrice(discount)}`;
    checkoutDiscountRow.style.display = 'flex';
    checkoutTotal.innerText = formatPrice(subtotal - discount);
  } else {
    checkoutDiscountRow.style.display = 'none';
    checkoutTotal.innerText = formatPrice(subtotal);
  }
}

function handleCheckoutSubmit(event) {
  event.preventDefault();

  const first = document.getElementById('ship-first').value;
  const last = document.getElementById('ship-last').value;
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = subtotal * (state.discountPercent / 100);
  const total = subtotal - discount;

  const orderNo = `#PK-${Math.floor(Math.random() * 9000000) + 1000000}`;
  const orderDate = new Date().toLocaleDateString('en-IN');
  const productsSummary = state.cart.map(c => `${c.name} (x${c.quantity})`).join(', ');

  const orderRecord = { orderNo, date: orderDate, products: productsSummary, total: formatPrice(total) };
  state.orderHistory.unshift(orderRecord);
  localStorage.setItem('peaky_orders', JSON.stringify(state.orderHistory));

  document.getElementById('receipt-order-no').innerText = orderNo;
  document.getElementById('receipt-amount-paid').innerText = formatPrice(total);
  document.getElementById('receipt-ship-to').innerText = `${first} ${last}`;

  state.appliedPromo = null;
  state.discountPercent = 0;
  promoInput.value = '';
  promoAppliedMsg.className = 'promo-status';
  promoAppliedMsg.innerText = '';
  discountRow.style.display = 'none';

  clearCart();
  checkoutSuccessScreen.style.display = 'flex';
  lucide.createIcons();
}

function handleFinishCheckout() {
  checkoutSuccessScreen.style.display = 'none';
  checkoutForm.reset();
  renderOrderHistory();
  switchTab('shop-view');
}

async function clearCart() {
  try {
    for (const item of state.cart) {
      await fetch(`/api/cart/${item.id}`, { method: 'DELETE' });
    }
    state.cart = [];
    updateCartUI();
  } catch (err) {
    console.error('Error clearing cart:', err);
  }
}

// =============================================
// ORDER HISTORY
// =============================================
function renderOrderHistory() {
  if (state.orderHistory.length === 0) {
    orderTimeline.innerHTML = `<div class="empty-orders"><p>No orders placed yet.</p></div>`;
    return;
  }

  orderTimeline.innerHTML = state.orderHistory.map(o => `
    <div class="order-item-history">
      <div class="order-header-history">
        <span class="order-no">${o.orderNo}</span>
        <span class="order-date">${o.date}</span>
      </div>
      <p class="order-products">${o.products}</p>
      <div class="order-total-history">Total: ${o.total}</div>
    </div>
  `).join('');
}

// =============================================
// TOAST
// =============================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = { success: 'check-circle', error: 'alert-circle' };
  const icon = iconMap[type] || 'info';

  toast.innerHTML = `<i data-lucide="${icon}"></i><span>${message}</span>`;
  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
