App = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        return {
          samples: Data.find({}).fetch()
        }
    },

    renderData() {
        return this.data.samples.map((sample) => {
            return <Sample key={sample._id} Id={sample.Id} cellShape={sample.CellThickness} cellSize={sample.CellSize}
                           cellShape={sample.CellShape} marginalAdhesion={sample.MarginalAdhesion}
                           epithelialCellSize={sample.EpithelialCellSize} bareNuclei={sample.BareNuclei}
                           blandChromatin={sample.BlandChromatin} normalNucleoli={sample.NormalNucleoli}
                           mitoses={sample.Mitoses} klass={sample.Class} />;
        });
    },
    render() {
        return (
            <div className="container">
              <header>
                <h1>Wisconsing Breast Cancer Dataset</h1>
              </header>

              <ul>
                {this.renderData()}
              </ul>
            </div>
        );
    }
});
