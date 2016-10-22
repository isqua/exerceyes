'use strict';

(function() {
    var ANIMATED_CLASS = 'animated';
    var KEYFRAMES_NAME = 'move';
    var ANIMATION_SPEED = 0.1;
    var STEP = 20;

    var ANIMATION_RUNNING = 'running';
    var ANIMATION_PAUSED = 'paused';

    var ANIMATION = 'animation';
    var TRANSFORM = 'transform';
    var ANIMATION_DURATION = 'animation-duration';
    var ANIMATION_PLAY_STATE = 'animation-play-state';

    function findKeyframes(name) {
        var styles = document.styleSheets;
        var keyframes;

        Array.prototype.some.call(styles, function (style) {
            Array.prototype.forEach.call(style.cssRules, function (rule) {
                if (rule.name === name) {
                    keyframes = rule;
                }
            });

            if (keyframes) {
                return true;
            }
        });

        return keyframes;
    }

    function clearKeyframes(keyframes) {
        Array.prototype.forEach.call(keyframes.cssRules, function(rule) {
            keyframes.deleteRule(rule.keyText);
        });
    }

    function createKeyframes(keyframes, rules) {
        if (keyframes.appendRule) {
            rules.forEach(function(rule) {
                keyframes.appendRule(rule);
            });
        } else {
            rules.forEach(function(rule) {
                keyframes.insertRule(rule);
            });
        }
    }

    function getWidth(elem) {
        return parseInt(getComputedStyle(elem).width, 10);
    }

    function Exerceyes() {
        var balls = document.querySelectorAll('.ball');

        this.balls = [ balls[0], balls[1] ];
        this.ballsContainer = document.querySelector('.balls');
        this.score = document.querySelector('.score');

        this.keyframes = findKeyframes(KEYFRAMES_NAME);

        this.getDimensions();
        this.listenKeyboard();
        this.listenButtons();

        window.addEventListener('resize', function() {
            this.getDimensions();
        }.bind(this));
    };

    Exerceyes.prototype.getDimensions = function() {
        var barWidth = getWidth(document.querySelector('.ball-left'));
        var ballWidth = getWidth(this.balls[0]);

        this.maxTranslate = barWidth - ballWidth;
        this.maxPercentage = this.maxTranslate / ballWidth * 100;
    };

    Exerceyes.prototype.play = function() {
        var rest = this.maxTranslate - this.getTranslate();

        this.ballsContainer.classList.add(ANIMATED_CLASS);

        createKeyframes(this.keyframes, [
            '0% { transform: ' + this.css(TRANSFORM) + ' }',
            '100% { transform: translateX(' + this.maxTranslate + 'px) }',
        ]);

        this.css(ANIMATION_DURATION, rest * ANIMATION_SPEED + 's');
        this.css(ANIMATION_PLAY_STATE, ANIMATION_RUNNING);

        this.spyStart();
        this.__isRunning = true;
    };

    Exerceyes.prototype.pause = function() {
        this.css(ANIMATION_PLAY_STATE, ANIMATION_PAUSED);
        this.css(TRANSFORM, this.css(TRANSFORM));
        this.ballsContainer.classList.remove(ANIMATED_CLASS);

        clearKeyframes(this.keyframes);

        this.spyStop();
        this.__isRunning = false;
    };

    Exerceyes.prototype.toggle = function() {
        if (this.__isRunning) {
            this.pause();
        } else {
            this.play();
        }
    };

    Exerceyes.prototype.reset = function() {
        this.ballsContainer.classList.remove(ANIMATED_CLASS);
        this.css(TRANSFORM, 'none');
        clearKeyframes(this.keyframes);

        this.spyStop();
        this.updateScore();
    };

    Exerceyes.prototype.together = function() {
        this.move(-1);
    };

    Exerceyes.prototype.apart = function() {
        this.move(1);
    };

    Exerceyes.prototype.move = function(n) {
        var currentProgress = Math.round(this.getTranslate() / getWidth(this.balls[0]) * 100);

        if (this.__isRunning) {
            this.pause();
        }

        var widthPercentage = this.getNearestWidthPoint(currentProgress, n);

        this.ballsContainer.classList.remove(ANIMATED_CLASS);
        this.css(TRANSFORM, 'translateX(' + widthPercentage +'%)');

        this.updateScore();
    };

    Exerceyes.prototype.getNearestWidthPoint = function(width, n) {
        var result;

        if (width % STEP === 0) {
            result = width + STEP * n;
        } else if (n > 0) {
            result = Math.ceil(width / STEP) * STEP;
        } else {
            result = (Math.floor(width / STEP) - 1) * STEP;
        }

        return Math.min(Math.max(result, 0), this.maxPercentage);
    };

    Exerceyes.prototype.listenKeyboard = function() {
        var exerceyes = this;
        var codes = {
            // [
            219: 'together',
            // ]
            221: 'apart',
            // space
            32: 'toggle',
            // esc
            27: 'reset'
        };

        window.addEventListener('keyup', function(event) {
            var method = codes[event.keyCode];

            if (method) {
                exerceyes[method]();
            }
        }, false);
    };

    Exerceyes.prototype.listenButtons = function() {
        var exerceyes = this;

        Array.prototype.forEach.call(document.querySelectorAll('.action'), function(button) {
            button.addEventListener('click', function() {
                exerceyes[this.getAttribute('data-action')]();
            });
        });
    };

    Exerceyes.prototype.css = function(prop, value) {
        if (value === void 0) {
            return getComputedStyle(this.balls[0])[prop];
        } else {
            this.balls[0].style[prop] = value;
            this.balls[1].style[prop] = value;
        }
    };

    Exerceyes.prototype.getTranslate = function() {
        return this.css(TRANSFORM).split(',')[4] || 0
    };

    Exerceyes.prototype.updateScore = function() {
        window.requestAnimationFrame(function() {
            this.score.innerHTML = Math.round(this.getTranslate() * 2);
        }.bind(this));
    };

    Exerceyes.prototype.spyStart = function() {
        if (this.__spy) {
            this.spyStop();
        }

        this.__spy = setInterval(this.updateScore.bind(this), 50);
    };

    Exerceyes.prototype.spyStop = function() {
        clearInterval(this.__spy);

        delete this.__spy;
    };

    new Exerceyes();

})();
