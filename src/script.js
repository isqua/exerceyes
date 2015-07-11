(function() {
    var ANIMATED_CLASS = 'animated',
        ANIMATION_RUNNING = 'running',
        ANIMATION_PAUSED = 'paused',
        ANIMATION_SPEED = 2,
        ANIMATION_NAME = 'move',
        STEP = 6;

    function Exerceyes() {
        this.balls = document.querySelector('.balls');
        this.score = document.querySelector('.score');
        this.bodyWith = this.getElemWidth(document.body);

        this.checkPrefixes();
        this.findKeyframes();
        this.listenButtons();
        this.listenKeyboard();
        this.updateScore();
    }

    Exerceyes.prototype.play = function() {
        this.requestAnimationFrame(function() {
            var width = this.getWidth();

            this.createKeyframes(width);
            this.balls.classList.add(ANIMATED_CLASS);
            this.setPrefixedCss('animation-duration', this.getWidthPercentage(width) / ANIMATION_SPEED);
            this.setPrefixedCss('animation-play-state', ANIMATION_RUNNING);

            this.spyStart();

            this.__isRunning = true;
        });
    };

    Exerceyes.prototype.pause = function() {
        this.requestAnimationFrame(function() {
            this.setPrefixedCss('animation-play-state', ANIMATION_PAUSED);
            this.clearKeyframes();
            this.spyStop();
            this.__isRunning = false;
        });
    };

    Exerceyes.prototype.isRunning = function() {
        return this.__isRunning;
    };

    Exerceyes.prototype.toggle = function() {
        if (this.isRunning()) {
            this.pause();
        } else {
            this.play();
        }
    };

    Exerceyes.prototype.move = function(n) {
        var widthPercentage;

        this.requestAnimationFrame(function() {
            this.pause();

            widthPercentage = this.getNearestWidthPoint(this.getWidthPercentage(), n);

            this.balls.classList.remove(ANIMATED_CLASS);
            this.balls.style.width = widthPercentage + '%';

            this.updateScore();
        });
    };

    Exerceyes.prototype.reset = function() {
        this.requestAnimationFrame(function() {
            this.balls.classList.remove(ANIMATED_CLASS);
            this.balls.style.width = '';
            this.clearKeyframes();
            this.spyStop();
            this.updateScore();
        });
    };

    Exerceyes.prototype.getWidth = function() {
        return this.getElemWidth(this.balls);
    };

    Exerceyes.prototype.getElemWidth = function(elem) {
        var style = getComputedStyle(elem);

        return parseInt(style.getPropertyValue('width'), 10);
    };

    Exerceyes.prototype.getWidthPercentage = function(width) {
        width = width || this.getWidth();

        return Math.round((width / this.bodyWith) * 100);
    };

    Exerceyes.prototype.getNearestWidthPoint = function(width, n) {
        if (width % STEP === 0) {
            return width + STEP * n;
        }

        return Math[n > 0 ? 'ceil' : 'floor'](width / STEP) * STEP;
    };

    Exerceyes.prototype.updateScore = function() {
        this.requestAnimationFrame(function() {
            this.score.innerHTML = this.getWidth() + ' px';
        });
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

    Exerceyes.prototype.listenKeyboard = function() {
        var exerceyes = this;

        window.addEventListener('keyup', function(event) {
            switch (event.keyCode) {
                case 219: // [
                    exerceyes.move(-1);
                    break;
                case 221: // ]
                    exerceyes.move(1);
                    break;
                case 32: // space
                    exerceyes.toggle();
                    break;
                case 27: // esc
                    exerceyes.reset();
                    break;
            }
        }, false);
    };

    Exerceyes.prototype.listenButtons = function() {
        var exerceyes = this;

        Array.prototype.forEach.call(document.querySelectorAll('.action'), function(button) {
            var action = button.getAttribute('data-action'),
                arg = button.getAttribute('data-arg');

            if (arg) {
                arg = parseInt(arg, 10);
            }

            button.addEventListener('click', function() {
                exerceyes[action](arg);
            });
        });
    };

    Exerceyes.prototype.checkPrefixes = function() {
        var balls = this.balls;

        [
            '',
            'Webkit',
            'Moz',
            'O'
        ].some(function(prop) {
            if (balls.style.hasOwnProperty(prop + (prop ? 'A' : 'a') + 'nimation')) {
                this.__prefix = prop;
                return true;
            }
        }.bind(this));
    };

    Exerceyes.prototype.setPrefixedCss = function(prop, value) {
        var jsProp = prop.replace(/-(.)/g, function(match, group1) {
            return group1.toUpperCase();
        });

        if (this.__prefix) {
            jsProp = this.__prefix + jsProp[0].toUpperCase() + jsProp.substr(1);
        }

        this.balls.style[jsProp] = value;
    };

    Exerceyes.prototype.findKeyframes = function() {
        var exerceyes = this,
            styles = document.styleSheets;

        Array.prototype.some.call(styles, function (style) {
            return style.cssRules.length && Array.prototype.some.call(style.cssRules, function (rule) {
                if (rule.name === ANIMATION_NAME) {
                    exerceyes.keyframes = rule;

                    return true;
                }
            });
        });
    };

    Exerceyes.prototype.clearKeyframes = function() {
        Array.prototype.forEach.call(this.keyframes.cssRules, function(rule) {
            this.keyframes.deleteRule(rule.keyText);
        }.bind(this));
    };

    Exerceyes.prototype.createKeyframes = function(width) {
        this.keyframes.appendRule('0% { width:' + width + 'px }');
        this.keyframes.appendRule('100% { width: 90% }');
    };

    Exerceyes.prototype.requestAnimationFrame = function(cb) {
        return window.requestAnimationFrame(cb.bind(this));
    };

    new Exerceyes();

})();
