const fs = require('fs');
const path = require('path');

const cssPath = 'c:\\Users\\STA-MADH-54\\Documents\\DevOps Project Peaky Blinders\\frontend\\public\\style.css';

// Read existing style.css
const data = fs.readFileSync(cssPath, 'utf8');
const lines = data.split('\n');

// Keep only the first 814 lines
const baseCss = lines.slice(0, 814).join('\n');

// New Storefront Styles
const newStyles = `
/* ==========================================
   MULTI-TAB SPA VIEW STYLING
========================================== */
.app-view {
  display: none;
  opacity: 0;
  transform: translateY(15px);
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.app-view.active {
  display: block;
  opacity: 1;
  transform: translateY(0);
}

.view-header {
  margin-bottom: 2rem;
  text-align: center;
}

.view-header .section-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--text-primary), var(--text-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-subtitle {
  color: var(--text-secondary);
  font-size: 1.05rem;
}

/* ==========================================
   NAVIGATION LINKS & TABS
========================================== */
.nav-links-container {
  display: none;
  gap: 0.5rem;
  align-items: center;
}

@media(min-width: 640px) {
  .nav-links-container {
    display: flex;
  }
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all var(--transition-speed);
}

.nav-tab i {
  width: 16px;
  height: 16px;
  stroke-width: 2px;
}

.nav-tab:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.04);
  border-color: var(--border-glass);
}

.nav-tab.active {
  color: var(--accent-cyan);
  background: rgba(0, 229, 255, 0.06);
  border-color: rgba(0, 229, 255, 0.15);
}

/* ==========================================
   THEME SWITCHING (LIGHT & DARK)
========================================== */
body.light-theme {
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f1f5f9;
  --bg-glass: rgba(255, 255, 255, 0.8);
  --bg-glass-hover: rgba(255, 255, 255, 0.95);
  
  --border-glass: rgba(15, 23, 42, 0.08);
  --border-glass-hover: rgba(15, 23, 42, 0.16);

  --accent-purple: #7c3aed;
  --accent-purple-glow: rgba(124, 58, 237, 0.15);
  --accent-cyan: #0891b2;
  --accent-cyan-glow: rgba(8, 145, 178, 0.15);
  
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
}

.theme-btn {
  width: 42px;
  height: 42px;
  border: 1px solid var(--border-glass);
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--text-primary);
  transition: all var(--transition-speed);
  margin-right: 0.5rem;
}

.theme-btn:hover {
  border-color: var(--accent-purple);
  box-shadow: 0 0 10px var(--accent-purple-glow);
}

.theme-btn .moon-icon { display: block; width: 18px; height: 18px; }
.theme-btn .sun-icon { display: none; width: 18px; height: 18px; }

body.light-theme .theme-btn .moon-icon { display: none; }
body.light-theme .theme-btn .sun-icon { display: block; }

/* ==========================================
   CURRENCY SWITCHER SELECTOR
========================================== */
.currency-selector {
  margin-right: 0.75rem;
}

.currency-selector select {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-glass);
  color: var(--text-primary);
  font-family: var(--font-family);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.55rem 0.8rem;
  border-radius: 10px;
  outline: none;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.currency-selector select:hover {
  border-color: var(--border-glass-hover);
}

.currency-selector select:focus {
  border-color: var(--accent-cyan);
}

body.light-theme .currency-selector select {
  background: #ffffff;
}

/* ==========================================
   WISHLIST GRID & CARDS
========================================== */
.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.card-actions-top {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  z-index: 5;
}

.wishlist-heart-btn {
  background: rgba(10, 11, 16, 0.6);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid var(--border-glass);
  color: #94a3b8;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.wishlist-heart-btn:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  transform: scale(1.05);
}

.wishlist-heart-btn.active {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
}

.wishlist-heart-btn.active svg {
  fill: currentColor;
}

.wishlist-heart-btn svg {
  width: 18px;
  height: 18px;
  stroke-width: 2.2px;
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 1rem;
  text-align: center;
  color: var(--text-secondary);
}

.empty-icon {
  width: 54px;
  height: 54px;
  color: var(--text-muted);
  margin-bottom: 1rem;
  stroke-width: 1.5px;
}

.empty-state h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.empty-state p {
  font-size: 0.95rem;
  color: var(--text-secondary);
  max-width: 400px;
  margin-bottom: 1.5rem;
}

.back-to-shop-btn, .back-to-shop-success-btn {
  background: linear-gradient(135deg, var(--accent-purple), #9d4edd);
  color: white;
  border: none;
  padding: 0.75rem 1.75rem;
  border-radius: 30px;
  font-family: var(--font-family);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.back-to-shop-btn:hover, .back-to-shop-success-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px var(--accent-purple-glow);
}

/* ==========================================
   PRODUCT COMPARE SPECTACLE
========================================== */
.compare-card-container {
  background: var(--bg-glass);
  border: 1px solid var(--border-glass);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.compare-selectors {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.select-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 260px;
}

.select-field label {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1.2px;
}

.select-field select {
  background: var(--bg-secondary);
  border: 1px solid var(--border-glass);
  color: var(--text-primary);
  font-family: var(--font-family);
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  outline: none;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.select-field select:hover {
  border-color: var(--border-glass-hover);
}

.select-field select:focus {
  border-color: var(--accent-cyan);
}

.select-divider {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-muted);
  padding-top: 1.25rem;
}

.compare-matrix-wrapper {
  overflow-x: auto;
  border-radius: 16px;
  border: 1px solid var(--border-glass);
  background: var(--bg-secondary);
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.compare-table th, .compare-table td {
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid var(--border-glass);
}

.compare-table th {
  background: rgba(255,255,255,0.02);
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.compare-table tr:last-child td {
  border-bottom: none;
}

.compare-table td.feature-name {
  font-weight: 800;
  color: var(--text-secondary);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  width: 20%;
  background: rgba(255,255,255,0.01);
}

.compare-img-cell img {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid var(--border-glass);
}

.compare-text-cell {
  line-height: 1.5;
  color: var(--text-secondary);
  font-size: 0.88rem;
}

.price-val {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
}

/* ==========================================
   USER PROFILE & TIMELINES
========================================== */
.profile-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

@media(min-width: 900px) {
  .profile-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.profile-card {
  background: var(--bg-glass);
  border: 1px solid var(--border-glass);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 15px 35px rgba(0,0,0,0.15);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.profile-card h3 {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.35rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-glass);
  padding-bottom: 0.8rem;
}

.profile-card h3 i {
  color: var(--accent-purple);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1.2rem;
}

.input-group label {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.input-group input {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-glass);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  font-family: var(--font-family);
  font-size: 0.9rem;
  outline: none;
  transition: all var(--transition-speed);
}

.input-group input:focus {
  border-color: var(--accent-purple);
  background: rgba(255, 255, 255, 0.05);
}

body.light-theme .input-group input {
  background: #ffffff;
}

.save-profile-btn {
  background: linear-gradient(135deg, var(--accent-purple), #9d4edd);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-family: var(--font-family);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-speed);
  margin-top: 1rem;
}

.save-profile-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--accent-purple-glow);
}

/* History order list timeline */
.order-timeline {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.order-item-history {
  border-left: 2px solid var(--accent-cyan);
  padding-left: 1.25rem;
  position: relative;
  transition: all var(--transition-speed);
}

.order-item-history::before {
  content: '';
  position: absolute;
  left: -7px;
  top: 3px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--bg-primary);
  border: 2px solid var(--accent-cyan);
  transition: all var(--transition-speed);
}

.order-header-history {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}

.order-no {
  font-weight: 700;
  font-size: 0.95rem;
}

.order-date {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.order-products {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 0.4rem;
}

.order-total-history {
  font-weight: 700;
  color: var(--accent-cyan);
  font-size: 0.9rem;
}

.empty-orders {
  text-align: center;
  padding: 2rem 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* ==========================================
   CHECKOUT INTERFACE
========================================== */
.checkout-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media(min-width: 900px) {
  .checkout-grid {
    grid-template-columns: 1.15fr 0.85fr;
  }
}

.checkout-card {
  background: var(--bg-glass);
  border: 1px solid var(--border-glass);
  border-radius: 24px;
  padding: 2.5rem;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.checkout-card h3 {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-glass);
  padding-bottom: 0.75rem;
}

.form-section-header {
  font-weight: 800;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--accent-cyan);
  margin-top: 1.25rem;
  margin-bottom: 1rem;
  border-bottom: 1px dashed var(--border-glass);
  padding-bottom: 0.4rem;
}

.submit-order-btn {
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(135deg, var(--accent-purple), #9d4edd);
  border: none;
  border-radius: 12px;
  color: white;
  font-family: var(--font-family);
  font-weight: 700;
  font-size: 0.98rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all var(--transition-speed);
  box-shadow: 0 4px 15px rgba(124, 77, 255, 0.2);
  margin-top: 1.5rem;
}

.submit-order-btn:hover {
  background: linear-gradient(135deg, #8c5ffc, #a85cfc);
  box-shadow: 0 6px 20px rgba(124, 77, 255, 0.4);
}

.checkout-summary-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-glass);
  padding-bottom: 1.25rem;
  max-height: 200px;
  overflow-y: auto;
}

.summary-item-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.summary-item-name {
  font-weight: 600;
}

.summary-item-qty {
  color: var(--text-muted);
  font-size: 0.78rem;
  margin-left: 0.4rem;
}

.summary-item-price {
  font-weight: 700;
}

/* Success Receipt cards */
.success-screen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(5, 6, 8, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 2500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.success-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-glass);
  border-radius: 24px;
  padding: 3rem 2rem;
  width: 100%;
  max-width: 480px;
  text-align: center;
  box-shadow: 0 25px 55px rgba(0,0,0,0.5);
  animation: popUpIn 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.success-icon-wrapper {
  width: 68px;
  height: 68px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.25);
  border-radius: 50%;
  color: #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem auto;
}

.success-icon-wrapper svg {
  width: 36px;
  height: 36px;
}

.success-card h2 {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.success-subtitle {
  color: var(--text-secondary);
  margin-bottom: 1.75rem;
  font-size: 0.9rem;
}

.receipt-box {
  background: var(--bg-primary);
  border: 1px solid var(--border-glass);
  border-radius: 14px;
  padding: 1.25rem;
  margin-bottom: 2rem;
  text-align: left;
}

.receipt-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 0.6rem;
  color: var(--text-secondary);
}

.receipt-row:last-child {
  margin-bottom: 0;
}

.bold-text {
  font-weight: 700;
  color: var(--text-primary);
}

@keyframes popUpIn {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* ==========================================
   RATINGS & CUSTOMER REVIEWS
========================================== */
.rating-stars {
  display: inline-flex;
  gap: 0.1rem;
  color: #f59e0b; /* rating gold */
}

.rating-stars svg {
  width: 13px;
  height: 13px;
  fill: currentColor;
}

.rating-stars svg.empty {
  color: var(--text-muted);
  fill: none;
}

/* Modal review feed layout */
.modal-reviews-section {
  margin-top: 1.75rem;
  border-top: 1px solid var(--border-glass);
  padding-top: 1.25rem;
}

.modal-reviews-section h4 {
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.reviews-list {
  max-height: 140px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1.25rem;
  padding-right: 0.4rem;
}

.review-item {
  background: var(--bg-primary);
  border: 1px solid var(--border-glass);
  border-radius: 10px;
  padding: 0.75rem 1rem;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.3;
}

.reviewer-name {
  font-weight: 700;
  font-size: 0.8rem;
  color: var(--text-primary);
}

.review-content {
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.write-review-form {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.review-input-row {
  display: flex;
  gap: 0.5rem;
}

.review-input-row input {
  flex-grow: 1;
  background: var(--bg-primary);
  border: 1px solid var(--border-glass);
  border-radius: 8px;
  padding: 0.5rem 0.8rem;
  color: var(--text-primary);
  font-family: var(--font-family);
  font-size: 0.8rem;
  outline: none;
}

.review-input-row input:focus, .review-input-row select:focus {
  border-color: var(--accent-cyan);
}

.review-input-row select {
  background: var(--bg-primary);
  border: 1px solid var(--border-glass);
  border-radius: 8px;
  padding: 0.5rem 0.8rem;
  color: var(--text-primary);
  font-family: var(--font-family);
  font-size: 0.8rem;
  outline: none;
  cursor: pointer;
}

.submit-review-btn {
  align-self: flex-end;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-glass);
  color: var(--text-primary);
  padding: 0.4rem 1.2rem;
  border-radius: 20px;
  font-family: var(--font-family);
  font-weight: 600;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.submit-review-btn:hover {
  background: rgba(255,255,255,0.06);
  color: var(--accent-cyan);
  border-color: var(--accent-cyan);
}

/* ==========================================
   PROMO CODE SYSTEM
========================================== */
.promo-code-section {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.25rem;
  margin-bottom: 0.25rem;
  padding-top: 1rem;
  border-top: 1px dashed rgba(255, 255, 255, 0.06);
}

.promo-code-section input {
  flex-grow: 1;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-glass);
  border-radius: 8px;
  padding: 0.5rem 0.8rem;
  color: var(--text-primary);
  font-family: var(--font-family);
  font-size: 0.85rem;
  outline: none;
  transition: all var(--transition-speed);
}

.promo-code-section input:focus {
  border-color: var(--accent-cyan);
  background: rgba(255, 255, 255, 0.05);
}

.promo-code-section button {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-glass);
  color: var(--text-primary);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-family: var(--font-family);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.promo-code-section button:hover {
  background: rgba(255,255,255,0.08);
  border-color: var(--accent-cyan);
  color: var(--accent-cyan);
}

.promo-msg {
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.promo-msg.success { color: #4ade80; }
.promo-msg.error { color: #f87171; }
.discount-color { color: #4ade80; font-weight: 700; }
`;

// Write the combined CSS
fs.writeFileSync(cssPath, baseCss + '\n' + newStyles, 'utf8');
console.log("CSS file rewritten successfully!");
