var Canvas = (function() {

  function Canvas(ctx) {
    this.ctx = ctx;
  }

  var prtt = Canvas.prototype;

  prtt.data = function(x, y, w, h) {
    return this.ctx.getImageData(x, y, w, h);
  };

  prtt.draw = function(data) {
    var x = arguments[1] || 0;
    var y = arguments[2] || 0;
    this.ctx.putImageData(data, x, y);
  };

  return Canvas;

})();
