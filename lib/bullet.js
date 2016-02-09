var MovingObject = require('./movingObject.js');
var Util = require('./utils.js');
var Asteroid = require('./asteroid.js');
function Bullet (options) {

    if (!options['radius']) {
      options['radius'] = 1;
    }
    if (!options['color']) {
      options['color'] = "#FF0000";
    }

    MovingObject.call(this, options);
}

Util.prototype.inherits(Bullet, MovingObject);


Bullet.prototype.move = function () {
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];

  if (this.game.isOutOfBounds(this.pos, this.radius)) {
    console.log("remove bullet");
    console.log(this.game.bullets);
    this.game.remove(this);
  }
};

Bullet.prototype.collideWith = function (otherObject) {
  if (otherObject.constructor.name === "Asteroid") {
    this.game.remove(otherObject);
    if (otherObject.radius > 10) {
      var radius = otherObject.radius / 2;
      this.game.asteroids.push(new Asteroid( {
        pos: otherObject.pos,
        game: this.game,
        radius: radius,
        vel: this.game.randomVelocity(radius * 4),
      } ));

      this.game.asteroids.push(new Asteroid( {
        pos: otherObject.pos,
        game: this.game,
        radius: radius,
        vel: this.game.randomVelocity(radius * 4),
      } ));
    }
    this.game.remove(this);
  }
};

module.exports = Bullet;
