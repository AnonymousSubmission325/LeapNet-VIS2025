function my_Func(network, papers){
data = network
papers = papers['papers']
var max_layer = Math.max(...papers.map(paper => paper.layer))
var paper_lookup = {}
papers.forEach(paper => {paper_lookup[paper.paperId] = paper})

console.log(data)
console.log(network)
console.log(paper_lookup)

var width = 1000,
    height = 1000;

// set the dimensions and margins of the graph
var margin = {top: 50, right: 30, bottom: 30, left: 60}

var svg = d3.select("div#vis")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 1000 1000")
  .classed("svg-content", true)
  .append("g").attr("transform","translate(" + margin.left + "," + margin.top + ")");

var hexRadius = Math.floor((width / 12)*0.5);
var points = [];
for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 12; j++) {
        points.push([hexRadius * j * 1.8, hexRadius * i * 1.5]);
    }
}

var hexbin = d3.hexbin()
    .radius(hexRadius);

svg.append("g")
    .selectAll(".hexagon")
    .data(hexbin(points))
    .enter().append("path")
    .attr("class", "hexagon")
    .attr("d", function (d) {
    return "M" + d.x + "," + d.y + hexbin.hexagon();
})
    .attr("stroke", "#fff")
    .attr("stroke-width", "2px")
    .style("fill", function (d) {
    return "#dcdcdc"; //color(d.length); 
})

return data
}