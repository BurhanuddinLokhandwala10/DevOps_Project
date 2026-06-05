const fs = require('fs');

const cssPath = 'c:\\Users\\STA-MADH-54\\Documents\\DevOps Project Peaky Blinders\\frontend\\public\\style.css';

// Read existing style.css
const data = fs.readFileSync(cssPath, 'utf8');
const lines = data.split('\n');

// Keep only the lines before line 813 (index 812)
const baseCss = lines.slice(0, 812).join('\n');

// New Enterprise Header & Footer Styles
const enterpriseStyles = `
/* ==========================================
   TOP UTILITY BAR
========================================== */
.top-bar {
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-glass);
  height: 35px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 105;
}

.top-bar-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 1.5rem;
}

.top-bar-left, .top-bar-right {
  display: flex;
  gap: 1.5rem;
}

.top-bar-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-speed);
}

.top-bar-link:hover {
  color: var(--text-primary);
}

/* Navbar & Hero Overrides to accommodate Top Bar */
.navbar {
  top: 35px !important;
}

.hero {
  margin-top: 105px !important;
}

.app-view {
  padding-top: 35px !important;
}

#shop-view.app-view {
  padding-top: 0 !important;
}

/* ==========================================
   PREMIUM CORPORATE FOOTER (4-COLUMNS)
========================================== */
.footer-premium {
  background: #001539 !important; /* Deep corporate navy blue */
  color: #ffffff !important;
  padding: 5rem 0 3rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-family: var(--font-family);
  margin-top: 5rem;
}

.footer-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
  margin-bottom: 4rem;
}

.footer-col h4 {
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 1.5rem;
  color: #ffffff !important;
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-col ul li a {
  color: #b4c6e7 !important; /* Muted blue-white */
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  transition: color var(--transition-speed);
}

.footer-col ul li a:hover {
  color: #ffffff !important;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 2.5rem;
}

.footer-bottom-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media(min-width: 768px) {
  .footer-bottom-container {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}

.footer-logo-brand {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.footer-logo-text {
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: 1px;
  color: #ffffff;
}

.footer-powered {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #8da4cb;
}

.footer-right-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: flex-end;
}

.footer-socials {
  display: flex;
  gap: 1.5rem;
}

.footer-socials a {
  color: #b4c6e7 !important;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: color var(--transition-speed);
}

.footer-socials a:hover {
  color: #ffffff !important;
}

.footer-copyright-links {
  text-align: right;
}

.footer-copyright-links .copyright {
  font-size: 0.8rem;
  color: #8da4cb;
  margin-bottom: 0.5rem;
}

.legal-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-end;
}

.legal-links a {
  color: #b4c6e7 !important;
  text-decoration: none;
  font-size: 0.78rem;
  font-weight: 500;
  transition: color var(--transition-speed);
}

.legal-links a:hover {
  color: #ffffff !important;
}
`;

fs.writeFileSync(cssPath, baseCss + '\n' + enterpriseStyles, 'utf8');
console.log("CSS file updated to enterprise layout successfully!");
