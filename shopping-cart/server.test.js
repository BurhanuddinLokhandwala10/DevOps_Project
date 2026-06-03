const request = require('supertest');
const app = require('./server');
const { resetCart } = require('./server');

describe('Shopping Cart API', () => {
  beforeEach(() => {
    resetCart();
  });

  it('GET /health should return status healthy', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'healthy');
  });

  it('GET /cart should return an empty cart initially', async () => {
    const res = await request(app).get('/cart');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it('POST /cart should add an item', async () => {
    const res = await request(app)
      .post('/cart')
      .send({ id: 1, name: 'AeroSound Max', price: 199.99, quantity: 1 });
    expect(res.statusCode).toEqual(201);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].name).toEqual('AeroSound Max');
  });

  it('POST /cart should increment quantity of existing item', async () => {
    // Seed: add item with qty 1 first
    await request(app)
      .post('/cart')
      .send({ id: 1, name: 'AeroSound Max', price: 199.99, quantity: 1 });
    // Now add 2 more of the same item — quantity should become 3
    const res = await request(app)
      .post('/cart')
      .send({ id: 1, name: 'AeroSound Max', price: 199.99, quantity: 2 });
    expect(res.statusCode).toEqual(201);
    const cartItem = res.body.find(item => item.id === 1);
    expect(cartItem.quantity).toEqual(3);
  });

  it('POST /cart should return 400 if validation fails', async () => {
    const res = await request(app)
      .post('/cart')
      .send({ id: 2, name: 'VeloSmart Watch' }); // Missing price and quantity
    expect(res.statusCode).toEqual(400);
  });

  it('DELETE /cart/:id should remove the item', async () => {
    // Seed: add item with ID 1 first
    await request(app)
      .post('/cart')
      .send({ id: 1, name: 'AeroSound Max', price: 199.99, quantity: 1 });
    // Now delete it
    const res = await request(app).delete('/cart/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body.find(item => item.id === 1)).toBeUndefined();
  });

  it('DELETE /cart/:id should return 404 if item not in cart', async () => {
    const res = await request(app).delete('/cart/999');
    expect(res.statusCode).toEqual(404);
  });

  it('GET /metrics should return Prometheus metrics', async () => {
    const res = await request(app).get('/metrics');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('shopping_cart_requests_total');
  });
});
