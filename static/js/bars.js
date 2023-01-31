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
    var width = 800,
    height = 300;

    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 30, bottom: 30, left: 60}

    var svg = d3.select("div#vis")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1000 1000")
    .classed("svg-content", true)
    .append("g").attr("transform","translate(" + margin.left + "," + margin.top + ")");


    d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv", function(data) {

    console.log(data)
    // data = []
    // header = []
    // for (let step = 0; step < 20; step++) {
    //   header.push(String(step))
    // }
    // data['columns'] = header
    
    // for (let step = 0; step < 20; step++) {
    //   row = {group : String(step)}
    //   for (let s = 0; s < 20; s++) {
    //     row[String(s)] = '1'
    //   }
    //   data.push(row)
    // }

  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(1)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function(d){return(d.group)}).keys()
  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0])
  svg.append("g")
    .attr("transform", "translate(0," + height/2 + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 60])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#e41a1c','#377eb8','#4daf4a'])

  //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)
    (data)

  // Show the bars
  var container = svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect").attr("class", function(d) { return "group_"+ x(d.data.group); })
        .attr("x", function(d) { return x(d.data.group); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth())

  function move_bars_to_center(){
    groups = ['.group_0', '.group_200', '.group_400', '.group_600']

    for (const group of groups){
        stack_height = 0;
        svg.selectAll(group).each(function(){stack_height = stack_height + parseInt(this.attributes.height.value)})
        moving_distance = -height/2 + stack_height/2
        
        svg.selectAll('g').selectAll(group).attr('width', 10).transition().duration(1000).attr("transform", "translate(" + 0 + "," + moving_distance + ")");
    }
  }
  //   stack_height = 0
  //   svg.selectAll('.group_0').each(function(){console.log(this.attributes.height.value); stack_height = stack_height + parseInt(this.attributes.height.value)})
  //   moving_distance =  -height/2 + stack_height/2
  //   console.log(stack_height)
  //   svg.selectAll('g').selectAll('.group_0').attr('width', 10).transition().duration(1000).attr("transform", "translate(" + 0 + "," + moving_distance + ")");
  //   svg.selectAll('g').selectAll('.group_200').attr('width', 10).transition().duration(1000).attr("transform", "translate(" + 0 + "," + moving_distance + ")");
  //   svg.selectAll('g').selectAll('.group_400').attr('width', 10).transition().duration(1000).attr("transform", "translate(" + 0 + "," + moving_distance + ")");
  //   svg.selectAll('g').selectAll('.group_600').attr('width', 10).transition().duration(1000).attr("transform", "translate(" + 0 + "," + moving_distance + ")");
  move_bars_to_center()
  //svg.selectAll('g').selectAll('.group_0').attr('width', 10).transition().duration(1000).attr("transform", "translate(" + 0 + "," + -50 + ")");  


  })
}