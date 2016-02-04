(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// Sample.jsx                                                          //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Sample = React.createClass({                                           // 1
    displayName: "Sample",                                             //
                                                                       //
    //    propTypes: {                                                 //
    //        sample: React.PropTypes.object.isRequired                //
    //    },                                                           //
    render: function () {                                              // 5
        return React.createElement(                                    // 6
            "li",                                                      //
            null,                                                      //
            this.props.cellSize                                        //
        );                                                             //
    }                                                                  //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=Sample.jsx.map
