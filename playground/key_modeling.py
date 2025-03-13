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
import yake
from gensim.models import word2vec
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from nltk.tokenize import word_tokenize
from sklearn.cluster import DBSCAN
from collections import Counter


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


    papers = papers.drop(columns=['layer', 'paperId', 'citationCount', 'year', 'journal', 'url', 'venue', 'authors', 'publicationDate', 'publicationTypes', 'referenceCount' ], axis=1)
    papers.applymap(prepare_text)

    rel_text = papers.apply(lambda row : row.tolist(), axis = 1)
    raw_text = []
    for i in rel_text:
        text = ''
        for j in i:
            if not pd.isna(j):
                text = text + ' ' + j 
        raw_text.append(text)

    data = papers.values.tolist()


    texts_p_publication = []
    for d in data:
        su = ""
        for text in d:
            if not pd.isnull(text) and text is not None:
                su = su + text.lower()
        texts_p_publication.append(su)

    language = "en"
    max_ngram_size = 1
    deduplication_thresold = 0.9
    deduplication_algo = 'seqm'
    windowSize = 1
    numOfKeywords = 200

    kw_extractor = yake.KeywordExtractor(lan=language, 
                                        n=max_ngram_size, 
                                        dedupLim=deduplication_thresold, 
                                        dedupFunc=deduplication_algo, 
                                        windowsSize=windowSize, 
                                        top=numOfKeywords)
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

    print(model.infer_vector(['graph']))

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

    pca = PCA(n_components=2)
    key_vectors_2d_pca = pca.fit_transform(X)

    import umap
    reducer = umap.UMAP(random_state=42)
    reducer.fit(X)
    key_vectors_2d_umap = reducer.transform(X)


    # def append_coords(papers, keys, arrs):
    #     papers_w_coords = []
    #     for i,p in enumerate(papers):
    #         p = papers[i]
    #         p[keys[0]] = arrs[0][i]
    #         p[keys[1]] = arrs[1][i]
    #         p[keys[2]] = arrs[2][i]
    #         papers_w_coords.append(p)
    #     return papers_w_coord


    #FOR TESTING
    # tsne_model = TSNE(perplexity=40, n_components=2, init='pca', n_iter=2500, random_state=23)
    # new_values = tsne_model.fit_transform(tokens)

    # x = []
    # y = []
    # for value in new_values:
    #     x.append(value[0])
    #     y.append(value[1])
        
    # plt.figure(figsize=(16, 16)) 
    # for i in range(len(x)):
    #     plt.scatter(x[i],y[i])
    #     plt.annotate(labels[i],
    #                  xy=(x[i], y[i]),
    #                  xytext=(5, 2),
    #                  textcoords='offset points',
    #                  ha='right',
    #                  va='bottom')
    # plt.show()
    
    
    from sklearn import preprocessing
    min_max_scaler = preprocessing.MinMaxScaler()

    #ACTUALLY DOCUMENTS NOT TOPICS
    topic_vectors_2d_tsne_normalized = min_max_scaler.fit_transform(key_vectors_2d_tsne)
    topic_vectors_2d_pca_normalized = min_max_scaler.fit_transform(key_vectors_2d_pca)
    topic_vectors_2d_umap_normalized = min_max_scaler.fit_transform(key_vectors_2d_umap)

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


    
    all_projections = []
    for k in flat_listu:
        coords_tsne = [[],[]]
        coords_tsne_xy = []
        coords_pca = [[],[]]
        coords_pca_xy = []
        coords_umap = [[],[]]
        coords_umap_xy = []
        doc_ids = []
        for i, c in enumerate(corpus):
            if k in c:
                doc_ids.append(i)

                coords_tsne[0].append(topic_vectors_2d_tsne_normalized[i][0])
                coords_tsne[1].append(topic_vectors_2d_tsne_normalized[i][1])
                coords_tsne_xy.append([topic_vectors_2d_tsne_normalized[i][0],topic_vectors_2d_tsne_normalized[i][1]])

                coords_pca[0].append(topic_vectors_2d_pca_normalized[i][0])
                coords_pca[1].append(topic_vectors_2d_pca_normalized[i][1])
                coords_pca_xy.append([topic_vectors_2d_pca_normalized[i][0],topic_vectors_2d_pca_normalized[i][1]])

                coords_umap[0].append(topic_vectors_2d_umap_normalized[i][0])
                coords_umap[1].append(topic_vectors_2d_umap_normalized[i][1])
                coords_umap_xy.append([topic_vectors_2d_umap_normalized[i][0],topic_vectors_2d_umap_normalized[i][1]])
        
        coords_tsne_xy_np = np.array(coords_tsne_xy)
        coords_pca_xy_np = np.array(coords_pca_xy)
        coords_umap_xy_np = np.array(coords_umap_xy)


        clustering_tsne = DBSCAN(eps=0.1, min_samples=2).fit(coords_tsne_xy_np)
        clustering_pca = DBSCAN(eps=0.1, min_samples=2).fit(coords_pca_xy_np)
        clustering_umap = DBSCAN(eps=0.1, min_samples=2).fit(coords_umap_xy_np)
        
        def get_true_elem(ar):
            if(ar[0][0] == -1 and len(ar)>1):
                return ar[1]
            else:
                return ar[0]

        ctsne = get_true_elem(Counter(clustering_tsne.labels_).most_common())
        cpca = get_true_elem(Counter(clustering_pca.labels_).most_common())
        cumap = get_true_elem(Counter(clustering_umap.labels_).most_common())

        projections = {}
        projections['key'] = k
        projections['docs'] = doc_ids
        
        projections['tsne_numberofelem'] = ctsne[1]
        projections['pca_numberofelem'] = cpca[1]
        projections['umap_numberofelem'] = cumap[1]
        
        tsne_coordsx = []
        tsne_coordsy = []
        tsne_docclusterindices = []
        for i,l in enumerate(clustering_tsne.labels_):
                if l==ctsne[0]:
                    tsne_docclusterindices.append(i)
                    tsne_coordsx.append(topic_vectors_2d_tsne_normalized[i][0])
                    tsne_coordsy.append(topic_vectors_2d_tsne_normalized[i][1])
        pca_coordsx = []
        pca_coordsy = []
        pca_docclusterindices = []
        for i,l in enumerate(clustering_pca.labels_):
                if l==cpca[0]:
                    pca_docclusterindices.append(i)
                    pca_coordsx.append(topic_vectors_2d_pca_normalized[i][0])
                    pca_coordsy.append(topic_vectors_2d_pca_normalized[i][1])
        umap_coordsx = []
        umap_coordsy = []
        umap_docclusterindices = []
        for i,l in enumerate(clustering_umap.labels_):
                if l==cumap[0]:
                    umap_docclusterindices.append(i)
                    umap_coordsx.append(topic_vectors_2d_pca_normalized[i][0])
                    umap_coordsy.append(topic_vectors_2d_pca_normalized[i][1])

        projections['tsne_clusterindices'] = tsne_docclusterindices
        projections['pca_clusterindices'] = pca_docclusterindices
        projections['umap_clusterindices'] = umap_docclusterindices

        projections['tsne_biggestcluster_center'] = [average(tsne_coordsx), average(tsne_coordsy)]
        projections['pca_biggestcluster_center'] = [average(pca_coordsx), average(pca_coordsy)]
        projections['umap_biggestcluster_center'] = [average(umap_coordsx), average(umap_coordsy)]


        projections['tsne_avg'] = [average(coords_tsne[0]), average(coords_tsne[1])]
        projections['pca_avg'] = [average(coords_pca[0]), average(coords_pca[1])]
        projections['umap_avg'] = [average(coords_umap[0]), average(coords_umap[1])]
        all_projections.append(projections)


        from pycolormap_2d import ColorMap2DBremm, ColorMap2DSchumann, ColorMap2DSteiger

        # Create the color map object.
        cmap_bremm = ColorMap2DBremm()
        cmap_schumann = ColorMap2DSchumann()
        cmap_steiger = ColorMap2DSteiger()

        # Get the color value.
        #color = cmap_bremm(0.2, 0.6)
        def rgb_to_hex(r, g, b):
            return '#{:02x}{:02x}{:02x}'.format(r, g, b)

        def get_colors_matrix(l):
            x=l[0]
            y=l[1]
            
            br = cmap_bremm(x,y)
            c1 = rgb_to_hex(br[0], br[1], br[2])

            sc = cmap_schumann(x,y)
            c2 = rgb_to_hex(sc[0], sc[1], sc[2])

            st = cmap_steiger(x,y)
            c3 = rgb_to_hex(st[0], st[1], st[2])
            return c1, c2, c3
        
        projections['color_bremm_tsne'], projections['color_schumann_tsne'],projections['color_steiger_tsne'] = get_colors_matrix(projections['tsne_biggestcluster_center'])
        projections['color_bremm_pca'], projections['color_schumann_pca'],projections['color_steiger_pca'] = get_colors_matrix(projections['pca_biggestcluster_center'])
        projections['color_bremm_umap'], projections['color_schumann_umap'],projections['color_steiger_umap'] = get_colors_matrix(projections['umap_biggestcluster_center'])

    # es kann sein dass weniger topics in den dokumenten vorhanden sind als angegeben
    # in dem fall ist die projection nicht korrekt
    
    #need to map 2d array to 1d here if necessary
    #topics['TSNE'] =  topic_vectors_2d_tsne_normalized
    #topics['PCA'] =  topic_vectors_2d_pca_normalized
    #topics['UMAP'] =  topic_vectors_2d_umap_normalized
    
    # topics['TSNE_Bremm'] =  tsne_bremm
    # topics['PCA_Bremm'] =  pca_bremm
    # topics['UMAP_Bremm'] =  umap_bremm
    
    # topics['TSNE_Schumann'] =  tsne_schumann
    # topics['PCA_Schumann'] =  pca_schumann
    # topics['UMAP_Schumann'] =  umap_schumann
    
    # topics['TSNE_Steiger'] =  tsne_steiger
    # topics['PCA_Steiger'] =  pca_steiger
    # topics['UMAP_Steiger'] =  umap_steiger
    

    # the json file where the output must be stored
    projection_file = open("frontend/static/projections.json", "w")
    json.dump(all_projections, projection_file, indent = 6)
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