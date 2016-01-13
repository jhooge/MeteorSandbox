Sample = React.createClass({
    propTypes: {
        sample: React.PropTypes.object.isRequired
    },
    render() {
        return (
            <li>{this.props.sample.cellSize}</li>
        );
    }
});
