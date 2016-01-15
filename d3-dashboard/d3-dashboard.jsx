Data = new Mongo.Collection("BreastCancer");
//Data = Mongo.Collection.get("BreastCancer");
if (Meteor.isClient) {

  Meteor.startup(function() {
//    console.log(Data.find());
    React.render(<App />, document.getElementById("render-target"));
  });
}
