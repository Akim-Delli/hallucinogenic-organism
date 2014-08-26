
var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    width = w.innerWidth || e.clientWidth || g.clientWidth,
    height = w.innerHeight|| e.clientHeight|| g.clientHeight;

var nodes = [],
    foci = [{x: 150, y: 150}, {x: 350, y: 250}, {x: 700, y: 400}];

d3.csv('data/employees-list.csv', function(data) {   process(data)});

//var fill = d3.scale.category10();
// Blue, Orange
var colorsGlow = ["#0892d0", "#FFA500"]


var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .nodes(nodes)
    .links([])
    .gravity(0)
    .size([width, height])
    .on("tick", tick);

var node = svg.selectAll("g");

createDefs();

function createDefs () {
    var clip = svg.append("defs").append("svg:clipPath")
    .attr("id", "clip")
    .append("circle")
    .attr("id", "clip-circle")
    .attr("cx", "3%")
    .attr("cy", "3%")
    .attr("r", "1.5%")
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


function tick(e) {
  var k = .1 * e.alpha;
  //console.log(k);

  // Push nodes toward their designated focus.
  nodes.forEach(function(o, i) {
    o.y += (foci[o.id].y - o.y) * k;
    o.x += (foci[o.id].x - o.x) * k;
  });

  node
         .attr('transform', function(d) {return "translate (" + d.x +"," + d.y + ")"});
      // .attr("x", function(d) { return d.x; })
      // .attr("y", function(d) { return d.y; });
}

function process (dataCsv) {


        setInterval(function(){

            if (typeof dataCsv !== 'undefined' && dataCsv !== null) {
                if (dataCsv.length > 0) {
                  nodes.push({id: ~~(Math.random() * foci.length), data : dataCsv.pop()});

                  force.start();

                  node = node.data(nodes);
                 // console.log(node);

                    nd = node.enter()
                        .append('g')
                        .attr("class", "node")
                         .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                        .call(force.drag);


                      nd.append("circle")
                        .attr("id", "circleGlow")
                        .attr("stroke", function(d,i){ return colorsGlow[ i%2 ];})
                        .attr("cx", "3%")
                        .attr("cy", "3%")
                        .attr("r", "2.5%")
                        .attr("filter", "url(#glow)");


                     nd.append("svg:image")
                        .attr("xlink:href", function(d) {
                            if (d.data.HasPicture) {return "img/" + d.data.id +".png"} else {return "img/li.png"}
                        })
                        // .attr("x", function(d) { return d.x; })
                        // .attr("y", function(d) { return d.y; })
                        .attr("width", "6%")
                        .attr("height", "6%")
                        .attr("clip-path", "url(#clip)");
                      // .call(force.drag);

                      //  nd.append('text')
                      // // .attr("x", function(d) { return d.x; })
                      // // .attr("y", function(d) { return d.y; })
                      // .text( function (d) { return "( " + d.data.Name + ", " + d.data.Title +" )"; })
                      //    .attr("font-family", "sans-serif")
                      //    .attr("font-size", "20px")
                      //        // .attr("fill", "red");

                       node.exit().remove();
                }
            }

    }, 500);
};
