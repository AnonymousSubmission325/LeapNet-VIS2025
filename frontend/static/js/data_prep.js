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
    console.log(a)
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
    all_nodes = []
    console.log(selection)
    console.log(pwk_lookup)
    console.log(source_lookup)
    console.log(children_lookup)
    //while 
    var treeData =
    {
      "name": "Top Level",
      "children": [
        { 
      "name": "Level 2: A",
          "children": [
            { "name": "Son of A" },
            { "name": "Daughter of A" }
          ]
        },
        { "name": "Son of A" }
      ]
    };
  
}

function prep_influ(selection, pwk_lookup){
  //get maximas
  var data = []
  var ax = ["Citation Count", "Reference Count", "Betweenness Centrality", "Closeness Centrality", "Connectivity"]
  selection.forEach(s => {
    pinfl = []
    pinfl.push({axis: "Citation Count", value: pwk_lookup[s]["citationCount"]})
    pinfl.push({axis: "Reference Count", value: pwk_lookup[s]["referenceCount"]})
    pinfl.push({axis: "Betweenness Centrality", value: pwk_lookup[s]["betweenc"]})
    pinfl.push({axis: "Degree Centrality", value: pwk_lookup[s]["degreec"]})
    pinfl.push({axis: "Connectivity", value: pwk_lookup[s]["degreec"]})
    data.push(pinfl)
  })

  var data = [
    [//iPhone
    {axis:"Citation Count",value:0.22},
    {axis:"Reference Count",value:0.28},
    {axis:"Betweenness Centrality",value:0.29},
    {axis:"Closeness Centrality",value:0.17},
    {axis:"Connectivity",value:0.22}	
    ],[//Samsung
    {axis:"Citation Count",value:0.27},
    {axis:"Reference Count",value:0.16},
    {axis:"Betweenness Centrality",value:0.35},
    {axis:"Closeness Centrality",value:0.13},
    {axis:"Have Internet Connectivity",value:0.20},
    {axis:"Connectivity",value:0.13}
    ]
  ];
  return data;
}