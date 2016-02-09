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

Asteroid.prototype.breakUp = function () {
  var radius = this.game.normalizedRandom(this.radius);
  this.game.asteroids.push(new Asteroid( {
    pos: this.pos,
    game: this.game,
    radius: radius,
    vel: this.game.randomVelocity(radius * 1.5),
  } ));
  var radius2 = this.radius - radius;
  this.game.asteroids.push(new Asteroid( {
    pos: this.pos,
    game: this.game,
    radius: radius2,
    vel: this.game.randomVelocity(radius2 * 1.5),
  } ));
};

Asteroid.prototype.COLOR = "#000000";
Asteroid.prototype.RADIUS = 10;
Asteroid.prototype.VELOCITY = 5;

module.exports = Asteroid;
