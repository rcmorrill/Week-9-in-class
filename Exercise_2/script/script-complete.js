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
var pieLayout = d3.layout.pie()
    .value(function(d){return d.total})
    .sort(function(a,b){
        return a.activity1 - b.activity1; //sort by top-level activities
    })

//Generator function
var arcGenerator = d3.svg.arc()
    .innerRadius(80)
    .outerRadius(function(d){
        return 80 + (d.data.men/d.data.women)*70;
    });

//Scales
var scaleColor = d3.scale.ordinal().domain([1,2,3,4]).range(['#FF510E','#F58465','#003438','rgb(220,220,220)'])

function dataLoaded(err,data,m){
    console.log(pieLayout(data));

    var pieChart = plot.append('g')
        .attr('transform','translate('+width/2+','+height/2+')')
    var slices = pieChart.selectAll('.activity-2')
        .data(pieLayout(data),function(d){return d.data.activity2})
        .enter()
        .append('g').attr('class','activity-2');

    slices.append('path')
        .attr('d',arcGenerator)
        .style('fill', function(d){
            var classification = metadata.get(d.data.activity1).classification;
            return scaleColor(classification);
        })
    slices.append('text')
        .text(function(d){return d.data.activity2})
        .attr('transform',function(d){
            //angle in radians, starting at 12 o'clock
            var angle = (d.startAngle + d.endAngle)/2;
            //transform radian to degrees
            angle = angle/(2*Math.PI)*360;
            //start at 3 o'clock instead
            angle = angle-90;

            return 'rotate('+angle+')translate(160,0)';
        })
        .style('fill-opacity',function(d){
            if ((d.endAngle-d.startAngle)<Math.PI/90){return 0}
        })

    pieChart.append('circle')
        .attr('r',150)
        .attr('class','axis');
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
    //use this function to populate the d3.map()
    metadata.set(d.activity1,{
        abbrev:d.abbrev,
        classification:d.classification
    })
}