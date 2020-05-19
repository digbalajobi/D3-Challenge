// @TODO: YOUR CODE HERE!
function init(){
    d3.csv("data.csv").then
    (healthData => {
        console.log (healthData)
    })

};
init();