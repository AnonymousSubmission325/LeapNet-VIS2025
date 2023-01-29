import test
import citation_network_aggregation
import topic_modeling
import networkx_extension

seedset = ["Event‐based Dynamic Graph Drawing without the Agonizing Pain","Visual Exploration of Financial Data with Incremental Domain Knowledge", "Vaim: Visual analytics for influence maximization","Influence Maximization With Visual Analytics", "A distributed multilevel force-directed algorithm", "Profiling distributed graph processing systems through visual analytics"]
paper_num = 30
citation_network_aggregation.main(seedset, paper_num)
topic_modeling.topic_modeling()
networkx_extension.get_paths()