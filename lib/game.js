var Asteroid = require('./asteroid.js');
var Ship = require('./ship.js');

function Game(){
  this.asteroids = [];
  this.bullets = [];
  this.addShip();
}

Game.prototype.DIM_X = 640;
Game.prototype.DIM_Y = 480;
Game.prototype.NUM_ASTEROIDS = 15;

Game.prototype.addShip = function () {
  this.ship = new Ship({
    game: this,
    pos: this.randomPosition()
  });
};

Game.prototype.addAsteroids = function () {
  for (var i = 0; i < this.NUM_ASTEROIDS; i++) {
    this.asteroids.push(
      new Asteroid( {
        pos: this.randomPosition(),
        game: this,
        vel: this.randomVelocity()
       } )
    );
  }
};


Game.prototype.allObjects = function () {

  return this.asteroids.concat([this.ship]).concat(this.bullets);
};

Game.prototype.checkCollisions = function () {
  var collisions = [];
  for (var i = 0; i < this.allObjects().length; i++) {
    for (var j = 0; j < this.allObjects().length; j++) {
      if (i !== j) {
        if (this.allObjects()[i].isCollidedWithOtherObject(this.allObjects()[j])) {

          this.allObjects()[i].collideWith(this.allObjects()[j]);
          // collisions.push([this.asteroids[i], this.asteroids[j]]);
        }
      }
    }
  }

  // for (var i = 0; i < collisions.length; i++) {
  //   var pair = collisions[i];
  //   pair[0].collideWith(pair[1]);
  // }

};

Game.prototype.remove = function (obj) {
  if (obj.constructor.name === "Asteroid") {
    this.asteroids.splice(this.asteroids.indexOf(obj), 1);
  } else if (obj.constructor.name === "Bullet") {
    this.bullets.splice(this.bullets.indexOf(obj), 1);
  }
};



Game.prototype.wrap = function(pos, obj) {
  var newPos = [];

  if (pos[0] > (this.DIM_X + obj.radius)) { newPos.push(-obj.radius); }
  else if (pos[0] < -obj.radius) { newPos.push(this.DIM_X+obj.radius); }
  else { newPos.push(pos[0]); }

  if (pos[1] > (this.DIM_Y + obj.radius) ) { newPos.push(-obj.radius); }
  else if (pos[1] < -obj.radius) { newPos.push(this.DIM_Y+obj.radius); }
  else { newPos.push(pos[1]); }

  return newPos;

};

Game.prototype.isOutOfBounds = function (pos, radius) {
  if (pos[0] > (this.DIM_X + radius)) { return true; }
  else if (pos[0] < -radius) { return true; }

  if (pos[1] > (this.DIM_Y + radius) ) { return true; }
  else if (pos[1] < -radius) { return true; }

  return false;
};

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0,0,this.DIM_X, this.DIM_Y);
  for (var i = 0; i < this.allObjects().length; i++) {
    this.allObjects()[i].draw(ctx);
  }
};

Game.prototype.moveObjects = function () {
  for (var i = 0; i < this.allObjects().length; i++) {
    this.allObjects()[i].move();
  }
};

Game.prototype.randomPosition = function () {
  return [Math.random() * this.DIM_X, Math.random() * this.DIM_Y ];
};

Game.prototype.randomVelocity = function () {
  var angle = Math.random() * Math.PI * 2;
  var magnitude = 3 + Math.random()*5;

  return [magnitude * Math.cos(angle), magnitude * Math.sin(angle)];

};

module.exports = Game;
