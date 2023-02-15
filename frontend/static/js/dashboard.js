function my_Func(network, papers, seeds, keys, pwk, paths){
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



//these are not the numbers in keys. check why different! maybe create an copy beacuse keys is alterned

var field = svg.append("g")

var widthScale = d3.scaleLinear()
  .domain([0, 1])
  .range([0, width]);

var heightScale = d3.scaleLinear()
  .domain([0, 1])
  .range([0, height]);

var cluster_relevance = 1

console.log(keyword_points)
field.selectAll(".keytexts")
	.data(keyword_points)
  .enter().append("text")
  .filter(function(d){return key_lookup[d[2]][PROJECTION_KEYCLUSTERNUMS]>cluster_relevance})
	.attr("class", "keytext")
  .attr("x", function(d) {return widthScale(d[0]) })
  .attr("y", function(d) { return heightScale(d[1]) })
  .text(function(d) { return d[2]; })
  .style('font-size', '10px');

var hexbin = d3.hexbin()
.size([width,height])
.radius(15);
var bins = hexbin(points)

var color = d3.scaleSequential(d3.interpolateLab("white", "blue"))
.domain([0, d3.max(bins, d => d.length)/3 ]);


field.selectAll(".hexagon")
	.data(bins)
  .enter().append("path")
	.attr("class", "hexagon")
	.attr("d", hexbin.hexagon())
	.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
	.style("fill", function(d) { return color(d.length); })
  .style('opacity', 0.4);





// var svg = d3.select("div#vis")
// .append("svg")
// .attr("preserveAspectRatio", "xMinYMin meet")
// .attr("viewBox", "0 0 1000 1000")
// .classed("svg-content", true)
// .append("g").attr("transform","translate(" + margin.left + "," + margin.top + ")");

  data, columns = prepare_data(paper_lookup,pwk_lookup,keys , key_to_sort)

  max_stack = 0
  data.map(d => {if(d.length > max_stack){max_stack=d.length} })

  console.log('data')
  console.log(data)
  console.log('columns')
  console.log(columns)

  var cellSize = 4, border = 1;
  var width = data.length * (cellSize + border) , height = max_stack * cellSize + border;

  var x = d3.scaleBand()
      .range([0, width])
      .domain(d3.range(data.length));
  var y = d3.scaleBand()
      .range([0, height])
      .domain(d3.range(max_stack)); //get maximum length
  
  
  var rect = document.querySelector('#stacks');
  var width = rect.offsetWidth;
  var height = rect.offsetHeight;

  var svg = d3.select("div#stacks")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .classed("svg-content", true)
  .append("g")
  // Show the bars
  var container = svg.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
    .attr('transform', function(d, i) { return 'translate('+ x(i) + ', 0)';})
    //.attr("x", function(d,i) { return x(i); })
    //.attr('transform', function(d,i) { return 'translate('+ x(i) + ', 0)';})
    .selectAll("rect")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(function(d) { return d; })
    .enter().append("rect").attr("class", function(d) {return 's' + String(pwk_lookup[d]['year']); })
      //.attr("class", function(d) { return "group_"+ x(d.data.group); })
      .attr("y", function(d,i) { return y(i); })
      .attr("height", cellSize)
      .attr("width",cellSize)
      //.attr("fill", function(d) { return topics[color_map][pwk_lookup[d]['Dominant_Topic']]; })
      //.attr("opacity", function(d) { return topics[color_map][pwk_lookup[d]['Topic_Perc_Contrib']]; })
      .style("stroke", function(d) {if(seeds.includes(d)){return "blue"} });

      function move_bars_to_center(){
        groups = columns.map(c => '.s' + String(c) )
        for (const group of groups){
            stack_height = 0;
            svg.selectAll(group).each(function(){stack_height = stack_height + parseInt(this.attributes.height.value)})
            moving_distance = height/2 - stack_height/2
            
            svg.selectAll('g').selectAll(group).transition().duration(2000).attr("transform", "translate(" + 0 + "," + moving_distance + ")");
        }
      }
      move_bars_to_center()

      
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_network.json", function( data) {
      create_network(data);
})


}