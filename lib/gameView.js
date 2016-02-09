var Game = require('./game.js');
var key = require('./keymaster.js');
function GameView(game, ctx) {
    this.game = game;
    this.ctx = ctx;
}

GameView.prototype.start = function () {
  this.setupKeys();
  var view = this;

  var step = function () {
    view.checkKeys();
    view.game.moveObjects();
    view.game.checkCollisions();
    view.game.draw(view.ctx);

    requestAnimationFrame(step);

  };

  requestAnimationFrame(step);
};

GameView.prototype.checkKeys = function () {
  if (key.isPressed('left')) {
    this.game.ship.turn(-Math.PI/32);
  }
  if (key.isPressed('right')) {
    this.game.ship.turn(Math.PI/32);
  }

  if (key.isPressed('up')) {
    this.game.ship.power(0.3);
  }
};

GameView.prototype.setupKeys = function () {
  var ship = this.game.ship;
  // key('left',function () {
  //   ship.turn(-Math.PI/4);
  // });
  // key('right', function () {
  //   ship.turn(Math.PI/4);
  // });
  // key('up', function() {
  //   ship.power(1);
  // });
  key('space', function () {
    ship.fireBullet();
  });
};

module.exports = GameView;
