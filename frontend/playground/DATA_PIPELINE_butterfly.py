import test
import citation_network_aggregation
import keyword_hdbscan



seedset = ["Visual explanations - images and quantities, evidence and narrative E. Tufte"]
paper_num = 1000
citation_network_aggregation.main(seedset, paper_num)

# TODO: extract keywords
# TODO: projection
# TODO: agglomerative clustering

#import key_modeling
#key_modeling.keyword_modeling()

keyword_hdbscan.keyword_modeling()

#import networkx_extension
#networkx_extension.get_paths()

print("finished")