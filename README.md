# Pixel
Digital Image Processing in Javascript and CSS.

[Demo](http://zcoding.github.io/pixel/)

# Installation
## ~~NPM~~
~~`npm install pixel-js`~~

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

#### `Pixel.Canvas.prototype.draw(shape, location)`

Arguments:

+ shape `Shape`
+ location `Location`

Return:

+ `this`

#### `Pixel.Canvas.prototype.drawImage(image, offsetX, offsetY)`

Arguments:

+ image `Image`
+ offsetX `Number`
+ offsetY `Number`

Return:

+ `this`

#### `Pixel.Canvas.prototype.clear()`

Arguments:

+ none

Return:

+ `this`

#### `Pixel.Canvas.prototype.data()`

Arguments:

+ none

Return:

+ `Array`
