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


# https://www.machinelearningplus.com/nlp/topic-modeling-visualization-how-to-present-results-lda-models/

def prepare_text(cleaned_text):
    if isinstance(cleaned_text, str):
        return re.sub('[,\.!?]', '', cleaned_text).lower()
    else:
        #print(cleaned_text)
        return ''


def topic_modeling():

    # temporal??
    with open('static/papers.json') as f:
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

    stop_words = stopwords.words('english')
    stop_words.extend(['from', 'subject', 're', 'edu', 'use'])
    stop_words.extend(['nan'])

    def sent_to_words(sentences):
        for sentence in sentences:
            # deacc=True removes punctuations
            yield(gensim.utils.simple_preprocess(str(sentence), deacc=True))

    def remove_stopwords(texts):
        return [[word for word in simple_preprocess(str(doc)) 
                if word not in stop_words] for doc in texts]


    data = papers.values.tolist()
    data_words = list(sent_to_words(data))

    # remove stop words
    data_words = remove_stopwords(data_words)


    # Create Dictionary
    id2word = corpora.Dictionary(data_words)

    # Create Corpus
    texts = data_words

    # Term Document Frequency
    corpus = [id2word.doc2bow(text) for text in texts]

    # View
    #print(corpus[:1][0][:30])


    # number of topics
    num_topics = 5

    # Build LDA model
    print(__name__)
    #if __name__ == '__main__':
    lda_model = gensim.models.LdaModel(corpus=corpus, id2word=id2word, num_topics=num_topics)

    # Print the Keyword in the 10 topics
    #pprint(lda_model.print_topics())
    doc_lda = lda_model[corpus]


    #  What is the Dominant topic and its percentage contribution in each document


    LDAvis_data_filepath = os.path.join('./results/ldavis_prepared_'+str(num_topics))

    def format_topics_sentences(ldamodel=None, corpus=corpus, texts=data):
        # Init output
        sent_topics_df = pd.DataFrame()

        # Get main topic in each document
        for i, row_list in enumerate(ldamodel[corpus]):
            row = row_list[0] if ldamodel.per_word_topics else row_list            
            # print(row)
            row = sorted(row, key=lambda x: (x[1]), reverse=True)
            # Get the Dominant topic, Perc Contribution and Keywords for each document
            for j, (topic_num, prop_topic) in enumerate(row):
                if j == 0:  # => dominant topic
                    wp = ldamodel.show_topic(topic_num)
                    topic_keywords = ", ".join([word for word, prop in wp])
                    sent_topics_df = sent_topics_df.append(pd.Series([int(topic_num), round(prop_topic,4), topic_keywords]), ignore_index=True)
                else:
                    break
        sent_topics_df.columns = ['Dominant_Topic', 'Perc_Contribution', 'Topic_Keywords']

        # Add original text to the end of the output
        contents = pd.Series(texts)
        sent_topics_df = pd.concat([sent_topics_df, contents], axis=1)
        return(sent_topics_df)


    df_topic_sents_keywords = format_topics_sentences(ldamodel=lda_model, corpus=corpus, texts=texts)

    # Format
    df_dominant_topic = df_topic_sents_keywords.reset_index()
    df_dominant_topic.columns = ['Document_No', 'Dominant_Topic', 'Topic_Perc_Contrib', 'Keywords', 'Text']
    print(df_dominant_topic.head(100))
    print(df_topic_sents_keywords.head(100))
    

    #append topic info to papers
    papers.reset_index(drop=True, inplace=True)
    df_dominant_topic.reset_index(drop=True, inplace=True)
    papers_with_topic = pd.concat([papers, df_dominant_topic], axis=1)
    orig_papers_with_topic = pd.concat([orig_papers, papers_with_topic], axis=1)
    orig_papers_with_topic = orig_papers_with_topic.iloc[:,~orig_papers_with_topic.columns.duplicated()]

    
    # Display setting to show more characters in column
    pd.options.display.max_colwidth = 100

    sent_topics_sorteddf_mallet = pd.DataFrame()
    sent_topics_outdf_grpd = df_topic_sents_keywords.groupby('Dominant_Topic')

    for i, grp in sent_topics_outdf_grpd:
        sent_topics_sorteddf_mallet = pd.concat([sent_topics_sorteddf_mallet,  grp.sort_values(['Perc_Contribution'], ascending=False).head(1)], axis=0)

    # Reset Index    
    sent_topics_sorteddf_mallet.reset_index(drop=True, inplace=True)

    # Format
    sent_topics_sorteddf_mallet.columns = ['Topic_Num', "Topic_Perc_Contrib", "Keywords", "Representative Text"]

    # Show
    #pprint(sent_topics_sorteddf_mallet.head(100))

    
    #pprint(lda_model.get_topics())
    # similarities
    #cos_sims = cosine_similarity(lda_model.get_topics())
    #pprint(cos_sims)


    # Get topic weights and dominant topics ------------
    from sklearn.manifold import TSNE
    from bokeh.plotting import figure, output_file, show
    from bokeh.models import Label
    from bokeh.io import output_notebook

    pprint(lda_model[corpus])


    # get topic vectors
    topic_vectors = lda_model.get_topics()

    # perform t-SNE dimensionality reduction
    tsne = TSNE(n_components=2, perplexity=30)
    topic_vectors_2d_tsne = tsne.fit_transform(topic_vectors)

    #pprint(topic_vectors_2d_tsne)
    # plot topics
    #plt.scatter(topic_vectors_2d_tsne[:, 0], topic_vectors_2d_tsne[:, 1])
    #plt.show()


    # perform PCA dimensionality reduction
    pca = PCA(n_components=2)
    topic_vectors_2d_pca = pca.fit_transform(topic_vectors)

    # plot topics
    #plt.scatter(topic_vectors_2d_pca[:, 0], topic_vectors_2d_pca[:, 1])
    #plt.show()


    #NOT TESTED YET
    import umap
    reducer = umap.UMAP(random_state=42)
    reducer.fit(topic_vectors)
    topic_vectors_2d_umap = reducer.transform(topic_vectors)
 

    from sklearn import preprocessing
    min_max_scaler = preprocessing.MinMaxScaler()

    topic_vectors_2d_tsne_normalized = min_max_scaler.fit_transform(topic_vectors_2d_tsne)
    topic_vectors_2d_pca_normalized = min_max_scaler.fit_transform(topic_vectors_2d_pca)
    topic_vectors_2d_umap_normalized = min_max_scaler.fit_transform(topic_vectors_2d_umap)

    from pycolormap_2d import ColorMap2DBremm, ColorMap2DSchumann, ColorMap2DSteiger

    # Create the color map object.
    cmap_bremm = ColorMap2DBremm()
    cmap_schumann = ColorMap2DSchumann()
    cmap_steiger = ColorMap2DSteiger()

    # Get the color value.
    #color = cmap_bremm(0.2, 0.6)
    def rgb_to_hex(r, g, b):
        return '#{:02x}{:02x}{:02x}'.format(r, g, b)

    def get_colors_matrix(coords_matrix):
        color_matrix_bremm = []
        color_matrix_schumann = []
        color_matrix_steiger = []
        for l in coords_matrix:
            x=l[0]
            y=l[1]
            
            br = cmap_bremm(x,y)
            color_matrix_bremm.append(rgb_to_hex(br[0], br[1], br[2]))

            sc = cmap_schumann(x,y)
            color_matrix_schumann.append(rgb_to_hex(sc[0], sc[1], sc[2]))

            st = cmap_steiger(x,y)
            color_matrix_steiger.append(rgb_to_hex(st[0], st[1], st[2]))
        return color_matrix_bremm, color_matrix_schumann, color_matrix_steiger
    
    tsne_bremm, tsne_schumann, tsne_steiger = get_colors_matrix(topic_vectors_2d_tsne_normalized)
    pca_bremm, pca_schumann, pca_steiger = get_colors_matrix(topic_vectors_2d_pca_normalized)
    umap_bremm, umap_schumann, umap_steiger = get_colors_matrix(topic_vectors_2d_umap_normalized)

    topics = sent_topics_sorteddf_mallet


    # es kann sein dass weniger topics in den dokumenten vorhanden sind als angegeben
    # in dem fall ist die projection nicht korrekt
    
    #need to map 2d array to 1d here if necessary
    #topics['TSNE'] =  topic_vectors_2d_tsne_normalized
    #topics['PCA'] =  topic_vectors_2d_pca_normalized
    #topics['UMAP'] =  topic_vectors_2d_umap_normalized
    
    topics['TSNE_Bremm'] =  tsne_bremm
    topics['PCA_Bremm'] =  pca_bremm
    topics['UMAP_Bremm'] =  umap_bremm
    
    topics['TSNE_Schumann'] =  tsne_schumann
    topics['PCA_Schumann'] =  pca_schumann
    topics['UMAP_Schumann'] =  umap_schumann
    
    topics['TSNE_Steiger'] =  tsne_steiger
    topics['PCA_Steiger'] =  pca_steiger
    topics['UMAP_Steiger'] =  umap_steiger
    

    # the json file where the output must be stored
    topics_file = open("static/topics.json", "w")
    json.dump(topics.to_dict(), topics_file, indent = 6)
    topics_file.close()

    values = {"citationCount": -1, "publicationTypes": "none", "referenceCount":-1, "abstract": "none", "journal":"", "tldr":"",
    "venue": "", "athours":"", "publicationDate":"", "authors":""}
    orig_papers_with_topic = orig_papers_with_topic.fillna(value=values)
    # orig_papers_with_topic.fillna(-1)
    # the json file where the output must be stored
    paper_file = open("static/papers_with_topics.json", "w")
    json.dump(orig_papers_with_topic.to_dict(), paper_file, indent = 6)
    paper_file.close()

    return topics

    #pprint(tsne_bremm)
    #pprint(pca_bremm)
    #pprint(umap_bremm)
topic_modeling()