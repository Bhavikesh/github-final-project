import os
import sys
import time
import subprocess
import requests

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PYTHON_BIN = os.path.join(BASE_DIR, ".venv", "bin", "python")

def run_smoke_test():
    print("=== STARTING FULL LOCAL INTEGRATION SMOKE TEST ===")
    
    # 1. Start products_list (port 5002)
    print("Starting products_list microservice (port 5002)...")
    env_prod = os.environ.copy()
    env_prod["PORT"] = "5002"
    p_prod = subprocess.Popen(
        [PYTHON_BIN, os.path.join(BASE_DIR, "products_list", "app.py")],
        cwd=os.path.join(BASE_DIR, "products_list"),
        env=env_prod,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

    # 2. Start dealer_details (port 8080)
    print("Starting dealer_details microservice (port 8080)...")
    env_8080 = os.environ.copy()
    env_8080["PORT"] = "8080"
    p_dealer = subprocess.Popen(
        ["node", "server.js"],
        cwd=os.path.join(BASE_DIR, "dealer_details"),
        env=env_8080,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

    # 3. Start frontend (port 5001)
    print("Starting frontend microservice (port 5001)...")
    env_5001 = os.environ.copy()
    env_5001["PORT"] = "5001"
    p_front = subprocess.Popen(
        [PYTHON_BIN, os.path.join(BASE_DIR, "dealer_evaluation_frontend", "app.py")],
        cwd=os.path.join(BASE_DIR, "dealer_evaluation_frontend"),
        env=env_5001,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

    processes = [p_prod, p_dealer, p_front]

    try:
        # Wait up to 10 seconds for services to become available
        print("Waiting for all microservices to start...")
        urls = [
            ("products_list", "http://127.0.0.1:5002/products"),
            ("dealer_details", "http://127.0.0.1:8080/allprice/Mouse"),
            ("frontend", "http://127.0.0.1:5001/")
        ]

        for name, url in urls:
            connected = False
            for attempt in range(20):
                try:
                    r = requests.get(url, timeout=1)
                    if r.status_code == 200:
                        connected = True
                        print(f"✓ {name} is up and responding at {url}")
                        break
                except Exception:
                    time.sleep(0.5)
            if not connected:
                raise RuntimeError(f"Service {name} failed to respond at {url}")

        print("\n--- Validating API Endpoints ---")

        # Test 1: GET /products
        res = requests.get("http://127.0.0.1:5002/products")
        assert res.status_code == 200, f"Expected 200, got {res.status_code}"
        prods = res.json().get("products", [])
        assert len(prods) == 4, f"Expected 4 products, got {prods}"
        print(f"✓ GET /products returned: {prods}")

        # Test 2: GET /getdealers/Laptop
        res = requests.get("http://127.0.0.1:5002/getdealers/Laptop")
        assert res.status_code == 200
        dealers = res.json().get("dealers", [])
        assert "GH Computers" in dealers
        print(f"✓ GET /getdealers/Laptop returned dealers: {dealers}")

        # Test 3: GET /price/Binglee/Headphones
        res = requests.get("http://127.0.0.1:8080/price/Binglee/Headphones")
        assert res.status_code == 200
        msg = res.json().get("message", "")
        assert "Headphones costs $30 at Binglee" == msg
        print(f"✓ GET /price/Binglee/Headphones returned: {msg}")

        # Test 4: GET /allprice/Laptop
        res = requests.get("http://127.0.0.1:8080/allprice/Laptop")
        assert res.status_code == 200
        prices = res.json().get("prices", [])
        assert len(prices) >= 3
        print(f"✓ GET /allprice/Laptop returned {len(prices)} dealer prices: {prices}")

        # Test 5: GET / (Frontend Homepage)
        res = requests.get("http://127.0.0.1:5001/")
        assert res.status_code == 200
        assert "Products price comparison" in res.text
        assert "prod_dd" in res.text
        assert "dealers" in res.text
        assert "pricing" in res.text
        print("✓ Frontend serves homepage with comparison DOM elements correctly.")

        print("\n🎉 ALL LOCAL SMOKE TESTS PASSED SUCCESSFULLY!")

    finally:
        print("\nShutting down test microservices...")
        for p in processes:
            p.terminate()
            p.wait()
        print("All test servers terminated.")

if __name__ == "__main__":
    run_smoke_test()
