(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// app.jsx                                                             //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
App = React.createClass({                                              // 1
    displayName: "App",                                                //
                                                                       //
    mixins: [ReactMeteorData],                                         // 3
                                                                       //
    getMeteorData: function () {                                       // 5
        return {                                                       // 6
            samples: Data.find({}).fetch()                             // 7
        };                                                             //
    },                                                                 //
                                                                       //
    renderData: function () {                                          // 11
        return this.data.samples.map(function (sample) {               // 12
            return React.createElement(Sample, { key: sample._id, Id: sample.Id, cellShape: sample.CellThickness, cellSize: sample.CellSize,
                cellShape: sample.CellShape, marginalAdhesion: sample.MarginalAdhesion,
                epithelialCellSize: sample.EpithelialCellSize, bareNuclei: sample.BareNuclei,
                blandChromatin: sample.BlandChromatin, normalNucleoli: sample.NormalNucleoli,
                mitoses: sample.Mitoses, klass: sample.Class });       // 17
        });                                                            //
    },                                                                 //
    render: function () {                                              // 20
        return React.createElement(                                    // 21
            "div",                                                     //
            { className: "container" },                                //
            React.createElement(                                       //
                "header",                                              //
                null,                                                  //
                React.createElement(                                   //
                    "h1",                                              //
                    null,                                              //
                    "Wisconsing Breast Cancer Dataset"                 //
                )                                                      //
            ),                                                         //
            React.createElement(                                       //
                "ul",                                                  //
                null,                                                  //
                this.renderData()                                      //
            )                                                          //
        );                                                             //
    }                                                                  //
});                                                                    //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=app.jsx.map
