(function(window){

  "use strict";

  var animated = 'animated',
  auto = 'auto',
  score = document.querySelector('.score'),
  spacer = document.querySelector('.spacer'), width, min, max,

  animation = (function(element) {
    var isMoving = false, interval,

    prefix = (function () {
      var property = false,
      element = document.createElement('div'),
      prefixes = ['Webkit', 'Moz', 'O', 'ms'];

      if (element.style.animationName) {
        return true;
      }

      prefixes.forEach(function (prefix) {
        if (element.style[prefix + 'AnimationName'] !== undefined) {
          property = prefix;
        }
      });
      return property;

    })(),

    keyframes = (function (name) {
      var styles = document.styleSheets, result;
      forEach(styles, function (style) {
        forEach(style.cssRules, function (rule) {
          if (isKeyframes(rule.type) && rule.name === name) {
            result = rule;
          }
        });
      });
      return result;
    })('push');

    function isKeyframes (type) {
      return prefix && ((type === window.CSSRule.KEYFRAMES_RULE) || (type === window.CSSRule[prefix.toUpperCase()+'_KEYFRAMES_RULE']) || (type === 7));
    }

    function clearKeyframes () {
      var keys = [];
      forEach(keyframes.cssRules, function(rule) {
        keys.push(rule.keyText);
      });
      forEach(keys, function (key) {
        keyframes.deleteRule(key);
      });
    }

    function createKeyframes () {
      if (keyframes.insertRule) {
        keyframes.insertRule("0% {width:"+width+"px}");
        keyframes.insertRule("100% {width:"+max+"px}");
      } else {
        keyframes.appendRule("0% {width:"+width+"px}");
        keyframes.appendRule("100% {width:"+max+"px}");
      } 
    }

    function run () {
      isMoving = true;
      createKeyframes();
      interval = setInterval(function() {
        width = element.offsetWidth;
        updateScore();
      },50);
      return isMoving;
    }

    function pause () {
      isMoving = false;
      clearKeyframes();
      width = element.offsetWidth;
      push(0);
      clearInterval(interval);
      return isMoving;
    }

    function toggle () {
      if (prefix) {
        push(0);
        return isMoving ? pause() : run();
      }
    }

    function is () {
      return isMoving;
    }

    clearKeyframes();

    return {
      'toggle': toggle,
      'is': is,
      'stop': pause
    };

  })(spacer);

  function toInt(n) {
    return parseInt(n.trim(), 10);
  }

  function forEach (array, callback) {
    [].forEach.call(array, callback);
  }

  function capitalize (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function updateScore() {
    score.innerHTML = Math.round(width) + ' px'
  }

  function addEventListener(target, event, listener) {
    target.addEventListener(event, listener, false);
  }

  function getWidth() {
    var css = getComputedStyle(spacer);
    width = toInt(css.getPropertyValue('width'));
    min = width;
    max = spacer.parentNode.offsetWidth * toInt(css.getPropertyValue('max-width')) / 100;
  }

  function push(n) {
    width = width + n;
    width = width < min ? min : width > max ? max : width
    spacer.style.width = width + 'px'
    updateScore();
  }

  function setAnimated(n) {
    if (n) {
      setTimeout(function () {
        push(n);
      }, 0);
    }
  }

  function clear() {
    animation.stop();
    spacer.classList.remove(auto);
    spacer.style.removeProperty('width');
    width = min;
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

  function toggleAnimation () {
    spacer.classList.toggle(auto);
    animation.toggle();
    push(0);
    spacer.classList.toggle(animated);
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
        toggleAnimation();
      break;
      case 27: // esc
        clear();
      break;
    }
  });

})(window);
