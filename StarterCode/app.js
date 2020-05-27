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
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//initial Parameters
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

//a function for updating the x-scale variable upon click of label

function xScale(censusData, chosenXAxis) {
  //scales
  let xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2])
    .range([0, width]);
  return xLinearScale;
}

//function used for updating y-scale var upon clicking on axis label
function yScale(censusData, chosenYAxis) {
  //scales
  let yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
      d3.max(censusData, d => d[chosenYAxis]) * 1.2])
    .range([height, 0]);

  return yLinearScale;
}

//function used for updating xAxis var upon click on axis label
function renderAxesX(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
      .duration(1000)
      .call(bottomAxis);

  return xAxis;
}

//function used for updating yAxis var upon click on axis label
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
      .duration(1000)
      .call(leftAxis);

  return yAxis;
}

//function used for updating circles group with a transition to new circles
//for change in x axis or y axis
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
      .duration(1000)
      .attr("cx", data => newXScale(data[chosenXAxis]))
      .attr("cy", data => newYScale(data[chosenYAxis]));

  return circlesGroup;
}

//function used for updating state labels with a transition to new 
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  textGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));

  return textGroup;
}
//function to stylize x-axis values for tooltips
function styleX(value, chosenXAxis) {

  //stylize based on variable chosen
  //poverty percentage
  if (chosenXAxis === 'poverty') {
      return `${value}%`;
  }
  //household income in dollars
  else if (chosenXAxis === 'income') {
      return `$${value}`;
  }
  //age (number)
  else {
      return `${value}`;
  }
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  //select x label
  //poverty percentage
  if (chosenXAxis === 'poverty') {
      var xLabel = "Poverty:";
  }
  //household income in dollars
  else if (chosenXAxis === 'income') {
      var xLabel = "Median Income:";
  }
  //age (number)
  else {
      var xLabel = "Age:";
  }

  //select y label
  //percentage lacking healthcare
  if (chosenYAxis === 'healthcare') {
      var yLabel = "No Healthcare:"
  }
  //percentage obese
  else if (chosenYAxis === 'obesity') {
      var yLabel = "Obesity:"
  }
  //smoking percentage
  else {
      var yLabel = "Smokers:"
  }

  //create tooltip
  var toolTip = d3.tip()
      .attr("class", 'd3-tip')
      .offset([-8, 0])
      .html(function(d) {
          return (`${d.state}<br>${xLabel} ${styleX(d[chosenXAxis], chosenXAxis)}<br>${yLabel} ${d[chosenYAxis]}%`);
      });

  circlesGroup.call(toolTip);

//   //add events
  circlesGroup.on("mouseover", toolTip.show)
  .on("mouseout", toolTip.hide);

  return circlesGroup;
}

  // Import censusData
d3.csv("data.csv").then(function(censusData) {

  console.log(censusData);

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
        data.abbr = data.abbr;

    });

    
    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = xScale(censusData, chosenXAxis);
    var yLinearScale = yScale(censusData, chosenYAxis);

      // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    var xAxis = chartGroup.append("g")
      .classed('x-axis', true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    //append Y
    var yAxis = chartGroup.append('g')
      .classed('y-axis', true)
      //.attr
      .call(leftAxis);

      // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "11")
    .attr("fill", "pink")
    .attr("opacity", "5");

     //append Initial Text
     var textGroup = chartGroup.selectAll('.stateText')
     .data(censusData)
     .enter()
     .append('text')
     .classed('stateText', true)
     .attr('x', d => xLinearScale(d.poverty))
     .attr('y', d => yLinearScale(d.healthcare))
     .attr('dy', 3)
     .attr('font-size', '10px')
     .text(function(d){return d.abbr});

      //create a group for the x axis labels
    var xLabelsGroup = chartGroup.append('g')
    .attr('transform', `translate(${width / 2}, ${height + 10 + margin.top})`);
    
    var povertyLabel = xLabelsGroup.append('text')
      .classed('aText', true)
      .classed('active', true)
      .attr('x', 0)
      .attr('y', 20)
      .attr('value', 'poverty')
      .text('In Poverty (%)');
      
    var ageLabel = xLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 40)
      .attr('value', 'age')
      .text('Age (Median)');  

    var incomeLabel = xLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 60)
      .attr('value', 'income')
      .text('Household Income (Median)')

    //create a group for Y labels
    var yLabelsGroup = chartGroup.append('g')
      .attr('transform', `translate(${0 - margin.left/4}, ${height/2})`);

    var healthcareLabel = yLabelsGroup.append('text')
      .classed('aText', true)
      .classed('active', true)
      .attr('x', 0)
      .attr('y', 0 - 20)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'healthcare')
      .text('Without Healthcare (%)');
    
    var smokesLabel = yLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 0 - 40)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'smokes')
      .text('Smoker (%)');
    
    var obesityLabel = yLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 0 - 60)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'obesity')
      .text('Obese (%)');

    // Step 6: Update tool tip
    // ==============================
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

     //x axis event listener
     xLabelsGroup.selectAll('text')
       .on('click', function() {
         var value = d3.select(this).attr('value');
 
         if (value != chosenXAxis) {
 
           //replace chosen x with a value
           chosenXAxis = value; 
 
           //update x for new data
           xLinearScale = xScale(censusData, chosenXAxis);
 
           //update x 
           xAxis = renderXAxis(xLinearScale, xAxis);
 
           //upate circles with a new x value
           circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
 
           //update text 
           textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
 
           //update tooltip
           circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    //change of classes changes text
    if (chosenXAxis === 'poverty') {
      povertyLabel.classed('active', true).classed('inactive', false);
      ageLabel.classed('active', false).classed('inactive', true);
      incomeLabel.classed('active', false).classed('inactive', true);
    }
    else if (chosenXAxis === 'age') {
      povertyLabel.classed('active', false).classed('inactive', true);
      ageLabel.classed('active', true).classed('inactive', false);
      incomeLabel.classed('active', false).classed('inactive', true);
    }
    else {
      povertyLabel.classed('active', false).classed('inactive', true);
      ageLabel.classed('active', false).classed('inactive', true);
      incomeLabel.classed('active', true).classed('inactive', false);
    }
  }
});

     //y axis lables event listener
     yLabelsGroup.selectAll('text')
     .on('click', function() {
       var value = d3.select(this).attr('value');

       if(value !=chosenYAxis) {
           //replace chosenY with value  
           chosenYAxis = value;

           //update Y scale
           yLinearScale = yScale(censusData, chosenYAxis);

           //update Y axis 
           yAxis = renderYAxis(yLinearScale, yAxis);

           //Udate CIRCLES with new y
           circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

           //update TEXT with new Y values
           textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

           //update tooltips
           circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

           //Change of the classes changes text
           if (chosenYAxis === 'obesity') {
             obesityLabel.classed('active', true).classed('inactive', false);
             smokesLabel.classed('active', false).classed('inactive', true);
             healthcareLabel.classed('active', false).classed('inactive', true);
           }
           else if (chosenYAxis === 'smokes') {
             obesityLabel.classed('active', false).classed('inactive', true);
             smokesLabel.classed('active', true).classed('inactive', false);
             healthcareLabel.classed('active', false).classed('inactive', true);
           }
           else {
             obesityLabel.classed('active', false).classed('inactive', true);
             smokesLabel.classed('active', false).classed('inactive', true);
             healthcareLabel.classed('active', true).classed('inactive', false);
           }
         }
       });
});