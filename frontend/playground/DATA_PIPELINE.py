import test
import citation_network_aggregation
import keyword_hdbscan



seedset = ["Event‐based Dynamic Graph Drawing without the Agonizing Pain","Visual Exploration of Financial Data with Incremental Domain Knowledge", "Vaim: Visual analytics for influence maximization","Influence Maximization With Visual Analytics", "A distributed multilevel force-directed algorithm", "Profiling distributed graph processing systems through visual analytics"]
paper_num = 2000
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