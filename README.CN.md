# Pixel
Digital Image Processing in Javascript and CSS.

[Demo](http://zcoding.github.io/pixel/)

## 安装

### NPM

```bash
npm install pixel-js --save
```

### 独立打包文件

`dist/iife/pixel.js`是一个独立打包文件，可以直接在浏览器环境使用。

通过`<script>`标签载入：

```html
<script src="path/to/pixel.js"></script>
```

### 支持ES6/AMD规范

+ `dist/es6/pixel.js` 支持ES6规范的打包文件
+ `dist/amd/pixel.js` 支持AMD规范的打包文件

## 示例

```javascript
var Pixel = require('pixel-js');

Pixel.loadImage("images/lena.jpg").then(function(image) {
  var canvas = new Pixel.Canvas('#my-canvas', image, image.width, image.height);
  canvas.gray().then(function() {
    return canvas.binarization(128);
  }).then(function() {
    canvas.repaint();
  });
}, function(err) {
  console.log(err.message);
});
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

参数:

+ selector `String`|`Element`
+ image `Image`
+ width `Number`
+ height `Number`

返回:

+ `Canvas`

#### `Pixel.Canvas.prototype.repaint()`

触发重绘。

参数：

+ none

返回：

+ `this`

#### `Pixel.Canvas.prototype.clear()`

清除内容。

参数：

+ 无

返回：

+ `this`

#### `Pixel.Canvas.prototype.reset()`

参数：

+ 无

返回：

+ `this`

#### `Pixel.Canvas.complement()`

参数：

+ 无

返回：

+ `Promise`

#### `Pixel.Canvas.linear(x, y)`

转换公式：

+ `r' = x * r + y`
+ `g' = x * g + y`
+ `b' = x * b + y`
+ `a' = a`

参数：

+ x `Number`
+ y `Number`

返回：

+ `Promise`

#### `Pixel.Canvas.opacity()`
#### `Pixel.Canvas.binarization()`
#### `Pixel.Canvas.gray()`
#### `Pixel.Canvas.smooth()`
#### `Pixel.Canvas.crosswindow()`
#### `Pixel.Canvas.squareWindow()`
#### `Pixel.Canvas.highPassFilter()`
#### `Pixel.Canvas.sharpenFilter()`
