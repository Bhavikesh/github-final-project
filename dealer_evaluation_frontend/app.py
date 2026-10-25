from flask import Flask
from flask_cors import CORS
from flask import send_from_directory
import os

app = Flask("Product deal check")
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route("/")
def getHomePage():
    html_dir = os.path.join(BASE_DIR, "html") if os.path.exists(os.path.join(BASE_DIR, "html")) else "html"
    return send_from_directory(html_dir, "index.html")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)
