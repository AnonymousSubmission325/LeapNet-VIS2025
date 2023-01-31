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
    with open('static/network.json') as f:
        network = json.load(f)
    with open('static/papers.json') as f:
        papers = json.load(f)
    with open('static/seeds.json') as f:
        seeds = json.load(f)
    with open('static/topics.json') as f:
        topics = json.load(f)
    return render_template("templ.html", network = network, papers = papers, seeds = seeds, topics = topics)


if __name__ == '__main__':
    # run app in debug mode on port 5000
    app.run(debug=True, port=5000)