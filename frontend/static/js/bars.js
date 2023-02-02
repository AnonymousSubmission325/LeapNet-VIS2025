function my_Func(network, papers, seeds, topics, pwt){
    data = network
    papers = papers['papers']
    var max_layer = Math.max(...papers.map(paper => paper.layer))
    var paper_lookup = {}
    papers.forEach(paper => {paper_lookup[paper.paperId] = paper})
    
    console.log(data)
    console.log(network)
    console.log(paper_lookup)
    console.log(seeds)
    console.log(topics)
    console.log(pwt)
    
    
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


    data = prepare_data()
  
    var groups = [...Array(data.length).keys()];
    console.log(groups)
    var subgroups = ["Topic1", "Topic2"]
  
    // List of subgroups = header of the csv files = soil condition here
    //var subgroups = data.columns.slice(1)

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    //var groups = d3.map(data, function(d){return(d.group)}).keys()
    // Add X axis
    var x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0])
    svg.append("g")
      .attr("transform", "translate(0," + height/2 + ")")
      .call(d3.axisBottom(x));
  
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, 6])  //get maximum number of rect in one column
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));
  
    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(['#e41a1c','#377eb8','#4daf4a'])

    rw = 45,
    rh = 45;

    // var data = [];
    // for (var k = 0; k < 3; k += 1) {
    //     data.push(d3.range(3));
    // }
    // Create a group for each row in the data matrix and
    // translate the group horizontally
    var grp = svg.append('g').selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('transform', function(d, i) { return 'translate('+ x(i) + ', 0)';});

    // For each group, create a set of rectangles and bind 
    // them to the inner array (the inner array is already
    // binded to the group)
    grp.selectAll('rect')
        .data(function(d) { return d; })
        .enter()
        .append('rect')
            .attr('y', function(d, i) { console.log(d); return y(i); })
            .attr('transform', function(d, i) { return 'translate( 0,' + -rh/2 +')';})
            .attr('width', rw)
            .attr('height', rh)
            .style('stroke', 'red');

}