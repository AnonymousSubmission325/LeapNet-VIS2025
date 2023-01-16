import networkx as nx

import matplotlib.pyplot as plt

import random

#Set up a graph with random edges and weights
G = nx.barabasi_albert_graph(6, 2, seed= 3214562)

for u,v in list (G.edges):
    G[u][v]['weight'] = int(random.random() * 10)
    pos = nx.spring_layout(G)

nx.draw(G, pos)

nx.draw_networkx_edge_labels(G,pos)

plt.show()