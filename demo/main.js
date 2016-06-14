function selectDOM(selector, context) {
  context = context || document;
  return context.querySelectorAll(selector);
}

var canvas;

Pixel.loadImage("image/lena.jpg").then((image) => {
  canvas = new Pixel.Canvas("#my-canvas", image, image.width, image.height);
}, (error) => {
  console.error(error);
});

// 求补
selectDOM('#complement')[0].addEventListener('click', function() {
  canvas.complement().then(function() {
    console.log('Complement done');
    canvas.repaint();
  });
}, false);

// 亮度加
selectDOM('#light')[0].addEventListener('click', function() {
  canvas.linear(1, 10).then(function() {
    console.log('Light done');
    canvas.repaint();
  });
}, false);

// 亮度减
selectDOM('#dark')[0].addEventListener('click', function() {
  canvas.linear(1, -10).then(function() {
    console.log('Dark done');
    canvas.repaint();
  });
}, false);

// 透明度
selectDOM('#opacity')[0].addEventListener('click', function() {
  canvas.opacity(0.8).then(function() {
    console.log('Opacity done');
    canvas.repaint();
  });
}, false);

// 二值化
selectDOM('#binary')[0].addEventListener('click', function() {
  canvas.binarization(128).then(function() {
    console.log('Binarization done');
    canvas.repaint();
  });
}, false);

// 灰度图
selectDOM('#gray')[0].addEventListener('click', function() {
  canvas.gray().then(function() {
    console.log('Gray done');
    canvas.repaint();
  });
}, false);

// 重置
selectDOM('#reset')[0].addEventListener('click', function() {
  canvas.reset();
}, false);

//平滑1
selectDOM('#pinghua1')[0].addEventListener('click', function() {
  canvas.smooth(Pixel.TemplateSmooth1, 8).then(function() {
    console.log('Smooth-Filter 1');
    canvas.repaint();
  });
}, false);

//平滑2
selectDOM('#pinghua2')[0].addEventListener('click', function() {
  canvas.smooth(Pixel.TemplateSmooth2, 16).then(function() {
    console.log('Smooth-Filter 2');
    canvas.repaint();
  });
}, false);

selectDOM('#crosswindow')[0].addEventListener('click', function() {
  canvas.crosswindow().then(function() {
    console.log('Cross-Window done');
    canvas.repaint();
  });
}, false);

selectDOM('#square-window')[0].addEventListener('click', function() {
  canvas.squareWindow().then(function() {
    console.log('Square-Window done');
    canvas.repaint();
  });
}, false);

selectDOM('#laplacian1')[0].addEventListener('click', function() {
  canvas.highPassFilter(Pixel.Laplacian1).then(function() {
    console.log('High-Pass-Filter done');
    canvas.repaint();
  });
}, false);

selectDOM('#sobel')[0].addEventListener('click', function() {
  canvas.sharpenFilter(Pixel.SobelX, Pixel.SobelY).then(function() {
    console.log('Sobel-Filter done');
    canvas.repaint();
  });
}, false);

selectDOM('#prewitty')[0].addEventListener('click', function() {
  canvas.sharpenFilter(Pixel.PrewittX, Pixel.PrewittY).then(function() {
    console.log('Prewitty-Filter done');
    canvas.repaint();
  });
}, false);
