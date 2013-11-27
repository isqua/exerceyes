(function(window){

  "use strict";

  var animated = 'animated',
  auto = 'auto',
  score = document.querySelector('.score'),
  spacer = document.querySelector('.spacer'), width, min, max, defaultWidth,

  animation = (function(element) {
    var state, interval,

    property = (function () {
      var property = false,
      element = document.createElement('div'),
      prefixes = ['Webkit', 'Moz', 'O', 'ms'];

      if (element.style.animationName) {
        property = 'animationPlayState';
        return property;
      }

      prefixes.forEach(function (prefix) {
        if (element.style[prefix + 'AnimationName'] !== undefined) {
          property = prefix + 'AnimationPlayState';
        }
      });

      return property;
    })();

    function getState () {
      state = element.style[property] || 'paused';
      return state;
    }

    function isMoving () {
      if (state === 'running') {
        return true;
      }
      return false;
    }

    function setState (s) {
      state = s;
      element.style[property] = state;
      return state;
    }

    function run () {
      setState('running');
      interval = setInterval(function() {
        width = element.offsetWidth;
        updateScore();
      }, 100);
    }

    function pause () {
      setState('paused');
      push(0);
      clearInterval(interval);
    }

    function toggle () {
      if (property) {
        element.classList.add(auto);
        if (state === 'running') {
          pause();
          return true;
        }
        run();
        return false
      }
    }

    getState();
    return {
      'toggle': toggle,
      'is': isMoving,
      'stop': pause
    };

  })(spacer);

  function toInt(n) {
    return parseInt(n.trim(), 10);
  }

  function getWidth() {
    var css = getComputedStyle(spacer);
    width = toInt(css.getPropertyValue('width'));
    defaultWidth = width;
    max = spacer.parentNode.offsetWidth * toInt(css.getPropertyValue('max-width')) / 100;
  }

  function updateScore() {
    score.innerHTML = Math.round(width) + ' px'
  }
  
  function push(n) {
    width = width + n;
    if (width > max) {
      width = max;
    }
    if (width < defaultWidth) {
      width = defaultWidth;
    }
    spacer.style.width = width + 'px'
    updateScore();
  }

  function setAnimated(n) {
    spacer.classList.remove(auto);
    spacer.classList.add(animated);
    if (n) {
      setTimeout(function () {
        push(n);
      }, 0);
    }
  }

  function clear() {
    animation.stop();
    spacer.style.removeProperty('width');
    width = defaultWidth;
    setAnimated(0);
    updateScore();
  }

  function move(dir) {
    if (animation.is()) {
      return;
    }
    push(0);
    setAnimated(dir ? 50 : -50);
  }

  function addEventListener(target, event, listener) {
    target.addEventListener(event, listener, false);
  }

  getWidth();
  updateScore();
  spacer.classList.add(animated);
  addEventListener(window, 'keyup', function(event) {
    switch (event.keyCode) {
      case 219: // [
        move(false);
      break;
      case 221: // ]
        move(true);
      break;
      case 32: // space
        animation.toggle();
      break;
      case 27: // esc
        clear();
      break;
    }
  });

})(window);
