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


var metadata = d3.map();

//Import
queue()
    .defer(d3.csv,'data/atus-2014.csv',parse)
    .defer(d3.csv,'data/metadata.csv',parseMetadata)
    .await(dataLoaded);

//Layout function
var partition = d3.layout.partition()
    .children(function(d){
        return d.values;
    })
    .size([width,height])
    .value(function(d){return d.total});

//Generators?
var arc = d3.svg.arc()
    .startAngle(function(d){
        return d.x/width*Math.PI*2
    })
    .endAngle(function(d){
        return (d.x+d.dx)/width*Math.PI*2
    })
    .innerRadius(function(d){
        return scaleR(d.y);
    })
    .outerRadius(function(d){
        return scaleR(d.y+d.dy);
    })

//Scales
var scaleR = d3.scale.linear().domain([0,height]).range([50,height/2-50])

function dataLoaded(err,data,m){
    var nestedData = d3.nest().key(function(d){return d.activity1})
        .entries(data);

    var hierarchy = {
        key:"day",
        values:nestedData
    };

    console.log(partition(hierarchy));

    //Draw as a rectangular partition diagram
    var node = plot.selectAll('.time')
        .data(partition(hierarchy))
        .enter()
        .append('rect').attr('class','time')
        .attr('x',function(d){return d.x})
        .attr('y',function(d){return d.y})
        .attr('width',function(d){return d.dx})
        .attr('height',function(d){return d.dy})
        .style('stroke',function(d){
            return 'rgb(100,100,100)';
        })
        .style('stroke-width','1px');

    //Draw as a circular partition diagram
    plot2.append('g')
        .attr('class','partition pie')
        .attr('transform','translate('+width/2+','+height/2+')')
        .selectAll('.time')
        .data(partition(hierarchy))
        .enter()
        .append('path')
        .attr('class','time')
        .attr('d',arc)
        .style('stroke',function(d){
            return 'rgb(100,100,100)';
        })
        .style('stroke-width','1px');
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