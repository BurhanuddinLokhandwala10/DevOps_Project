const express = require('express');
const path = require('path');
const client = require('prom-client');

const app = express();
app.use(express.json());

// Load backend service URLs from environment variables
const PRODUCT_CATALOG_URL = process.env.PRODUCT_CATALOG_URL || 'http://localhost:5001';
const SHOPPING_CART_URL = process.env.SHOPPING_CART_URL || 'http://localhost:5002';

// Chaos Mode Flag
let chaosMode = false;

// Serve static assets from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Prometheus Metrics registry and instrumentation
const registry = new client.Registry();
client.collectDefaultMetrics({ register: registry });

const httpRequestCounter = new client.Counter({
  name: 'frontend_requests_total',
  help: 'Total HTTP requests to the Frontend server',
  labelNames: ['method', 'route', 'status_code'],
  registers: [registry]
});

const httpRequestDuration = new client.Histogram({
  name: 'frontend_request_duration_seconds',
  help: 'HTTP request duration in seconds for Frontend server',
  labelNames: ['method', 'route'],
  registers: [registry]
});

// Middleware for request timing and counts
app.use((req, res, next) => {
  if (req.path === '/metrics' || req.path === '/health') {
    return next();
  }
  const end = httpRequestDuration.startTimer({ method: req.method, route: req.path });
  
  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status_code: res.statusCode
    });
    end();
  });
  next();
});

// BFF Proxies using native Node.js fetch (Node 18+)

// Proxy to Product Catalog API
app.get('/api/products', async (req, res) => {
  if (chaosMode) {
    return res.status(502).json({ error: 'Chaos Mode Active: Product Catalog service is unavailable' });
  }
  try {
    const response = await fetch(`${PRODUCT_CATALOG_URL}/products`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(502).json({ error: 'Product Catalog service is unavailable' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  if (chaosMode) {
    return res.status(502).json({ error: 'Chaos Mode Active: Product Catalog service is unavailable' });
  }
  try {
    const response = await fetch(`${PRODUCT_CATALOG_URL}/products/${req.params.id}`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(502).json({ error: 'Product Catalog service is unavailable' });
  }
});

// Proxy to Shopping Cart API
app.get('/api/cart', async (req, res) => {
  if (chaosMode) {
    return res.status(502).json({ error: 'Chaos Mode Active: Shopping Cart service is unavailable' });
  }
  try {
    const response = await fetch(`${SHOPPING_CART_URL}/cart`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(502).json({ error: 'Shopping Cart service is unavailable' });
  }
});

app.post('/api/cart', async (req, res) => {
  if (chaosMode) {
    return res.status(502).json({ error: 'Chaos Mode Active: Shopping Cart service is unavailable' });
  }
  try {
    const response = await fetch(`${SHOPPING_CART_URL}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(502).json({ error: 'Shopping Cart service is unavailable' });
  }
});

app.delete('/api/cart/:id', async (req, res) => {
  if (chaosMode) {
    return res.status(502).json({ error: 'Chaos Mode Active: Shopping Cart service is unavailable' });
  }
  try {
    const response = await fetch(`${SHOPPING_CART_URL}/cart/${req.params.id}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error deleting from cart:', error);
    res.status(502).json({ error: 'Shopping Cart service is unavailable' });
  }
});

// Chaos Mode Control Endpoints
app.post('/api/chaos/toggle', (req, res) => {
  chaosMode = !chaosMode;
  res.status(200).json({ chaosMode });
});

app.get('/api/chaos/status', (req, res) => {
  res.status(200).json({ chaosMode });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', registry.contentType);
  res.send(await registry.metrics());
});

// Fallback to serve index.html for frontend routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export app for testing
module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Frontend BFF Server running on port ${PORT}`);
    console.log(`Configured Catalog API URL: ${PRODUCT_CATALOG_URL}`);
    console.log(`Configured Cart API URL: ${SHOPPING_CART_URL}`);
  });
}
