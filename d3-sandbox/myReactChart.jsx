MyReactChart = React.createClass({

    propTypes: {},

    componentDidMount: function() {
        var el = this.getDOMNode();
        myChart.create(el, {
            width: "100%",
            height: "300px"
        },
        this.getChartState());
    },

    componentDidUpdate: function() {
        var el = this.getDOMNode();
        myChart.update(el, this.getChartState());
    },

    getChartState: function() {
        return {};
    },

    componentWillUnmount: function() {
         var el = this.getDOMNode();
         myChart.destroy(el);
    },

    render: function() {
        return (
            <div className="MyReactChart"></div>
        );
    }
});
