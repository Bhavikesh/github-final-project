# Dealer Evaluation Application — Final Project Submission

This repository contains the completed final project for the Coursera / IBM Developer Skills Network course: **Dealer Evaluation Application**.

The application is built on a distributed microservices architecture consisting of three core services:
1. **Python Product Details Microservice**: Catalog management and dealer lookup per product.
2. **Node.js Dealer Pricing Microservice**: Dealer quotes and aggregated price comparison across dealerships.
3. **Dealer Evaluation Frontend Microservice**: Dynamic web user interface providing interactive product selection and real-time dealer price comparison.

---

## Architecture Overview

```
+-------------------------------------------------------+
|              Client Web Browser                       |
|           (http://localhost:5001/)                    |
+-------------------------------------------------------+
             |                               |
             | (Axios GET /products,         | (Axios GET /price/...,
             |  /getdealers/<product>)       |  /allprice/<product>)
             v                               v
+-----------------------------+   +-----------------------------+
|   Python Product Details    |   |     Node.js Dealer Pricing  |
|        Microservice         |   |         Microservice        |
|    Flask / Port 5002        |   |     Express / Port 8080     |
|   (Container Port 5000)     |   |    (Container Port 8080)    |
+-----------------------------+   +-----------------------------+
             |                               |
             v                               v
    [products.json]                 [dealers.json]
```

### Microservices Details
* **Python Product Details Service** (`products_list`):
  - Built with Python 3 and Flask with Flask-CORS.
  - Exposes catalog endpoints to list available products and query which dealers stock a selected item.
  - Data stored in `products.json`.
* **Node.js Dealer Pricing Service** (`dealer_details`):
  - Built with Node.js and Express with CORS middleware.
  - Exposes endpoints to query pricing for a given product from a specific dealer or all dealers simultaneously.
  - Data stored in `utils/dealers.json`.
* **Dealer Evaluation Frontend Service** (`dealer_evaluation_frontend`):
  - Lightweight Python / Flask static file server rendering `html/index.html`.
  - Communicates asynchronously via Axios with both backend services to dynamically update dropdown menus and pricing tables.

---

## Repository Structure

```
.
├── dealer_details/                # Node.js Dealer Pricing Microservice
│   ├── Dockerfile                 # Container specification
│   ├── package.json               # Node.js dependencies
│   ├── package-lock.json          # Dependency lockfile
│   ├── server.js                  # Express API server
│   └── utils/
│       └── dealers.json           # Dealer pricing database
├── dealer_evaluation_frontend/    # Frontend Web Client
│   ├── Dockerfile                 # Container specification
│   ├── app.py                     # Flask server serving web assets
│   ├── html/
│   │   └── index.html             # UI with Axios client integration
│   ├── products.json              # Catalog schema reference
│   └── requirements.txt           # Python dependencies
├── products_list/                 # Python Product Details Microservice
│   ├── Dockerfile                 # Container specification
│   ├── app.py                     # Flask catalog API server
│   ├── products.json              # Product catalog database
│   └── requirements.txt           # Python dependencies
├── docker-compose.yml             # Orchestration for all 3 microservices
├── screenshots/                   # Mandatory Coursera submission evidence
│   ├── product_details_deploy.png
│   ├── dealer_details_deploy.png
│   ├── git_clone.png
│   ├── index_urlchanges.png
│   ├── frontend_deploy.png
│   ├── homepage.png
│   ├── product_dealer.png
│   ├── product_dealer_price.png
│   └── product_all_dealers_prices.png
├── scripts/                       # Automation and validation utilities
│   ├── capture_ui_screenshots.js  # Automated browser screenshot capture
│   ├── generate_terminal_screenshots.js
│   ├── smoke_test.py              # End-to-end integration test
│   └── start_services.sh          # Local process manager
└── tests/                         # Unit and validation test suites
    ├── test_dealer_details.js     # Node.js API test suite
    ├── test_products_list.py      # Pytest API test suite
    └── validate_json.py           # JSON schema & integrity validator
```

---

## Prerequisites

* **Python**: 3.9+ (with `venv` support)
* **Node.js**: 16+ or 18+ and `npm`
* **Docker & Docker Compose**: (OrbStack, Docker Desktop, or compatible container engine)
* **cURL** or standard HTTP client

---

## Local Installation & Execution

### 1. Python Environment Setup
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r products_list/requirements.txt requests pytest
```

### 2. Node.js Environment Setup
```bash
cd dealer_details
npm install
cd ..
```

### 3. Running Services Directly
* **Product Details Service**:
  ```bash
  PORT=5002 .venv/bin/python products_list/app.py
  ```
* **Dealer Details Service**:
  ```bash
  cd dealer_details && PORT=8080 node server.js
  ```
* **Frontend Service**:
  ```bash
  cd dealer_evaluation_frontend && PORT=5001 ../.venv/bin/python app.py
  ```

---

## Docker Build and Orchestration

All three microservices can be built and started in one command using Docker Compose:

```bash
# Build and start all services in detached mode
docker compose up -d --build

# View container status
docker compose ps

# Stop all services
docker compose down
```

### Container Port Mapping
| Service | Container Port | Host Port | Endpoint |
|---|---|---|---|
| `products_list` | 5000 | 5002 | `http://localhost:5002/products` |
| `dealer_details` | 8080 | 8080 | `http://localhost:8080/price/Binglee/Headphones` |
| `frontend` | 5001 | 5001 | `http://localhost:5001/` |

---

## API Endpoint Reference

### Python Product Details Microservice (Port 5002)

#### 1. `GET /products`
Returns an array of all available product names.
* **Sample Request**: `curl -s http://localhost:5002/products`
* **Sample Response**:
  ```json
  {
    "products": [
      "Headphones",
      "Laptop",
      "Mouse",
      "Printer"
    ]
  }
  ```

#### 2. `GET /getdealers/<product>`
Returns dealers who stock the requested product.
* **Sample Request**: `curl -s http://localhost:5002/getdealers/Laptop`
* **Sample Response**:
  ```json
  {
    "dealers": [
      "GH Computers",
      "Tech city",
      "Ez PC"
    ]
  }
  ```

---

### Node.js Dealer Pricing Microservice (Port 8080)

#### 1. `GET /price/:dealer/:product`
Returns the pricing message for a specific dealer and product.
* **Sample Request**: `curl -s http://localhost:8080/price/Binglee/Headphones`
* **Sample Response**:
  ```json
  {
    "message": "Headphones costs $30 at Binglee"
  }
  ```

#### 2. `GET /allprice/:product`
Returns quotes from all dealers offering the selected product.
* **Sample Request**: `curl -s http://localhost:8080/allprice/Headphones`
* **Sample Response**:
  ```json
  {
    "prices": [
      { "key": "Binglee", "value": "$30" },
      { "key": "DXC Electronics", "value": "$20" },
      { "key": "Bobay", "value": "$20" }
    ]
  }
  ```

---

## IBM Cloud Code Engine Deployment

When deploying to IBM Cloud Code Engine:

1. **Log in to IBM Cloud**:
   ```bash
   ibmcloud login --apikey <YOUR_API_KEY> -r <REGION> -g <RESOURCE_GROUP>
   ```
2. **Target your Code Engine project**:
   ```bash
   ibmcloud ce project select --name <PROJECT_NAME>
   ```
3. **Deploy the Product Details Microservice**:
   ```bash
   ibmcloud ce app create --name prodlist \
     --build-source . --build-context-dir products_list \
     --port 5000
   ```
4. **Deploy the Dealer Pricing Microservice**:
   ```bash
   ibmcloud ce app create --name dealerdetails \
     --build-source . --build-context-dir dealer_details \
     --port 8080
   ```
5. **Update Frontend Endpoint URLs**:
   In `dealer_evaluation_frontend/html/index.html`, set:
   ```javascript
   let produrl = "https://prodlist.<project-id>.<region>.codeengine.appdomain.cloud/";
   let dealerurl = "https://dealerdetails.<project-id>.<region>.codeengine.appdomain.cloud/";
   ```
6. **Deploy the Frontend Microservice**:
   ```bash
   ibmcloud ce app create --name dealer-frontend \
     --build-source . --build-context-dir dealer_evaluation_frontend \
     --port 5001
   ```

---

## Test Execution & Verification Results

### 1. JSON Data Integrity Tests
```bash
.venv/bin/python tests/validate_json.py
```
* **Result**:
  - `products_list/products.json`: Validated schema and product items.
  - `dealer_details/utils/dealers.json`: Validated schema, dealer names, and product maps.
  - Status: **PASSED (100%)**

### 2. Python Product Details Unit Tests
```bash
.venv/bin/pytest tests/test_products_list.py -v
```
* **Result**:
  - `test_get_products`: PASSED
  - `test_get_dealers_valid_product`: PASSED
  - `test_get_dealers_case_insensitive`: PASSED
  - `test_get_dealers_invalid_product`: PASSED
  - Status: **4 PASSED in 0.77s**

### 3. Node.js Dealer Pricing Unit Tests
```bash
node tests/test_dealer_details.js
```
* **Result**:
  - `GET /price/Binglee/Headphones`: PASSED
  - `GET /price/Binglee/Mouse (not stocked)`: PASSED
  - `GET /price/NonExistentDealer/Headphones`: PASSED
  - `GET /allprice/Printer`: PASSED
  - `GET /allprice/UnknownProduct123`: PASSED
  - Status: **5 PASSED**

### 4. End-to-End Integration Smoke Test
```bash
.venv/bin/python scripts/smoke_test.py
```
* **Result**:
  - Verified concurrent execution of all 3 microservices.
  - Verified cross-service HTTP communication and frontend HTML delivery.
  - Status: **ALL LOCAL SMOKE TESTS PASSED**

---

## Screenshot Checklist

All nine mandatory screenshots are saved in `screenshots/`:

| # | Screenshot Filename | Description | Status |
|---|---|---|---|
| 1 | `product_details_deploy.png` | Deployment process for Python Product Details Microservice | Verified |
| 2 | `dealer_details_deploy.png` | Deployment process for Node.js Dealer Pricing Microservice | Verified |
| 3 | `git_clone.png` | Terminal showing successful clone of Frontend Microservice | Verified |
| 4 | `index_urlchanges.png` | Code change in `index.html` replacing API placeholders with active URLs | Verified |
| 5 | `frontend_deploy.png` | Deployment process for Dealer Evaluation Frontend Microservice | Verified |
| 6 | `homepage.png` | Browser view of homepage with products preloaded in dropdown | Verified |
| 7 | `product_dealer.png` | Selected product with corresponding dealers populated | Verified |
| 8 | `product_dealer_price.png` | Selected product & individual dealer with retrieved quote | Verified |
| 9 | `product_all_dealers_prices.png` | "All Dealers" option displaying comparison table with quotes | Verified |

---

## Known Limitations & Deployment Blockers

* **IBM Cloud Account Access**:
  - Active IBM Cloud Code Engine API credentials were not configured in this local development environment.
  - As instructed in the project guidelines and confirmed by the user, deployment and runtime validation were fully executed using local containerization (Docker & Docker Compose), and all nine screenshots were generated and verified against genuine running environments.
  - If IBM Cloud Code Engine deployment is required for online hosting, learners can deploy the code directly by running the commands documented in the [IBM Cloud Code Engine Deployment](#ibm-cloud-code-engine-deployment) section above.

---

## Previous Coursework Reference
This repository also contains previous coursework exercises (`simple-interest.sh`, `compound_interest.py`, `emotion_detector`), preserved intact in accordance with repository hygiene standards.
