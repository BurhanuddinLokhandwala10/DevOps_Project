import json
import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    """Test that the health check endpoint returns 200 and status healthy."""
    response = client.get('/health')
    assert response.status_code == 200
    data = json.loads(response.data.decode('utf-8'))
    assert data['status'] == 'healthy'

def test_get_all_products(client):
    """Test that GET /products returns all 8 products."""
    response = client.get('/products')
    assert response.status_code == 200
    data = json.loads(response.data.decode('utf-8'))
    assert isinstance(data, list)
    assert len(data) == 8
    assert data[0]['name'] == 'AeroSound Max'

def test_get_product_by_id(client):
    """Test that GET /products/<id> returns correct product."""
    response = client.get('/products/2')
    assert response.status_code == 200
    data = json.loads(response.data.decode('utf-8'))
    assert data['id'] == 2
    assert data['name'] == 'VeloSmart Watch'

def test_get_new_products(client):
    """Test that the 3 new products (ids 6, 7, 8) are present in the catalog."""
    for pid, name in [(6, 'KeyMaster Pro Mechanical Keyboard'), (7, 'NovaCam 4K Webcam'), (8, 'ErgoLift Monitor Stand')]:
        response = client.get(f'/products/{pid}')
        assert response.status_code == 200
        data = json.loads(response.data.decode('utf-8'))
        assert data['id'] == pid
        assert data['name'] == name


def test_get_product_not_found(client):
    """Test that GET /products/<id> returns 404 if product does not exist."""
    response = client.get('/products/999')
    assert response.status_code == 404
    data = json.loads(response.data.decode('utf-8'))
    assert 'error' in data

def test_metrics_endpoint(client):
    """Test that /metrics endpoint returns prometheus data."""
    # First query /products to trigger metric recording
    client.get('/products')
    
    response = client.get('/metrics')
    assert response.status_code == 200
    metrics_data = response.data.decode('utf-8')
    assert 'product_catalog_requests_total' in metrics_data
