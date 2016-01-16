valueheat
==========

JavaScript library for drawing heatmaps with value in every dot, without changing color because of concentration.
Useful for graphical demonstration of value-based data on maps - pollution, population, prices, economics 
Modified [simpleheat.js](https://github.com/mourner/simpleheat)

More "hot"(bigger value) dots has priority on "cold" ones.
File: [valueheat.js](https://kotia.github.io/valueheat/valueheat.js)
Demo: [valueheat.js demo](https://kotia.github.io/valueheat/demo)


In addition - order-oriented value heatmap - where "new" dots has priority, useful for real time reloading data
File: [valueheat-order.js](https://kotia.github.io/valueheat/valueheat-order.js)
Demo: [valueheat-order.js demo](https://kotia.github.io/valueheat/demo/index-order.html)


```js
valueheat('canvas').data(data).draw();
```

## Reference

#### Constructor

```js
// create a valueheat object given an id or canvas reference
var heat = valueheat(canvas);
```

#### Data

```js
// set data of [[x, y, value], ...] format
// value by default
heat.data(data);

// add a data point
heat.add(point);

// clear data
heat.clear();
```

#### Appearance

```js
// set point radius (25 by default)
heat.radius(r);

// set transparency (0 to 1, 0.6 default)
heat.alpha(a);

// set gradient colors as {<stop>: '<color>'}, e.g. {0.4: 'blue', 0.65: 'lime', 1: 'red'}
heat.gradient(grad);

// call in case Canvas size changed
heat.resize();
```

#### Rendering

```js
// draw the heatmap with optional minimum point opacity (0.05 by default)
heat.draw();
```