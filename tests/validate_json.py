import json
import os
import sys

def test_json_files():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # 1. products.json in products_list
    prod_path = os.path.join(base_dir, "products_list", "products.json")
    assert os.path.exists(prod_path), f"File not found: {prod_path}"
    with open(prod_path, "r", encoding="utf-8") as f:
        prod_data = json.load(f)
    assert "products" in prod_data, "Missing 'products' key in products.json"
    assert len(prod_data["products"]) > 0, "products array is empty"
    for item in prod_data["products"]:
        assert "product" in item, "Item missing 'product' name"
        assert "Dealers" in item, "Item missing 'Dealers' list"
        assert isinstance(item["Dealers"], list), "'Dealers' must be a list"
    print("✓ products_list/products.json is valid.")

    # 2. dealers.json in dealer_details/utils
    dealer_path = os.path.join(base_dir, "dealer_details", "utils", "dealers.json")
    assert os.path.exists(dealer_path), f"File not found: {dealer_path}"
    with open(dealer_path, "r", encoding="utf-8") as f:
        dealer_data = json.load(f)
    assert "dealers" in dealer_data, "Missing 'dealers' key in dealers.json"
    assert len(dealer_data["dealers"]) > 0, "dealers array is empty"
    for dealer in dealer_data["dealers"]:
        assert "Dealer" in dealer, "Dealer missing 'Dealer' name"
        assert "products" in dealer, "Dealer missing 'products' map"
        assert isinstance(dealer["products"], dict), "'products' must be a dict"
    print("✓ dealer_details/utils/dealers.json is valid.")

if __name__ == "__main__":
    test_json_files()
    print("All JSON data files successfully validated!")
