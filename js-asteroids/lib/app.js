var MovingObject = require('./movingObject');
var Util = require('./utils');
var Asteroid = require('./asteroid.js');
// var Ship = require('./ship.js');
var Game = require('./game.js');
var GameView = require('./gameView.js');


var g = new Game();
g.addAsteroids();
var canvasEl = document.getElementsByTagName("canvas")[0];
canvasEl.height = g.DIM_Y;
canvasEl.width = g.DIM_X;
var ctx = canvasEl.getContext("2d");

var gv = new GameView(g, ctx);
// m.draw(ctx);
// console.log(a);
// a.draw(ctx);
console.log(g);
gv.start();
