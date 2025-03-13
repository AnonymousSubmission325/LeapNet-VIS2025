function my_Func(network, papers){
data = network
papers = papers['papers']
var max_layer = Math.max(...papers.map(paper => paper.layer))
var paper_lookup = {}
papers.forEach(paper => {paper_lookup[paper.paperId] = paper})

console.log(data)
console.log(network)
console.log(paper_lookup)


var rect = document.querySelector('#vis'),
    width = rect.offsetWidth,
    height = rect.offsetHeight;

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40}

// append the svg object to the body of the page

// var svg = d3.select("#chart")
//   .attr("width", width + margin.left + margin.right + "px")
//   .attr("height", height + margin.top + margin.bottom + "px")
// .append("g")
//   .attr("transform",
//         "translate(" + margin.left + "," + margin.top + ")");
var svg = d3.select("#chart")
  .attr("width", width + "px")
  .attr("height", height  + "px")
.append("g");


  // Initialize the links
  var link = svg
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
      .style("stroke", "#aaa")

  // Initialize the nodes


  console.log(max_layer)
  var myColor = d3.scaleLinear().domain([0,max_layer])
  .range(["red", "blue"])




  var node = svg
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
      .attr("r", 5)
      .attr("fill", function(d){ var l = paper_lookup[d.id].layer; console.log(l); if(l == 0){ return "red" }
                                  if (l == 1) { return "orange"} 
                                  else { return "blue"}
      })

  const simulation = d3.forceSimulation(data.nodes)
      .force("charge", d3.forceCollide().radius(7).iterations(2))
      .force("r", d3.forceRadial(d => {var l = paper_lookup[d.id].layer; if (l===0) {return 10}; if(l===1) {return 70} else return 120}, width/2, height/2).strength(0.2))
      .on("tick", ticked)
      .alphaTarget(0.1);


  // This function is run at each iteration of the force algorithm, updating the nodes position.
  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
         .attr("cx", function (d) { return d.x; })
         .attr("cy", function(d) { return d.y; });
  }


return data
}