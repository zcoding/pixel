# Pixel
Digital Image Processing in Javascript and CSS.

[Demo](http://zcoding.github.io/pixel/)

## Installation

### ~~NPM~~
~~`npm install pixel-js`~~

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

#### `Pixel.Canvas.opacity()`
#### `Pixel.Canvas.binarization()`
#### `Pixel.Canvas.gray()`
#### `Pixel.Canvas.smooth()`
#### `Pixel.Canvas.crosswindow()`
#### `Pixel.Canvas.squareWindow()`
#### `Pixel.Canvas.highPassFilter()`
#### `Pixel.Canvas.sharpenFilter()`
