import os
import json
from flask import Flask, render_template

app = Flask(__name__)

# Load static data
def load_json(filename):
    with open(os.path.join("frontend/static", filename)) as f:
        return json.load(f)

data = {
    "network": load_json("network.json"),
    "papers": load_json("papers.json"),
    "seeds": load_json("seeds.json"),
    "keys": load_json("projections.json"),
    "key_projections": load_json("key_projections.json"),
    "pwk": load_json("papers_with_keys.json"),
    "paths": load_json("paths.json"),
    "authors": load_json("authors.json")
}

# Generate static HTML
def generate_static_html():
    with app.app_context():  # Ensures the Flask context is active
        html = render_template("templ.html", **data)
        output_path = "frontend/index.html"
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"✅ Generated {output_path}")

if __name__ == "__main__":
    generate_static_html()
