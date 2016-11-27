/*
 *				 MatrixRain.JS v. 2.0
 *
 *			  Written by Bilotta Matteo.
 *
 * Copyright © 2016, Bylothink. All rights reserved.
 */

var Letter = function(characterValue)
{
    // Private constants:
        var TIMES = {

            FADE_IN: 0.1,
            FADE_OUT: 3, // 2.7,

            CHANGE_COLOR: 0.3 // 0.2
        };

    // Private properties:
        var _this = this;
        var _animation = null;

    // Public properties:
        this.red = 255;
        this.green = 255;
        this.blue = 255;
        this.alpha = 0;

        this.character = characterValue;

        this.ended = false;

    // Public methods:
        this.getColor = function()
        {
            return "rgba(" + Math.floor(_this.red) + ", " + Math.floor(_this.green) + ", " + Math.floor(_this.blue) + ", " + _this.alpha + ")";
        };

    // Start executions...
        _animation = new TimelineMax({

            onComplete: function()
            {
                _this.ended = true;
            }
        });

        _animation.add(TweenMax.to(_this, TIMES.FADE_IN, { alpha: 1 }));
        _animation.add(TweenMax.to(_this, TIMES.CHANGE_COLOR, {

            red: 0,
            blue: 0
        }));

        _animation.add(TweenMax.to(_this, TIMES.FADE_OUT, { alpha: 0 }));
};

var Column = function(widthCanvasValue, heightCanvasValue)
{
    // Private constants:
        var SIZE = {

            MIN: 15,
            MAX: 20
        };

        var NEW_LETTER_RATIO = 75;

        var VALID_CHARS = [

            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "£", "$", "€", "§", "%", "&", "!", "?", "@", "#", "(", ")", "[", "]", "{", "}"
        ];

    // Private properties:
        var _this = this;

    // Public properties:
        this.x = Math.floor(Math.random() * widthCanvasValue);
        this.size = Math.floor(Math.random() * SIZE.MAX) + SIZE.MIN;

        this.ended = false;

        this.letters = [];

    // Private methods:
        var _addNewLetter = function()
        {
            var index = Math.floor(Math.random() * VALID_CHARS.length);
            var letter = new Letter(VALID_CHARS[index]);

            _this.letters.push(letter);

            if ((_this.letters.length * _this.size) < heightCanvasValue)
            {
                // setTimeout(jQuery.proxy(this.addNewLetter, this), NEW_LETTER_RATIO);

                setTimeout(_addNewLetter, NEW_LETTER_RATIO);
            }
            else
            {
                _this.ended = true;
            }
        };

    // Public methods:
        this.hasToBeRemoved = function()
        {
            if (_this.ended === true)
            {
                var lastLetterIndex = _this.letters.length - 1;

                if (_this.letters[lastLetterIndex].ended === true)
                {
                    return true;
                }
            }

            return false;
        };

    // Start executions...
        _addNewLetter();
};

var MatrixRain = function(selectorId)
{
    // Private constants:
        var BLUR_VALUE = 10;
        var MAX_COLUMNS = 500000;
        var NEW_COLUMN_RATIO = 17;

    // Private properties:
        var _this = this;

        var _domElement = document.getElementById(selectorId);

        var _context = _domElement.getContext("2d");

        var _columns = [];

    // Private methods:
        var _createNewColumn = function()
        {
            if (_columns.length < MAX_COLUMNS)
            {
                var column = new Column(_domElement.width, _domElement.height);

                _columns.push(column);

                setTimeout(_createNewColumn, NEW_COLUMN_RATIO);
            }
        };

        var _updateFrame = function(timestamp)
        {
            _context.clearRect(0, 0, _domElement.width, _domElement.height);

            _draw();

            requestAnimationFrame(_updateFrame);
        };

        var _draw = function()
        {
            _context.textBaseline = "top";
            _context.shadowBlur = BLUR_VALUE;

            for (var i = 0; i < _columns.length; i += 1)
            {
                // _context.measureText(<string>).width

                var x = _columns[i].x;
                var size = _columns[i].size;
                var letters = _columns[i].letters;

                for (var j = 0; j < letters.length; j += 1)
                {
                    if (letters[j].alpha > 0)
                    {
                        var color = letters[j].getColor();
                        var character = letters[j].character;

                        _context.font = size + "px monospace";

                        _context.shadowColor = color;
                        _context.fillStyle = color;

                        _context.fillText(character, x, j * size);
                    }
                }

                if (_columns[i].hasToBeRemoved() === true)
                {
                    _columns.splice(i, 1);
                }
            }
        };

    // Public methods:
        this.initialize = function()
        {
            _domElement.height = $(window).height();
            _domElement.width = $(window).width();

            _createNewColumn();
        };


    // Start executions...
        requestAnimationFrame(_updateFrame);
};
