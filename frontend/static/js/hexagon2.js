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


    var randomX = d3.randomNormal(width / 2, 80),
        randomY = d3.randomNormal(height / 2, 80),
    
 //   points = []
 //   network['nodes'].forEach(element => {
 //       points.push([randomX,randomY, element.paperId])    
 //   });
    points = d3.range(network['nodes'].length).map(function() { return [randomX(), randomY()]; });
    var color = d3.scaleSequential(d3.interpolateLab("white", "steelblue"))
        .domain([0, 20]);

    var hexbin = d3.hexbin()
        .radius(20)
        .extent([[0, 0], [width, height]]);

    var x = d3.scaleLinear()
        .domain([0, width])
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain([0, height])
        .range([height, 0]);

    svg.append("clipPath")
        .attr("id", "clip")
    .append("rect")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .attr("class", "hexagon")
        .attr("clip-path", "url(#clip)")
    .selectAll("path")
    .data(hexbin(points))
    .enter().append("path")
        .attr("d", hexbin.hexagon())
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .attr("fill", function(d) { return color(d.length); });

    svg.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).tickSizeOuter(-width));

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(-height));
    return network
}