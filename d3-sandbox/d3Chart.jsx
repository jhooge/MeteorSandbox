// d3Chart.js

d3Chart = {};

d3Chart.create = function(el, props, state) {
    svg = d3.select(el).append("svg")
        .attr("class", "d3")
        .attr("width", props.width)
        .attr("height", props.height);

    svg.append("g")
        .attr("class", "d3-points");

    this.update(el, state);
};

d3Chart.update = function(el, state) {
    // Re-compue the scales, and render the data points
    scales =  this._scales(el, state.domain);
    this._drawPoints(el, scales, state.data);
};

d3Chart.destroy = function(el) {
    // Any clean-up would go here
    // in this example there is nothing to do
};

d3Chart._scales = function(el, domain) {
    if (!domain) {
        return null;
    }

    width = el.offsetWidth
    height = el.offsetHeight;

    x = d3.scale.linear()
        .range([0, width])
        .domain(domain.x);

    y = d3.scale.linear()
        .range([height, 0])
        .domain(domain.y);

    z = d3.scale.linear()
        .range([5, 20])
        .domain([1, 10]);

    return {x: x, y: y, z: z};
}

d3Chart._drawPoints = function(el, scales, data) {
     g = d3.select(el).selectAll(".d3-points");

     point = g.selectAll(".d3-point")
        .data(data, function(d) { return d.id;  });

    // ENTER
    point.enter().append("circle")
        .attr("class", "d3-point");

    // ENTER & UPDATE
    point.attr("cx", function(d) { return scales.x(d.x);  })
        .attr("cy", function(d) { return scales.y(d.y); })
        .attr("r", function(d) { return scales.z(d.z); });

    // EXIT
    point.exit()
        .remove();
};
