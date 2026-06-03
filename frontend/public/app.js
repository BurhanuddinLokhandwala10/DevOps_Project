// Global application state
let state = {
  products: [],
  cart: [],
  activeCategory: 'all',
  searchQuery: ''
};

// Elements
const productGrid = document.getElementById('product-grid');
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
const categoryButtons = document.querySelectorAll('.filter-btn');

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
  init();
});

async function init() {
  // Fetch initial products and cart
  await Promise.all([
    fetchProducts(),
    fetchCart()
  ]);
  
  // Setup Event Listeners
  setupEventListeners();
  
  // Initialize Lucide Icons
  lucide.createIcons();
}

// Fetch products from BFF
async function fetchProducts() {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Failed to load products');
    state.products = await res.ok ? await res.json() : [];
    renderProducts();
  } catch (err) {
    console.error('Error fetching products:', err);
    renderErrorState();
  }
}

// Fetch cart list from BFF
async function fetchCart() {
  try {
    const res = await fetch('/api/cart');
    if (!res.ok) throw new Error('Failed to load shopping cart');
    state.cart = await res.json();
    updateCartUI();
  } catch (err) {
    console.error('Error fetching cart:', err);
    showToast('Failed to connect to Shopping Cart service.', 'error');
  }
}

// Setup user interactions
function setupEventListeners() {
  // Drawer Toggle
  cartToggleBtn.addEventListener('click', toggleCartDrawer);
  cartCloseBtn.addEventListener('click', toggleCartDrawer);
  cartOverlay.addEventListener('click', toggleCartDrawer);
  
  if (shopNowBtn) {
    shopNowBtn.addEventListener('click', () => {
      toggleCartDrawer();
      document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Category Filtering
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      state.activeCategory = e.target.dataset.category;
      renderProducts();
    });
  });

  // Search Filtering
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.toLowerCase().trim();
    renderProducts();
  });

  // Checkout Sim
  checkoutBtn.addEventListener('click', () => {
    if (state.cart.length === 0) return;
    showToast('Thank you for your order! Checkout simulated successfully.', 'success');
    clearCart();
  });
}

function toggleCartDrawer() {
  cartDrawer.classList.toggle('open');
  cartOverlay.classList.toggle('open');
}

// Render product catalog cards
function renderProducts() {
  // Filter products based on search & category
  const filtered = state.products.filter(p => {
    const matchesCategory = state.activeCategory === 'all' || p.category.toLowerCase() === state.activeCategory.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(state.searchQuery) || p.description.toLowerCase().includes(state.searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    productGrid.innerHTML = `
      <div class="error-state">
        <i data-lucide="package-search"></i>
        <h3>No products found</h3>
        <p>Try resetting filters or adjusting search terms</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  productGrid.innerHTML = filtered.map(p => `
    <div class="product-card" id="product-${p.id}">
      <div class="product-img-wrapper">
        <img class="product-img" src="${p.image}" alt="${p.name}">
        <span class="product-category-tag">${p.category}</span>
      </div>
      <div class="product-info">
        <h3 class="product-title">${p.name}</h3>
        <p class="product-desc">${p.description}</p>
        <div class="product-footer">
          <span class="product-price">$${p.price.toFixed(2)}</span>
          <button class="add-to-cart-btn" onclick="handleAddToCart(${p.id})">
            <i data-lucide="plus"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

function renderErrorState() {
  productGrid.innerHTML = `
    <div class="error-state">
      <i data-lucide="alert-triangle"></i>
      <h3>Failed to load products</h3>
      <p>The product catalog microservice could not be reached.</p>
      <button class="retry-btn" onclick="fetchProducts()">Retry Connection</button>
    </div>
  `;
  lucide.createIcons();
}

// Click listener to add item to cart API
async function handleAddToCart(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  try {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      })
    });

    if (!res.ok) throw new Error('Could not add item to cart');
    
    state.cart = await res.json();
    updateCartUI();
    showToast(`Added ${product.name} to bag!`, 'success');
    
    // Add badge pop micro-animation
    cartCount.classList.add('pop');
    setTimeout(() => cartCount.classList.remove('pop'), 300);

  } catch (err) {
    console.error('Error adding item:', err);
    showToast('Failed to add item to shopping cart.', 'error');
  }
}

// Click listener to remove item from cart API
async function handleRemoveFromCart(productId) {
  try {
    const res = await fetch(`/api/cart/${productId}`, {
      method: 'DELETE'
    });

    if (!res.ok) throw new Error('Could not remove item from cart');
    
    state.cart = await res.json();
    updateCartUI();
    showToast('Item removed from bag.', 'success');

  } catch (err) {
    console.error('Error removing item:', err);
    showToast('Failed to remove item.', 'error');
  }
}

// Update the Cart Drawer & badge UI
function updateCartUI() {
  // Update badge count
  const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.innerText = totalCount;
  
  if (state.cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart-state">
        <i data-lucide="shopping-basket" class="empty-cart-icon"></i>
        <p>Your shopping bag is empty</p>
        <button class="shop-now-btn" id="shop-now-btn-empty">Start Shopping</button>
      </div>
    `;
    cartFooter.style.display = 'none';
    
    const shopBtn = document.getElementById('shop-now-btn-empty');
    if (shopBtn) {
      shopBtn.addEventListener('click', () => {
        toggleCartDrawer();
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
      });
    }
  } else {
    cartFooter.style.display = 'block';
    cartItemsContainer.innerHTML = state.cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          <div class="cart-item-qty">
            <span>Quantity: ${item.quantity}</span>
          </div>
        </div>
        <button class="item-remove-btn" onclick="handleRemoveFromCart(${item.id})">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    `).join('');
    
    // Calculate and render pricing
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartSubtotal.innerText = `$${subtotal.toFixed(2)}`;
    cartTotal.innerText = `$${subtotal.toFixed(2)}`;
  }
  
  lucide.createIcons();
}

// Simulate clearing the cart (e.g. after checkout)
async function clearCart() {
  try {
    for (const item of state.cart) {
      await fetch(`/api/cart/${item.id}`, { method: 'DELETE' });
    }
    state.cart = [];
    updateCartUI();
    toggleCartDrawer();
  } catch (err) {
    console.error('Error clearing cart:', err);
  }
}

// Toast notification helper
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'info';
  if (type === 'success') icon = 'check-circle';
  if (type === 'error') icon = 'alert-circle';
  
  toast.innerHTML = `
    <i data-lucide="${icon}"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  lucide.createIcons();
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
