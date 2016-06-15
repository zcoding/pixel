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
function get3x3Matrix(originData, i, j, w, h) {
  var topLeft = (i - 1) * w + j - 4, top = (i - 1) * w + j, topRight = (i - 1) * w + j + 4,
    left = i * w + j - 4, center = i * w + j, right = i * w + j + 4,
    bottomLeft = (i + 1) * w + j - 4, bottom = (i + 1) * w + j, bottomRight = (i + 1) * w + j + 4;
  let points = [
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

// 十字窗口取相邻像素的规则不是3x3，需要特殊处理
function getCrossWindowMatrix(originData, i, j, w, h) {
  let top2 = (i - 2) * w + j, top1 = (i - 1) * w + j,
    right1 = i * w + j + 4, right2 = i * w + j + 8,
    bottom1 = (i + 1) * w + j, bottom2 = (i + 2) * w + j,
    left2 = i * w + j - 8, left1 = i * w + j - 4,
    center = i * w + j;
  let points = [
    i < 2 ? center : top2,
    i < 1 ? center : top1,
    j > w - 8 ? center : right1,
    j > w - 12 ? center : right2,
    i > h - 2 ? center : bottom1,
    i > h - 3 ? center : bottom2,
    j < 1 ? center : left1,
    j < 2 ? center : left2
  ];
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

function getAsyncProcessingPromise(processing, w, h, N) {
  N = N || 100;
  return function asyncProcessing(imageData) {
    return new Promise((resolve, reject) => {
      function doProcess(irow, rows) {
        for (let i = 0; i < rows; ++i) {
          for (let j = 0; j < w; j += 4) {
            processing(imageData, irow + i, j, w, h);
          }
        }
        setTimeout(() => {
          irow += rows;
          if (irow + N < h) {
            doProcess(irow, N);
          } else if (irow < h) {
            doProcess(irow, h - irow);
          } else {
            resolve(imageData);
          }
        }, 0);
      }
      doProcess(0, N);
    });
  };
}

export function SmoothFilter2(imageData, srcw, srch, template, times) {
  var originData = imageData.slice(0);
  return getAsyncProcessingPromise(function asyncProcessingSmoothFilter(imageData, i, j, w, h) {
    let matrix3x3 = get3x3Matrix(originData, i, j, w, h);
    imageData[i * w + j] = Convolution(matrix3x3[0], template) / times;
    imageData[i * w + j + 1] = Convolution(matrix3x3[1], template) / times;
    imageData[i * w + j + 2] = Convolution(matrix3x3[2], template) / times;
  }, srcw * 4, srch)();
};

/**
 * Smooth Filter
 * @param {TypedArray} imageData
 * @param {Number} srcw
 * @param {Number} srch
 */
export function SmoothFilter(imageData, srcw, srch, template, times) {
  var originData = imageData.slice(0);
  var rowPixelLength = srcw * 4;
  var N = 100;
  return new Promise((resolve, reject) => {
    // async way
    function doProcess(irow, rows) {
      for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < rowPixelLength; j += 4) {
          let matrix3x3 = get3x3Matrix(originData, irow + i, j, rowPixelLength, srch);
          imageData[(irow + i) * rowPixelLength + j] = Convolution(matrix3x3[0], template) / times;
          imageData[(irow + i) * rowPixelLength + j + 1] = Convolution(matrix3x3[1], template) / times;
          imageData[(irow + i) * rowPixelLength + j + 2] = Convolution(matrix3x3[2], template) / times;
        }
      }
      setTimeout(() => {
        irow += rows;
        if (irow + N < srch) {
          doProcess(irow, N);
        } else if (irow < srch) {
          doProcess(irow, srch - irow);
        } else {
          resolve(imageData);
        }
      }, 0);
    }
    doProcess(0, N);
    // sync way
    // for(let i = 0; i < srch; ++i) {
    //   for (let j = 0; j < rowPixelLength; j += 4) {
    //     let matrix3x3 = get3x3Matrix(originData, i, j, rowPixelLength, srch);
    //     imageData[i * rowPixelLength + j] = Convolution(matrix3x3[0], template) / times;
    //     imageData[i * rowPixelLength + j + 1] = Convolution(matrix3x3[1], template) / times;
    //     imageData[i * rowPixelLength + j + 2] = Convolution(matrix3x3[2], template) / times;
    //   }
    // }
    // resolve(imageData);
  });
}

/**
 * Median Filter : Cross Window
 * @param {TypedArray} imageData
 * @param {Number} srcw
 * @param {Number} srch
 */
export function CrossWindow(imageData, srcw, srch) {
  var originData = imageData.slice(0);
  var rowPixelLength = srcw * 4;
  var N = 100;
  return new Promise((resolve, reject) => {
    // async way
    function doProcess(irow, rows) {
      for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < rowPixelLength; j += 4) {
          let matrix3x3 = getCrossWindowMatrix(originData, irow + i, j, rowPixelLength, srch);
          let dataR = matrix3x3[0], dataG = matrix3x3[1], dataB = matrix3x3[2];
          dataR.sort(AscendingOrder);
          dataG.sort(AscendingOrder);
          dataB.sort(AscendingOrder);
          imageData[(irow + i) * rowPixelLength + j] = dataR[4];
          imageData[(irow + i) * rowPixelLength + j + 1] = dataG[4];
          imageData[(irow + i) * rowPixelLength + j + 2] = dataB[4];
        }
      }
      setTimeout(() => {
        irow += rows;
        if (irow + N < srch) {
          doProcess(irow, N);
        } else if (irow < srch) {
          doProcess(irow, srch - irow);
        } else {
          resolve(imageData);
        }
      }, 0);
    }
    doProcess(0, N);
    // sync way
    // for(let i = 0; i < srch; ++i) {
    //   for (let j = 0; j < rowPixelLength; j += 4) {
        // let matrix3x3 = getCrossWindowMatrix(originData, i, j, rowPixelLength, srch);
        // let dataR = matrix3x3[0], dataG = matrix3x3[1], dataB = matrix3x3[2];
        // dataR.sort(AscendingOrder);
        // dataG.sort(AscendingOrder);
        // dataB.sort(AscendingOrder);
        // imageData[i * rowPixelLength + j] = dataR[4];
        // imageData[i * rowPixelLength + j + 1] = dataG[4];
        // imageData[i * rowPixelLength + j + 2] = dataB[4];
    //   }
    // }
    // resolve(imageData);
  });
}

/**
 * Median Filter : Square Window
 * @param {Array} imageData
 * @param {Number} srcw
 * @param {Number} srch
 */
export function SquareWindow(imageData, srcw, srch) {
  var originData = imageData.slice(0);
  var rowPixelLength = srcw * 4;
  var N = 100;
  return new Promise((resolve, reject) => {
    // async way
    function doProcess(irow, rows) {
      for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < rowPixelLength; j += 4) {
          let matrix3x3 = get3x3Matrix(originData, irow + i, j, rowPixelLength, srch);
          let dataR = matrix3x3[0], dataG = matrix3x3[1], dataB = matrix3x3[2];
          dataR.sort(AscendingOrder);
          dataG.sort(AscendingOrder);
          dataB.sort(AscendingOrder);
          imageData[(irow + i) * rowPixelLength + j] = dataR[4];
          imageData[(irow + i) * rowPixelLength + j + 1] = dataG[4];
          imageData[(irow + i) * rowPixelLength + j + 2] = dataB[4];
        }
      }
      setTimeout(() => {
        irow += rows;
        if (irow + N < srch) {
          doProcess(irow, N);
        } else if (irow < srch) {
          doProcess(irow, srch - irow);
        } else {
          resolve(imageData);
        }
      }, 0);
    }
    doProcess(0, N);
    // sync way
    // for(let i = 0; i < srch; ++i) {
    //   for (let j = 0; j < rowPixelLength; j += 4) {
    //     let matrix3x3 = get3x3Matrix(originData, i, j, rowPixelLength, srch);
    //     let dataR = matrix3x3[0], dataG = matrix3x3[1], dataB = matrix3x3[2];
    //     dataR.sort(AscendingOrder);
    //     dataG.sort(AscendingOrder);
    //     dataB.sort(AscendingOrder);
    //     imageData[i * rowPixelLength + j] = dataR[4];
    //     imageData[i * rowPixelLength + j + 1] = dataG[4];
    //     imageData[i * rowPixelLength + j + 2] = dataB[4];
    //   }
    // }
    // resolve(imageData);
  });
}

/**
 * High Pass Filter
 * @param {Array} imageData
 * @param {Number} srcw
 * @param {Number} srch
 * @param {Array} template
 */
export function HighPassFilter(imageData, srcw, srch, template) {
  var originData = imageData.slice(0);
  var rowPixelLength = srcw * 4;
  var N = 100;
  return new Promise((resolve, reject) => {
    // async way
    function doProcess(irow, rows) {
      for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < rowPixelLength; j += 4) {
          let matrix3x3 = get3x3Matrix(originData, irow + i, j, rowPixelLength, srch);
          imageData[(irow + i) * rowPixelLength + j] = Convolution(matrix3x3[0], template);
          imageData[(irow + i) * rowPixelLength + j + 1] = Convolution(matrix3x3[1], template);
          imageData[(irow + i) * rowPixelLength + j + 2] = Convolution(matrix3x3[2], template);
        }
      }
      setTimeout(() => {
        irow += rows;
        if (irow + N < srch) {
          doProcess(irow, N);
        } else if (irow < srch) {
          doProcess(irow, srch - irow);
        } else {
          resolve(imageData);
        }
      }, 0);
    }
    doProcess(0, N);
    // sync way
    // for(let i = 0; i < srch; ++i) {
    //   for (let j = 0; j < rowPixelLength; j += 4) {
    //     let matrix3x3 = get3x3Matrix(originData, i, j, rowPixelLength, srch);
    //     imageData[i * rowPixelLength + j] = Convolution(matrix3x3[0], template);
    //     imageData[i * rowPixelLength + j + 1] = Convolution(matrix3x3[1], template);
    //     imageData[i * rowPixelLength + j + 2] = Convolution(matrix3x3[2], template);
    //   }
    // }
    // resolve(imageData);
  });
}

/**
 * Sharpen Filter
 */
export function SharpenFilter(imageData, srcw, srch, templateX, templateY) {
  var originData = imageData.slice(0);
  var rowPixelLength = srcw * 4;
  var N = 100;
  return new Promise((resolve, reject) => {
    // async way
    function doProcess(irow, rows) {
      for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < rowPixelLength; j += 4) {
          let matrix3x3 = get3x3Matrix(originData, irow + i, j, rowPixelLength, srch);
          let dataR = matrix3x3[0], dataG = matrix3x3[1], dataB = matrix3x3[2];
          var RTempX = Convolution(dataR, templateX);
          var RTempY = Convolution(dataR, templateY);
          imageData[(irow + i) * rowPixelLength + j] = Math.sqrt(Math.pow(RTempX, 2) + Math.pow(RTempY, 2));
          var GTempX = Convolution(dataG, templateX);
          var GTempY = Convolution(dataG, templateY);
          imageData[(irow + i) * rowPixelLength + j + 1] = Math.sqrt(Math.pow(GTempX, 2) + Math.pow(GTempY, 2));
          var BTempX = Convolution(dataB, templateX);
          var BTempY = Convolution(dataB, templateY);
          imageData[(irow + i) * rowPixelLength + j + 2] = Math.sqrt(Math.pow(BTempX, 2) + Math.pow(BTempY, 2));
        }
      }
      setTimeout(() => {
        irow += rows;
        if (irow + N < srch) {
          doProcess(irow, N);
        } else if (irow < srch) {
          doProcess(irow, srch - irow);
        } else {
          resolve(imageData);
        }
      }, 0);
    }
    doProcess(0, N);
    // sync way
    // for(let i = 0; i < srch; ++i) {
    //   for (let j = 0; j < rowPixelLength; j += 4) {
    //     let matrix3x3 = get3x3Matrix(originData, i, j, rowPixelLength, srch);
    //     let dataR = matrix3x3[0], dataG = matrix3x3[1], dataB = matrix3x3[2];
    //     var RTempX = Convolution(dataR, templateX);
    //     var RTempY = Convolution(dataR, templateY);
    //     imageData[i * rowPixelLength + j] = Math.sqrt(Math.pow(RTempX, 2) + Math.pow(RTempY, 2));
    //     var GTempX = Convolution(dataG, templateX);
    //     var GTempY = Convolution(dataG, templateY);
    //     imageData[i * rowPixelLength + j + 1] = Math.sqrt(Math.pow(GTempX, 2) + Math.pow(GTempY, 2));
    //     var BTempX = Convolution(dataB, templateX);
    //     var BTempY = Convolution(dataB, templateY);
    //     imageData[i * rowPixelLength + j + 2] = Math.sqrt(Math.pow(BTempX, 2) + Math.pow(BTempY, 2));
    //   }
    // }
    // resolve(imageData);
  });
}
