myChart= {};

myChart.create = function(el) {
  svg = d3.select(el).append("svg")
    .attr("class", "d3Canvas")
    .attr("width", "500px")
    .attr("height", "500px")
    .attr("border", "1px")
    .style("background", "darkgrey");

  svg.append("path")
    .attr("d", "M 10,60 40,30 50,50, 60,30 70,80")
    .style("fill", "black")
    .style("stroke", "gray")
    .style("stroke-width", "4px");

  svg.append("polygon")
    .attr("points", "80,400 120,400 160,440 120,480 60,460")
    .style("fill", "red")

  svg.append("g")
    .attr("class", "geomObjs")

  this.update(el);
};

myChart.update = function(el) {
    this._draw(el);
}

myChart._draw = function(el){
    g = d3.select(el).selectAll(".geomObjs")

    g.append("line")
      .attr("x1", "200")
      .attr("y1", "100")
      .attr("x2", "450")
      .attr("y2", "225")
      .style("stroke", "black")
      .style("stroke-width", "2px");

    g.append("circle")
      .attr("cx", "200")
      .attr("cy", "100")
      .attr("r", "30");

    g.append("rect")
      .attr("x", "410")
      .attr("y", "200")
      .attr("width", "100")
      .attr("height", "50")
      .style("fill", "pink")
      .style("stroke", "black")
      .style("stroke-width", "1px");


};
