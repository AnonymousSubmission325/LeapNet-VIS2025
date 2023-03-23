import test
import citation_network_aggregation
import keyword_hdbscan
import networkx_extension



#seedset = ["PersonaSAGE: A Multi-Persona Graph Neural Network","PersonaSAGE: A Multi-Persona Graph Neural Network", "Learning holistic interactions in LBSNs with high-order, dynamic, and multi-role contexts"]
seedset = ["Visualization of Time-Oriented Data","Standards for Internet-based experimenting"]
paper_num = 1000
citation_network_aggregation.main(seedset, paper_num)

# TODO: extract keywords
# TODO: projection
# TODO: agglomerative clustering

#import key_modeling
#key_modeling.keyword_modeling()

keyword_hdbscan.keyword_modeling()


networkx_extension.import_graph()

print("finished")