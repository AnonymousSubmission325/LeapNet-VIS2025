import test
import citation_network_aggregation
import keyword_hdbscan
import networkx_extension



#seedset = ["PersonaSAGE: A Multi-Persona Graph Neural Network","PersonaSAGE: A Multi-Persona Graph Neural Network", "Learning holistic interactions in LBSNs with high-order, dynamic, and multi-role contexts"]
seedset = [
    "On the Quantification over Times in Natural Language",
    "Cross-linguistic variation in imperfectivity",
    "Multilingual Processing of Auxiliaries within LFG",
    "Epistemic Modality for Dummies",
    "PISA 2006: An Assessment of Scientific Literacy.",
    "Biased modality and epistemic weakness with the future and MUST: non veridicality, partial knowledge",
    "Measurement and Modality: The Scalar Basis of Modal Semantics."
    ]
paper_num = 20
citation_network_aggregation.main(seedset, paper_num)

# TODO: extract keywords
# TODO: projection
# TODO: agglomerative clustering

#import key_modeling
#key_modeling.keyword_modeling()

keyword_hdbscan.keyword_modeling()


# networkx_extension.import_graph()

print("finished")