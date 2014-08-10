
var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

var dataArray = [1, 2, 3, 4, 5];

d3.csv('data/employees-list.csv', function(data) { process(data)});

//Time Scale
var xTime = d3.time.scale()
    .domain([new Date('2009-09-01'), d3.time.month.offset(new Date('2014-09-01'), 5)])
    .rangeRound([0, x]);

var xAxis = d3.svg.axis()
    .scale(xTime)
    .orient('bottom')
    .ticks(d3.time.years, 1)
    .tickFormat(d3.time.format('%Y'))
    .tickSize(8)
    .tickPadding(8);

function process (data) {
var points = [
  [480, 200],
  [580, 400],
  [680, 100],
  [780, 300],
  [180, 300],
  [280, 100],
  [380, 400]
];

var index = 1;
var colorsGlow = ["#0892d0", "#FFA500"]

var svg = d3.select("body").append("svg")
    .attr("width", x)
    .attr("height", y-50);

var svg2 = d3.select("body").append("svg")
    .attr('class', 'chart')
    .attr("width", x)
    .attr("height", 50);

    svg2.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0, ' + 5 + ')')
    .call(xAxis);


createDefs();



function createDefs () {

var clip = svg.append("defs").append("svg:clipPath")
    .attr("id", "clip")
    .append("circle")
    .attr("id", "clip-circle")
    .attr("cx", "10%")
    .attr("cy", "10%")
    .attr("r", "5%")
    ;


// create filter with id #drop-shadow
// height=130% so that the shadow is not clipped
var filter = svg.append("defs").append("filter")
                 .attr("id", "glow")
                 .attr("x", "-30%")
                 .attr("y", "-30%")
                 .attr("width", "160%")
                 .attr("height", "160%");

// SourceAlpha refers to opacity of graphic that this filter will be applied to
// convolve that with a Gaussian with standard deviation 3 and store result
// in blur
filter.append("feGaussianBlur")
.attr("stdDeviation", 5)
.attr("result", "glow");


// overlay original SourceGraphic over translated blurred opacity by using
// feMerge filter. Order of specifying inputs is important!
var feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode")
           .attr("in", "glow");
    feMerge.append("feMergeNode")
           .attr("in", "glow");
    feMerge.append("feMergeNode")
           .attr("in", "glow");

};

function transition() {
  index++;
  console.log("index value", index);

var g = svg.selectAll("g").data(data, function(d,i) { return d.id <=index?d.id:null});


  // var circle = g.append("circle")
  //               .attr("id", "circleGlow")
  //               .attr("stroke", function(d,i){ return colorsGlow[ i%2 ];})
  //               .attr("cx", "10%")
  //               .attr("cy", "10%")
  //               .attr("r", "6%")
  //               .attr("filter", "url(#glow)");


  // var imgs = g.append("svg:image")
  //               .attr("xlink:href", function(d) { return d +".png"})
  //               .attr("x", "0%")
  //               .attr("y", "0%")
  //               .attr("width", "20%")
  //               .attr("height", "20%")
  //               .attr("clip-path", "url(#clip)");


  g.transition()
      .duration(8000)
      .attr("transform", function(d, i) { return "translate("+ (Math.random()  * x) +","+ (Math.random()  * y) +")"; });

  var group = g.enter().append("g");


    group.append("circle")
                .attr("id", "circleGlow")
                .attr("stroke", function(d,i){ return colorsGlow[ i%2 ];})
                .attr("cx", "10%")
                .attr("cy", "10%")
                .attr("r", "6%")
                .attr("filter", "url(#glow)");

                group.append("svg:image")
                .attr("xlink:href", function(d) { if (d.HasPicture) {return "img/" + d.id +".png"} else {return "img/li.png"}})
                .attr("x", "0%")
                .attr("y", "0%")
                .attr("width", "20%")
                .attr("height", "20%")
                .attr("clip-path", "url(#clip)");

    group.transition()
      .duration(2000)
      .attr("transform", function(d, i) { return "translate("+ (Math.random()  * x) +","+ (Math.random()  * y) +")"; }).style("fill-opacity", 1)
      ;
  g.exit().remove();
 // createElement();
}

// Returns an attrTween for translating along the specified path element.
function translateAlong(path) {
  var l = path.getTotalLength();
  return function(d, i, a) {
    return function(t) {
      var p = path.getPointAtLength(t * l);
      return "translate(" + p.x + "," + p.y + ")";
    };
  };
}

setInterval(function() {
  transition();
}, 1000);

};
