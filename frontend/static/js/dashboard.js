function my_Func(network, papers, seeds, keys, key_projections, pwk, paths){

  data = network
  papers = papers['papers']
  pwk = pwk['papers']
  seeds = seeds['seeds']
  var max_layer = Math.max(...papers.map(paper => paper.layer))
  var paper_lookup = {}
  papers.forEach(paper => {paper_lookup[paper.paperId] = paper})
  var key_lookup = {}
  keys.forEach(k => {key_lookup[k.key] = k})
  console.log(papers)
  console.log(pwk)
  console.log(paths)
  var pwk_lookup = {}
  pwk.forEach(paper => {pwk_lookup[paper.paperId] = paper})

  console.log(data)

  console.log("network")
  console.log(network)
  console.log("papers")
  console.log(papers)
  console.log("paper_lookup")
  console.log(paper_lookup)
  console.log("seeds")
  console.log(seeds)
  seeds.map(s => console.log(paper_lookup[s]["title"], paper_lookup[s]["year"]))
  console.log("keys")
  console.log(keys)
  console.log("pwk")
  console.log(pwk)
  console.log("pwk_lookup")
  console.log(pwk_lookup)
  console.log("paths")
  console.log(pwk_lookup)

var rect = document.querySelector('#hex');
var width = rect.offsetWidth;
var height = rect.offsetHeight;
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



//https://stackoverflow.com/questions/50029490/in-d3-hexbin-increase-radius-of-multiple-hexagons-with-mouseover
//resize



//these are not the numbers in keys. check why different! maybe create an copy beacuse keys is alternes

var field = svg.append("g")

var widthScale = d3.scaleLinear()
  .domain([0, 1])
  .range([0, width]);

var heightScale = d3.scaleLinear()
  .domain([0, 1])
  .range([0, height]);


function create_keywords(keynum){
  var hierachic_array = [...Array(keynum).keys()];
  var old_hierachic_array = [0,1,2,3,5,8,10,13]
  var max_index = hierachic_array.length
  //select particular clusters??


  var fontsize_scale = d3.scaleLinear()
              .domain([0, max_index])
              .range([3, 0.4]);
  
  var textopacity_scale = d3.scaleLinear()
              .domain([0, max_index])
              .range([0.2, 1]);
  
  var key_proj_flat = []
  key_projections.forEach( function(d,i) {d.forEach(e =>{e["index"] = i; key_proj_flat.push(e)})})
  
  var already_used = []
  
  text = field.selectAll(".keytexts")
    .data(key_proj_flat)
    .enter()
    .append("text")
    .filter(function(d){
      leave = false
      if(hierachic_array.includes(d.index)){
        leave = true
      }
      used = JSON.stringify(already_used);
      elem = JSON.stringify(d.coords);
      indexx = used.indexOf(elem);
      if(indexx != -1){
        leave = false
      }
      if (leave==true){
        already_used.push(d.coords)
      }
      return leave})
    .attr("class", "keytext")
    .attr("x", function(d) { return widthScale(d.coords[0]) })
    .attr("y", function(d) { return heightScale(d.coords[1])})
    .text(function(d) { return d.key; })
    .style("text-anchor", "middle")
    .style('font-size', function(d) { return fontsize_scale(d.index) + 'em'})
    .style('opacity', function(d) { return textopacity_scale(d.index)});  

} 

var keywordnum_slider = document.getElementById("keywordnumslider");
// Update the current slider value (each time you drag the slider handle)
keywordnum_slider.oninput = function() {
  svg.selectAll(".keytext").remove()
  create_keywords(keywordnum_slider.value)
}
create_keywords(18)




var bin_lookup = {}

function createHexBins(hexbin_slider_vals){
  var hexbin = d3.hexbin()
  .size([width,height])
  .radius(hexbin_slider_vals);
  var bins = hexbin(points)
  console.log(bins)
  var color = d3.scaleSequential(d3.interpolateLab("white", "blue"))
  .domain([0, d3.max(bins, d => d.length)/3 ]);
  var colorStroke = d3.scaleSequential(d3.interpolateLab("white", "black"))
  .domain([0, d3.max(bins, d => d.length)/3 ]);
  var widthStroke = d3.scaleLinear(1,40)
  .domain([0, d3.max(bins, d => d.length)/3 ]);
  
  hexagons = field.selectAll(".hexagon")
    .data(bins)
    .enter().append("path")
    .attr("id", function(d,i) { return "hex" + String(i)})
    .attr("d", hexbin.hexagon())
    .attr("class", "hexagon_path")
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .style("fill", function(d) { return color(d.length); })
    .style('opacity', 0.4)
    .style('stroke', function(d) { return colorStroke(d.length); })
    .style('stroke-width', function(d) { return String(widthStroke(d.length))+'px'; })
    .on("mouseover", function() {
      d3.select(this).style("fill", "red");
    })
    .on("mouseout", function() {
      d3.select(this).style("fill", "blue");
    })
    .on("click", function() {
      console.log("You clicked a hexagon!");
    });
    //create hex_lookup
    //bins.forEach((d,i) => d.forEach(e => {if(i in Object.keys(bin_lookup)){bin_lookup[i].push(e[2])} else{bin_lookup[i] = [e[2]]}}))
    bins.forEach((d,i) => d.forEach(e => bin_lookup[e[2]]= i))
}

var hexbin_slider = document.getElementById("binsizeslider");

// Update the current slider value (each time you drag the slider handle)
hexbin_slider.oninput = function() {
  svg.selectAll(".hexagon").remove()
  createHexBins(hexbin_slider.value)
}
createHexBins(10)
console.log(bin_lookup)







  
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
  console.log(data_stack)

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
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect").attr("class", function(d) {return 's' + String(pwk_lookup[d]['year']); })
        //.attr("class", function(d) { return "group_"+ x(d.data.group); })
        .attr("x", function(d,i) { return x(i); })
        .attr("height", cellSize)
        .attr("width",cellSize)
        //.attr("fill", function(d) { return topics[color_map][pwk_lookup[d]['Dominant_Topic']]; })
        //.attr("opacity", function(d) { return topics[color_map][pwk_lookup[d]['Topic_Perc_Contrib']]; })
        .style("stroke", function(d) {if(seeds.includes(d)){return "blue"} });

    // Draw the axis
    var xAxis = d3.axisLeft(y).tickValues(y.domain().filter(function(d, idx) { return idx%5==0 }))
    svg
    .append("g")
    .attr("transform", "translate(50,0)")      // This controls the vertical position of the Axis
    .call(xAxis);

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
            svg.selectAll('g').selectAll(group).attr("transform", "translate(" + moving_distance + "," + 0 + ")");
          })
      }
    }

    move_bars_to_center()
  }

  create_stacked_bars()

  color_points = d3.scaleOrdinal(d3.schemeCategory10)


  function insert_seedselection(seeds,color_points){
    field.selectAll(".seed_points")
    .data(seeds)
    .enter()
    .append('circle')
        .attr('cx', function(d){return widthScale(pwk_lookup[d]['pca'][0])})
        .attr('cy', function(d){return heightScale(pwk_lookup[d]['pca'][1])})
        .attr('r','4')
        .attr("fill", function(d){return color_points(d)})
    
    marked = seeds.map(d => bin_lookup[d])
    console.log(marked)
    marked.forEach(m =>{
      console.log(m)
      d3.select('#hex' + String(m)).style('stroke',color_points(m)).style('stroke-width','8px')
    })

    
    
  }


  function update_selection(seeds){
    // Option 2: use a palette:
    // Include <script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script> in your code!

    //svg.selectAll(".firstrow").data(data).enter().append("circle").attr("cx", function(d,i){return 30 + i*60}).attr("cy", 150).attr("r", 19).attr("fill", function(d){return myColor(d) })

    // Select the table element
    var cardscontainer = d3.select('.cards-container');
    // Bind the data to the table
    var cards = cardscontainer.selectAll('card')
      .data(seeds)
      .enter()
      var card = cards.append('div').attr("class","card")

      var icondiv = card.append('div').attr("class","card-icon").append('div').attr("class","point")
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
      .text(function(d) { return paper_lookup[d].authors; });


      icondiv.append("svg").attr("height", 10).attr("width",  10).append("circle").attr("cx", 5).attr("cy", 5).attr("r", 5).attr("fill", function(d){return color_points(d)})
      .style('stroke', function(d) { return "grey"; })
      .style('stroke-width', function(d) { return '1px'; })
      insert_seedselection(seeds, color_points)
  }
  
  update_selection(seeds)

  function create_corpus_table(){
    // FILL TABLE WIT WHOLE CORPUS. Too much?
    // Select the table element
    var table = d3.select('#myTable');
    // Bind the data to the table
    var rows = table.selectAll('tr')
      .data(papers)
      .enter()
      .append('tr');
  
    // Append a cell for each piece of data in the row
    var cells = rows.selectAll('td')
      .data(function(d) { return [d.title, d.authors, d.year, d.venue]; })
      .enter()
      .append('td');
  
    // Set the cell's text content
    cells.text(function(d) { return d; });
  }
  create_corpus_table()

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
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}