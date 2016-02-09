var MovingObject = require('./movingObject.js');

function Bullet (options) {

    if (!options['radius']) {
      options['radius'] = 1;
    }
    if (!options['color']) {
      options['color'] = "#FF0000";
    }

    MovingObject.call(this, options);
}


module.exports = Bullet;
