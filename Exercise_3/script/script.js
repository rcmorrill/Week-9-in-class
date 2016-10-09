/*Start by setting up the canvas */
var margin = {t:50,r:100,b:50,l:50};
var width = document.getElementById('plot').clientWidth - margin.r - margin.l,
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var plot = d3.select('#plot')
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');
var plot2 = d3.select('#plot-2')
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');


//Import
queue()
    .defer(d3.csv,'data/atus-2014.csv',parse)
    .defer(d3.csv,'data/metadata.csv',parseMetadata)
    .await(dataLoaded);

//Layout function
var partition = d3.layout.partition()
    .size([width,height])
    .children(function(d){
        //given the heirarchy data, how to go down the tree
        return d.values;
    })
    .value(function(d){
        return d.total;
    })

//Generators?

//Scales
var scaleR = d3.scale.linear().domain([0,height]).range([50,height/2-50])

function dataLoaded(err,data,m){

    var nestedData=d3.nest().key(function(d){return d.activity1})
        .entries(data);

    console.log(nestedData);

    var heirarchy = {
        key:"all day",
        values: nestedData
    }

    console.log(heirarchy);

    console.log(partition(heirarchy));
    //Draw as a rectangular partition diagram

    plot.selectAll('.slice')
        .data(partition(heirarchy))
        .enter()
        .append('rect')
        .attr('class','slice')
        .attr('x', function(d){return d.x})
        .attr('y', function(d){return d.y})
        .attr('width', function(d){return d.dx})
        .attr('height', function(d){return d.dy})
        .style('stroke','white')
        .style('stroke-width','1px')


    //Draw as a circular partition diagram
}

function parse(d){
    return {
        activity1:d['activity 1'],
        activity2:d['activity 2'],
        total:+d.Total,
        men:+d.Men,
        women:+d.Women
    }
}

function parseMetadata(d){
}