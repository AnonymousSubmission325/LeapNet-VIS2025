import networkx as nx
from networkx.readwrite import json_graph
import json
import matplotlib.pyplot as plt
import pandas as pd

import random


def convert_to_json(pwt):
    cleaned_paper_objects = {"papers":[]}
    columns = pwt.columns
    
    for index, row in pwt.iterrows():
        l = {}
        for c in columns:
            l[c] = row[c]
        cleaned_paper_objects["papers"].append(l)
        
    return cleaned_paper_objects

def get_biggest_connected_component(G):
    #G_test = nx.barabasi_albert_graph(6, 2, seed= 3214562)
    #subgraphs = nx.connected_components(G_test)
    biggest_component = 0
    graphs = [  ]
    for g in  [G.subgraph(c) for c in nx.connected_components(G)]:
        if biggest_component == 0 or (biggest_component.size() < g.size()):
            biggest_component = g
    return biggest_component

    
def import_graph():

    def read_json_file(filename):
        with open(filename) as f:
            js_graph = json.load(f)
        return json_graph.node_link_graph(js_graph)

    #Set up a graph with random edges and weights

    G = read_json_file("frontend/static/network.json")
    degree_c = nx.degree_centrality(G)
    betweenness_c = nx.betweenness_centrality(G)

    with open('frontend/static/papers_with_keys.json') as f:
        data = json.load(f)
    # Convert the data to a DataFrame
    papers = pd.DataFrame(data['papers'])
    degree_cs = []
    betweenness_cs = []
    for i,p in papers.iterrows():
        degree_cs.append(degree_c[p.paperId])
        betweenness_cs.append(betweenness_c[p.paperId])
    papers["degreec"] = degree_cs
    papers["betweenc"] = betweenness_cs

    
    values = {"citationCount": -1, "publicationTypes": "none", "referenceCount":-1, "abstract": "none", "journal":"", "tldr":"",
    "venue": "", "athours":"", "publicationDate":"", "authors":"", "degreec":0, "betweenc":0}
    papers = papers.fillna(value=values)
    pwt_json = convert_to_json(papers)
    # orig_papers_with_topic.fillna(-1)
    # the json file where the output must be stored
    paper_file = open("frontend/static/papers_with_keys_and_centrals.json", "w")
    json.dump(pwt_json, paper_file, indent = 6)
    paper_file.close()

    #for node in n:
        

    # n = G.nodes
    # counts = {}
    # for node in n:
    #     counts[node] = 0
    # for e in G.edges:
    #     if e[0] in counts.keys():
    #         counts[e[0]] = counts[e[0]] +1
    #     if e[1] in counts.keys():
    #         counts[e[1]] = counts[e[1]] +1





    #print(list(G.edges))
    #for u,v in G.edges():
    #    G[u][v][0]['weight'] = int(random.random() * 10)
    #    pos = nx.spring_layout(G)
    #nx.draw(G)
    #nx.draw_networkx_edge_labels(G)
    #plt.show()
    #nx.draw(G)
    #plt.show()

    # remove single nodes
    #G = nx.to_undirected(G)
    #G = get_biggest_connected_component(G)
    #subgraphs = nx.connected_components(G)
    #G = max(subgraphs, key=len)

    return G

def import_seeds():
    filename = "frontend/static/seeds.json"
    def read_seed_file(filename):
        with open(filename) as f:
            js_graph = json.load(f)
        return js_graph
    return read_seed_file(filename)['seeds']


def extract_paths(G, seeds):
    path_dict = {"paths" : []}

    for i in range(len(seeds)-1):
        k_paths = str(seeds[i]) + '_' + str(seeds[i+1])
        if (seeds[i] in G and seeds[i+1] in G):
            paths = list(nx.all_simple_paths(G, source=seeds[i], target=seeds[i+1], cutoff=3))
            path_dict["paths"].append({k_paths : paths})
    
    # the json file where the output must be stored
    paths_file = open("frontend/static/paths.json", "w")
    json.dump(path_dict, paths_file, indent = 6)
    paths_file.close()

    return path_dict

def get_paths():
    print("improt graph")
    graph = import_graph()
    print("import seeds")
    seeds = import_seeds()
    print("extract paths")
    paths = extract_paths(graph, seeds)
