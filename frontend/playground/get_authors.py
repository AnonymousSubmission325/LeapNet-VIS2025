import pandas as pd
import json
def authors_modeling():

    # temporal??
    with open('frontend/static/papers.json') as f:
        data = json.load(f)
    # Convert the data to a DataFrame
    author_lookup = {}
    paper_lookup = {}

    papers = pd.DataFrame(data['papers'])
    print("hello")
authors_modeling()