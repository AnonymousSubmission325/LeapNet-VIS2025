function prepare_data(paper_lookup, pwt_lookup, topics_arr, key_to_sort){
    // 
    //  following format is given:
    //      data = [
    //     ["id1", "id2", "id3","id4", "id5", "id12"],
    //     ["id7", "id8", "id9","id10", "id11"]
    // ]
    slices_unsorted = []

    var all_years = Object.entries(paper_lookup).map(p => p[1]['year'])
    var uniqueYears = [...new Set(all_years)];
    var sortedYears = uniqueYears.sort((a,b)=>a-b);
    var columns = sortedYears

    year_dic = {}
    sortedYears.map(year => year_dic[year] = [])
    
    Object.entries(paper_lookup).map( p => year_dic[p[1]['year']].push(p[0]));
    var all_years = Object.entries(year_dic).map(p => slices_unsorted.push(p[1]));

    data = []
    function sort_by_topic(slice){
        sorted = []
        topics_arr.map(t => 
            slice.map(c => {if(t == pwt_lookup[c]['Dominant_Topic']){sorted.push(c)}}))
        return sorted
    }
    slices_unsorted.map(s => data.push(sort_by_topic(s)))
    
    return data, columns
}