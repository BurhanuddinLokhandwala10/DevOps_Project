const express = require('express');
const cors = require('cors');
const client = require('prom-client');

const app = express();
app.use(express.json());
app.use(cors());

// Prometheus Metrics registry and instruments
const registry = new client.Registry();
client.collectDefaultMetrics({ register: registry });

const httpRequestCounter = new client.Counter({
  name: 'shopping_cart_requests_total',
  help: 'Total HTTP requests to the Shopping Cart API',
  labelNames: ['method', 'route', 'status_code'],
  registers: [registry]
});

const httpRequestDuration = new client.Histogram({
  name: 'shopping_cart_request_duration_seconds',
  help: 'HTTP request duration in seconds for Shopping Cart API',
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

// In-memory data store for the shopping cart
// Elements in array will look like: { id: 1, name: "Product Name", price: 99.99, quantity: 2 }
let cartItems = [];

// GET /cart
app.get('/cart', (req, res) => {
  res.status(200).json(cartItems);
});

// POST /cart
app.post('/cart', (req, res) => {
  const { id, name, price, quantity } = req.body;
  
  if (!id || !name || price === undefined || !quantity) {
    return res.status(400).json({ error: 'Missing required item details (id, name, price, quantity)' });
  }

  const existingItemIndex = cartItems.findIndex(item => item.id === id);
  if (existingItemIndex > -1) {
    cartItems[existingItemIndex].quantity += parseInt(quantity);
  } else {
    cartItems.push({
      id,
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity)
    });
  }

  res.status(201).json(cartItems);
});

// DELETE /cart/:id
app.delete('/cart/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const existingItemIndex = cartItems.findIndex(item => item.id === itemId);

  if (existingItemIndex === -1) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }

  // Remove the item from the cart
  cartItems = cartItems.filter(item => item.id !== itemId);
  res.status(200).json(cartItems);
});

// GET /health
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// GET /metrics
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', registry.contentType);
  res.send(await registry.metrics());
});

// Export app for unit tests
module.exports = app;

// Listen only if run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, () => {
    console.log(`Shopping Cart API listening on port ${PORT}`);
  });
}
