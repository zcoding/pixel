var imageData, canvas;
var cvs = selectDOM('#my-canvas')[0];
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

function selectDOM(selector, context) {
  context = context || document;
  return context.querySelectorAll(selector);
}

// 求补
selectDOM('#complement')[0].addEventListener('click', function() {
  Pixel.complement(imageData.data).then(function(newData) {
    canvas.draw(imageData);
  });
}, false);

// 亮度加
selectDOM('#light')[0].addEventListener('click', function() {
  Pixel.linear(imageData.data, 1, 10).then(function(newData) {
    canvas.draw(imageData);
  });
}, false);

// 亮度减
selectDOM('#dark')[0].addEventListener('click', function() {
  Pixel.linear(imageData.data, 1, -10).then(function(newData) {
    canvas.draw(imageData);
  });
}, Pixel);

// 透明度
selectDOM('#opacity')[0].addEventListener('click', function() {
  Pixel.opacity(imageData.data, 0.5).then(function(newData) {
    canvas.draw(imageData);
  });
}, false);

// 二值化
selectDOM('#binary')[0].addEventListener('click', function() {
  Pixel.binarization(imageData.data, 128).then(function(newData) {
    canvas.draw(imageData);
  });
}, false);

// 灰度图
selectDOM('#gray')[0].addEventListener('click', function() {
  Pixel.gray(imageData.data).then(function(newData) {
    canvas.draw(imageData);
  });
}, false);

// 重置
selectDOM('#reset')[0].addEventListener('click', function() {
}, false);

//平滑1
selectDOM('#pinghua1')[0].addEventListener('click', function() {
  Pixel.smoothFilter(imageData.data, Pixel.smooth1, 8);
}, false);
