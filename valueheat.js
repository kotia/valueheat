'use strict';

if (typeof module !== 'undefined') module.exports = valueheat;

function valueheat(canvas) {
    if (!(this instanceof valueheat)) return new valueheat(canvas);

    this._canvas = canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;

    this._ctx = canvas.getContext('2d');
    this._width = canvas.width;
    this._height = canvas.height;
    this._gridSize = 1;
    this._alpha = 0.6;

    this._data = [];
}

valueheat.prototype = {

    defaultRadius: 25,

    defaultGradient: {
        0.2: 'blue',
        0.4: 'cyan',
        0.7: 'lime',
        0.8: 'yellow',
        1.0: 'red'
    },

    data: function (data) {
        this._data = data;
        return this;
    },

    add: function (point) {
        this._data.push(point);
        return this;
    },

    radius: function (r) {
        this._radius = r;
        this.cacheCircles();
        return this;
    },

    alpha: function (a) {
        this._alpha = a;
        return this;
    },

    gridSize: function(size) {
        this._gridSize = Math.abs(Math.round(size));
        return this;
    },

    cacheCircles: function () {

        this._circles  = [];
        var circle, ctx, color, r = this._radius;
        for (var i = 0; i < 256; i++) {
            circle = document.createElement('canvas');
            ctx = circle.getContext('2d');
            color = "rgba(" + i + ", " + i + ", " + i + ", ";

            circle.width = circle.height = r * 2;

            var grd = ctx.createRadialGradient(r, r, 1, r, r, this._radius);

            grd.addColorStop(0, color + "1)");
            grd.addColorStop(1, color + "0)");
            ctx.fillStyle = grd;

            ctx.beginPath();
            ctx.arc(r, r, this._radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            this._circles.push(circle);
        }
    },

    resize: function () {
        this._width = this._canvas.width;
        this._height = this._canvas.height;
    },

    gradient: function (grad) {
        // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            gradient = ctx.createLinearGradient(0, 0, 0, 256);

        canvas.width = 1;
        canvas.height = 256;

        for (var i in grad) {
            gradient.addColorStop(i, grad[i]);
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1, 256);

        this._grad = ctx.getImageData(0, 0, 1, 256).data;

        return this;
    },

    draw: function () {
        if (!this._radius) this.radius(this.defaultRadius);
        if (!this._grad) this.gradient(this.defaultGradient);

        var ctx = this._ctx, greyVal;
        var filteredData = [], p, powP;

        ctx.clearRect(0, 0, this._width, this._height);

        for (var i = 0, len = this._data.length; i < len; i++) {
            p = this._data[i];
            powP = [];
            powP[0] = Math.floor(p[0]/this._gridSize) * this._gridSize;
            powP[1] = Math.floor(p[1]/this._gridSize) * this._gridSize;
            powP[2] = p[2];
            filteredData[powP[0]] = filteredData[powP[0]] || [];
            if (filteredData[powP[0]][powP[1]] === undefined) {
                filteredData[powP[0]][powP[1]] = powP[2];
            } else {
                filteredData[powP[0]][powP[1]] = Math.round((filteredData[powP[0]][powP[1]] + powP[2])/2);
            }
        }

        // draw a grayscale heatmap by putting a blurred circle at each data point
        ctx.globalCompositeOperation = 'darken';
        for (var i = 0, iLen = filteredData.length; i < iLen; i++) {
            if(filteredData[i]) {
                for (var j = 0, jLen = filteredData[i].length; j < jLen; j++) {
                    if (filteredData[i][j]){
                        greyVal = 256 - filteredData[i][j];
                        ctx.drawImage(this._circles[greyVal], i - this._radius, j - this._radius);
                    }
                }
            }
        }

        var colored = ctx.getImageData(0, 0, this._width, this._height);
        this._colorize(colored.data, this._grad);
        ctx.putImageData(colored, 0, 0);

        return this;
    },

    _colorize: function (pixels, gradient) {
        var color, alpha, realColor;
        for (var i = 0, len = pixels.length, j; i < len; i += 4) {
            color = pixels[i];
            alpha = pixels[i + 3];

            // convert grey color with alpha to grey color without
            realColor = 255 - Math.abs(Math.round(((255-color) * alpha / 255)));

            j = (255-realColor)*4;
            pixels[i] = gradient[j];
            pixels[i + 1] = gradient[j + 1];
            pixels[i + 2] = gradient[j + 2];
            pixels[i + 3] = pixels[i + 3] * this._alpha;
        }
    }
};