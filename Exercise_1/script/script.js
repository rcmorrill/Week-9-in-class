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

//TODO: create an arc, centered at (100,100), with outer radius 100, inner radius 50, starting at 12 o'clock and ending at 6
var arcGenerator = d3.svg.arc()
    .innerRadius(50)
    .outerRadius(100);

plot.append('g')
    .attr('transform','translate(100,100)')
    .append('path')
    .datum({
        startAngle:0,
        endAngle:Math.PI*2
    })
    .attr('d',arcGenerator);

//TODO: create an arc, centered at (350,100), with outer radius 100, inner radius 0, starting at 6 o'clock and ending at 9
arcGenerator
    .innerRadius(0);
plot.append('g')
    .attr('transform','translate(350,100)')
    .append('path')
    .datum({
        startAngle:Math.PI,
        endAngle:Math.PI/2*3
    })
    .attr('d',arcGenerator);
