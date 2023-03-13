import test
import citation_network_aggregation
import keyword_hdbscan
import networkx_extension



seedset = ["Visual Comparison of Language Model Adaptation","LMFingerprints: Visual Explanations of Language Model Embedding Spaces through Layerwise Contextualization Scores", "Questioncomb: A gamification approach for the visual explanation of linguistic phenomena through interactive labeling", "Going beyond visualization: Verbalization as complementary medium to explain machine learning models"]
#seedset = ["Information visualization and visual data mining", "Visualization of Time-Oriented Data","Standards for Internet-based experimenting"]
paper_num = 3000
citation_network_aggregation.main(seedset, paper_num)

# TODO: extract keywords
# TODO: projection
# TODO: agglomerative clustering

#import key_modeling
#key_modeling.keyword_modeling()

keyword_hdbscan.keyword_modeling()


networkx_extension.import_graph()

print("finished")