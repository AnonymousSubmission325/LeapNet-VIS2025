import test
import citation_network_aggregation
import keyword_hdbscan
import networkx_extension



seedset = ["A nested model for visualization design and validation","Design study methodology: Reflections from the trenches and the stacks", "A multi-level typology of abstract visualization tasks", "Squarified Treemaps Wijk", "Visual analysis of large graphs: state‐of‐the‐art and future research challenges", "Force‐directed edge bundling for graph visualization"]
#seedset = ["Information visualization and visual data mining", "Visualization of Time-Oriented Data","Standards for Internet-based experimenting"]
paper_num = 2000
citation_network_aggregation.main(seedset, paper_num)

# TODO: extract keywords
# TODO: projection
# TODO: agglomerative clustering

#import key_modeling
#key_modeling.keyword_modeling()

keyword_hdbscan.keyword_modeling()


networkx_extension.import_graph()

print("finished")