from flask import Flask
from flask_cors import CORS
import json
import os

app = Flask("List of products")
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(BASE_DIR, "products.json")

def load_products_data():
    path = JSON_PATH if os.path.exists(JSON_PATH) else "products.json"
    with open(path, "r", encoding="utf-8") as prodfile:
        return json.load(prodfile)

@app.route("/products", methods=["GET"])
def getProductsList():
    try:
        data = load_products_data()
        products = [item["product"] for item in data.get("products", [])]
        return {"products": products}
    except Exception as e:
        return {"message": f"Error loading products: {str(e)}"}, 500

@app.route("/getdealers/<product>", methods=["GET"])
def getDealers(product):
    try:
        data = load_products_data()
        for productMeta in data.get("products", []):
            if productMeta.get("product") == product or productMeta.get("product", "").lower() == product.lower():
                return {"dealers": productMeta.get("Dealers", [])}
        return {"message": "Could not find dealers for this product"}
    except Exception as e:
        return {"message": f"Error loading dealers: {str(e)}"}, 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5002))
    app.run(host="0.0.0.0", port=port, debug=True)
