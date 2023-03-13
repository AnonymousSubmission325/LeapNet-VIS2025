function my_Func(network, papers, seeds, keys, key_projections, pwk, paths, authors){
  data = network
  papers = papers['papers']
  papers.forEach(paper => {paper["authors_name"] = authors['papers'][paper.paperId]})
  console.log(papers)
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


  console.log(children_lookup)
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
var radius = 20;
// set the dimensions and margins of the graph
var margin = {top: 50, right: 30, bottom: 30, left: 60}
var svg = d3.select("div#hex").append("svg")
//  .attr("preserveAspectRatio", "xMinYMin meet")
//  .attr("viewBox", "0 0 " + String(width) + " " +  String(height) )
.attr("width", width)
.attr("height", height)
.classed("svg-content", true)
.append("g")
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

color_points = d3.scaleOrdinal(d3.schemeCategory10)

//https://stackoverflow.com/questions/50029490/in-d3-hexbin-increase-radius-of-multiple-hexagons-with-mouseover
//resize



//these are not the numbers in keys. check why different! maybe create an copy beacuse keys is alternes

var field = svg.append("g")


var bin_lookup = {}

function createHexBins(hexbin_slider_vals){
  var hexbin = d3.hexbin()
  .size([width,height])
  .radius(hexbin_slider_vals);
  var bins = hexbin(points)
  var color = d3.scaleSequential(d3.interpolateLab("white", "blue"))
  .domain([0, d3.max(bins, d => d.length)/3 ]);
  var colorStroke = d3.scaleSequential(d3.interpolateLab("white", "black"))
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
    .on('mouseover', function(d) { 
      d3.select(this).attr("d", d => hexbin.hexagon(radius(hexbin_slider_vals)*2))
      })
      .on('mouseout', function(d) { 
          d3.select(this).attr("d", d => hexbin.hexagon(radius(hexbin_slider_vals)))
      })
    .on("mouseover", function() {
      d3.select(this).style("stroke", "red");
    })
    .on("mouseout", function() {
      d3.select(this).style("stroke", function(d) { return colorStroke(d.length)})
    })
    .on("click", function(arr) {
      console.log(arr)
      const result = [];
      for (let i = 0; i < arr.length; i++) {
        console.log(arr[i])
        const [, , third] = arr[i]; // extract the third value using array destructuring
        result.push(third);
      }
      update_selection_closeview(result)
      d3.select(this).style("stroke", function(d) {return colorStroke(d.length)})
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
              .range([0.2, 1]);
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
    .style('fill', function(d) { return d.color['bremm']});
  
      
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
createHexBins(10)

  
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

    var cellSize = 5;
    // var width = data_stack.length * (cellSize + border) , height = max_stack * cellSize + border;
    // var rect = document.querySelector('#stacks');
    // var width = rect.offsetWidth;
    // var height = rect.offsetHeight;


    var rect = document.querySelector('#timeline');
    const styles = window.getComputedStyle(rect);
    const height = rect.clientHeight - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom);
    const width = rect.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);

    var x = d3.scaleBand()
      .range([0, width])
      .domain(d3.range(max_stack));
    var y = d3.scaleBand()
        .range([0, height])
        .domain(d3.range(min_year, max_year+1)); //get maximum length

    var svg = d3.select("div#timeline")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .classed("svg-content", true)
    // Show the bars
    var container = svg.append("g")
      .selectAll("g")
      .data(data_stack)
      .enter().append("g")
      .attr('transform', function(d, i) { return 'translate(0,' + y(pwk_lookup[d[0]]['year']) + ')';})
      //.attr("x", function(d,i) { return x(i); })
      //.attr('transform', function(d,i) { return 'translate('+ x(i) + ', 0)';})
    var rows = container.selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect").attr("class", function(d) {return 's' + String(pwk_lookup[d]['year']); })
        //.attr("class", function(d) { return "group_"+ x(d.data.group); })
        .attr("x", function(d,i) { return x(i); })
        .attr("height", cellSize)
        .attr("width",cellSize)
        .attr("fill", function(d) { return pwk_lookup[d]['PCA_Bremm']; })
        //.attr("opacity", function(d) { return topics[color_map][pwk_lookup[d]['Topic_Perc_Contrib']]; })
        .style("stroke", function(d) {if(seeds.includes(d)){return "blue"} })
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
    var xAxis = d3.axisRight(y).tickSize(0).tickValues(y.domain().filter(function(d, idx) { return idx%4==0 }))

    svg
    .append("g")
    .attr("transform", "translate("+ "0" + ",0)")      // This controls the vertical position of the Axis
    .call(xAxis);
    
    svg.selectAll('.tick text')
    .attr('font-size', '0.9em')
    .attr('font-family', 'Roboto')
    .attr('fill', 'darkgrey')
    function move_bars_to_center(){

      var rect = document.querySelector('#timeline');
      var width = rect.offsetWidth;
      var svg = d3.select("div#timeline")
      groups = columns.map(c => '.s' + String(c) )
      for (const group of groups){
          stack_width = 0;
          svg.selectAll(group).each(function(d){
            stack_width = stack_width + parseInt(this.attributes.width.value)
            moving_distance = width/2 - stack_width/2
            svg.selectAll('g').selectAll(group).transition().duration(200).attr("transform", "translate(" + moving_distance + "," + 0 + ")");
          })
          
      }
    }

    move_bars_to_center()
  }

  create_stacked_bars()




  function insert_seedselection(seeds,color_points){
    color_points = d3.scaleOrdinal(d3.schemeCategory10)
    var symbolset = ["\uf02e", "\uf0c8", "\uf111"]

    field.selectAll(".seed_points")
    .data(seeds)
    .enter()
    .append("text")       // Append a text element
    .attr("class", "fa")  // Give it the font-awesome class
    .text(function(d){return symbolset[parseInt(pwk_lookup[d]['layer'])]})      // Specify your icon in unicode
    .attr('x', function(d){return widthScale(pwk_lookup[d]['pca'][0])})
    .attr('y', function(d){return heightScale(pwk_lookup[d]['pca'][1])})
    .attr("fill", function(d){return color_points(d)})
    .attr("width", 1)
    .attr("height", 1);

    //var icons = ["fa fa-tint fa-2x", "fa fa-square", "fa fa-circle"]
    // Set the width of each td element to match its corresponding th element
    // Append a cell for each piece of data in the row


    marked_seeds = seeds.map( d => bin_lookup[d])
    marked_seeds.forEach(m =>{
      d3.select('#hex' + String(m)).style('stroke',color_points(m)).style('stroke-width','8px')
    })
    relevant_bins = {}
    bin_colors={}
    paper_to_seed_lookup = {}
    seeds.forEach(s => {
      if(source_lookup[s]){
        source_lookup[s].forEach( p => {
          paper_to_seed_lookup[p] = s
          bin = bin_lookup[p]
          if(relevant_bins[bin]){ relevant_bins[bin].push(p);}
          else {relevant_bins[bin] = [p]; }
          seed_color = color_points(s)

          if(bin_colors[bin]){ 
            if(!bin_colors[bin].includes(seed_color)){
              bin_colors[bin].push(seed_color);}
            }
          else {bin_colors[bin] = [seed_color]; }
        })
      }
    })

    var max_pinbin = 0 
    Object.values(relevant_bins).forEach(b => {if(b.length>max_pinbin){max_pinbin = b.length}})
    var fillopacity_scale = d3.scaleLinear()
    .domain([0, max_pinbin])
    .range([0.2, 0.7]);

    var defs = svg.append("defs");
    Object.keys(relevant_bins).forEach(b =>{

    //create color gradient
    var gradient = defs.append("linearGradient")
    .attr("id", "svgGradient_bin" + String(b))
    .attr("x1", "0%")
    .attr("x2", "100%")
    .attr("y1", "50%")
    .attr("y2", "50%");
    bin_colors[b].forEach( (c,i) =>{
    gradient.append("stop")
      .attr('class', 'end')
      .attr("offset", 100/(bin_colors[b].length+1)*i+"%")
      .attr("stop-color", c)
      .attr("stop-opacity", 1)
    gradient.append("stop")
      .attr('class', 'end')
      .attr("offset", 100/(bin_colors[b].length)*(i+1)+"%")
      .attr("stop-color", c)
      .attr("stop-opacity", 1);
    })



      //d3.select('#hex' + String(b)).style('fill',color_points(paper_to_seed_lookup[relevant_bins[b][0]])).style('opacity',fillopacity_scale(relevant_bins[b].length))
      d3.select('#hex' + String(b)).style('fill',"url(#svgGradient_bin"+String(b) +")").style('opacity',fillopacity_scale(relevant_bins[b].length))
    })
    
  }


  function update_selection(seeds){
    // Option 2: use a palette:
    // Include <script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script> in your code!

    //svg.selectAll(".firstrow").data(data).enter().append("circle").attr("cx", function(d,i){return 30 + i*60}).attr("cy", 150).attr("r", 19).attr("fill", function(d){return myColor(d) })
    var symbolset = ["\uf02e", "\uf0c8", "\uf111"]

    // Select the table element
    var cardscontainer = d3.select('.cards-container');
    // Bind the data to the table
    var cards = cardscontainer.selectAll('card')
      .data(seeds)
      .enter()
    var card = cards.append('div').attr("class","card")
    var icondiv = card.append('div').attr("class","card-icon")
          .append("text")       // Append a text element
          .attr("class", "fa")  // Give it the font-awesome class
          .style("color", function(d){return color_points(d)})
          .attr("width", 12)
          .attr("height", 12)
          .text(function(d){return symbolset[parseInt(pwk_lookup[d]['layer'])]})
    
    card.append('div')
    .attr("class","card-text")
    .append('div')
    .attr("class","card-title")
    .append('p')
    .text(function(d) { return paper_lookup[d].title; })
    .append('div')
    .attr("class","card-info")
    .append('p')
    .text(function(d) { return paper_lookup[d].year })
    .append('div')
    .attr("class","card-author")
    .append('p')
    .text(function(d) { return paper_lookup[d].authors_name; });


          // .attr("width",  10).append("circle").attr("cx", 5).attr("cy", 5).attr("r", 5).attr("fill", function(d){console.log(d); return color_points(d)})
      // icondiv.append("svg").attr("height", 10).attr("width",  10).append("circle").attr("cx", 5).attr("cy", 5).attr("r", 5).attr("fill", function(d){console.log(d); return color_points(d)})
      // .style('stroke', function(d) { return "grey"; })
      // .style('stroke-width', function(d) { return '1px'; })
      insert_seedselection(seeds, color_points)
  }
  
  update_selection(seeds)


  var hexbin_slider = document.getElementById("binsizeslider");

  function update_by_binsizeslider(){
    field.selectAll(".hexagon_path").remove()
    createHexBins(hexbin_slider.value)
    // d3.select('.cards-container').selectAll('card').remove()
     update_selection(seeds)
  }
  // Update the current slider value (each time you drag the slider handle)
  hexbin_slider.oninput = update_by_binsizeslider


  function create_corpus_table(){

    // Select the table element
    var table = d3.select('#myTable tbody');
    // Bind the data to the table

    var rows = table.selectAll('tr')
      .data(papers)
      .enter()
      .append('tr');
    var icons = ["fa fa-bookmark", "fa fa-square", "fa fa-circle"]
    // Set the width of each td element to match its corresponding th element
    // Append a cell for each piece of data in the row
    var cells = rows.selectAll('td')
      .data(function(d) { return [d.layer]; })
      .enter()
      .append('td')
      .append("i")
      .attr("class", function(d){return icons[parseInt(d)]})

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
      .append('tr');
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
    var data = all_data[0]
    var max = all_data[1]
    // append the svg object to the body of the page
    var select = d3.select("#stack1")
    var margin = {top: 5, right: 10, bottom: 5, left: 20},
    width = select.node().getBoundingClientRect().width - margin.left - margin.right,
    height = select.node().getBoundingClientRect().height - margin.top - margin.bottom;
    console.log(data)
    var svg = d3.select("#stack1")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.author; }))
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
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.author); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", "#69b3a2")

    if(data.length <40){
    var bartext = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-15,-2)rotate(-90)")
        .style("text-anchor", "start");
    }




    var all_data  = prep_keys_venue(selection, pwk_lookup,authors)
    var data = all_data[0]
    var max = all_data[1]
    // append the svg object to the body of the page
    var select = d3.select("#stack2")
    var margin = {top: 5, right: 10, bottom: 5, left: 20},
    width = select.node().getBoundingClientRect().width - margin.left - margin.right,
    height = select.node().getBoundingClientRect().height - margin.top - margin.bottom;
    console.log(data)
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
    .domain(data.map(function(d) { return d.author; }))
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
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.author); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", "#69b3a2")

    if(data.length <40){
    var bartext = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-15,-2)rotate(-90)")
        .style("text-anchor", "start");
    }

  }
  create_stacks(seeds)

  function create_radar(seeds){
    //var data  = prep_influ(selection, pwk_lookup)


    var rect = document.querySelector('.radarChart');
    var width = rect.clientWidth;
    var height = rect.clientHeight;

    var margin = {top: 50, right: 50, bottom: 50, left: 50},
				width = Math.min(width, window.innerWidth - 10) - margin.left - margin.right,
				height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
					
			////////////////////////////////////////////////////////////// 
			////////////////////////// Data ////////////////////////////// 
			////////////////////////////////////////////////////////////// 

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
			////////////////////////////////////////////////////////////// 
			//////////////////// Draw the Chart ////////////////////////// 
			////////////////////////////////////////////////////////////// 

			var color = d3.scaleOrdinal(d3.schemeCategory10)
				.range(["#EDC951","#CC333F","#00A0B0"]);
				
			var radarChartOptions = {
			  w: width,
			  h: height,
			  margin: margin,
			  maxValue: 0.5,
			  levels: 5,
			  roundStrokes: true,
			  color: color
			};
			//Call function to draw the Radar chart
			RadarChart(".radarChart", data, radarChartOptions);
  }
  create_radar(seeds)

  function create_network(selection){
    console.log(selection)
    var data  = prep_network(selection, pwk_lookup, source_lookup, children_lookup)
    // append the svg object to the body of the page
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
    var colors = d3.scaleOrdinal(d3.schemeCategory10)

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {return d.id;}).distance(300).strength(1))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

var graph = {
  "nodes": [
    {
      "name": "Peter",
      "label": "Person",
      "id": 1
    },
    {
      "name": "Michael",
      "label": "Person",
      "id": 2
    },
    {
      "name": "Neo4j",
      "label": "Database",
      "id": 3
    },
    {
      "name": "Graph Database",
      "label": "Database",
      "id": 4
    }
  ],
  "links": [
    {
      "source": 1,
      "target": 2,
      "type": "KNOWS",
      "since": 2010
    },
    {
      "source": 1,
      "target": 3,
      "type": "FOUNDED"
    },
    {
      "source": 2,
      "target": 3,
      "type": "WORKS_ON"
    },
    {
      "source": 3,
      "target": 4,
      "type": "IS_A"
    }
  ]
}
  update(graph.links, graph.nodes)
    function update(links, nodes) {
        link = svg.selectAll(".link")
            .data(links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr('marker-end','url(#arrowhead)')

        link.append("title")
            .text(function (d) {return d.type;});

        edgepaths = svg.selectAll(".edgepath")
            .data(links)
            .enter()
            .append('path')
            .attrs({
                'class': 'edgepath',
                'fill-opacity': 0,
                'stroke-opacity': 0,
                'id': function (d, i) {return 'edgepath' + i}
            })
            .style("pointer-events", "none");

        edgelabels = svg.selectAll(".edgelabel")
            .data(links)
            .enter()
            .append('text')
            .style("pointer-events", "none")
            .attrs({
                'class': 'edgelabel',
                'id': function (d, i) {return 'edgelabel' + i},
                'font-size': 10,
                'fill': '#aaa'
            });

        edgelabels.append('textPath')
            .attr('xlink:href', function (d, i) {return '#edgepath' + i})
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .attr("startOffset", "50%")
            .text(function (d) {return d.type});

        node = svg.selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    //.on("end", dragended)
            );

        node.append("circle")
            .attr("r", 5)
            .style("fill", function (d, i) {return colors(i);})

        node.append("title")
            .text(function (d) {return d.id;});

        node.append("text")
            .attr("dy", -3)
            .text(function (d) {return d.name+":"+d.label;});

        simulation
            .nodes(nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(links);
    }

    function ticked() {
        link
            .attr("x1", function (d) {return d.source.x;})
            .attr("y1", function (d) {return d.source.y;})
            .attr("x2", function (d) {return d.target.x;})
            .attr("y2", function (d) {return d.target.y;});

        node
            .attr("transform", function (d) {return "translate(" + d.x + ", " + d.y + ")";});

        edgepaths.attr('d', function (d) {
            return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
        });

        edgelabels.attr('transform', function (d) {
            if (d.target.x < d.source.x) {
                var bbox = this.getBBox();

                rx = bbox.x + bbox.width / 2;
                ry = bbox.y + bbox.height / 2;
                return 'rotate(180 ' + rx + ' ' + ry + ')';
            }
            else {
                return 'rotate(0)';
            }
        });
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

//    function dragended(d) {
//        if (!d3.event.active) simulation.alphaTarget(0);
//        d.fx = undefined;
//        d.fy = undefined;
//    }


  }
  create_network(seeds)


  function update_selection_closeview(selection){
    d3.select("#stack1").selectAll("*").remove()
    d3.select("#stack2").selectAll("*").remove()
    create_stacks(selection)
    //create_radar(selection)
    //create_network(selection)
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