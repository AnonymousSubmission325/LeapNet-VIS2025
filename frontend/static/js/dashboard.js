function my_Func(network, papers, seeds, keys, key_projections, pwk, paths, authors){
  data = network
  papers = papers['papers']
  papers.forEach(paper => {paper["authors_name"] = authors['papers'][paper.paperId]})
  pwk = pwk['papers']
  seeds = seeds['seeds']
  var max_layer = Math.max(...papers.map(paper => paper.layer))
  var paper_lookup = {}
  papers.forEach(paper => {paper_lookup[paper.paperId] = paper})
  var source_lookup = {}
  var children_lookup = {}
  network['links'].forEach(link => {
    if(source_lookup[link['source']]){ source_lookup[link['source']].push(link['target']);}
    else {source_lookup[link['source']] = [link['target']]; }

    if(children_lookup[link['target']]){ children_lookup[link['target']].push(link['source']);}
    else {children_lookup[link['target']] = [link['source']]; }
  })


  var key_lookup = {}
  keys.forEach(k => {key_lookup[k.key] = k})
  var pwk_lookup = {}
  pwk.forEach(paper => {pwk_lookup[paper.paperId] = paper})

  console.log("network")
  console.log(network)
  console.log("source lookup")
  console.log(source_lookup)
  console.log("papers")
  console.log(papers)
  console.log("paper_lookup")
  console.log(paper_lookup)
  console.log("seeds")
  console.log(seeds)
  console.log("keys")
  console.log(keys)
  console.log("paths")
  console.log(paths)
  console.log("key_projections")
  console.log(key_projections)
  console.log("pwk_lookup")
  console.log(pwk_lookup)
  console.log("paths")
  console.log(paths)
  console.log("authors")
  console.log(authors)

var rect = document.querySelector('#hex');
var width = rect.clientWidth;
var height = rect.clientHeight;
var hexradius = 20;
// set the dimensions and margins of the graph
var margin = {top: 50, right: 30, bottom: 30, left: 60}
var svg = d3.select("div#hex").append("svg")
//  .attr("preserveAspectRatio", "xMinYMin meet")
//  .attr("viewBox", "0 0 " + String(width) + " " +  String(height) )
.attr("width", width)
.attr("height", height)
.classed("svg-content", true)
.append("g")
// .on("click", function() { unhover_pub("None")})
 //.attr("transform","translate(" + margin.left + "," + margin.top + ")");
PROJECTION = 'pca' 
PROJECTION_KEYCLUSTERCENTERS = 'pca_biggestcluster_center' 
PROJECTION_KEYCLUSTERNUMS = 'pca_numberofelem' 
color_map = 'PCA_Bremm'
key_to_sort = 'year'

var randomX = d3.randomNormal(width, 80),
randomY = d3.randomNormal(height, 80),

points = []
pwk.forEach(element => {points.push([element[PROJECTION][0] * (width),element[PROJECTION][1]* (height), element.paperId])});
//points = d3.range(network['nodes'].length).map(function() { return [randomX(), randomY()]; });
keyword_points = []
keys.forEach(element => {keyword_points.push([element[PROJECTION_KEYCLUSTERCENTERS][0], element[PROJECTION_KEYCLUSTERCENTERS][1],element.key])});



//https://stackoverflow.com/questions/50029490/in-d3-hexbin-increase-radius-of-multiple-hexagons-with-mouseover
//resize



//these are not the numbers in keys. check why different! maybe create an copy beacuse keys is alternes

var field = svg.append("g")

var card_ids = []
var bib_ids = []
var bin_lookup = {}
var bins = []
var click_ids = []

var tlayer = false
var hlayer = false
var clayer = false
var blayer = false
var nlayer = false
var alayer = false
var rlayer = false
var slayer = false
var ilayer = false

function createTrackBins(){

  var color = d3.scaleSequential(d3.interpolateLab("transparent","yellow", "blue"))
  .domain([0, 100 ]);

  const hexSize = 30;

  const hexWidth = Math.sqrt(3) * hexSize;
  const hexHeight = 2 * hexSize;
  const numCols = Math.floor((width - margin.left - margin.right) / hexWidth);
  const numRows = Math.floor((height - margin.top - margin.bottom) / hexHeight);
  const xSpacing = hexWidth;
  const ySpacing = 1.5 * hexHeight;
  const data = [];
  for (let i = 0; i < numRows; i++) {
    const y = margin.top + i * ySpacing;
    const offset = i % 2 === 0 ? 0 : hexWidth / 2;
    for (let j = 0; j < numCols; j++) {
      const x = margin.left + j * xSpacing + offset;
      data.push({ x, y });
    }
  }
  const hexagons = field.append("g")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("d", d3.hexbin())
    .attr("transform", d => `translate(${d.x},${d.y})`)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1);
}
createTrackBins()

var colorStroke = d3.scaleSequential(d3.interpolateLab("white", "black"))
.domain([0, d3.max(bins, d => d.length)/3 ]);
//HEXBINS
function createHexBins(hexbin_slider_vals){
  var hexbin = d3.hexbin()
  .size([width,height])
  .radius(hexbin_slider_vals);
  bins = hexbin(points)
  var color = d3.scaleSequential(d3.interpolateLab("white", "blue"))
  .domain([0, d3.max(bins, d => d.length)/3 ]);

  var widthStroke = d3.scaleLinear(1,70)
  .domain([0, d3.max(bins, d => d.length)/3 ]);
  
  hexagons_g = field.append("g").selectAll(".hexagon")
    .data(bins)
    .enter().append("path")
    .attr("id", function(d,i) { return "hex" + String(i)})
    .attr("d", hexbin.hexagon())
    .attr("class", "hexagon_path")
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .style("fill", function(d) { return "transparent"; })
    .style('opacity', 0.5)
    .style('stroke', function(d) { return colorStroke(d.length); })
    .style('stroke-width', function(d) { return String(widthStroke(d.length))+'px'; })
    .on("mouseover", function(d) {
      d3.select(this).style("stroke", "red");
      // var pubs = []
      // d.forEach(function(e){
      //   pubs.push(e[2])
      // })
      // hover_pubs(pubs);
    })
    .on("mouseout", function() {
      d3.select(this).style("stroke", function(d) { return colorStroke(d.length)})
      // unhover_pub("None");
    })
    .on("click", function(arr) {

      var result = [];
      for (let i = 0; i < arr.length; i++) {
        const [, , third] = arr[i]; 
        result.push(third);
      }
      unhover_pub("None")
      if(d3.event.ctrlKey){
        click_ids.push(...result)
      }
      else{
        click_ids = result
      }
      hover_pubs(click_ids);
      clicked_pubs(click_ids)

    });
    bins.forEach((d,i) => d.forEach(e => bin_lookup[e[2]]= i))
}


var widthScale = d3.scaleLinear()
  .domain([0, 1])
  .range([0, width]);

var heightScale = d3.scaleLinear()
  .domain([0, 1])
  .range([0, height]);


  const getOverlapFromTwoExtents = (l, r) => {
    var overlapPadding = -20
    l.left = l.x - overlapPadding
      l.right = l.x + l.width + overlapPadding
      l.top = l.y - overlapPadding
      l.bottom = l.y + l.height + overlapPadding
    r.left = r.x - overlapPadding
      r.right = r.x + r.width + overlapPadding
      r.top = r.y - overlapPadding
      r.bottom = r.y + r.height + overlapPadding
    var a = l
    var b = r

    if (a.left >= b.right || a.top >= b.bottom ||
        a.right <= b.left || a.bottom <= b.top ){
      return false
    } else {
      return true
    }
  }

function create_keywords(keynum){
  var hierachic_array = []
  hierachic_array = [...Array(keynum).keys()];
  //var old_hierachic_array = [0,1,2,3,5,8,10,13]
  var max_index = hierachic_array.length
  //select particular clusters??


  var fontsize_scale = d3.scaleLinear()
              .domain([0, keynum])
              .range([3, 0.4]);
  
  var textopacity_scale = d3.scaleLinear()
              .domain([0, keynum])
              .range([0.4, 1]);
  var already_used_key = []
  var key_proj_flat = []

  key_projections.forEach( function(d,i) {
    d.forEach(e =>{
      if(e['keys'].length > 0){
        if(!(already_used_key.includes(e['keys'][0]))){
          already_used_key.push(e['keys'][0]);
            e["index"] = i; 
            key_proj_flat.push(e)}
        }
      })
  })

  var already_used = []

  keytext_g = field.append("g").style("class","keytext_g")
  textLabels = keytext_g.selectAll(".keytexts")
    .data(key_proj_flat)
    .enter()
    .append("text")
    .filter(function(d){
      leave = false
      if(keynum >= d.index){
        leave = true
      }
      used = JSON.stringify(already_used);
      elem = JSON.stringify(d.coords);
      indexx = used.indexOf(elem);
      if(indexx != -1){
        leave = false
        leave = false
      }
      if (leave==true){already_used.push(d.coords)}
      return leave})
    .attr("class", "keytext")
    .attr("x", function(d) { return widthScale(d.coords[0]) })
    .attr("y", function(d) { return heightScale(d.coords[1])})
    .text(function(d) { if (d.keys.length > 0){return d.keys[0]} else{return d.keys}; })
    .style("text-anchor", "middle")
    .style('font-size', function(d) {return fontsize_scale(d.index) + 'em'})
    .style('opacity', function(d) { return textopacity_scale(d.index)})
    .style('fill', function(d) { return d.color['bremm']})
    .on("click", function(d) {this.remove()})
  
      
  // Cycle through dedupables and dedupe them
  textLabels.each(function(d, i) {
    
    // Get bounding box
    var thisBBox = this.getBBox()
    
    // Iterate through each box to see if it overlaps with any following
    // If they do, hide them
    // And only get labels later in the order than this one
    textLabels.filter((k, j) => j > i).each(function(d){
        var underBBox = this.getBBox()
        // If not overlapping with a subsequent item, and isn't meant to be shown always, hide it
        if(getOverlapFromTwoExtents(thisBBox, underBBox) && d3.select(this).attr('class').match('dedupe-always-show') == null){
          d3.select(this)
                // TODO: This animation is just for the Observable demo
                .style('opacity', 1)
                .transition().delay(500).duration(1000)
            .style('opacity', 0)
        }
    })
  })
}


var keywordnum_slider = document.getElementById("keywordnumslider");
// Update the current slider value (each time you drag the slider handle)
keywordnum_slider.oninput = function() {
  d3.selectAll(".keytext").remove()
  create_keywords(keywordnum_slider.value)
}



create_keywords(80)
createHexBins(hexradius)

  
function create_stacked_bars(){


  // var svg = d3.select("div#vis")
  // .append("svg")
  // .attr("preserveAspectRatio", "xMinYMin meet")
  // .attr("viewBox", "0 0 1000 1000")
  // .classed("svg-content", true)
  // .append("g").attr("transform","translate(" + margin.left + "," + margin.top + ")");

    var prepared_for_stacks = prepare_data(paper_lookup,pwk_lookup,keys , key_to_sort)
    console.log(prepared_for_stacks)
    var data_stack = prepared_for_stacks[0]
    var columns = prepared_for_stacks[1]

    max_stack = 0
    data_stack.map(d => {if(d.length > max_stack){max_stack=d.length} })
    max_year = 0
    min_year = 10000
    papers.map(d => { var current_year = d.year
                      if(current_year > max_year){ max_year=current_year} 
                      if(current_year < min_year){ min_year=current_year}})

    var cellSize = 4.3;
    // var width = data_stack.length * (cellSize + border) , height = max_stack * cellSize + border;
    // var rect = document.querySelector('#stacks');
    // var width = rect.offsetWidth;
    // var height = rect.offsetHeight;

    var rect = document.querySelector('#timeline-down');
    var styles = window.getComputedStyle(rect);
    var height = rect.clientHeight - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom);
    var width = rect.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
    var axisheight = rect.clientHeight * 0.1



    var x = d3.scaleBand()
      .range([0, width])
      .domain(d3.range(min_year, max_year+1));
    var y = d3.scaleBand()
        .range([0, height-axisheight])
        .domain(d3.range(max_stack)); //get maximum length

    var svg = d3.select("div#timeline-down") 
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .classed("svg-content", true)
    

    // Show the bars

    
    // const xAxisGrid = d3.axisBottom(x).tickSize(-(height-axisheight)).tickFormat('');

    // svg.append('g')
    // .attr('class', 'axis-grid')
    // .attr('transform', 'translate(0,' + (height-axisheight) + ')')
    // .call(xAxisGrid);



    var container = 
      svg.selectAll("stacks")
      .data(data_stack)
      .enter().filter(function(d){ return pwk_lookup[d[0]]['year'] !== "undefined"})
      .append("g")
      .attr('transform', function(d, i) { return 'translate(' + (x(pwk_lookup[d[0]]['year']) + (cellSize/2)) + ',0)';})
      //.attr("x", function(d,i) { return x(i); })
      //.attr('transform', function(d,i) { return 'translate('+ x(i) + ', 0)';})
    var rows = container.selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; }).enter()
      .append("rect").attr("class", function(d) {return 's' + String(pwk_lookup[d]['year']); })
        .attr("y", function(d,i) { return y(i); })
        .attr("height", cellSize)
        .attr("width",cellSize)
        .attr("fill", function(d) { return pwk_lookup[d]['PCA_Bremm']; })
        //.attr("opacity", function(d) { return topics[color_map][pwk_lookup[d]['Topic_Perc_Contrib']]; })
        .style("stroke", function(d) {if(seeds.includes(d)){return "blue"} })
        // .on("mouseover", function(d) { hover_pub(d) })
        // .on("mouseout", function(d) { unhover_pub(d) })
        .on("click", function(d) {
          hover_pub(d)
          clicked_pubs([d])})
        .append("g").attr("class", function(d){return "r" + d})
  //IDEA: append text to single bars
        // container.append("text")
    // .text(function(d) {      console.log( pwk_lookup[d[0]]['year']);          
    //          return pwk_lookup[d[0]]['year'];
    // })
    // .attr("text-anchor", "middle")
    // .attr("x", function(d, i) {
    //      return x(0);
    // })
    // .attr("y", function(d) {
    //      return 0;
    // })
    // .attr("font-family", "sans-serif")
    // .attr("font-size", "11px")



    // Draw the axis
    var xAxis = d3.axisBottom(x).tickValues(x.domain()).tickFormat((interval,i) => {
      return i%5 !== 0 ? " ": interval;
     })
    var rect = document.querySelector('#timeline-down');
    var rheight = rect.offsetHeight - rect.offsetHeight*0.08;

    svg
    .append("g")
    .attr("transform", "translate(0," +  rheight + ")")      // This controls the vertical position of the Axis
    .call(xAxis);
    
    svg.selectAll('.tick text')
    .attr('font-size', '0.9em')
    .attr('font-family', 'Roboto')
    .attr('fill', 'darkgrey')

    groups = columns.map(c => '.s' + String(c) )
    for (const group of groups){
        stack_height = 0;
        svg.selectAll(group).each(function(d){
          stack_height = stack_height + parseInt(this.attributes.height.value)
          moving_distance = (height-axisheight)/2 - stack_height/2
          svg.selectAll('g').selectAll(group).transition().duration(2000).attr("transform", "translate(" + 0 + "," + moving_distance + ")");
    })
        
    }
    // Initialize the links
    var links = svg
    .selectAll("time_line")
    .data(network.links)
    .enter().filter(d => pwk_lookup[d.source] && pwk_lookup[d.target] )
    .append("line")
    .style("stroke", "transparent")
    .attr("x1", function(d) { return (x(pwk_lookup[d.source]['year']) + (cellSize/2) + cellSize/2 ); })
    .attr("y1", function(d) { 
      var i = data_stack[columns.indexOf(pwk_lookup[d.source]['year'])].indexOf(d.source)
      var moving_distance  = 0
      var stack_height = 0;
      svg.selectAll('.s' + pwk_lookup[d.source]['year']).each(function(d){
        stack_height = stack_height + parseInt(this.attributes.height.value)
        moving_distance = (height-axisheight)/2 - stack_height/2
      })
      return y(i) + moving_distance + cellSize/2; })
    .attr("x2", function(d) { return (x(pwk_lookup[d.target]['year']) + (cellSize/2) + cellSize/2); })
    .attr("y2", function(d) { 
      var i = data_stack[columns.indexOf(pwk_lookup[d.target]['year'])].indexOf(d.target)
      var moving_distance  = 0
      var stack_height = 0;
      svg.selectAll('.s' + pwk_lookup[d.target]['year']).each(function(d){
        stack_height = stack_height + parseInt(this.attributes.height.value)
        moving_distance = (height-axisheight)/2 - stack_height/2
      })
      return y(i) + moving_distance + cellSize/2; })
    


    
  }

  create_stacked_bars()

  function insert_all_points(pwk_lookup){
     var symbolset = ["\u2605", "\u2B29", "\uf111"]


    var layer1 = []
    var layer2 = []
    var layer3 = []
    pwk.forEach(p=>{
      if(!(card_ids.includes(p.paperId))){
        if(p.layer == 0){layer1.push(p)}
        if(p.layer == 1){layer2.push(p)}
        if(p.layer >= 2){layer3.push(p)}
      }
    })
    var el = document.getElementById('hex');
    var style = window.getComputedStyle(el, null).getPropertyValue('font-size');
    var fontSize = parseFloat(style); 

    var curr_stroke = "transparent"
    // Initialize the links
    var links = field
    .selectAll("line")
    .data(network.links)
    .enter().filter(d => pwk_lookup[d.source] && pwk_lookup[d.target] )
    .append("line")
    .style("stroke", "transparent")
    .attr("x1", function(d) { return widthScale(pwk_lookup[d.source]['pca'][0]); })
    .attr("y1", function(d) { return heightScale(pwk_lookup[d.source]['pca'][1]); })
    .attr("x2", function(d) { return widthScale(pwk_lookup[d.target]['pca'][0]); })
    .attr("y2", function(d) { return heightScale(pwk_lookup[d.target]['pca'][1]); })
    // .on("mouseover", function(d) {
    //   curr_stroke = window.getComputedStyle(this).getPropertyValue("stroke");
    //   if(!(curr_stroke=="transparent")){
    //   d3.select(this).style("stroke", "red");
    //   }
    // })
    // .on("mouseout", function() {
    //   d3.select(this).style("stroke", curr_stroke)
    // })
    .on("click", function(d) {
      var linked = []
      linked.push(d.source)
      linked.push(d.target)
      unhover_pub("None")
      if(d3.event.ctrlKey){
        click_ids.push(...linked)
      }
      else{
        click_ids = linked
      }
      console.log(linked)

      hover_pubs(click_ids) 
      clicked_pubs([click_ids])});


    var seeds = field.selectAll(".seed_layer")
    .data(layer1)
    .enter()
    .append("g").attr("class", function(d){return "seedpoint"}) 
    .append("text").attr("class", function(d){return "seedpoint2"})        // Append a text element
    .attr("class", "fa")  // Give it the font-awesome class
    .attr('text-anchor', 'middle')
    .text(function(d){return symbolset[0]})      // Specify your icon in unicode
    .style("font-size", "1.2em")
    .attr('x', function(d){return widthScale(pwk_lookup[d.paperId]['pca'][0])})
    .attr('y', function(d){return heightScale(pwk_lookup[d.paperId]['pca'][1]) + fontSize*0.2})
    // .attr("fill", function(d){return "#3B3B3B"})
    .attr("fill", function(d){return pwk_lookup[d.paperId].PCA_Bremm})
    .attr("width", 1)
    .attr("height", 1)
    // .on("mouseover", function(d) { hover_pub(d) })
    // .on("mouseout", function(d) { unhover_pub(d) })
    .on("click", function(d) {
      hover_pub(d.paperId) 
      clicked_pubs([d.paperId])});

    var rels = field.selectAll(".relation_layer")
    .data(layer2)
    .enter()
    .append("g").attr("class", function(d){return "relationpoint"}) 
    .append("text")       // Append a text element
    .attr("class", "fa")  // Give it the font-awesome class
    .attr('text-anchor', 'middle')
    .text(function(d){return symbolset[1]})      // Specify your icon in unicode
    .style("font-size", "2em")
    .attr('x', function(d){return widthScale(pwk_lookup[d.paperId]['pca'][0])})
    .attr('y', function(d){return heightScale(pwk_lookup[d.paperId]['pca'][1]) + fontSize*0.75})
    // .attr("fill", function(d){return "#525252"})
    .attr("fill", function(d){return pwk_lookup[d.paperId].PCA_Bremm})
    .attr("width", 1)
    .attr("height", 1)
    // .on("mouseover", function(d) {
    //   hover_pub(d.paperId) 

    //   // var so = source_lookup[d.paperId]
    //   // if(so == 'undefined' || so == null){so = []}
    //   // var ch = children_lookup[d.paperId]
    //   // if(ch == 'undefined' || ch == null){ch = []}

    //   // links.style('stroke', function (link_d) {return link_d.source === d.paperId || link_d.target === d.paperId ? '#696969' : 'transparent';})
    //   // seeds.attr('opacity', function (e) { return e.paperId === d.paperId || so.includes(e.paperId) || ch.includes(e.paperId) ? 1 : 0.2;})
    //   // rels.attr('opacity', function (e) { return e.paperId === d.paperId || so.includes(e.paperId) || ch.includes(e.paperId) ? 1 : 0.2;})
    //   // spaces.attr('opacity', function (e) { return e.paperId === d.paperId || so.includes(e.paperId) || ch.includes(e.paperId) ? 1 : 0.2;})
    //   // selection.attr('opacity', function (e) { return e.paperId === d.paperId || so.includes(e.paperId) || ch.includes(e.paperId) ? 1 : 0.2;})
    // })
    // .on("mouseout", function(d) {
    //   unhover_pub(d) 
    // })
    .on("click", function(d) {
      hover_pub(d.paperId) 
      clicked_pubs([d.paperId])});

    var spaces = field.selectAll(".space_layer")
    .data(layer3)
    .enter()
    .append("g").attr("class", function(d){return "spacepoint"}) 
    .append("text")       // Append a text element
    .attr("class", "fa")  // Give it the font-awesome class
    .attr('text-anchor', 'middle')
    .text(function(d){return symbolset[2]})      // Specify your icon in unicode
    .style("font-size", "0.6em")
    .attr('x', function(d){return widthScale(pwk_lookup[d.paperId]['pca'][0])})
    .attr('y', function(d){return heightScale(pwk_lookup[d.paperId]['pca'][1]) + fontSize*0.2})
    // .attr("fill", function(d){return "#696969"})
    .attr("fill", function(d){return pwk_lookup[d.paperId].PCA_Bremm})
    .attr("width", 1)
    .attr("height", 1)
    // .on("mouseover", function(d) { hover_pub(d) })
    // .on("mouseout", function(d) { unhover_pub(d) })
    .on("click", function(d) {
      hover_pub(d.paperId) 
      clicked_pubs([d.paperId])});

  }

  insert_all_points(pwk_lookup)

  function insert_seedselection(card_ids, point_color_lookup){
    
    function getHexagonVertices(cx, cy, r) {
      const vertices = [];
      const angle = Math.PI / 3; // 60 degrees in radians
      const angled = Math.PI / 6; // 30 degrees in radians
      for (let i = 0; i < 6; i++) {
        const x =  cx + r * Math.cos(angle * i - angled );
        const y = cy + r * Math.sin(angle * i - angled );
        vertices.push([x, y]);
      }
      return vertices;
    }
    var symbolset = ["\uf02e", "\uf0c8", "\uf111"]

    var clienth = 100
    var clientw = 100
    var size = 0
    if(clienth<clientw){size = clienth}
    else{size=clientw}

    var localhexradius = size
    var verticesh = getHexagonVertices(0,0, localhexradius)
    var el = document.getElementById('hex');
    var style = window.getComputedStyle(el, null).getPropertyValue('font-size');
    var fontSize = parseFloat(style); 

    var selection = field.selectAll(".selection_points")
    .data(card_ids)
    .enter()
    .append("g").attr("class", function(d){return "seedp"}) 
    .append("text")       // Append a text element
    .attr("class", "fa")  // Give it the font-awesome class
    .attr('text-anchor', 'middle')
    // .text(function(d){return symbolset[parseInt(pwk_lookup[d]['layer'])]})      // Specify your icon in unicode
    .text(function(d){return '⬢'})      // Specify your icon in unicode
    .style("font-size", "1em")
    .attr('x', function(d){return widthScale(pwk_lookup[d]['pca'][0])})
    .attr('y', function(d){return heightScale(pwk_lookup[d]['pca'][1])+ fontSize*0.2})
    // .attr("fill", function(d){return point_color_lookup[d]})
    .attr("fill", function(d){return pwk_lookup[d].PCA_Bremm})
    .attr("width", 1)
    .attr("height", 1)
    // .on("mouseover", function(d) { hover_pub(d) })
    // .on("mouseout", function(d) { unhover_pub(d) })
    .on("click", function(d) {
      hover_pubs([d])
      clicked_pubs([d])});

    var relevant_bins = {}
    var paper_to_seed_lookup = {}
    var bin = '';

    card_ids.forEach(s => {
      if(source_lookup[s]){
        source_lookup[s].forEach( p => {
          if(paper_to_seed_lookup[p]){ paper_to_seed_lookup[p].push(s);}
          else {paper_to_seed_lookup[p] = [s]; }
          bin = bin_lookup[p]
          if(relevant_bins[bin]){ relevant_bins[bin].push(p);}
          else {relevant_bins[bin] = [p]; }
        })
      }
      if(children_lookup[s]){
        children_lookup[s].forEach( p => {
          if(paper_to_seed_lookup[p]){ paper_to_seed_lookup[p].push(s);}
          else {paper_to_seed_lookup[p] = [s]; }
          bin = bin_lookup[p]
          if(relevant_bins[bin]){ relevant_bins[bin].push(p);}
          else {relevant_bins[bin] = [p]; }
        })
      }
    })

    var max_pinbin = 0 
    Object.values(relevant_bins).forEach(b => {if(b.length>max_pinbin){max_pinbin = b.length}})
    var fillopacity_scale = d3.scaleLinear()
    .domain([0, max_pinbin])
    .range([0.2, 0.7]);
    svg.selectAll("#cdefs").selectAll("*").remove()
    svg.selectAll(".cdefs").selectAll("*").remove()
    // var defs = svg.append("defs").attr("class", "cdefs");
    console.log(relevant_bins)
    Object.keys(relevant_bins).forEach(b =>{
      var relevant_bins_p_hex = relevant_bins[b]
      console.log(relevant_bins_p_hex)
      //checkbox
      var count = {}
      var andorbox = document.getElementById("andorbox").checked;
      if(andorbox){
        var count = {};
          for (var num of relevant_bins_p_hex) {
            count[num] = count[num] ? count[num] + 1 : 1;
        }
        var relevant_bins_t = []
        Object.keys(count).forEach(i =>{
          if(count[i]>=bins[bin_lookup[i]].length){
            relevant_bins_t.push(i)
          }
        })
        
        relevant_bins_p_hex = relevant_bins_t
      }

      var hex = d3.select('#hex' + String(b)).datum()
      var verticesh = getHexagonVertices(hex.x,hex.y, hexradius)
      
      var relevant_selection = []
      relevant_bins_p_hex.forEach( function(c){
        paper_to_seed_lookup[c].forEach( function(d){
          if(!(relevant_selection.includes(d))){
            relevant_selection.push(d)
          }
        })

      })
      relevant_selection.forEach(function(s) {
        var i = card_ids.indexOf(s)
        var next = i+1
        if(next == 6){next=0}

                // Define the points of the triangle
        var points = hex.x + ',' + hex.y + ' ' + verticesh[i][0] + ',' + verticesh[i][1] + ' ' + verticesh[next][0] + ',' + verticesh[next][1] 
        // Add a path element to the SVG element and set its d attribute to the points
        svg.append("g").attr("class", "triangle").append("path")
          .attr("d", "M " + points + " Z")
          // .attr('stroke', 'black')
          .attr("fill", pwk_lookup[s].PCA_Bremm)
          .style('opacity',fillopacity_scale(relevant_bins[b].length))
          .on("mouseover", function(d) {
            d3.select('#hex' + String(b)).style("stroke", "red");
            // var pubs = []
            // d.forEach(function(e){
            //   pubs.push(e[2])
            // })
            // hover_pubs(pubs);
            // hover_pubs(pubs);
          })
          .on("mouseout", function() {
            d3.select('#hex' + String(b)).style("stroke", function(d) { return colorStroke(d.length)})
            // unhover_pub("None");
          })
          .on("click", function() {
      
            unhover_pub("None")
            if(d3.event.ctrlKey){
              click_ids.push(...relevant_bins_p_hex)
            }
            else{
              click_ids = relevant_bins_p_hex
            }
            // var pubs = []
            // d.forEach(function(e){
            //   pubs.push(e[2])
            // })
            hover_pubs(click_ids);
            clicked_pubs(click_ids)
            // update_selection_closeview(result)
            // d3.select(this).style("stroke", function(d) {return colorStroke(d.length)})
            //HERE
          });
        })

      //create color gradient
      // var gradient = defs.append("linearGradient")
      // .attr("id", "svgGradient_bin" + String(b))
      // .attr("x1", "0%")
      // .attr("x2", "100%")
      // .attr("y1", "50%")
      // .attr("y2", "50%");
      // bin_colors[b].forEach( (c,i) =>{
      //   gradient.append("stop")
      //     .attr('class', 'end')
      //     .attr("offset", 100/(bin_colors[b].length+1)*i+"%")
      //     .attr("stop-color", c)
      //     .attr("stop-opacity", 1)
      //   gradient.append("stop")
      //     .attr('class', 'end')
      //     .attr("offset", 100/(bin_colors[b].length)*(i+1)+"%")
      //     .attr("stop-color", c)
      //     .attr("stop-opacity", 1);
      // })
      // //d3.select('#hex' + String(b)).style('fill',color_points(paper_to_seed_lookup[relevant_bins[b][0]])).style('opacity',fillopacity_scale(relevant_bins[b].length))
      // d3.select('#hex' + String(b)).style('fill',"url(#svgGradient_bin"+String(b) +")").style('opacity',fillopacity_scale(relevant_bins[b].length))
    })
    
  }


  function update_selection(card_ids){

    function getHexagonVertices(cx, cy, r) {
      const vertices = [];
      const angle = Math.PI / 3; // 60 degrees in radians
      const angled = Math.PI / 6; // 30 degrees in radians
      for (let i = 0; i < 6; i++) {
        const x =  cx + r * Math.cos(angle * i - angled );
        const y = cy + r * Math.sin(angle * i - angled );
        vertices.push([x, y]);
      }
      return vertices;
    }
    if(card_ids.length>0){
    var color_points = d3.scaleOrdinal(d3.schemeCategory10)
    // Option 2: use a palette:
    // Include <script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script> in your code!

    //svg.selectAll(".firstrow").data(data).enter().append("circle").attr("cx", function(d,i){return 30 + i*60}).attr("cy", 150).attr("r", 19).attr("fill", function(d){return myColor(d) })
    var symbolset = ["\uf02e", "\uf0c8", "\uf111"]

    // Select the table element
    var cardscontainer = d3.select('.cards-container');
    // Bind the data to the table
    var point_color_lookup = {}

    var cards = cardscontainer.selectAll('card')
      .data(card_ids)
      .enter()
    var card = cards.append('div').attr("class","card")
                    .style('background-color', function (d) {return bib_ids.includes(d.paperId) ? "#d1d1d1":"white";})
                    .on("click", function(d) { card_click(d3.select(this),d) })
                    .on("mouseover", function(d) { hover_pub(d) })
                    .on("mouseout", function(d) { unhover_pub(d) });
    var icondiv = card.append('div').attr("class","card-icon")
    var element = document.getElementsByClassName('card-icon')[0];

    var clienth = element.clientHeight
    var clientw = element.clientWidth
    var size = 0
    if(clienth<clientw){size = clienth}
    else{size=clientw}

    var icondiv_svg = icondiv.append("svg")
    .attr("width", clientw)
    .attr("height", clienth)


    var localhexradius = size*0.3
    var width = size
    var height = size

    var verticesh = getHexagonVertices(clientw/2,clienth/2, localhexradius)
    var hexverticesh = verticesh.push(verticesh[0])

    var enterElements = icondiv_svg.selectAll("path.area") //draw elements
            .data([verticesh]).enter().append("path")
            .style("fill", "transparent")
            .style("stroke", "black")
            .attr("d", d3.line())
            .attr("transform", "translate(" + 0 + "," + 0 + ")");

    // Define the points of the triangle
    //var points = clientw/2 + ',' + clienth/2 + ' ' + verticesh[0][0] + ',' + verticesh[0][1] + ' ' + verticesh[1][0] + ',' + verticesh[1][1] 
    // Add a path element to the SVG element and set its d attribute to the points
    icondiv_svg.append("path")
      .attr("d", function(d,i){
        var j=0
        if(i==6){j=0} //to 5??
        else{j=i+1}

        var points = clientw/2 + ',' + clienth/2 + ' ' + verticesh[i][0] + ',' + verticesh[i][1] + ' ' + verticesh[j][0] + ',' + verticesh[j][1] 
        return "M " + points + " Z"})
      //.attr("d", "M " + points + " Z")
      .attr("fill", function(d,i){return pwk_lookup[d].PCA_Bremm})
      // .style('opacity',fillopacity_scale(relevant_bins[b].length));
    
    card.append('div')
    .attr("class","card-text")
    .append('div')
    .attr("class","card-title")
    .append('p')
    .text(function(d) { return paper_lookup[d].title; })
    .append('div')
    .attr("class","card-info")
    .append('p')
    .text(function(d) { return paper_lookup[d].year+ ' , ' + paper_lookup[d].venue; })
    .append('div')
    .attr("class","card-author")
    .append('p')
    .text(function(d) { return paper_lookup[d].authors_name; })
    
    }


          // .attr("width",  10).append("circle").attr("cx", 5).attr("cy", 5).attr("r", 5).attr("fill", function(d){console.log(d); return color_points(d)})
      // icondiv.append("svg").attr("height", 10).attr("width",  10).append("circle").attr("cx", 5).attr("cy", 5).attr("r", 5).attr("fill", function(d){console.log(d); return color_points(d)})
      // .style('stroke', function(d) { return "grey"; })
      // .style('stroke-width', function(d) { return '1px'; })
    field.selectAll(".selection_point").remove()
    field.selectAll(".seedp").remove()
    field.selectAll(".hexagon_path").remove()
    d3.selectAll(".triangle").remove()
    createHexBins(hexradius)
    insert_seedselection(card_ids, point_color_lookup)
    }
  
  //update_selection(card_ids)



  var hexbin_slider = document.getElementById("binsizeslider");

  function update_by_binsizeslider(){
    field.selectAll(".hexagon_path").remove()
    d3.select('.cards-container').html("");
    hexradius = hexbin_slider.value
    createHexBins(hexradius)
    update_selection(card_ids)
  }
  // Update the current slider value (each time you drag the slider handle)
  hexbin_slider.oninput = update_by_binsizeslider

  d3.select('#tlayer').style("background", "darkgrey").style("opacity",0.6);
  const myDivt = document.getElementById('tlayer');
  myDivt.addEventListener('click', () => {
    console.log(tlayer)
    if(!(tlayer)){
      tlayer=true
      d3.select('#tlayer').style("background", "white").style("opacity",1);}
    else{
      tlayer=false
      d3.select('#tlayer').style("background", "darkgrey").style("opacity",0.6);}

    update_by_trackingbox()
  });

  function update_by_trackingbox(){
    // const element = field.selectAll(".hexagon_path")
    // element.style('display', 'none');
    // if(trackingbox.checked){
    //   element.style('display', 'block');}
    // else{element.style('display', 'none'); }
  }

  d3.select('#hlayer').style("background", "darkgrey").style("opacity",0.6);
  const myDivh = document.getElementById('hlayer');
  myDivh.addEventListener('click', () => {
    if(!(hlayer)){
      hlayer=true
      d3.select('#hlayer').style("background", "white").style("opacity",1);
      set_selection()}
    else{
      hlayer=false
      d3.select('#hlayer').style("background", "darkgrey").style("opacity",0.6);
      unset_selection()}
  });

  function set_selection(){
    const element = field.selectAll(".seedp")
      element.style('display', 'block');
  }
  function unset_selection(){
    const element = field.selectAll(".seedp")
    element.style('display', 'none');
  }

  d3.select('#clayer').style("background", "darkgrey").style("opacity",0.6);
  const myDivc = document.getElementById('clayer');
  myDivc.addEventListener('click', () => {
    if(!(clayer)){
      clayer=true
      d3.select('#clayer').style("background", "white").style("opacity",1);
      set_c()}
    else{
      clayer=false
      d3.select('#clayer').style("background", "darkgrey").style("opacity",0.6);
      unset_c()}
  });
  
  function set_c(){
    const element = field.selectAll(".keytext")
      element.style('display', 'block');
  }
  function unset_c(){
    const element = field.selectAll(".keytext")
    element.style('display', 'none');
  }

  d3.select('#blayer').style("background", "darkgrey").style("opacity",0.6);
  const myDivb = document.getElementById('blayer');
  myDivb.addEventListener('click', () => {
    if(!(blayer)){
      blayer=true
      d3.select('#blayer').style("background", "white").style("opacity",1);
      set_b()}
    else{
      blayer=false
      d3.select('#blayer').style("background", "darkgrey").style("opacity",0.6);
      unset_b()}
  });
  
  function set_b(){
    const element = field.selectAll(".hexagon_path")
    const element2 = d3.selectAll(".triangle")
      element.style('display', 'block');
      element2.style('display', 'block');
  }
  function unset_b(){
    const element = field.selectAll(".hexagon_path")
    const element2 = d3.selectAll(".triangle")
    element.style('display', 'none'); 
    element2.style('display', 'none'); 
  }


  d3.select('#nlayer').style("background", "darkgrey").style("opacity",0.6);
  const myDivn = document.getElementById('nlayer');
  myDivn.addEventListener('click', () => {
    if(!(nlayer)){
      nlayer=true
      d3.select('#nlayer').style("background", "white").style("opacity",1);
      set_n()}
    else{
      nlayer=false
      d3.select('#nlayer').style("background", "darkgrey").style("opacity",0.6);
      unset_n()}
  });
  
  function set_n(){
    const element = field.selectAll("line")
    const element2 = field.selectAll("timeline")
      element.style('display', 'block');
      element2.style('display', 'block');
  }
  function unset_n(){
    const element = field.selectAll("line")
    const element2 = field.selectAll("timeline")
    element.style('display', 'none'); 
    element2.style('display', 'none'); 
  }

  d3.select('#alayer').style("background", "darkgrey").style("opacity",0.6);
  const myDiva = document.getElementById('alayer');
  myDiva.addEventListener('click', () => {
    if(!(alayer)){
      alayer=true
      d3.select('#alayer').style("background", "white").style("opacity",1);
      set_a()}
    else{
      alayer=false
      d3.select('#alayer').style("background", "darkgrey").style("opacity",0.6);
      unset_a()}
  });
  
  function set_a(){
    const element = d3.selectAll(".spacepoint")
    element.style('display', 'block');
  }
  function unset_a(){
    const element = d3.selectAll(".spacepoint")
    element.style('display', 'none'); 
  }

  d3.select('#rlayer').style("background", "darkgrey").style("opacity",0.6);
  const myDivr = document.getElementById('rlayer');
  myDivr.addEventListener('click', () => {
    if(!(rlayer)){
      rlayer=true
      d3.select('#rlayer').style("background", "white").style("opacity",1);
      set_r()}
    else{
      rlayer=false
      d3.select('#rlayer').style("background", "darkgrey").style("opacity",0.6);
      unset_r()}
  });
  
  function set_r(){
    const element = d3.selectAll(".relationpoint")
    element.style('display', 'block');
  }
  function unset_r(){
    const element = d3.selectAll(".relationpoint")
    element.style('display', 'none'); 
  }

  d3.select('#slayer').style("background", "darkgrey").style("opacity",0.6);
  const myDivs = document.getElementById('slayer');
  myDivs.addEventListener('click', () => {
    if(!(slayer)){
      slayer=true
      d3.select('#slayer').style("background", "white").style("opacity",1);
      set_s()}
    else{
      slayer=false
      d3.select('#slayer').style("background", "darkgrey").style("opacity",0.6);
      unset_s()}
  });
  
  function set_s(){
    const element = d3.selectAll(".seedpoint")
    element.style('display', 'block');
  }
  function unset_s(){
    const element = d3.selectAll(".seedpoint")
    element.style('display', 'none'); 
  }

  d3.select('#ilayer').style("background", "darkgrey").style("opacity",0.6);
  const myDivi = document.getElementById('ilayer');
  myDivi.addEventListener('click', () => {
    if(!(ilayer)){
      ilayer=true
      d3.select('#ilayer').style("background", "white").style("opacity",1);
      set_i()}
    else{
      ilayer=false
      d3.select('#ilayer').style("background", "darkgrey").style("opacity",0.6);
      unset_i()}
  });
  
  function set_i(){
    // const element = d3.selectAll(".seedpoint")
    // element.style('display', 'block');
  }
  function unset_i(){
    // const element = d3.selectAll(".seedpoint")
    // element.style('display', 'none'); 
  }


  var andorbox = document.getElementById("andorbox");

  function update_by_andorbox(){
    field.selectAll(".hexagon_path").remove()
    d3.select('.cards-container').html("");
    hexradius = hexbin_slider.value
    createHexBins(hexradius)
    update_selection(card_ids)
  }
  andorbox.oninput = update_by_andorbox



  function create_corpus_table(){
    d3.select('#myTable tbody').html("")
    var corp_papers = papers.filter(p => !(card_ids.includes(p.paperId)))

    // Select the table element
    var table = d3.select('#myTable tbody');
    // Bind the data to the table

    
    var rows = table.selectAll('tr')
      .data(corp_papers)
      .enter()
      .append('tr')
      .on("click", function(d) {
        unhover_pub("None")
        if(d3.event.ctrlKey){
          click_ids.push(d.paperId)
        }
        else{
          click_ids = [d.paperId]
        }

        d3.select(this).style('background-color',"rgb(255, 173, 144)"); hover_pubs(click_ids); table_row_click(d) })
      // .on("mouseover", function(d) { hover_pub(d.paperId) })
      // .on("mouseout", function(d) { unhover_pub(d) })
      .style('background-color', function (d) {return bib_ids.includes(d.paperId) ? "#d1d1d1":"white";});

    var icons = ["fa fa-star", "fa fa-square fa-rotate-45", "fa fa-circle"]
    // Set the width of each td element to match its corresponding th element
    // Append a cell for each piece of data in the row
    var cells = rows.selectAll('td')
      .data(function(d) { return [d]; })
      .enter()
    cells.append('td')
      .append("i")
      .attr("class", function(d){return icons[parseInt(d.layer)]})
      .style('color', function(d){return pwk_lookup[d.paperId].PCA_Bremm})

    var cells = rows.selectAll('td')
      .data(function(d) { return [d.title, d.title, d.authors_name, d.year, d.venue]; })
      .enter()
      .append('td')
      .text(function(d) { return d; });


    var author_ls = Object.keys(authors["authors"]).map((key) => [key, authors["authors"][key]]);
    var table = d3.select('#myTableB tbody');
    // Bind the data to the table
    var rows = table.selectAll('tr')
      .data(author_ls)
      .enter()
      .append('tr')
      // .on("mouseover", function(d) { hover_pubs(authors['authors'][d[0]]) })
      // .on("mouseout", function(d) { unhover_pub(d) })
      .on("click", function(d) {
        unhover_pub("None")
        if(d3.event.ctrlKey){
          click_ids.push(...authors['authors'][d[0]])
        }
        else{
          click_ids = authors['authors'][d[0]]
        }
        d3.select(this).style('background-color',"rgb(255, 173, 144)");
        hover_pubs(click_ids)
        clicked_pubs(click_ids)});
    // Set the width of each td element to match its corresponding th element
    // Append a cell for each piece of data in the row

    var cells = rows.selectAll('td')
      .data(function(d) { return [d[0], d[1].length]; })
      .enter()
      .append('td')
      .text(function(d) { return d; });


  }
  create_corpus_table()


  function create_stacks(selection){

    var all_data  = prep_keys_author(selection, pwk_lookup,authors)
    var dataA = all_data[0]
    var max = all_data[1]
    // append the svg object to the body of the page
    var select = d3.select("#stack2")
    var margin = {top: 5, right: 10, bottom: 5, left: 20},
    width = select.node().getBoundingClientRect().width - margin.left - margin.right,
    height = select.node().getBoundingClientRect().height - margin.top - margin.bottom;

    var svg = d3.select("#stack2")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(dataA.map(function(d) { return d.author; }))
    .padding(0.2);


    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, max])
    .range([ height, 0]);
    const yAxisTicks = y.ticks()
    .filter(tick => Number.isInteger(tick) && (tick !== 0));
    svg.append("g")
      .call(d3.axisLeft(y)
      .tickValues(yAxisTicks)
      .tickFormat(d3.format('d'))
      .tickSize(0).tickSizeOuter(0).tickSizeInner(0)
    );


  var bars = svg.selectAll("mybar")
    .data(dataA)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.author); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", "#C5C5C5")

    if(dataA.length <40){
    var bartext = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-15,-2)rotate(-90)")
        .style("text-anchor", "start");
    }




    var all_data  = prep_keys_venue(selection, pwk_lookup,authors)
    var dataV = all_data[0]
    var max = all_data[1]
    // append the svg object to the body of the page
    var select = d3.select("#stack3")
    var margin = {top: 5, right: 10, bottom: 5, left: 20},
    width = select.node().getBoundingClientRect().width - margin.left - margin.right,
    height = select.node().getBoundingClientRect().height - margin.top - margin.bottom;

    var svg = d3.select("#stack3")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(dataV.map(function(d) { return d.author; }))
    .padding(0.2);

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, max])
    .range([ height, 0]);
    var yAxisTicksv = y.ticks()
    .filter(tick => Number.isInteger(tick) && (tick !== 0));
    svg.append("g")
      .call(d3.axisLeft(y)
      .tickValues(yAxisTicksv)
      .tickFormat(d3.format('d'))
      .tickSize(0).tickSizeOuter(0).tickSizeInner(0)
    );

  var bars = svg.selectAll("mybar")
    .data(dataV)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.author); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", "#C5C5C5")

    if(dataV.length <40){
    var bartext = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-15,-2)rotate(-90)")
        .style("text-anchor", "start");
    }
    //var gen_info  = prep_geninfo(selection, pwk_lookup,authors)

  
    var svg = d3.select("#textc1")
              .append('h1')
                .text(function() { return String(selection.length); })
                .attr('class', 'textc')
    var svg = d3.select("#textc1")
              svg.append('h1')
                .text(function() { return 'Publications'; })
                .attr('class', 'textcdescribtion')
    
    var svg = d3.select("#textc2")
                .append('h1')
                  .text(function() { return String(dataA.length); })
                  .attr('class', 'textc')
    var svg = d3.select("#textc2")
                svg.append('h1')
                  .text(function() { return 'Authors'; })
                  .attr('class', 'textcdescribtion')

    var svg = d3.select("#textc3")
                  .append('h1')
                    .text(function() { return String(dataV.length); })
                    .attr('class', 'textc')
    var svg = d3.select("#textc3")
                  svg.append('h1')
                    .text(function() { return 'Venues'; })
                    .attr('class', 'textcdescribtion')

  }
  //create_stacks(seeds)

//   node.addEventListener("keyup", ({key}) => {
//     if (key === "Enter") {
//         // Do work
//     }
// })
//   const node = document.getElementsByClassName("#myInput")[0];
//   node.addEventListener("keyup", ({key}) => {
//     if (key === "Enter") {
//       console.log("nope")
//     }
//   })



  function update_info(card_ids){
    d3.select('.infoinner-container').html("");
    if(card_ids.length>0){

    // Select the table element
    var cardscontainer = d3.select('.infoinner-container');
    // Bind the data to the table
    var point_color_lookup = {}

    var cards = cardscontainer.selectAll('info')
      .data(card_ids)
      .enter()
    var card = cards.append('div').attr("class","info")
                    .style('background-color', function (d) {return bib_ids.includes(d.paperId) ? "#d1d1d1":"white";})
                // .on("click", function(d) { this.remove()})
                    .on("mouseover", function(d) { hover_pub(d) })
                    .on("mouseout", function(d) { unhover_pub(d) })
                    
    // var icondiv = card.append('div').attr("class","card-icon")
    // var element = document.getElementsByClassName('card-icon')[0];

    // var clienth = element.clientHeight
    // var clientw = element.clientWidth    

    // var group = d3.select(document.createElement("div")).append('div').attr("class", "btngroup")
    // group.append('div')
    // .attr("class", "btn")
    // .append('i')
    // .attr("class", "fa fa-trash")
    // group.append('div')
    // .attr("class", "btn")
    // .append('i')
    // .attr("class", "fa fa-trash")
    // group.append('div')
    // .attr("class", "btn")
    // .append('i')
    // .attr("class", "fa fa-trash")
    var card_text = card.append('div').attr("class","info-text-container")

    card_text.append('div')
    .attr("class","info-title")
    .append('p')
    .text(function(d) { return paper_lookup[d].title; })
    .append('div')
    .attr("class","info-info")
    .append('p')
    .text(function(d) { return paper_lookup[d].year+ ' , ' + paper_lookup[d].venue; })
    .append('div')
    .attr("class","info-author")
    .append('p')
    .text(function(d) { return paper_lookup[d].authors_name; })
    .append('div')
    .attr("class","info-author")
    .append('p')
    .text(function(d) { 
      var summary = ''
      if(paper_lookup[d].abstract != 'none'){summary=paper_lookup[d].abstract}
      else if(paper_lookup[d].tldr != 'none'){summary=paper_lookup[d].tldr}
      return summary; })


    var card_text = card.append('div').attr("class","info-button-container")
    card_text//.append('div').attr("class", "btngroup")
    .append('div')
    .attr("class", "btn")
    .append('i')
    .attr("class", "fa fa-mouse-pointer")
    .on("click", function(d) { infoselect_click(d) })
    card_text
    .append('div')
    .attr("class", "btn")
    .append('i')
    .attr("class", "fa fa-link")
    .on("click", function(d) { infolink_click(d) })
    card_text
    .append('div')
    .attr("class", "btn")
    .append('i')
    .attr("class", "fa fa-bookmark")
    .on("click", function(d) { infobookmark_click(d) })
    }
  }



  function update_bib(info_ids){
    
      // Select the table element
      var cardscontainer = d3.select('.bibcardinner-container');
      // Bind the data to the table
      var point_color_lookup = {}
  
      var cards = cardscontainer.selectAll('bibcard')
        .data(info_ids)
        .enter()
      var card = cards.append('div').attr("class","bibcard")
                      .on("click", function(d) { bibcard_click(elem, d)})
                      .on("mouseover", function(d) { hover_pub(d) })
                      .on("mouseout", function(d) { unhover_pub(d) });

      var card_text = card.append('div').attr("class","bibcard-text-container")
  
      card_text.append('div')
      .attr("class","bibcard-title")
      .append('p')
      .text(function(d) { return paper_lookup[d].title; })
      .append('div')
      .attr("class","bibcard-info")
      .append('p')
      .text(function(d) { return paper_lookup[d].year+ ' , ' + paper_lookup[d].venue; })
      .append('div')
      .attr("class","bibcard-author")
      .append('p')
      .text(function(d) { return paper_lookup[d].authors_name; })
      
    // Select the table element
      // update_info(info_ids)
      // update_selection(card_ids)
      // create_corpus_table()
    

  }


  // function create_radar(selection){
  //   dataAcolor = prep_influ(selection, pwk_lookup)
  //   data = dataAcolor[0]
  //   colors = dataAcolor[1]
  //   maxistr = dataAcolor[2]

  //   var rect = document.querySelector('.radarChart');
  //   var width = rect.clientWidth;
  //   var height = rect.clientHeight;

  //   var margin = {top: 50, right: 50, bottom: 50, left: 50},
	// 			width = Math.min(width, window.innerWidth - 10) - margin.left - margin.right,
	// 			height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
					
	// 		var color = d3.scaleOrdinal(d3.schemeCategory10)
	// 			.range(colors);
				
	// 		var radarChartOptions = {
	// 		  w: width,
	// 		  h: height,
	// 		  margin: margin,
	// 		  maxValue: 0.5,
	// 		  levels: 1,
	// 		  roundStrokes: false,
	// 		  color: color
	// 		};
	// 		//Call function to draw the Radar chart
	// 		RadarChart(".radarChart", data, radarChartOptions, maxistr);
  // }
  //create_radar(seeds)

  function create_network(selection){
    var graph  = prep_network(selection, pwk_lookup, source_lookup, children_lookup)
    // append the svg object to the body of the page
    var maxref = 0
    graph.nodes.forEach(n => {
      if(pwk_lookup[n.id].referenceCount > maxref)
      maxref = pwk_lookup[n.id].referenceCount
    })
    var radiusScale = d3.scaleLinear(3,maxref)
    .domain([5, 10 ]);


    var select = d3.select("#network")
    var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = select.node().getBoundingClientRect().width - margin.left - margin.right,
    height = select.node().getBoundingClientRect().height - margin.top - margin.bottom;

    var svg = d3.select("#network")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")
            .call(d3.zoom().on("zoom", function () {
              svg.attr("transform", d3.event.transform)
           }))
    
    var color = d3.scaleOrdinal(d3.schemeCategory20c);
    var nodeRadius = 20;

    var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) {
        return d.id;
    }).distance(80))
    .force("charge", d3.forceManyBody().strength(-50))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide().radius(function(d) {
        return nodeRadius + 0.5; }).iterations(4))


        simulation.nodes(graph.nodes);
        simulation.force("link").links(graph.links);


        var link = svg.append("g")
            .attr("class", "link")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line");

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")

            
        //Setting node radius by group value. If 'group' key doesn't exist, set radius to 9
        .attr("r", function(d) {
            return radiusScale(pwk_lookup[d.id].referenceCount) 
            })
          .attr('stroke', 'black')
            //Colors by 'group' value
            .style("fill", function(d) {
              if (selection.includes(d.id)) {
                return pwk_lookup[d.id].PCA_Bremm;
            } else {
                return "white";
            }
            })
            .style("stroke", function(d) {
              return color(d.group);
          })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("svg:title")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function(d) {
                return d.id
            });

        var labels = svg.append("g")
            .attr("class", "label")
            .selectAll("text")
            .data(graph.nodes)
            .enter().append("text")
            .attr("dx", 6)
            .attr("dy", ".35em")
            .style("font-size", 10)
            .text(function(d) {
                return pwk_lookup[d.id].title.substring(0,8) + "..."
            });
      

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);
      
      function ticked() {

        link.attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });

        node
            .attr("cx", function(d) {
                return d.x;
            })
            .attr("cy", function(d) {
                return d.y;
            });
        labels
            .attr("x", function(d) {
                return d.x;
            })
            .attr("y", function(d) {
                return d.y;
            }); 
    }
    

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

  }
  //create_network(seeds)


  function update_selection_closeview(selection){
    //d3.select("#stack1").selectAll("*").remove()
    d3.select("#stack2").selectAll("*").remove()
    d3.select("#stack3").selectAll("*").remove()
    d3.select("#textc1").selectAll("*").remove()
    d3.select("#textc2").selectAll("*").remove()
    d3.select("#textc3").selectAll("*").remove()
    create_stacks(selection)
    create_radar(selection)
    d3.select("#network").selectAll("*").remove()
    create_network(selection)
  }

  function table_row_click(d){
    if(!(card_ids.includes(d.paperId))){
      if(card_ids.length<6){
      card_ids.push(d.paperId)
      d3.select('.cards-container').html("");
      update_selection(card_ids)
      }
    }
  }
  function card_click(elem,d){
    elem.remove();
    var index = card_ids.indexOf(d);
    if (index !== -1) {
      card_ids.splice(index, 1);
    }
    d3.select('.cards-container').html("");
    update_selection(card_ids)
  }  
  
  function bibcard_click(elem,d){
    elem.remove();
    var index = bib_ids.indexOf(d);
    if (index !== -1) {
      card_ids.splice(index, 1);
    }
    d3.select('.cards-container').html("");
      update_info(info_ids)
  update_selection(card_ids)
  create_corpus_table()
  }




  function infolink_click(d){
    window.open(pwk_lookup[d].url);
  }

  function infobookmark_click(d){
    if(!(bib_ids.includes(d))){
        bib_ids.push(d)
      update_bib([d])
      }
  }
  
function infoselect_click(d){
  console.log(d)
  if(!(card_ids.includes(d))){
  if(card_ids.length<6){
    card_ids.push(d)
    d3.select('.cards-container').html("");
    update_selection(card_ids)
    }
  }
}




  function hover_pub(pubId){
    var so = source_lookup[pubId]
    if(so == 'undefined' || so == null){so = []}
    var ch = children_lookup[pubId]
    if(ch == 'undefined' || ch == null){ch = []}
  
    d3.selectAll("line").style('stroke', function (link_d) {return link_d.source === pubId || link_d.target === pubId ? '#696969' : 'transparent';})
                        .style("stroke-dasharray", function (link_d) { return link_d.source === pubId ? ("3, 3") : ("10,10")})
    d3.selectAll(".seedpoint").attr('opacity', function (e) { return e.paperId === pubId || so.includes(e.paperId) || ch.includes(e.paperId) ? 1 : 0.2;})
    d3.selectAll(".relationpoint").attr('opacity', function (e) { return e.paperId === pubId || so.includes(e.paperId) || ch.includes(e.paperId) ? 1 : 0.2;})
    d3.selectAll(".spacepoint").attr('opacity', function (e) { return e.paperId === pubId || so.includes(e.paperId) || ch.includes(e.paperId) ? 1 : 0.2;})
    d3.selectAll(".selection").attr('opacity', function (e) { return e.paperId === pubId || so.includes(e.paperId) || ch.includes(e.paperId) ? 1 : 0.2;})  
    d3.selectAll("rect").attr('opacity', function (e) { return e === pubId || so.includes(e) || ch.includes(e) ? 1 : 0.2;})  
  }

  function hover_pubs(pubIds){
    var so = []
    pubIds.forEach(p => {s = source_lookup[p]; if(s != 'undefined' && s != null){so.push(...s)}})
    var ch = []
    pubIds.forEach(p => {c = children_lookup[p]; if(c != 'undefined' && c != null){ch.push(...c)}})

    d3.selectAll("line").style('stroke', function (link_d) {return pubIds.includes(link_d.source) || pubIds.includes(link_d.target) ? '#696969' : 'transparent';})
    .style("stroke-dasharray", function (link_d) { return pubIds.includes(link_d.source) ? ("1, 1") : ("10,10")})
    d3.selectAll(".seedpoint").attr('opacity', function (e) { return pubIds.includes(e.paperId) || so.includes(e.paperId) || ch.includes(e.paperId) ? 1 : 0.2;})
    d3.selectAll(".relationpoint").attr('opacity', function (e) { return pubIds.includes(e.paperId) || so.includes(e.paperId) || ch.includes(e.paperId) ? 1 : 0.2;})
    d3.selectAll(".spacepoint").attr('opacity', function (e) { return pubIds.includes(e.paperId) || so.includes(e.paperId) || ch.includes(e.paperId) ? 1 : 0.2;})
    d3.selectAll(".selection").attr('opacity', function (e) { return pubIds.includes(e.paperId) || so.includes(e.paperId) || ch.includes(e.paperId) ? 1 : 0.2;})  
    d3.selectAll("rect").attr('opacity', function (e) { return pubIds.includes(e) || so.includes(e) || ch.includes(e) ? 1 : 0.2;}) 
  }

  d3.select("#deselectButton").on("click", function () { console.log("hi");unhover_pub("None");} )

  function unhover_pub(pubId){
    d3.selectAll("line").style('stroke', function () { 'transparent';})
    d3.selectAll(".seedpoint").attr('opacity', 1)
    d3.selectAll(".relationpoint").attr('opacity', 1)
    d3.selectAll(".spacepoint").attr('opacity', 1)
    d3.selectAll(".selection").attr('opacity', 1)
    d3.selectAll("rect").attr('opacity', 1)
    d3.selectAll('tr').style('background-color',"white");
  }

  function clicked_pubs(pubIds){
    update_info(pubIds)
  }

  
}



function filter_on_search() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    all_text = ""
    Array.from(tr[i].getElementsByTagName("td")).forEach((td) => {
      if(td){
        txtValue = td.textContent || td.innerText;
      }
      all_text = all_text + txtValue
    })
    // console.log(tr[i].getElementsByTagName("td"))
    // tr[i].getElementsByTagName("td").forEach(d => console.log(d))
    // td = tr[i].getElementsByTagName("td")[0]
    txtValue = all_text
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }

  table = document.getElementById("myTableB");
  tr = table.getElementsByTagName("tr");
  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    all_text = ""
    Array.from(tr[i].getElementsByTagName("td")).forEach((td) => {
      if(td){
        txtValue = td.textContent || td.innerText;
      }
      all_text = all_text + txtValue
    })
    // console.log(tr[i].getElementsByTagName("td"))
    // tr[i].getElementsByTagName("td").forEach(d => console.log(d))
    // td = tr[i].getElementsByTagName("td")[0]
    txtValue = all_text
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }

  }

}