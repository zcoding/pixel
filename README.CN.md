# Pixel
[基于Javascript和CSS的数字图像处理]((http://zcoding.github.io/pixel/))

[![版本](https://img.shields.io/npm/v/pixel-js.svg?style=flat-square "版本")](https://www.npmjs.com/package/pixel-js)
[![协议](https://img.shields.io/npm/l/pixel-js.svg?style=flat-square "协议")](./LICENSE)

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

## 特性

+ 使用异步处理，不阻塞页面
+ 基于`Promise`的异步回调

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

#### `Pixel.Canvas.opacity(opacity)`

转换公式：

+ `r' = r`
+ `g' = g`
+ `b' = b`
+ `a' = 255 * opacity`

参数：

+ opacity `Number`

返回：

+ `Promise`

#### `Pixel.Canvas.binarization(threshold)`

转换公式：

+ `c' = c < threshold ? 0 : 255`
+ `a' = a`

参数：

+ threshold `Number`

返回：

+ `Promise`

#### `Pixel.Canvas.gray()`

转换公式：

+ `r' = g' = b' = 0.299 * r + 0.587 * g + 0.114 * b`
+ `a' = a`

参数：

+ 无

返回：

+ `Promise`

#### `Pixel.Canvas.smooth(template, times)`

参数：

+ template `Array`
+ times `Number`

返回：

+ `Promise`

#### `Pixel.Canvas.crosswindow()`

参数：

+ 无

返回：

+ `Promise`

#### `Pixel.Canvas.squareWindow()`

参数：

+ 无

返回：

+ `Promise`

#### `Pixel.Canvas.highPassFilter(template)`

参数：

+ template `Array`

返回：

+ `Promise`

#### `Pixel.Canvas.sharpenFilter(templateX, templateY)`

参数：

+ templateX `Array`
+ templateY `Array`

返回：

+ `Promise`
