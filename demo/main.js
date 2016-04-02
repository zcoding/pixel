var imageData, canvas;
var cvs = document.querySelector('#my-canvas');
var ctx = cvs.getContext("2d");
var img = new Image();

img.onload = function() {
  cvs.width = img.width;
  cvs.height = img.height;
  ctx.drawImage(img, 0, 0);
  canvas = new Canvas(ctx);
  imageData = canvas.data(0, 0, img.width, img.height);
};
img.src = "image/lena.jpg";

// 求补
document.querySelector('#complement').addEventListener('click', function() {
  Pixel.complement(imageData.data).then(function(newData) {
    canvas.draw(imageData);
  });
}, false);

// 亮度加
document.querySelector('#light').addEventListener('click', function() {
  Pixel.linear(imageData.data, 1, 10).then(function(newData) {
    canvas.draw(imageData);
  });
}, false);

// 亮度减
document.querySelector('#dark').addEventListener('click', function() {
  Pixel.linear(imageData.data, 1, -10).then(function(newData) {
    canvas.draw(imageData);
  });
}, Pixel);

// 透明度
document.querySelector('#opacity').addEventListener('click', function() {
  Pixel.opacity(imageData.data, 0.5).then(function(newData) {
    canvas.draw(imageData);
  });
}, false);

// 二值化
document.querySelector('#binary').addEventListener('click', function() {
  Pixel.binarization(imageData.data, 128).then(function(newData) {
    canvas.draw(imageData);
  });
}, false);

// 灰度图
document.querySelector('#gray').addEventListener('click', function() {
  Pixel.gray(imageData.data).then(function(newData) {
    canvas.draw(imageData);
  });
}, false);

// 重置
document.querySelector('#reset').addEventListener('click', function() {
}, false);
