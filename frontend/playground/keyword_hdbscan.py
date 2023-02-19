# Importing modules
import pandas as pd
from pandas import json_normalize
import os
import gensim.corpora as corpora
import pickle 
import pyLDAvis
# Load the regular expression library
import re
import gensim
from gensim.utils import simple_preprocess
from gensim import matutils
import nltk
# nltk.download('stopwords')
from nltk.corpus import stopwords
# Import the wordcloud library
from wordcloud import WordCloud
from pprint import pprint
import re
import json
import numpy
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.cluster import AgglomerativeClustering
from scipy.cluster.hierarchy import fcluster
import yake
from gensim.models import word2vec
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from nltk.tokenize import word_tokenize
from sklearn.cluster import DBSCAN
from collections import Counter
from sklearn.feature_extraction import text as stops

def plotScatter(df, corpus, keyword):
    fig = plt.figure(figsize=(10,15))
    ax = fig.add_subplot(1, 1, 1)

    pos_found_x = []
    pos_found_y = []
    found_names = []

    pos_rest_x = []
    pos_rest_y = []

    for term_id, pos in df.iterrows():

        if keyword not in corpus[term_id]:
            pos_rest_x.append(pos['x'])
            pos_rest_y.append(pos['y'])
        elif keyword in corpus[term_id]:
            pos_found_x.append(pos['x'])
            pos_found_y.append(pos['y'])

    ax.scatter(pos_rest_x, pos_rest_y, c='blue')       
    ax.scatter(pos_found_x, pos_found_y, c='red')

    fig.show()


# https://www.machinelearningplus.com/nlp/topic-modeling-visualization-how-to-present-results-lda-models/

def prepare_text(cleaned_text):
    if isinstance(cleaned_text, str):
        return re.sub('[,\.!?]', '', cleaned_text).lower()
    else:
        #print(cleaned_text)
        return ''

def convert_to_json(pwt):
    cleaned_paper_objects = {"papers":[]}
    columns = pwt.columns
    
    for index, row in pwt.iterrows():
        l = {}
        for c in columns:
            l[c] = row[c]
        cleaned_paper_objects["papers"].append(l)
        
    return cleaned_paper_objects


def keyword_modeling():

    # temporal??
    with open('frontend/static/papers.json') as f:
        data = json.load(f)
    # Convert the data to a DataFrame
    papers = pd.DataFrame(data['papers'])
    orig_papers = papers.copy()


    papers = papers.drop(columns=[ 'layer','paperId', 'citationCount', 'year', 'journal', 'url', 'venue', 'authors', 'publicationDate', 'publicationTypes', 'referenceCount' ], axis=1)
    papers.applymap(prepare_text)

    rel_text = papers.apply(lambda row : row.tolist(), axis = 1)
    raw_text = []
    for i in rel_text:
        text = ''
        for j in i:
            if not pd.isna(j):
                text = text + ' ' + str(j) 
        raw_text.append(text)

    data = papers.values.tolist()


    texts_p_publication = []
    for d in data:
        su = ""
        for text in d:
            if not pd.isnull(text) and text is not None:
                su = su + text.lower()
        texts_p_publication.append(su)

    import nltk
    from nltk.corpus import stopwords
    stops = set(stopwords.words('english'))



    language = "en"
    max_ngram_size = 2
    deduplication_thresold = 0.96
    deduplication_algo = 'seqm'
    windowSize = 1
    numOfKeywords = 500
    my_stopwords = ['method', 'number', 'used', 'using','also', 'many', 'several', 'demonstrated', 'three', 'abstract','without','dataset', 'draws','authors','algorithms','graphs', 'two','support','found','find','present','existing','propose','important','set','problem','design','presented','proposed','systems','user','users','system','techniques','show','study', 'results','work','visual','approach','present,''based','networks','paper','data','layer',"present", "describe", "show", "study", "technique", "techniques" ]

    all_stop = stops.union(my_stopwords)
    kw_extractor = yake.KeywordExtractor(lan=language, 
                                        n=max_ngram_size, 
                                        dedupLim=deduplication_thresold, 
                                        dedupFunc=deduplication_algo, 
                                        windowsSize=windowSize, 
                                        top=numOfKeywords,
                                        stopwords=all_stop)
    corpus = []
    for t in texts_p_publication:
        words = []
        k = kw_extractor.extract_keywords(t)
        for x in k:
            words.append(x[0])
        corpus.append(words)
    

    def tagged_document(list_of_list_of_words):
        for i, list_of_words in enumerate(list_of_list_of_words):
            yield TaggedDocument(list_of_words, [i])
    data_training = list(tagged_document(corpus))


    model = Doc2Vec(vector_size=40, min_count=2, epochs=30)

    model.build_vocab(data_training)

    doc_tags = list(model.docvecs.index_to_key)
    X = model[doc_tags]

    tsne = TSNE(n_components=2)
    X_tsne = tsne.fit_transform(X)
    df = pd.DataFrame(X_tsne, index=doc_tags, columns=['x', 'y'])

    #plotScatter(df, corpus,  keyword="diffusion")

    # COULD BE APPLIED IF NECESSARY
    #model = word2vec.Word2Vec(corpus, window=20, min_count=1, workers=4)


    tsne_model = TSNE(perplexity=40, n_components=2, init='pca', n_iter=2500, random_state=23)
    key_vectors_2d_tsne = tsne_model.fit_transform(X)

    pca = PCA(n_components=2, whiten=True)
    key_vectors_2d_pca = pca.fit_transform(X)

    import umap
    reducer = umap.UMAP(random_state=42)
    reducer.fit(X)
    key_vectors_2d_umap = reducer.transform(X)
    
    
    from sklearn import preprocessing
    min_max_scaler = preprocessing.MinMaxScaler()

    #ACTUALLY DOCUMENTS NOT TOPICS
    topic_vectors_2d_tsne_normalized = min_max_scaler.fit_transform(key_vectors_2d_tsne)
    topic_vectors_2d_pca_normalized = min_max_scaler.fit_transform(key_vectors_2d_pca)
    topic_vectors_2d_umap_normalized = min_max_scaler.fit_transform(key_vectors_2d_umap)
    
    topic_vectors_2d_tsne_normalized_np = np.array(min_max_scaler.fit_transform(key_vectors_2d_tsne))
    topic_vectors_2d_pca_normalized_np = np.array(min_max_scaler.fit_transform(key_vectors_2d_pca))
    topic_vectors_2d_umap_normalized_np = np.array(min_max_scaler.fit_transform(key_vectors_2d_umap))

    orig_papers["tsne"] = topic_vectors_2d_tsne_normalized.tolist()
    orig_papers["pca"] = topic_vectors_2d_pca_normalized.tolist()
    orig_papers["umap"] = topic_vectors_2d_umap_normalized.tolist()


    flat_list = [item for sublist in corpus for item in sublist]
    flat_listu = list(dict.fromkeys(flat_list))
    key_dic = {}
    for k in flat_listu: key_dic[k] = []

    #CREATE DOCUMENTS COORDINATES 
    def average(lst):
        return sum(lst) / len(lst)


    overall_key_projections = []
    #go through ecah cluster hierarchy level
    keys_already_in_use = []
    keyclusters_by_n = []
    for i in range(1,len(topic_vectors_2d_pca_normalized_np)):
        keys_per_cluster = []

        model = AgglomerativeClustering(distance_threshold=None, n_clusters=i)
        model = model.fit(topic_vectors_2d_pca_normalized_np)
        keyclusters_by_n.append(model.labels_)
        l = model.labels_
        all_clusters_ids = list(set(l))
        dict_clusters={}
        for id in all_clusters_ids:
            dict_clusters[id]= [i for i, x in enumerate(l) if x == id]
        for key in dict_clusters.keys():

            #get the cluster centers
            x_vals = []
            y_vals = []
            xy_vals = []
            keyword_list=[]
            for j in dict_clusters[key]:
                x_vals.append(topic_vectors_2d_pca_normalized_np[j][0])
                y_vals.append(topic_vectors_2d_pca_normalized_np[j][1])
                xy_vals.append([topic_vectors_2d_pca_normalized_np[j][0],topic_vectors_2d_pca_normalized_np[j][1]] )
                keyword_list.extend(corpus[j])
            x_coord = average(x_vals)
            y_coord = average(y_vals)

            if len(xy_vals)>2:
                from shapely.geometry import Polygon
                p = Polygon(xy_vals)
                c = [float(p.centroid.x) , float(p.centroid.y)]
            elif len(xy_vals)==2:
                c = [float((xy_vals[0][0]+xy_vals[1][0])/2) , float((xy_vals[0][1]+xy_vals[1][1])/2)]
            else:
                c = [float(xy_vals[0][0]),float(xy_vals[0][1])]

            # get best fitting keyword 
            from collections import Counter
            counter_dict = Counter(keyword_list)
            result_list = [(element, count) for element, count in counter_dict.items()]
            sorted_list = sorted(result_list, key=lambda x: x[1], reverse=True)
            for e in sorted_list: 
                if e[0] not in keys_already_in_use:
                    keys_per_cluster.append({"key":e[0], "coords":c})
                    keys_already_in_use.append(e[0])
                    break
        overall_key_projections.append(keys_per_cluster)


        




    # the json file where the output must be stored
    projection_file = open("frontend/static/key_projections.json", "w")
    json.dump(overall_key_projections, projection_file, indent = 6)
    projection_file.close()

    values = {"citationCount": -1, "publicationTypes": "none", "referenceCount":-1, "abstract": "none", "journal":"", "tldr":"",
    "venue": "", "athours":"", "publicationDate":"", "authors":""}
    orig_papers = orig_papers.fillna(value=values)
    pwt_json = convert_to_json(orig_papers)
    # orig_papers_with_topic.fillna(-1)
    # the json file where the output must be stored
    paper_file = open("frontend/static/papers_with_keys.json", "w")
    json.dump(pwt_json, paper_file, indent = 6)
    paper_file.close()

    return pwt_json

    #pprint(tsne_bremm)
    #pprint(pca_bremm)
    #pprint(umap_bremm)
keyword_modeling()