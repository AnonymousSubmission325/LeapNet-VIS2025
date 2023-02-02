function prepare_data(paper_lookup){
    data = [
        ["id1", "id2", "id3","id4", "id5", "id12"],
        ["id7", "id8", "id9","id10", "id11"]
    ]
    data = []

    var all_years = Object.entries(paper_lookup).map(p => p[1]['year'])
    var uniqueYears = [...new Set(all_years)];
    var sortedYears = uniqueYears.sort((a,b)=>a-b);

    year_dic = {}
    sortedYears.map(year => year_dic[year] = [])
    
    Object.entries(paper_lookup).map( p => year_dic[p[1]['year']].push(p[0]));
    var all_years = Object.entries(year_dic).map(p => data.push(p[1]));

    return data
}