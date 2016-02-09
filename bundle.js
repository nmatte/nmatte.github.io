/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(1);
	var Util = __webpack_require__(2);
	var Asteroid = __webpack_require__(3);
	// var Ship = require('./ship.js');
	var Game = __webpack_require__(4);
	var GameView = __webpack_require__(6);


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


/***/ },
/* 1 */
/***/ function(module, exports) {

	// var Ship = require('./ship.js');

	function MovingObject(options) {
	  this.pos = options['pos'];
	  this.vel = options['vel'];
	  this.radius = options['radius'];
	  this.color = options['color'];
	  this.game = options['game'];
	}

	MovingObject.prototype.draw = function(ctx) {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();

	  ctx.arc(
	    this.pos[0],
	    this.pos[1],
	    this.radius,
	    0,
	    2 * Math.PI,
	    false
	  );

	  ctx.fill();
	};

	MovingObject.prototype.move = function() {
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];

	  this.pos = this.game.wrap([this.pos[0], this.pos[1]], this);
	};

	MovingObject.prototype.isCollidedWithOtherObject = function (otherObject) {
	  return otherObject.radius + this.radius >
	         this.distance(this.pos, otherObject.pos);
	};


	MovingObject.prototype.collideWith = function (otherObject) {
	  // console.log("movingobject collideWith");
	  // console.log("asteroid collideWith");
	  // if (otherObject.constructor.name === "Ship") {
	  //   otherObject.relocate();
	  // }
	  // this.game.remove(this);
	  // this.game.remove(otherObject);
	};

	MovingObject.prototype.distance = function (pos1, pos2) {
	  return Math.sqrt(
	    Math.pow((pos1[0] - pos2[0]), 2) + Math.pow((pos1[1] - pos2[1]), 2)
	  );
	};



	module.exports = MovingObject;


/***/ },
/* 2 */
/***/ function(module, exports) {

	function Util() {

	}

	Util.prototype.inherits = function (childClass, superClass) {
	  function Surrogate(){ }
	  Surrogate.prototype = superClass.prototype;

	  childClass.prototype = new Surrogate();
	  childClass.prototype.constructor = childClass;
	};

	module.exports = Util;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(2);
	var MovingObject = __webpack_require__(1);
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Asteroid = __webpack_require__(3);
	var Ship = __webpack_require__(5);

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
	    var radius = this.randomSize();
	    this.asteroids.push(
	      new Asteroid( {
	        pos: this.randomPosition(),
	        game: this,
	        radius: radius,
	        vel: this.randomVelocity(radius),
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
	        if (this.allObjects()[i] && this.allObjects()[i].isCollidedWithOtherObject(this.allObjects()[j])) {
	          this.allObjects()[i].collideWith(this.allObjects()[j]);
	        }
	      }
	    }
	  }
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

	Game.prototype.randomVelocity = function (size) {
	  var angle = Math.random() * Math.PI * 2;
	  // var magnitude = 3 + Math.random()*5;
	  var magnitude = this.normalizedRandom(4);
	  magnitude = magnitude / ((size * size) / 100);

	  magnitude = Math.min(magnitude, 4);

	  return [magnitude * Math.cos(angle), magnitude * Math.sin(angle)];

	};

	Game.prototype.randomSize = function () {
	  var x = Math.random();
	  var a = 25;
	  var b = 0.5;
	  var c = 0.4;

	  var size = a * Math.pow(Math.E, - (((x - b) * (x - b)) / (2 * (c * c))));

	  return size;
	};

	Game.prototype.normalizedRandom = function(max, stdev) {
	  var x = Math.random();
	  var a = max ? max : 25;
	  var b = 0.5;
	  var c = stdev ? stdev : 0.4;

	  var size = a * Math.pow(Math.E, - (((x - b) * (x - b)) / (2 * (c * c))));

	  return size;
	};

	module.exports = Game;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(2);
	var MovingObject = __webpack_require__(1);
	var Game = __webpack_require__(4);
	var Bullet = __webpack_require__(8);
	function Ship (options) {
	  if (!options['radius']) {
	    options['radius'] = 10;
	  }
	  if (!options['vel']) {
	    options['vel'] = [0,0];
	  }
	  if (!options['color']) {
	    options['color'] = "#0000FF";
	  }
	  this.angle = 0;

	  MovingObject.call(this, options);
	}

	Util.prototype.inherits(Ship, MovingObject);

	Ship.prototype.draw = function (ctx) {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();

	  ctx.arc(
	    this.pos[0],
	    this.pos[1],
	    this.radius,
	    this.angle + 1.2 *  Math.PI,
	    this.angle + 0.8 * Math.PI,
	    false
	  );

	  ctx.lineTo(
	    this.pos[0],
	    this.pos[1]
	  );


	  ctx.fill();


	};

	Ship.prototype.MAX_VELOCITY = 10;
	Ship.prototype.relocate = function () {
	  // this.pos = this.game.randomPosition();
	  // this.vel = [0,0];
	};

	Ship.prototype.power = function (impulse) {
	  var xVel = impulse * Math.cos(this.angle) + this.vel[0];
	  var yVel = impulse * Math.sin(this.angle) + this.vel[1];

	  this.vel = [
	    xVel > this.MAX_VELOCITY ? this.MAX_VELOCITY : xVel,
	    yVel > this.MAX_VELOCITY ? this.MAX_VELOCITY : yVel
	  ];

	};

	Ship.prototype.turn = function (angle) {
	  this.angle += angle;
	};

	Ship.prototype.move = function () {
	  var magnitude = this.extractMagnitude(this.vel) * 0.98;

	  var angle = this.extractAngle(this.vel);

	  this.vel = this.angToCartesian(angle, magnitude);

	  MovingObject.prototype.move.call(this);
	};


	Ship.prototype.fireBullet = function () {
	  // debugger;
	  var bulletMag = this.extractMagnitude(this.vel) + 2;
	  var bulletAng = this.angle;
	  var offset = this.angToCartesian(this.angle,this.radius);

	  var bullet = new Bullet({
	    vel: this.angToCartesian(bulletAng, bulletMag),
	    pos: [this.pos[0] + offset[0], this.pos[1] + offset[1]],
	    game: this.game
	  });


	  this.game.bullets.push(bullet);
	};

	Ship.prototype.angToCartesian = function (angle, magnitude) {
	  return [magnitude * Math.cos(angle), magnitude * Math.sin(angle)];
	};
	//
	Ship.prototype.extractAngle = function (vector) {
	  var xVel = vector[0];
	  var yVel = vector[1];
	  var angle = Math.atan2(yVel, xVel);
	  if (xVel === 0) {
	    if (yVel > 0) {
	      angle = 1.5 * Math.PI;
	    } else {
	      angle = 0.5 * Math.PI;
	    }
	  }
	  return angle;
	};
	//
	Ship.prototype.extractMagnitude = function (vector) {
	    var xVel = vector[0];
	    var yVel = vector[1];

	    return Math.sqrt(xVel * xVel + yVel * yVel);
	};


	module.exports = Ship;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(4);
	var key = __webpack_require__(7);
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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	//     keymaster.js
	//     (c) 2011-2013 Thomas Fuchs
	//     keymaster.js may be freely distributed under the MIT license.

	;(function(global){
	  var k,
	    _handlers = {},
	    _mods = { 16: false, 18: false, 17: false, 91: false },
	    _scope = 'all',
	    // modifier keys
	    _MODIFIERS = {
	      '⇧': 16, shift: 16,
	      '⌥': 18, alt: 18, option: 18,
	      '⌃': 17, ctrl: 17, control: 17,
	      '⌘': 91, command: 91
	    },
	    // special keys
	    _MAP = {
	      backspace: 8, tab: 9, clear: 12,
	      enter: 13, 'return': 13,
	      esc: 27, escape: 27, space: 32,
	      left: 37, up: 38,
	      right: 39, down: 40,
	      del: 46, 'delete': 46,
	      home: 36, end: 35,
	      pageup: 33, pagedown: 34,
	      ',': 188, '.': 190, '/': 191,
	      '`': 192, '-': 189, '=': 187,
	      ';': 186, '\'': 222,
	      '[': 219, ']': 221, '\\': 220
	    },
	    code = function(x){
	      return _MAP[x] || x.toUpperCase().charCodeAt(0);
	    },
	    _downKeys = [];

	  for(k=1;k<20;k++) _MAP['f'+k] = 111+k;

	  // IE doesn't support Array#indexOf, so have a simple replacement
	  function index(array, item){
	    var i = array.length;
	    while(i--) if(array[i]===item) return i;
	    return -1;
	  }

	  // for comparing mods before unassignment
	  function compareArray(a1, a2) {
	    if (a1.length != a2.length) return false;
	    for (var i = 0; i < a1.length; i++) {
	        if (a1[i] !== a2[i]) return false;
	    }
	    return true;
	  }

	  var modifierMap = {
	      16:'shiftKey',
	      18:'altKey',
	      17:'ctrlKey',
	      91:'metaKey'
	  };
	  function updateModifierKey(event) {
	      for(k in _mods) _mods[k] = event[modifierMap[k]];
	  };

	  // handle keydown event
	  function dispatch(event) {
	    var key, handler, k, i, modifiersMatch, scope;
	    key = event.keyCode;

	    if (index(_downKeys, key) == -1) {
	        _downKeys.push(key);
	    }

	    // if a modifier key, set the key.<modifierkeyname> property to true and return
	    if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
	    if(key in _mods) {
	      _mods[key] = true;
	      // 'assignKey' from inside this closure is exported to window.key
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;
	      return;
	    }
	    updateModifierKey(event);

	    // see if we need to ignore the keypress (filter() can can be overridden)
	    // by default ignore key presses if a select, textarea, or input is focused
	    if(!assignKey.filter.call(this, event)) return;

	    // abort if no potentially matching shortcuts found
	    if (!(key in _handlers)) return;

	    scope = getScope();

	    // for each potential shortcut
	    for (i = 0; i < _handlers[key].length; i++) {
	      handler = _handlers[key][i];

	      // see if it's in the current scope
	      if(handler.scope == scope || handler.scope == 'all'){
	        // check if modifiers match if any
	        modifiersMatch = handler.mods.length > 0;
	        for(k in _mods)
	          if((!_mods[k] && index(handler.mods, +k) > -1) ||
	            (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
	        // call the handler and stop the event if neccessary
	        if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){
	          if(handler.method(event, handler)===false){
	            if(event.preventDefault) event.preventDefault();
	              else event.returnValue = false;
	            if(event.stopPropagation) event.stopPropagation();
	            if(event.cancelBubble) event.cancelBubble = true;
	          }
	        }
	      }
	    }
	  };

	  // unset modifier keys on keyup
	  function clearModifier(event){
	    var key = event.keyCode, k,
	        i = index(_downKeys, key);

	    // remove key from _downKeys
	    if (i >= 0) {
	        _downKeys.splice(i, 1);
	    }

	    if(key == 93 || key == 224) key = 91;
	    if(key in _mods) {
	      _mods[key] = false;
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;
	    }
	  };

	  function resetModifiers() {
	    for(k in _mods) _mods[k] = false;
	    for(k in _MODIFIERS) assignKey[k] = false;
	  };

	  // parse and assign shortcut
	  function assignKey(key, scope, method){
	    var keys, mods;
	    keys = getKeys(key);
	    if (method === undefined) {
	      method = scope;
	      scope = 'all';
	    }

	    // for each shortcut
	    for (var i = 0; i < keys.length; i++) {
	      // set modifier keys if any
	      mods = [];
	      key = keys[i].split('+');
	      if (key.length > 1){
	        mods = getMods(key);
	        key = [key[key.length-1]];
	      }
	      // convert to keycode and...
	      key = key[0]
	      key = code(key);
	      // ...store handler
	      if (!(key in _handlers)) _handlers[key] = [];
	      _handlers[key].push({ shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods });
	    }
	  };

	  // unbind all handlers for given key in current scope
	  function unbindKey(key, scope) {
	    var multipleKeys, keys,
	      mods = [],
	      i, j, obj;

	    multipleKeys = getKeys(key);

	    for (j = 0; j < multipleKeys.length; j++) {
	      keys = multipleKeys[j].split('+');

	      if (keys.length > 1) {
	        mods = getMods(keys);
	      }

	      key = keys[keys.length - 1];
	      key = code(key);

	      if (scope === undefined) {
	        scope = getScope();
	      }
	      if (!_handlers[key]) {
	        return;
	      }
	      for (i = 0; i < _handlers[key].length; i++) {
	        obj = _handlers[key][i];
	        // only clear handlers if correct scope and mods match
	        if (obj.scope === scope && compareArray(obj.mods, mods)) {
	          _handlers[key][i] = {};
	        }
	      }
	    }
	  };

	  // Returns true if the key with code 'keyCode' is currently down
	  // Converts strings into key codes.
	  function isPressed(keyCode) {
	      if (typeof(keyCode)=='string') {
	        keyCode = code(keyCode);
	      }
	      return index(_downKeys, keyCode) != -1;
	  }

	  function getPressedKeyCodes() {
	      return _downKeys.slice(0);
	  }

	  function filter(event){
	    var tagName = (event.target || event.srcElement).tagName;
	    // ignore keypressed in any elements that support keyboard data input
	    return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
	  }

	  // initialize key.<modifier> to false
	  for(k in _MODIFIERS) assignKey[k] = false;

	  // set current scope (default 'all')
	  function setScope(scope){ _scope = scope || 'all' };
	  function getScope(){ return _scope || 'all' };

	  // delete all handlers for a given scope
	  function deleteScope(scope){
	    var key, handlers, i;

	    for (key in _handlers) {
	      handlers = _handlers[key];
	      for (i = 0; i < handlers.length; ) {
	        if (handlers[i].scope === scope) handlers.splice(i, 1);
	        else i++;
	      }
	    }
	  };

	  // abstract key logic for assign and unassign
	  function getKeys(key) {
	    var keys;
	    key = key.replace(/\s/g, '');
	    keys = key.split(',');
	    if ((keys[keys.length - 1]) == '') {
	      keys[keys.length - 2] += ',';
	    }
	    return keys;
	  }

	  // abstract mods logic for assign and unassign
	  function getMods(key) {
	    var mods = key.slice(0, key.length - 1);
	    for (var mi = 0; mi < mods.length; mi++)
	    mods[mi] = _MODIFIERS[mods[mi]];
	    return mods;
	  }

	  // cross-browser events
	  function addEvent(object, event, method) {
	    if (object.addEventListener)
	      object.addEventListener(event, method, false);
	    else if(object.attachEvent)
	      object.attachEvent('on'+event, function(){ method(window.event) });
	  };

	  // set the handlers globally on document
	  addEvent(document, 'keydown', function(event) { dispatch(event) }); // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48
	  addEvent(document, 'keyup', clearModifier);

	  // reset modifiers to false whenever the window is (re)focused.
	  addEvent(window, 'focus', resetModifiers);

	  // store previously defined key
	  var previousKey = global.key;

	  // restore previously defined key and return reference to our key object
	  function noConflict() {
	    var k = global.key;
	    global.key = previousKey;
	    return k;
	  }

	  // set window.key and window.key.set/get/deleteScope, and the default filter
	  global.key = assignKey;
	  global.key.setScope = setScope;
	  global.key.getScope = getScope;
	  global.key.deleteScope = deleteScope;
	  global.key.filter = filter;
	  global.key.isPressed = isPressed;
	  global.key.getPressedKeyCodes = getPressedKeyCodes;
	  global.key.noConflict = noConflict;
	  global.key.unbind = unbindKey;

	  if(true) module.exports = assignKey;

	})(this);


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(1);
	var Util = __webpack_require__(2);
	var Asteroid = __webpack_require__(3);
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
	    if (otherObject.radius > 15) {
	      otherObject.breakUp();
	    }
	    this.game.remove(this);
	  }
	};

	module.exports = Bullet;


/***/ }
/******/ ]);