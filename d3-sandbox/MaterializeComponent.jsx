MaterializeComponent = React.createClass({

    propTypes: {
    },

    componentDidMount: function() {
    },

    componentDidUpdate: function() {
    },

    getChartState: function() {
    },

    render: function() {
        return(
            <div className="MaterializeComponent">
              <h1>This is a Materialize Component Show</h1>

              <h2>Material Box</h2>
              <img className="materialboxed" data-caption="A picture of some deer and tons of trees" width="250" src="http://th01.deviantart.net/fs70/PRE/i/2013/126/1/e/nature_portrait_by_pw_fotografie-d63tx0n.jpg" />

              <h2>Slider</h2>
              <div className="slider">
                <ul className="slides">
                  <li>
                    <img src="http://lorempixel.com/580/250/sports/1/" />
                      <div className="caption center-align">
                        <h3>This is our big Tagline!</h3>
                        <h5 className="light grey-text text-lighten-3">A small slogan.</h5>
                      </div>
                  </li>
                  <li>
                    <img src="http://lorempixel.com/580/250/sports/2" />
                    <div className="caption left-align">
                      <h3>Left Aligned Caption</h3>
                      <h5 className="light grey-text text-lighten-3">A small slogan.</h5>
                    </div>
                  </li>
                  <li>
                    <img src="http://lorempixel.com/580/250/sports/3" />
                      <div className="caption right-align">
                        <h3>Right Aligned Caption</h3>
                        <h5 className="light grey-text text-lighten-3">A our small slogan.</h5>
                      </div>
                  </li>
                </ul>
              </div>

              <h2>Carousel</h2>
              <div class="carousel">
                <a class="carousel-item" href="#one!"><img src="http://lorempixel.com/250/250/sports/1" /></a>
                <a class="carousel-item" href="#two!"><img src="http://lorempixel.com/250/250/sports/2" /></a>
                <a class="carousel-item" href="#three!"><img src="http://lorempixel.com/250/250/sports/3" /></a>
              </div>
            </div>
        );
    }
});
