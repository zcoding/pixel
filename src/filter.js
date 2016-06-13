// 卷积运算的问题：边界的像素没有相邻像素，无法构成矩阵
// 解决：补充像素
// 1. 用0填充
// 2. 用第一行／列和最后一行／列补充
// 3. 反射边界填充：column[-1] = column[1]
// 4. 图像拼接填充：column[-1] = column[width-1]
//
// 这里采用第二种策略

function getPoints(i, j, w, h) {
  var topLeft = (i - 1) * w + j - 4, top = (i - 1) * w + j, topRight = (i - 1) * w + j + 4,
    left = i * w + j - 4, center = i * w + j, right = i * w + j + 4,
    bottomLeft = (i + 1) * w + j - 4, bottom = (i + 1) * w + j, bottomRight = (i + 1) * w + j + 4;
  return [
    i === 0 ? (j === 0 ? center : left) : (j === 0 ? top : topLeft),
    i === 0 ? center : top,
    i === 0 ? (j === w - 4 ? center : right) : (j === w - 4 ? top : topRight)
    j === 0 ? center : left,
    center,
    j === w - 4 ? center : right,
    i === h - 1 ? (j === 0 ? center : left) : (j === 0 ? bottom : bottomLeft),
    i === h - 1 ? center : bottom,
    i === h - 1 ? (j === w - 4 ? center : right) : (j === w - 4 ? bottom : bottomRight)
  ];
}

/**
 * 平滑滤波器
 * @param {Array} imageData
 * @param template 模板
 * @param times 模板参数
 */
export function smoothFilter(imageData, srcw, srch, template, times) {
  var data = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
  return new Promise((resolve, reject) => {
    var dataR = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var dataG = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var dataB = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    setTimeout(() => {
      for(let i = 0; i < srch; ++i) {
        for (let j = 0; j < srcw; j += 4) {
          var points = getPoints(i, j, srcw, srch);
          dataR[0] = imageData[points[0]]; dataG[0] = imageData[points[0] + 1]; dataB = imageData[points[0] + 2];
          dataR[1] = imageData[points[1]]; dataG[1] = imageData[points[1] + 1]; dataB = imageData[points[1] + 2];
          dataR[2] = imageData[points[2]]; dataG[2] = imageData[points[2] + 1]; dataB = imageData[points[2] + 2];
          dataR[3] = imageData[points[3]]; dataG[3] = imageData[points[3] + 1]; dataB = imageData[points[3] + 2];
          dataR[4] = imageData[points[4]]; dataG[4] = imageData[points[4] + 1]; dataB = imageData[points[4] + 2];
          dataR[5] = imageData[points[5]]; dataG[5] = imageData[points[5] + 1]; dataB = imageData[points[5] + 2];
          dataR[6] = imageData[points[6]]; dataG[6] = imageData[points[6] + 1]; dataB = imageData[points[6] + 2];
          dataR[7] = imageData[points[7]]; dataG[7] = imageData[points[7] + 1]; dataB = imageData[points[7] + 2];
          dataR[8] = imageData[points[8]]; dataG[8] = imageData[points[8] + 1]; dataB = imageData[points[8] + 2];
          imageData[i * srcw + j] = Convolution(dataR, template) / times;
          imageData[i * srcw + j + 1] = Convolution(dataG, template) / times;
          imageData[i * srcw + j + 2] = Convolution(dataB, template) / times;
        }
      }
      resolve(imageData);
    }, 0);
  });
}

/**
 * 中值滤波器-十字窗口
 * @param image Image对象
 */
export function crossWindow(imageData, srcw, srch) {
  var data = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      for(var i = 0; i < srch; ++i) {
        for (var j = 0; j < srcw; j += 4) {
          // 边界不处理
          if(i === 0 || i === 1 || i === srch - 2 || i === srch - 1 || j === 0 || j === 1 || j === srcw - 8 || j === srcw - 4) {
            continue;
          }
          else {
            data[0] = imageData[(i - 2) * srcw + j];
            data[1] = imageData[(i - 1) * srcw + j];
            data[2] = imageData[i * srcw + j - 8];
            data[3] = imageData[i * srcw + j - 4];
            data[4] = imageData[i * srcw + j];
            data[5] = imageData[i * srcw + j + 4];
            data[6] = imageData[i * srcw + j + 8];
            data[7] = imageData[(i + 1) * srcw + j];
            data[8] = imageData[(i + 2) * srcw + j];
          }
          data.sort(ascendingOrder);
          imageData[i * srcw + j] = imageData[i * srcw + j+1] = imageData[i * srcw + j+2] = data[4];
        }
      }
      resolve(imageData);
    }, 0);
  });
}

function findMiddle() {}

/**
 * 中值滤波器-方形窗口
 * @param {Array} imageData
 * @param {Number} srcw
 * @param {Number} srch
 */
export function squareWindow(imageData, srcw, srch) {
  var dataR = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  var dataG = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  var dataB = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      for(let i = 0; i < srch; ++i) {
        for (let j = 0; j < srcw; j += 4) {
          var points = getPoints(i, j, srcw, srch);
          dataR[0] = imageData[points[0]]; dataG[0] = imageData[points[0] + 1]; dataB = imageData[points[0] + 2];
          dataR[1] = imageData[points[1]]; dataG[1] = imageData[points[1] + 1]; dataB = imageData[points[1] + 2];
          dataR[2] = imageData[points[2]]; dataG[2] = imageData[points[2] + 1]; dataB = imageData[points[2] + 2];
          dataR[3] = imageData[points[3]]; dataG[3] = imageData[points[3] + 1]; dataB = imageData[points[3] + 2];
          dataR[4] = imageData[points[4]]; dataG[4] = imageData[points[4] + 1]; dataB = imageData[points[4] + 2];
          dataR[5] = imageData[points[5]]; dataG[5] = imageData[points[5] + 1]; dataB = imageData[points[5] + 2];
          dataR[6] = imageData[points[6]]; dataG[6] = imageData[points[6] + 1]; dataB = imageData[points[6] + 2];
          dataR[7] = imageData[points[7]]; dataG[7] = imageData[points[7] + 1]; dataB = imageData[points[7] + 2];
          dataR[8] = imageData[points[8]]; dataG[8] = imageData[points[8] + 1]; dataB = imageData[points[8] + 2];
          dataR.sort(ascendingOrder);
          dataG.sort(ascendingOrder);
          dataB.sort(ascendingOrder);
          imageData[i * srcw + j] = dataR[4];
          imageData[i * srcw + j + 1] = dataG[4];
          imageData[i * srcw + j + 2] = dataB[4];
        }
      }
      resolve(imageData);
    }, 0);
  });
}

/**
 * 高通滤波器
 * @param {Array} imageData
 * @param template 模板
 */
export function highPassFilter(imageData, srcw, srch, template) {
  var data = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      for(var i = 0; i < srch; ++i) {
        for (var j = 0; j < srcw; j += 4) {
          // 左上、右上、左下、右下四个角不处理
          if((i === 0 && j === 0) || (i === 0 && j === srcw - 4) || (i === srch - 1 && j === 0) || (i === srch - 1 && j === srcw - 4)) {
            continue;
          }
          // 左边界
          if (j === 0) {
            data[0] = imageData[(i - 1) * srcw + j];
            data[3] = imageData[i * srcw + j];
            data[6] = imageData[(i + 1) * srcw + j];
            
            data[1] = imageData[(i - 1) * srcw + j];
            data[2] = imageData[(i - 1) * srcw + j + 4];
            data[4] = imageData[i * srcw + j];
            data[5] = imageData[i * srcw + j + 4];
            data[7] = imageData[(i + 1) * srcw + j];
            data[8] = imageData[(i + 1) * srcw + j + 4];
          }
          // 右边界
          else if(j === srcw - 4) {
            data[2] = imageData[(i - 1) * srcw + j];
            data[5] = imageData[i * srcw + j];
            data[8] = imageData[(i + 1) * srcw + j];
            
            data[0] = imageData[(i - 1) * srcw + j - 4];
            data[1] = imageData[(i - 1) * srcw + j];
            data[3] = imageData[i * srcw + j - 4];
            data[4] = imageData[i * srcw + j];
            data[6] = imageData[i * srcw + j - 4];
            data[7] = imageData[i * srcw + j];
          }
          // 上边界
          else if(i === 0) {
            data[0] = imageData[i * srcw + j - 4];
            data[1] = imageData[i * srcw + j];
            data[2] = imageData[i * srcw + j + 4];
            
            data[3] = imageData[i * srcw + j - 4];
            data[4] = imageData[i * srcw + j];
            data[5] = imageData[i * srcw + j + 4];
            data[6] = imageData[(i + 1) * srcw + j - 4];
            data[7] = imageData[(i + 1) * srcw + j];
            data[8] = imageData[(i + 1) * srcw + j + 4];
          }
          // 下边界
          else if(i === srch - 1) {
            data[6] = imageData[i * srcw + j - 4];
            data[7] = imageData[i * srcw + j];
            data[8] = imageData[i * srcw + j + 4];
            
            data[0] = imageData[(i - 1) * srcw + j - 4];
            data[1] = imageData[(i - 1) * srcw + j];
            data[2] = imageData[(i - 1) * srcw + j + 4];
            data[3] = imageData[i * srcw + j - 4];
            data[4] = imageData[i * srcw + j];
            data[5] = imageData[i * srcw + j + 4];
          }
          // 其它点
          else {
            data[0] = imageData[(i - 1) * srcw + j - 4];
            data[1] = imageData[(i - 1) * srcw + j];
            data[2] = imageData[(i - 1) * srcw + j + 4];
            data[3] = imageData[i * srcw + j - 4];
            data[4] = imageData[i * srcw + j];
            data[5] = imageData[i * srcw + j + 4];
            data[6] = imageData[(i + 1) * srcw + j - 4];
            data[7] = imageData[(i + 1) * srcw + j];
            data[8] = imageData[(i + 1) * srcw + j + 4];
          }
          imageData[i * srcw + j] = imageData[i * srcw + j+1] = imageData[i * srcw + j+2] = Convolution(data, template);
        }
      }
      resolve(imageData);
    }, 0);
  });
}

/**
 * 锐化滤波器
 */
function sharpenFilter(imageData, srcw, srch, templateX, templateY) {
  var data = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
  return new Promise(() => {
    setTimeout(() => {
      for(var i = 0; i < srch; ++i) {
        for (var j = 0; j < srcw; j += 4) {
          // 左上、右上、左下、右下四个角不处理
          if((i === 0 && j === 0) || (i === 0 && j === srcw - 4) || (i === srch - 1 && j === 0) || (i === srch - 1 && j === srcw - 4)) {
            continue;
          }
          // 左边界
          if (j === 0) {
            data[0] = imageData[(i - 1) * srcw + j];
            data[3] = imageData[i * srcw + j];
            data[6] = imageData[(i + 1) * srcw + j];
            
            data[1] = imageData[(i - 1) * srcw + j];
            data[2] = imageData[(i - 1) * srcw + j + 4];
            data[4] = imageData[i * srcw + j];
            data[5] = imageData[i * srcw + j + 4];
            data[7] = imageData[(i + 1) * srcw + j];
            data[8] = imageData[(i + 1) * srcw + j + 4];
          }
          // 右边界
          else if(j === srcw - 4) {
            data[2] = imageData[(i - 1) * srcw + j];
            data[5] = imageData[i * srcw + j];
            data[8] = imageData[(i + 1) * srcw + j];
            
            data[0] = imageData[(i - 1) * srcw + j - 4];
            data[1] = imageData[(i - 1) * srcw + j];
            data[3] = imageData[i * srcw + j - 4];
            data[4] = imageData[i * srcw + j];
            data[6] = imageData[i * srcw + j - 4];
            data[7] = imageData[i * srcw + j];
          }
          // 上边界
          else if(i === 0) {
            data[0] = imageData[i * srcw + j - 4];
            data[1] = imageData[i * srcw + j];
            data[2] = imageData[i * srcw + j + 4];
            
            data[3] = imageData[i * srcw + j - 4];
            data[4] = imageData[i * srcw + j];
            data[5] = imageData[i * srcw + j + 4];
            data[6] = imageData[(i + 1) * srcw + j - 4];
            data[7] = imageData[(i + 1) * srcw + j];
            data[8] = imageData[(i + 1) * srcw + j + 4];
          }
          // 下边界
          else if(i === srch - 1) {
            data[6] = imageData[i * srcw + j - 4];
            data[7] = imageData[i * srcw + j];
            data[8] = imageData[i * srcw + j + 4];
            
            data[0] = imageData[(i - 1) * srcw + j - 4];
            data[1] = imageData[(i - 1) * srcw + j];
            data[2] = imageData[(i - 1) * srcw + j + 4];
            data[3] = imageData[i * srcw + j - 4];
            data[4] = imageData[i * srcw + j];
            data[5] = imageData[i * srcw + j + 4];
          }
          // 其它点
          else {
            data[0] = imageData[(i - 1) * srcw + j - 4];
            data[1] = imageData[(i - 1) * srcw + j];
            data[2] = imageData[(i - 1) * srcw + j + 4];
            data[3] = imageData[i * srcw + j - 4];
            data[4] = imageData[i * srcw + j];
            data[5] = imageData[i * srcw + j + 4];
            data[6] = imageData[(i + 1) * srcw + j - 4];
            data[7] = imageData[(i + 1) * srcw + j];
            data[8] = imageData[(i + 1) * srcw + j + 4];
          }
          var tempx = Convolution(data, templateX);
          var tempy = Convolution(data, templateY);
          var gray = Math.sqrt(Math.pow(tempx, 2) + Math.pow(tempy, 2));
          imageData[i * srcw + j] = imageData[i * srcw + j+1] = imageData[i * srcw + j+2] = gray;
        }
      }
      resolve(imageData);
    }, 0);
  });
}
