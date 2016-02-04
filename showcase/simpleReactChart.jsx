SimpleReactChart = React.createClass({

    propTypes: {},

    componentDidMount: function() {
        var el = this.getDOMNode();
        simpleChart.create(el, {
            width: "100%",
            height: "300px"
        },
        this.getChartState());
    },

    componentDidUpdate: function() {
        var el = this.getDOMNode();
        simpleChart.update(el, this.getChartState());
    },

    getChartState: function() {
        return {};
    },

    componentWillUnmount: function() {
         var el = this.getDOMNode();
         simpleChart.destroy(el);
    },

    render: function() {
        return (
            <div className="SimpleReactChart"></div>
        );
    }
});
