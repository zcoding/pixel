export default class Canvas {
  constructor(element, width, height) {
    if (typeof element === 'string') {
      this.cvs = document.querySelectorAll(element)[0];
    } else {
      this.cvs = element;
    }
    this.ctx = this.cvs.getContext('2d');
    this.width = width;
    this.height = height;
  }

  data(x, y, w, h) {
    return this.ctx.getImageData(x, y, w, h);
  }

  drawImage(data) {
    var x = arguments[1] || 0;
    var y = arguments[2] || 0;
    this.ctx.putImageData(data, x, y);
  }

  draw(shape, location) {
    switch(shape.type) {
      case 'RECT':
        this.ctx.fillRect(location.x, location.y, shape.width, shape.height);
        break;
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
