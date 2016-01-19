sampleData = [
    {id: 1, x: 7, y: 41, z: 6},
    {id: 2, x: 11, y: 45, z: 9},
    {id: 3, x: 14, y: 11, z: 3},
    {id: 4, x: 12, y: 41, z: 13},
    {id: 5, x: 20, y: 11, z: 8},
    {id: 6, x: 42, y: 23, z: 10}
];

App = React.createClass({

    getInitialState: function() {
        return {
            data: sampleData,
            domain: {x: [0, 30], y: [0, 100]}
        };
    },

    render: function() {
        return (
            <div className="container">
              <Chart data={this.state.data} domain={this.state.domain} />
            </div>
        );
    }
});
