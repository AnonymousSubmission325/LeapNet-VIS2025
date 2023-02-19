# import main Flask class and request object
import os
import json

from flask import Flask, render_template, request, jsonify
# create the Flask app
app = Flask(__name__)
# This route serves the dictionary d at the route /date


@app.route('/', methods=["POST", "GET"])
def returnOne():
    # define some data
    with open('frontend/static/network.json') as f:
        network = json.load(f)
    with open('frontend/static/papers.json') as f:
        papers = json.load(f)
    with open('frontend/static/seeds.json') as f:
        seeds = json.load(f)
    with open('frontend/static/projections.json') as f:
        keys = json.load(f)
    with open('frontend/static/key_projections.json') as f:
        key_projections = json.load(f)
    with open('frontend/static/papers_with_keys.json') as f:
        pwk = json.load(f)
    with open('frontend/static/paths.json') as f:
        paths = json.load(f)
    return render_template("templ.html", network = network, papers = papers, seeds = seeds, keys = keys, key_projections = key_projections, pwk = pwk, paths = paths)


if __name__ == '__main__':
    # run app in debug mode on port 5000
    app.run(debug=True, port=5000)