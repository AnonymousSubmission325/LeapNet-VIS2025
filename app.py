# import main Flask class and request object
import os
from flask import Flask, render_template, request, jsonify
# create the Flask app
app = Flask(__name__)

@app.route('/query-example')
def query_example():
    # if key doesn't exist, returns None
    language = request.args.get('language')

    return '''<h1>The language value is: {}</h1>'''.format(language)

# This route serves the dictionary d at the route /date
@app.route("/data")
def data():
  # define some data
  d = {
    "name": "foo",
    "rank": "bar"
  }
  return render_template("networkvis.html", chart_data=jsonify(d))

@app.route('/network', methods=["POST", "GET"])
def returnOne():
        a = {
        "test": "abcd",
        "test1": "efg"
        }
        return render_template("report.html", a=a)

@app.route('/userQuery', methods=["POST", "GET"])
def example():
        a = {
        "test": "abcd",
        "test1": "efg"
        }
        return render_template("response.html", a=a)


if __name__ == '__main__':
    # run app in debug mode on port 5000
    app.run(debug=True, port=5000)