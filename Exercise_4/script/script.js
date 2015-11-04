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

    d3.selectAll('.btn').on('click',function(){
        var id = d3.select(this).attr('id');

        if(id=='all'){
            //
        }else if(id=="m"){
            //
        }else{

        }
    })

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