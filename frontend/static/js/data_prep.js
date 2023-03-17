function sortPointsClockwise(points) {
    // Determine the center of the points
    const center = [0.5, 0.5]
  
    // Calculate the angle between each point and the center
    const angles = points.map((point) => {
      const angle = Math.atan2(point['coords'][1] - center[1], point['coords'][0] - center[0]);
      const true_angle = angle < 0 ? angle + 2 * Math.PI : angle;
      return {angle:true_angle, paperId:point['paperId']};
    });
  
    const sortedPoints = angles.sort(function(first, second) {
        return second.angle - first.angle;});
    // Return the sorted array of points
    return sortedPoints;
  }

function prepare_data(paper_lookup, pwt_lookup, key_to_sort){
    // 
    //  following format is given:
    //      data = [
    //     ["id1", "id2", "id3","id4", "id5", "id12"],
    //     ["id7", "id8", "id9","id10", "id11"]
    // ]
    slices_unsorted = []

    var all_years = Object.entries(paper_lookup).map(p => p[1]['year'])
    var uniqueYears = [...new Set(all_years)];
    var sortedYears = uniqueYears.sort((a,b)=>a-b);
    var columns = sortedYears

    year_dic = {}
    sortedYears.map(year => year_dic[year] = [])
    
    Object.entries(paper_lookup).map( p => year_dic[p[1]['year']].push(p[0]));
    var all_years = Object.entries(year_dic).map(p => slices_unsorted.push(p[1]));
    data = []
    function sort_by_topic(slice){
        prep = slice.map(c => {return {coords: pwt_lookup[c]['pca'], paperId:c}})
        sorted = sortPointsClockwise(prep)
        sorted_fin = sorted.map(s => {return s['paperId']})
        return sorted_fin
    }
    slices_unsorted.map(s => data.push(sort_by_topic(s)))
    //slices_unsorted.map(s => data.push(s))

    return [data, columns]
}


function prep_geninfo(selection, pwk_lookup, authors){
  
  var venue_rel = {}
  selection.forEach(s => {
    console.log(pwk_lookup[s])
    a = pwk_lookup[s]["venue"]
    if(a !== ""){
      if((Object.keys(venue_rel).includes(a))){
        venue_rel[a] = venue_rel[a] + 1
      }
      else{ venue_rel[a] = 1}
    }
  });
  var author_ls = []
  var max = 0
  Object.entries(venue_rel).forEach(([k,v]) => {
    if(max<v){max =v}
    author_ls.push({author:k, value:v })
  })
  author_ls.sort(function(a, b) {
    return b["value"] - a["value"];
  });
  author_ls["columns"]= ["author", "value"]

  return [author_ls,max]
}





function prep_keys_author(selection, pwk_lookup, authors){
  
  var authors_rel = {}
  selection.forEach(s => {
    a_ls = authors.papers[s]
    a_ls.forEach(a => {
      if((Object.keys(authors_rel).includes(a))){
        authors_rel[a] = authors_rel[a] + 1
      }
      else{ authors_rel[a] = 1}
    })
  });
  var author_ls = []
  var max = 0
  Object.entries(authors_rel).forEach(([k,v]) => {
    if(max<v){max =v}
    author_ls.push({author:k, value:v })
  })
  author_ls.sort(function(a, b) {
    return b["value"] - a["value"];
  });
  author_ls["columns"]= ["author", "value"]

  return [author_ls,max]
}


function prep_keys_venue(selection, pwk_lookup, authors){
  
  var venue_rel = {}
  selection.forEach(s => {
    a = pwk_lookup[s]["venue"]
    if(a !== ""){
      if((Object.keys(venue_rel).includes(a))){
        venue_rel[a] = venue_rel[a] + 1
      }
      else{ venue_rel[a] = 1}
    }
  });
  var author_ls = []
  var max = 0
  Object.entries(venue_rel).forEach(([k,v]) => {
    if(max<v){max =v}
    author_ls.push({author:k, value:v })
  })
  author_ls.sort(function(a, b) {
    return b["value"] - a["value"];
  });
  author_ls["columns"]= ["author", "value"]

  return [author_ls,max]
}



function prep_network(selection, pwk_lookup, source_lookup, children_lookup){
    node_lu = []
    nodes = []
    links = []

    console.log(selection)
    console.log(pwk_lookup)
    console.log(source_lookup)
    console.log(children_lookup)

    selection.forEach(s => {
      node_lu.push(s)
      if(source_lookup[s]){
        source_lookup[s].forEach(l => {
            node_lu.push(l)
            node_lu.push(s)
          
        })
      }
      if(children_lookup[s]){
        children_lookup[s].forEach(l => {
            node_lu.push(l)
            node_lu.push(s)
        })
      }
    })

    var rel_nodes = node_lu.reduce(function(list, item, index, array) { 
      if (array.indexOf(item, index + 1) !== -1 && list.indexOf(item) === -1) {
        list.push(item);
      }
      return list;
    }, []);
    var already_in = []

    selection.forEach(s => {
      nodes.push({"id" : s})
      node_lu.push(s)
      if(source_lookup[s]){
        source_lookup[s].forEach(l => {
            if(rel_nodes.includes(l)){
              if(!(already_in.includes(l))){
              nodes.push({"id" : l})
              already_in.push(l)
            }
            links.push({"source":l, "target":s})
          }
        })
      }
      if(children_lookup[s]){
        children_lookup[s].forEach(l => {
          if(rel_nodes.includes(l)){
            if(!(already_in.includes(l))){
            nodes.push({"id" : l})
            already_in.push(l)
          }
          links.push({"source":l, "target":s})
        }
        })
      }
    })


    var graph = {"nodes": nodes, "links":links}
    //while 
    console.log(graph)
    return graph
}

function prep_influ(selection, pwk_lookup){
  
  //get maximas
  var data = []
  var mtemp = ["citationCount", "referenceCount", "betweenc", "degreec", "degreec"]
  var maxis = {citationCount:0.0000000000000000000000001, referenceCount:0.0000000000000000000000001, betweenc:0.0000000000000000000000001, degreec:0.0000000000000000000000001, degreec:0.0000000000000000000000001}
  var colors = []
  selection.forEach(s => {
    colors.push(pwk_lookup[s]["PCA_Bremm"])
    mtemp.forEach(a =>{
      console.log(pwk_lookup[s][a])
      if( pwk_lookup[s][a] > maxis[a]){maxis[a] =  pwk_lookup[s][a]}
      if( pwk_lookup[s][a] == 0 ){pwk_lookup[s][a] = 0.0000000000000000000000001}
    })
  })
  var maxistr = {}
  maxistr["#Citation"] = maxis["citationCount"]
  maxistr["#Reference"] = maxis["referenceCount"]
  maxistr["Betweenness"] = maxis["betweenc"]
  maxistr["Degree"] = maxis["degreec"]
  maxistr["Connectivity"] = maxis["degreec"]

  selection.forEach(s => {
    pinfl = []
    pinfl.push({axis: "#Citation", value: pwk_lookup[s]["citationCount"]/maxis.citationCount})
    pinfl.push({axis: "#Reference", value: pwk_lookup[s]["referenceCount"]/maxis.referenceCount})
    pinfl.push({axis: "Betweenness", value: pwk_lookup[s]["betweenc"]/maxis.betweenc})
    pinfl.push({axis: "Degree", value: pwk_lookup[s]["degreec"]/maxis.degreec})
    pinfl.push({axis: "Connectivity", value: pwk_lookup[s]["degreec"]/maxis.degreec})
    data.push(pinfl)
  })

  return [data,colors, maxistr];
}