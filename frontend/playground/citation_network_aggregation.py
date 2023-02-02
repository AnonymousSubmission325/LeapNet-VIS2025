from semanticscholar import SemanticScholar
import json
import re
import codecs

sch = SemanticScholar(timeout=30)

def clean_text(text,t):
    cleaned_text = ""
    if t == "journal": 
        if text is dict:
            if(text['name']):
                cleaned_text = text['name']
    elif t == "tldr" and type(text) is dict: 
        cleaned_text = text['text']
    else: cleaned_text = text

    cleaned_text = cleaned_text.replace("/\\n/g", "\\n")
    cleaned_text = cleaned_text.replace("/\\'/g", "\\'")
    cleaned_text = cleaned_text.replace('/\\"/g', '\\"')
    cleaned_text = cleaned_text.replace('/\\&/g', "\\&")
    cleaned_text = cleaned_text.replace('/\\r/g', "\\r")
    cleaned_text = cleaned_text.replace('/\\t/g', "\\t")
    cleaned_text = cleaned_text.replace('/\\b/g', "\\b")
    cleaned_text = cleaned_text.replace('/\\f/g', "\\f")
    cleaned_text = cleaned_text.replace('\n', "")
    cleaned_text = cleaned_text.replace('\\n', "")
    cleaned_text = cleaned_text.replace('"', '')
    cleaned_text = cleaned_text.replace("'", "")
    cleaned_text = cleaned_text.replace('\\', '')
    cleaned_text = codecs.escape_decode(bytes(cleaned_text, "utf-8"))[0].decode("utf-8")
    cleaned_text = cleaned_text.encode("ascii", "ignore")
    cleaned_text = cleaned_text.decode()
    #cleaned_text = cleaned_text.replace('/', '')
    cleaned_text = cleaned_text.replace('$', '')
    cleaned_text = re.sub('<[^>]*>', '', cleaned_text)
    return cleaned_text

def handle_other_field(field,t):
    cleaned_field = "not found"
    if t == "authors": 
        cleaned_field = ""
        for a in field: 
            if a["authorId"]:
                cleaned_field = cleaned_field + "_" + a["authorId"]
    if t == "publicationDate": 
        if type(field) is dict:
            if field['year']: cleaned_field = str(field['year'])
            if field['month']: cleaned_field = cleaned_field + "_" + str(field['month'])
            if field['day']: cleaned_field = cleaned_field + "_" + str(field['day'])
            cleaned_field = str(field['year'] + "-" + field['month'] + "-" + field['day'])
        if type(field) is str:
            cleaned_field = field
    if t == "publicationTypes": cleaned_field = field[0]
    return cleaned_field

def clean_paper_to_json(paper_objects, layers):
    cleaned_paper_objects = {"papers":[]}
    
    # just for dev
    # unneeded_fields = ["citations", "embedding", "externalIds", "fieldsofStudy", "isOpenAccess"]
    remaining_fields = ["paperId", "citationCount", "publicationTypes", "referenceCount", "year"]
    text_fields = ["abstract", "journal", "title", "tldr", "url", "venue"]
    other_fields = ["authors", "publicationDate", "publicationTypes"]
    

    for p in paper_objects.keys():
        np = {}
        if p in layers.keys():
            np["layer"] = layers[p]
        for r in remaining_fields:
            if paper_objects[p][r]:
                np[r] = paper_objects[p][r]
        for t in text_fields:
            if paper_objects[p][t]:
                np[t] = clean_text(paper_objects[p][t], t)
        for o in other_fields:
            if paper_objects[p][o]:
                np[o] = handle_other_field(paper_objects[p][o], o)
        cleaned_paper_objects["papers"].append(np)

    return cleaned_paper_objects
        



# retrieve all papers connected with the seed papers
# paper_limit for development, R: add iteration approach to remain unbiased
# returns: dictionary of all paper objects, dictionary of paper citations 
#  
def append_child_and_parents(paper_objects, paper_hierarchies, paper_lookup, paper_limit, limit_reached, layer, layers):

#R: for n in range(iterations):
    for p in list(paper_objects.values()):

        id = p.paperId
        #list seed paper in objects
        if id not in paper_lookup:
            paper_lookup.append(id)
            paper_objects[id] = p

        
        #skip if zero
        if p.citations:
            for cid in p.citations:
                # if paper not already retrieved
                if cid not in paper_lookup:
                    #...store in lookup...
                    paper_lookup.append(cid)
                    #...search for paper and store in objects
                    try:
                        paper_ob = sch.get_paper(cid)
                        if paper_ob is not None:
                            paper_objects[cid] = sch.get_paper(cid)
                            layers[cid] = layer
                    except Exception:
                        pass
                    if len(paper_lookup) >= paper_limit:
                        limit_reached = True
                        break
                #skip if zero

        if p.references:
            for r in p.references:
                rid = r['paperId']

                # if paper not already retrieved
                if rid not in paper_lookup:
                    #...store in lookup...
                    paper_lookup.append(rid)
                    #...search for paper and store in objects
                    try:
                        paper_ob = sch.get_paper(rid)
                        if paper_ob is not None:
                            paper_objects[rid] = sch.get_paper(rid)
                            layers[rid] = layer
                    except Exception:
                        pass

                    if len(paper_lookup) >= paper_limit:
                        limit_reached = True
                        break


    #filter paper objects
    filter_paper_objects = {}
    for po in paper_objects.keys():
        if paper_objects[po].paperId:
            filter_paper_objects[po] = paper_objects[po]

    paper_objects = filter_paper_objects


    #create hierarchies 
    for k in list(paper_objects.keys()):
        if paper_objects[k].references:
            for r in paper_objects[k].references:
                if r in paper_objects.keys():
                    if k in paper_hierarchies.keys():
                            paper_hierarchies[k].append(r["paperId"])
                    else: 
                        paper_hierarchies[k] = [r["paperId"]]
        if paper_objects[k].citations:
            for c in paper_objects[k].citations:
                cid = c.paperId
                if cid in paper_objects.keys():
                    if cid in paper_hierarchies.keys():
                        paper_hierarchies[cid].append(k)
                    else:
                        paper_hierarchies[cid] = [k]
    
    paper_hierarchies_fin = {}

    for k in paper_hierarchies.keys():
        paper_hierarchies_fin[k] = list(dict.fromkeys(paper_hierarchies[k]))


    return paper_objects, paper_hierarchies_fin, paper_lookup, paper_limit, limit_reached, layer, layers

# param:
# seeds are used to collect references and start the network
# number of iterations to collect references
def aggregate_network(paper_objects, paper_limit):
    layers = {}
    seed_first_results = []
    for x in paper_objects:
        if(len(sch.search_paper(x))>0):
            seed_first_results.append(sch.search_paper(x)[0])
        else:
            print("Paper" + x + "not found" )

    layer = 0

    paper_objects = {}
    for x in seed_first_results: 
        p = sch.get_paper(x.paperId)
        paper_objects[x.paperId] = p
        layers[x.paperId] = layer

    seeds = { "seeds": [] }
    for s in seed_first_results:
        seeds['seeds'].append(s.paperId)

    # the json file where the output must be stored
    seed_file = open("static/seeds.json", "w")
    json.dump(seeds, seed_file, indent = 6)
    seed_file.close()


    paper_hierarchies = {}
    paper_lookup = []
    limit_reached = False

    while not limit_reached: 
        layer += 1
        paper_objects, paper_hierarchies, paper_lookup, paper_limit, limit_reached, layer, layers = append_child_and_parents(paper_objects, paper_hierarchies, paper_lookup, paper_limit, limit_reached, layer, layers)

    return paper_objects, paper_hierarchies, layers


def convert_network_to_json_formats(paper_hierarchies, paper_objects):
    network = { "nodes": [], "links": [] }

    for o in list(paper_objects.values()):
        network["nodes"].append({"id":o["paperId"]})

    for k in list(paper_hierarchies.keys()):
        for v in paper_hierarchies[k]:
            network["links"].append({"source":k, "target":v})

    return network

def convert_papers_to_json_formats(paper_objects, layers):
    return clean_paper_to_json(paper_objects, layers)

def dump(paper_objects, paper_hierarchies, layers):
    network_json = convert_network_to_json_formats(paper_hierarchies,paper_objects)
    papers_json = convert_papers_to_json_formats(paper_objects, layers)

    # the json file where the output must be stored
    network_file = open("static/network.json", "w")
    json.dump(network_json, network_file, indent = 6)
    network_file.close()

    # the json file where the output must be stored
    json_file = open("static/papers.json", "w")
    json.dump(papers_json, json_file, indent = 6)
    json_file.close()

    # add author data
    return True


def main(seedset, paper_num):

    # paper = sch.get_paper('10.1093/mind/lix.236.433')
    # kempe_paper = sch.search_paper("Maximizing the Spread of Influence through a Social Network")
    # alessio_paper = sch.search_paper("Influence Maximization With Visual Analytics")
    # saito_paper = sch.search_paper("Effective Visualization of Information Diffusion Process over Complex Networks")
    # paper = sch.get_paper(saito_paper[0].paperId)

    #TESTING
    #seedset = ["Event‐based Dynamic Graph Drawing without the Agonizing Pain","Visual Exploration of Financial Data with Incremental Domain Knowledge", "Vaim: Visual analytics for influence maximization","Influence Maximization With Visual Analytics", "A distributed multilevel force-directed algorithm", "Profiling distributed graph processing systems through visual analytics"]
    #seedset = ["Event‐based Dynamic Graph Drawing without the Agonizing Pain","Visual Exploration of Financial Data with Incremental Domain Knowledge", "Vaim: Visual analytics for influence maximization","Influence Maximization With Visual Analytics", "A distributed multilevel force-directed algorithm", "Profiling distributed graph processing systems through visual analytics"]
    #seedset = ["Event‐based Dynamic Graph Drawing without the Agonizing Pain"]
    paper_objects, paper_hierarchies, layers = aggregate_network(seedset,paper_num)

    dump(paper_objects, paper_hierarchies, layers)
    print("aggregation finished")
print('citation network will be aggregated')
