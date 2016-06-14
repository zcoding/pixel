# Pixel
[Digital Image Processing in Javascript and CSS.]((http://zcoding.github.io/pixel/))

[![Versoin](https://img.shields.io/npm/v/pixel-js.svg?style=flat-square "Version")](https://www.npmjs.com/package/pixel-js)
[![License](https://img.shields.io/npm/l/pixel-js.svg?style=flat-square "License")](./LICENSE)

[中文文档](./README.CN.md)

## Installation

### NPM

```bash
npm install pixel-js --save
```

### Standalone

Use the standalone version in the `dist/iife/pixel.js` folder.

Use `<script>` tag to load the file:

```html
<script src="path/to/pixel.js"></script>
```

### ES6 and AMD support

+ `dist/es6/pixel.js`
+ `dist/amd/pixel.js`

## Demo

[github-pages](http://zcoding.github.io/pixel/)

or

```bash
npm install && npm start
```

## API

### `Pixel.loadImage`

```javascript
Pixel.loadImage("imageSrc").then((image) => {
  // Now image is ready
}, (error) => {
  // If load failed...
});
```

### `Pixel.Canvas(selector, image, width, height)`

Arguments:

+ selector `String`|`Element`
+ image `Image`
+ width `Number`
+ height `Number`

Return:

+ `Canvas`

#### `Pixel.Canvas.prototype.repaint()`

Trigger repaint.

Arguments:

+ none

Return:

+ `this`

#### `Pixel.Canvas.prototype.clear()`

Arguments:

+ none

Return:

+ `this`

#### `Pixel.Canvas.prototype.reset()`

Arguments:

+ none

Return:

+ `this`

#### `Pixel.Canvas.complement()`

Arguments:

+ none

Return:

+ `Promise`

#### `Pixel.Canvas.linear(x, y)`

Rules:

+ `r' = x * r + y`
+ `g' = x * g + y`
+ `b' = x * b + y`
+ `a' = a`

Arguments:

+ x `Number`
+ y `Number`

Return:

+ `Promise`

#### `Pixel.Canvas.opacity(opacity)`

Rules:

+ `r' = r`
+ `g' = g`
+ `b' = b`
+ `a' = 255 * opacity`

Arguments:

+ opacity `Number`

Return:

+ `Promise`

#### `Pixel.Canvas.binarization(threshold)`

Rules:

+ `c' = c < threshold ? 0 : 255`
+ `a' = a`

Arguments:

+ threshold `Number`

Return:

+ `Promise`

#### `Pixel.Canvas.gray()`

Rules:

+ `r' = g' = b' = 0.299 * r + 0.587 * g + 0.114 * b`
+ `a' = a`

Arguments:

+ none

Return:

+ `Promise`

#### `Pixel.Canvas.smooth(template, times)`

Arguments:

+ template `Array`
+ times `Number`

Return:

+ `Promise`

#### `Pixel.Canvas.crosswindow()`

Arguments:

+ none

Return:

+ `Promise`

#### `Pixel.Canvas.squareWindow()`

Arguments:

+ none

Return:

+ `Promise`

#### `Pixel.Canvas.highPassFilter(template)`

Arguments:

+ template `Array`

Return:

+ `Promise`

#### `Pixel.Canvas.sharpenFilter(templateX, templateY)`

Arguments:

+ templateX `Array`
+ templateY `Array`

Return:

+ `Promise`
