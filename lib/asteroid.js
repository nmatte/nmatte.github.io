var Util = require('./utils.js');
var MovingObject = require('./movingObject.js');
// var Ship = require('./ship.js');

function Asteroid(options) {
  if (!options['color']) {
    options['color'] = this.COLOR;
  }
  if (!options['radius']) {
    options['radius'] = this.RADIUS;
  }
  if (!options['vel']) {
    options['vel'] = [0, this.VELOCITY];
  }

  MovingObject.call(this, options);
}

Util.prototype.inherits(Asteroid, MovingObject);

Asteroid.prototype.collideWith = function(otherObject) {
  if (otherObject.constructor.name === "Ship") {
    otherObject.relocate();
  }
};

Asteroid.prototype.COLOR = "#000000";
Asteroid.prototype.RADIUS = 10;
Asteroid.prototype.VELOCITY = 5;

module.exports = Asteroid;
