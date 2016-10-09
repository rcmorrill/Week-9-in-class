/*Start by setting up the canvas */
var margin = {t:50,r:100,b:50,l:50};
var width = document.getElementById('plot').clientWidth - margin.r - margin.l,
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var plot = d3.select('.canvas')
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
//TODO: create pie layout

var pieLayout = d3.layout.pie()
    .value(function(d){
        return d.total
    })
    .sort(function(a,b){
        return b.activity1 - a.activity1;
    })

//Generator function
//TODO: create arc generator

var arcGenerator = d3.svg.arc()
    .innerRadius(100)
    .outerRadius(function(d){
        return (d.data.men/d.data.women *100+100);
    });

//Scales
//TODO: create color scale based on activity classification

var scaleColor = d3.scale.ordinal().domain([1,2,3,4]).range(['blue','red', 'orange','green']);

function dataLoaded(err,data,m){

    //console.log(data);

    var pieChart = plot
        .append('g')
        .attr('class','pie-chart')
        .attr('transform','translate('+width/2+','+height/2+')')
    pieChart
        .selectAll('.slice')
        .data(pieLayout(data))
        .enter()
        .append('path').attr('class','slice')
        .attr('d',arcGenerator)
        .style('fill', function(d){

            console.log(d);
            var classification = metadata.get(d.data.activity1); //1-4
            return scaleColor(classification);

        });

    pieChart.append('circle')
        .attr('r',200)
        .style('fill','none')
        .style('stroke','black')
        .style('stroke-width','1px')
        .style('stroke-dasharray','5px 5px');

    pieChart.selectAll('text')
        .data(pieLayout(data))
        .enter()
        .append('text')
        .text(function(d){return d.data.activity2})
        .attr('transform',function(d){
            var angle =((d.startAngle + d.endAngle)/2)/(2*Math.PI)*360-90;
            return 'rotate('+angle+')'+'translate(250,0)'

        })

    console.log(metadata);
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
    metadata.set(d.activity1, +d.classification)

}