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
var treemap = d3.layout.treemap()
    .children(function(d){
        return d.values;
    })
    .size([width,height])
    .value(function(d){return d.total});

//Generators?

//Scales
var scaleColor = d3.scale.ordinal().domain([1,2,3,4]).range(['#FF510E','#F58465','#003438','rgb(220,220,220)'])

function dataLoaded(err,data,m){
    var nestedData = d3.nest().key(function(d){return d.activity1})
        .entries(data);

    var hierarchy = {
        key:"day",
        values:nestedData
    };

    console.log(treemap(hierarchy));
    d3.selectAll('.btn').on('click',function(){
        var id = d3.select(this).attr('id');

        if(id=='all'){
            treemap
                .value(function(d){return d.total})
        }else if(id=="m"){
            treemap
                .value(function(d){return d.men})
        }else{
            treemap
                .value(function(d){return d.women})
        }

        draw(hierarchy);
    })

    draw(hierarchy);
}

function draw(hierarchy){
    console.log('Redraw');
    console.log(hierarchy);

    var node = plot.selectAll('.time')
        .data(treemap(hierarchy),function(d){return d.key});

    var nodeEnter = node.enter().append('g')
        .attr('class','time');
    nodeEnter
        .append('rect')
        .style('stroke','white')
        .style('stroke-width','1px')
        .style('fill',function(d){
            if(!d.activity1){return null;}
            var classification = metadata.get(d.activity1).classification;
            return scaleColor(classification);
        });

    node.exit().remove();

    node
        .select('rect')
        .transition()
        .attr('x',function(d){return d.x})
        .attr('y',function(d){return d.y})
        .attr('width',function(d){return d.dx})
        .attr('height',function(d){return d.dy});
}

function parse(d){
    return {
        activity1:d['activity 1'],
        key:d['activity 2'],
        total:+d.Total,
        men:+d.Men,
        women:+d.Women
    }
}

function parseMetadata(d){
    //use this function to populate the d3.map()
    metadata.set(d.activity1,{
        abbrev:d.abbrev,
        classification:d.classification
    })
}