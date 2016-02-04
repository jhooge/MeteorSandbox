simpleChart= {};

simpleChart.create = function(el) {
  svg = d3.select(el).append("svg")
    .attr("class", "d3Canvas")
    .attr("width", "500px")
    .attr("height", "500px")
    .attr("border", "1px")
    .style("background", "darkgrey");

  this.update(el);
};

simpleChart.update = function(el) {
    this._draw(el);
}

simpleChart._draw = function(el){

    canvas = d3.select(el).selectAll(".d3Canvas")

    canvas.append("rect")
      .attr("x", "50")
      .attr("y", "50")
      .attr("width", "100")
      .attr("height", "50")
      .style("fill", "red")
      .style("stroke", "black")
      .style("stroke-width", "1px");

};
