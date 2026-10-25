import pytest
import os
import sys

# Ensure products_list directory is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "products_list"))

from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_get_products(client):
    response = client.get("/products")
    assert response.status_code == 200
    data = response.get_json()
    assert "products" in data
    assert isinstance(data["products"], list)
    assert "Headphones" in data["products"]
    assert "Laptop" in data["products"]
    assert "Mouse" in data["products"]
    assert "Printer" in data["products"]

def test_get_dealers_valid_product(client):
    response = client.get("/getdealers/Headphones")
    assert response.status_code == 200
    data = response.get_json()
    assert "dealers" in data
    assert isinstance(data["dealers"], list)
    assert "Binglee" in data["dealers"]
    assert "DXC Electronics" in data["dealers"]
    assert "Bobay" in data["dealers"]

def test_get_dealers_case_insensitive(client):
    response = client.get("/getdealers/laptop")
    assert response.status_code == 200
    data = response.get_json()
    assert "dealers" in data
    assert "GH Computers" in data["dealers"]

def test_get_dealers_invalid_product(client):
    response = client.get("/getdealers/NonExistentProductXYZ")
    assert response.status_code == 200
    data = response.get_json()
    assert "message" in data
    assert data["message"] == "Could not find dealers for this product"
