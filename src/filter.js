import {
  Convolution,
  AscendingOrder
} from './utils';

// 卷积运算的问题：边界的像素没有相邻像素，无法构成矩阵
// 解决：补充像素
// 1. 用0填充
// 2. 用第一行／列和最后一行／列补充
// 3. 反射边界填充：column[-1] = column[1]
// 4. 图像拼接填充：column[-1] = column[width-1]
//
// 这里采用第二种策略
// 以某个像素点为中心，获取其周边像素组成一个3 x 3矩阵
function getPoints(i, j, w, h) {
  var topLeft = (i - 1) * w + j - 4, top = (i - 1) * w + j, topRight = (i - 1) * w + j + 4,
    left = i * w + j - 4, center = i * w + j, right = i * w + j + 4,
    bottomLeft = (i + 1) * w + j - 4, bottom = (i + 1) * w + j, bottomRight = (i + 1) * w + j + 4;
  return [
    i === 0 ? (j === 0 ? center : left) : (j === 0 ? top : topLeft),
    i === 0 ? center : top,
    i === 0 ? (j === w - 4 ? center : right) : (j === w - 4 ? top : topRight),
    j === 0 ? center : left,
    center,
    j === w - 4 ? center : right,
    i === h - 1 ? (j === 0 ? center : left) : (j === 0 ? bottom : bottomLeft),
    i === h - 1 ? center : bottom,
    i === h - 1 ? (j === w - 4 ? center : right) : (j === w - 4 ? bottom : bottomRight)
  ];
}

function get3x3Matrix(originData, i, j, w, h) {
  let points = getPoints(i, j, w, h);
  let dataR = [
    originData[points[0]], originData[points[1]], originData[points[2]],
    originData[points[3]], originData[points[4]], originData[points[5]],
    originData[points[6]], originData[points[7]], originData[points[8]]
  ];
  let dataG = [
    originData[points[0] + 1], originData[points[1] + 1], originData[points[2] + 1],
    originData[points[3] + 1], originData[points[4] + 1], originData[points[5] + 1],
    originData[points[6] + 1], originData[points[7] + 1], originData[points[8] + 1]
  ];
  let dataB = [
    originData[points[0] + 2], originData[points[1] + 2], originData[points[2] + 2],
    originData[points[3] + 2], originData[points[4] + 2], originData[points[5] + 2],
    originData[points[6] + 2], originData[points[7] + 2], originData[points[8] + 2]
  ];
  return [dataR, dataG, dataB];
}

/**
 * 平滑滤波器
 * @param {Array} imageData
 * @param template 模板
 * @param times 模板参数
 */
export function SmoothFilter(imageData, srcw, srch, template, times) {
  return new Promise((resolve, reject) => {
    var originData = imageData.slice(0);
    var rowPixelLength = srcw * 4;
    setTimeout(() => {
      for(let i = 0; i < srch; ++i) {
        for (let j = 0; j < rowPixelLength; j += 4) {
          let matrix3x3 = get3x3Matrix(originData, i, j, rowPixelLength, srch);
          imageData[i * rowPixelLength + j] = Convolution(matrix3x3[0], template) / times;
          imageData[i * rowPixelLength + j + 1] = Convolution(matrix3x3[1], template) / times;
          imageData[i * rowPixelLength + j + 2] = Convolution(matrix3x3[2], template) / times;
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
export function CrossWindow(imageData, srcw, srch) {
  var data = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  var rowPixelLength = srcw * 4;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      for(let i = 0; i < srch; ++i) {
        for (let j = 0; j < rowPixelLength; j += 4) {
          // 边界不处理
          if(i === 0 || i === 1 || i === srch - 2 || i === srch - 1 || j === 0 || j === 1 || j === rowPixelLength - 8 || j === rowPixelLength - 4) {
            continue;
          } else {
            data[0] = imageData[(i - 2) * rowPixelLength + j];
            data[1] = imageData[(i - 1) * rowPixelLength + j];
            data[2] = imageData[i * rowPixelLength + j - 8];
            data[3] = imageData[i * rowPixelLength + j - 4];
            data[4] = imageData[i * rowPixelLength + j];
            data[5] = imageData[i * rowPixelLength + j + 4];
            data[6] = imageData[i * rowPixelLength + j + 8];
            data[7] = imageData[(i + 1) * rowPixelLength + j];
            data[8] = imageData[(i + 2) * rowPixelLength + j];
          }
          data.sort(AscendingOrder);
          imageData[i * rowPixelLength + j] = imageData[i * rowPixelLength + j+1] = imageData[i * rowPixelLength + j+2] = data[4];
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
export function SquareWindow(imageData, srcw, srch) {
  var originData = imageData.slice(0);
  var rowPixelLength = srcw * 4;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      for(let i = 0; i < srch; ++i) {
        for (let j = 0; j < rowPixelLength; j += 4) {
          let matrix3x3 = get3x3Matrix(originData, i, j, rowPixelLength, srch);
          let dataR = matrix3x3[0], dataG = matrix3x3[1], dataB = matrix3x3[2];
          dataR.sort(AscendingOrder);
          dataG.sort(AscendingOrder);
          dataB.sort(AscendingOrder);
          imageData[i * rowPixelLength + j] = dataR[4];
          imageData[i * rowPixelLength + j + 1] = dataG[4];
          imageData[i * rowPixelLength + j + 2] = dataB[4];
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
export function HighPassFilter(imageData, srcw, srch, template) {
  var originData = imageData.slice(0);
  var rowPixelLength = srcw * 4;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      for(let i = 0; i < srch; ++i) {
        for (let j = 0; j < rowPixelLength; j += 4) {
          let matrix3x3 = get3x3Matrix(originData, i, j, rowPixelLength, srch);
          imageData[i * rowPixelLength + j] = Convolution(matrix3x3[0], template);
          imageData[i * rowPixelLength + j + 1] = Convolution(matrix3x3[1], template);
          imageData[i * rowPixelLength + j + 2] = Convolution(matrix3x3[2], template);
        }
      }
      resolve(imageData);
    }, 0);
  });
}

/**
 * 锐化滤波器
 */
export function SharpenFilter(imageData, srcw, srch, templateX, templateY) {
  var originData = imageData.slice(0);
  var rowPixelLength = srcw * 4;
  return new Promise(() => {
    setTimeout(() => {
      for(let i = 0; i < srch; ++i) {
        for (let j = 0; j < srcw; j += 4) {
          let matrix3x3 = get3x3Matrix(originData, i, j, rowPixelLength, srch);
          let dataR = matrix3x3[0], dataG = matrix3x3[1], dataB = matrix3x3[2];
          var RTempX = Convolution(dataR, templateX);
          var RTempY = Convolution(dataR, templateY);
          imageData[i * srcw + j] = Math.sqrt(Math.pow(RTempX, 2) + Math.pow(RTempY, 2));
          var GTempX = Convolution(dataG, templateX);
          var GTempY = Convolution(dataG, templateY);
          imageData[i * srcw + j+1] = Math.sqrt(Math.pow(GTempX, 2) + Math.pow(GTempY, 2));
          var BTempX = Convolution(dataB, templateX);
          var BTempY = Convolution(dataB, templateY);
          imageData[i * srcw + j+2] = Math.sqrt(Math.pow(BTempX, 2) + Math.pow(BTempY, 2));
        }
      }
      resolve(imageData);
    }, 0);
  });
}
