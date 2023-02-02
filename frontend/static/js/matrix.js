function my_Func(network, papers, seeds, topics, pwt){
    data = network
    papers = papers['papers']
    var max_layer = Math.max(...papers.map(paper => paper.layer))
    var paper_lookup = {}
    papers.forEach(paper => {paper_lookup[paper.paperId] = paper})

    var pwt_lookup = {}
    //Object.entries(pwt['paperId']).forEach((k,v) => Object.entries(pwt) )
    //pwt.forEach(paper => {pwt_lookup[paper.paperId] = paper})

    console.log(data)
    console.log(network)
    console.log(papers)
    console.log(paper_lookup)
    console.log(seeds)
    console.log(topics)
    console.log(pwt)
    console.log(pwt_lookup)
    
    
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


    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 30, bottom: 30, left: 60}

    var svg = d3.select("div#vis")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1000 1000")
    .classed("svg-content", true)
    .append("g").attr("transform","translate(" + margin.left + "," + margin.top + ")");


    data = prepare_data(paper_lookup)
  console.log(data)

  var cellSize = 50, border = 1;
  var width = data.length * (cellSize + border) , height = 300;


  var x = d3.scaleBand()
      .range([0, width])
      .domain(d3.range(data.length));
  
  var y = d3.scaleBand()
      .range([0, height])
      .domain(d3.range(6)); //get maximum length
  
  // Show the bars
  var container = svg.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
    .attr('transform', function(d, i) { return 'translate('+ x(i) + ', 0)';})
    .selectAll("rect")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(function(d) { return d; })
    .enter().append("rect")
    //.attr("class", function(d) { return "group_"+ x(d.data.group); })
      .attr("y", function(d,i) { console.log(d); return y(i); })
      .attr("height", cellSize)
      .attr("width",cellSize)
      .style("stroke", "red")

}