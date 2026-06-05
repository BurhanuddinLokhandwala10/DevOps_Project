import time
from flask import Flask, jsonify, request, Response
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST

app = Flask(__name__)

# Prometheus Metrics definition
REQUEST_COUNT = Counter(
    'product_catalog_requests_total',
    'Total HTTP requests to the Product Catalog API',
    ['method', 'endpoint', 'status_code']
)
REQUEST_LATENCY = Histogram(
    'product_catalog_request_duration_seconds',
    'HTTP request duration in seconds for Product Catalog API',
    ['method', 'endpoint']
)

# Mock database of products
PRODUCTS = [
    {
        "id": 1,
        "name": "AeroSound Max",
        "price": 199.99,
        "description": "Premium noise-cancelling over-ear wireless headphones with immersive high-fidelity audio.",
        "category": "Electronics",
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
    },
    {
        "id": 2,
        "name": "VeloSmart Watch",
        "price": 249.99,
        "description": "Sleek active fitness tracker and smartwatch with continuous bio-tracking and 7-day battery.",
        "category": "Wearables",
        "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
    },
    {
        "id": 3,
        "name": "Lumino Smart Bulb",
        "price": 59.99,
        "description": "Wi-Fi enabled smart LED bulb featuring millions of colors, voice control, and automation schedules.",
        "category": "Smart Home",
        "image": "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=600&auto=format&fit=crop&q=80"
    },
    {
        "id": 4,
        "name": "Zenith Laptop Backpack",
        "price": 89.99,
        "description": "Minimalist waterproof everyday backpack featuring a dedicated shockproof 16-inch laptop pocket.",
        "category": "Accessories",
        "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80"
    },
    {
        "id": 5,
        "name": "Chronos Desk Pad",
        "price": 34.99,
        "description": "Ultra-thick, organic merino wool felt desk mat designed to protect your desk and elevate mouse glide.",
        "category": "Office Gear",
        "image": "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80"
    },
    {
        "id": 6,
        "name": "KeyMaster Pro Mechanical Keyboard",
        "price": 139.99,
        "description": "Compact TKL mechanical keyboard with Cherry MX Red switches, per-key RGB backlighting, and aircraft-grade aluminium frame.",
        "category": "Electronics",
        "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80"
    },
    {
        "id": 7,
        "name": "NovaCam 4K Webcam",
        "price": 119.99,
        "description": "Ultra-sharp 4K/30fps webcam with auto-focus, HDR, dual built-in noise-cancelling mics, and privacy shutter for pro-grade video calls.",
        "category": "Electronics",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80"
    },
    {
        "id": 8,
        "name": "ErgoLift Monitor Stand",
        "price": 74.99,
        "description": "Height-adjustable solid bamboo monitor riser with built-in USB-A hub, cable management tray, and anti-slip padding.",
        "category": "Office Gear",
        "image": "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&auto=format&fit=crop&q=80"
    }
]

@app.before_request
def start_timer():
    request.start_time = time.time()

@app.after_request
def log_request(response):
    # Skip logging metrics requests to avoid scraping noise
    if request.path == '/metrics':
        return response

    if hasattr(request, 'start_time'):
        latency = time.time() - request.start_time
        # Record metrics
        endpoint = request.url_rule.rule if request.url_rule else request.path
        REQUEST_COUNT.labels(
            method=request.method,
            endpoint=endpoint,
            status_code=response.status_code
        ).inc()
        REQUEST_LATENCY.labels(
            method=request.method,
            endpoint=endpoint
        ).observe(latency)
    return response

# CORS Headers helper
@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/products', methods=['GET'])
def get_products():
    return jsonify(PRODUCTS)

@app.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = next((p for p in PRODUCTS if p["id"] == product_id), None)
    if product is None:
        return jsonify({"error": "Product not found"}), 404
    return jsonify(product)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/metrics', methods=['GET'])
def metrics():
    return Response(generate_latest(), mimetype=CONTENT_TYPE_LATEST)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
