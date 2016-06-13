import {
  Complement,
  Linear,
  Opacity,
  Binarization,
  Gray
} from './process';

import {
  SmoothFilter,
  CrossWindow,
  SquareWindow
} from './filter';

export default class Canvas {
  constructor(element, image, width, height) {
    if (typeof element === 'string') {
      this.cvs = document.querySelectorAll(element)[0];
    } else {
      this.cvs = element;
    }
    this.ctx = this.cvs.getContext('2d');
    this.cvs.width = width;
    this.cvs.height = height;
    this.width = width;
    this.height = height;
    this.ctx.drawImage(image, 0, 0);
    this.imageData = this.ctx.getImageData(0, 0, width, height);
    this.originImageData = this.ctx.getImageData(0, 0, width, height);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    return this;
  }

  repaint() {
    var x = arguments[1] || 0;
    var y = arguments[2] || 0;
    this.ctx.putImageData(this.imageData, x, y);
    return this;
  }

  reset() {
    this.ctx.putImageData(this.originImageData, 0, 0);
    this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    return this;
  }

  complement() {
    return Complement(this.imageData.data);
  }

  linear(x, y) {
    return Linear(this.imageData.data, x, y);
  }

  opacity(opacity) {
    return Opacity(this.imageData.data, opacity);
  }

  binarization(threshold) {
    return Binarization(this.imageData.data, threshold);
  }

  gray() {
    return Gray(this.imageData.data);
  }

  smooth(template, times) {
    return SmoothFilter(this.imageData.data, this.width, this.height, template, times);
  }

  crosswindow() {
    return CrossWindow(this.imageData.data, this.width, this.height);
  }

  squareWindow() {
    return SquareWindow(this.imageData.data, this.width, this.height);
  }
}
