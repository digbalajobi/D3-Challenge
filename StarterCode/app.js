// @TODO: YOUR CODE HERE!

//set svg and chart dimensions
var svgWidth = 960;
var svgHeight = 680;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
  };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Import Data
d3.csv("data.csv").then(function(HData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    HData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    })

    });

// // Create circles 
// var circlesGroup = chartGroup.selectAll("circle")
// .data(Data)
// .enter()
// .append("circle")
// .attr("cx", d => xLinearScale(d.poverty))
// .attr("cy", d => yLinearScale(d.healthcare))
// .attr("r", "15")
// .attr("fill", "pink")
// .attr("opacity", ".5");

  
// // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.


// // set borders in svg

// function init(){
//     djdata = "";
//     d3.csv("data.csv").then(healthData=> {
//         console.log(healthData)
//         djdata= healthData
//     });
//     djdata.forEach(function(state){
//         state.poverty = +state.poverty;
//         state.abbr = state.abbr;
//         state.income = +state.income;
//         state.obesity= +state.obesity;
//     })
//     };
//     init();