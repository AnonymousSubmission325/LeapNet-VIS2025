function my_Func(network, papers, seeds, keys, pwk, paths){
    data = network
    papers = papers['papers']
    pwk = pwk['papers']
    seeds = seeds['seeds']
    var max_layer = Math.max(...papers.map(paper => paper.layer))
    var paper_lookup = {}
    papers.forEach(paper => {paper_lookup[paper.paperId] = paper})
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
    
    
    var rect = document.querySelector('#vis'),
        width = rect.offsetWidth,
        height = rect.offsetHeight;

    
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
  color_map = 'PCA_Bremm'
  key_to_sort = 'year'
  
  //topics_arr = Object.keys(keys['Topic_Num'])
  data, columns = prepare_data(paper_lookup,pwk_lookup,topics_arr , key_to_sort)

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


}