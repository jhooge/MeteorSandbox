(function(){

/////////////////////////////////////////////////////////////////////////
//                                                                     //
// d3-dashboard.jsx                                                    //
//                                                                     //
/////////////////////////////////////////////////////////////////////////
                                                                       //
Data = new Mongo.Collection("BreastCancer");                           // 1
//Data = Mongo.Collection.get("BreastCancer");                         //
if (Meteor.isClient) {                                                 // 3
                                                                       //
  Meteor.startup(function () {                                         // 5
    //    console.log(Data.find());                                    //
    React.render(React.createElement(App, null), document.getElementById("render-target"));
  });                                                                  //
}                                                                      //
/////////////////////////////////////////////////////////////////////////

}).call(this);

//# sourceMappingURL=d3-dashboard.jsx.map
