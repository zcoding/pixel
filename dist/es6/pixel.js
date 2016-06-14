/**
 * 求补
 * r' = 255 - r
 * g' = 255 - g
 * b' = 255 - b
 * a' = a
 * @param {TypedArray} imageData
 * @return Promise
 */
function Complement(imageData) {
  var N = 100 * 500 * 4;
  return new Promise((resolve, reject) => {
    // async way
    function doProcess(pos, len) {
      for(let i = 0; i < len; i += 4) {
        imageData[pos + i] = 255 - imageData[pos + i];
        imageData[pos + i + 1] = 255 - imageData[pos + i + 1];
        imageData[pos + i + 2] = 255 - imageData[pos + i + 2];
      }
      setTimeout(() => {
        pos += len;
        if (pos + N < imageData.length) {
          doProcess(pos, N);
        } else if (pos < imageData.length) {
          doProcess(pos, imageData.length - pos);
        } else {
          resolve(imageData);
        }
      }, 0);
    }
    doProcess(0, N);
    // sync way
    // for(let i = 0; i < imageData.length; i += 4) {
    //   imageData[i] = 255 - imageData[i];
    //   imageData[i+1] = 255 - imageData[i+1];
    //   imageData[i+2] = 255 - imageData[i+2];
    // }
    // resolve(imageData);
  });
}

/**
 * 线性运算
 * r' = r * x + y
 * g' = g * x + y
 * b' = b * x + y
 * a' = a
 * @param {TypedArray} imageData
 * @param {Number} x
 * @param {Number} y
 * @return Promise
 */
function Linear(imageData, x, y) {
  var N = 100 * 500 * 4;
  return new Promise((resolve, reject) => {
    // async way
    function doProcess(pos, len) {
      for(let i = 0; i < len; i += 4) {
        imageData[pos + i] = x * imageData[pos + i] + y;
        imageData[pos + i + 1] = x * imageData[pos + i + 1] + y;
        imageData[pos + i + 2] = x * imageData[pos + i + 2] + y;
      }
      setTimeout(() => {
        pos += len;
        if (pos + N < imageData.length) {
          doProcess(pos, N);
        } else if (pos < imageData.length) {
          doProcess(pos, imageData.length - pos);
        } else {
          resolve(imageData);
        }
      }, 0);
    }
    doProcess(0, N);
    // sync way
    // for(let i = 0; i < imageData.length; i += 4) {
    //   imageData[i] = x * imageData[i] + y;
    //   imageData[i+1] = x * imageData[i+1] + y;
    //   imageData[i+2] = x * imageData[i+2] + y;
    // }
    // resolve(imageData);
  });
}

/**
 * 改变透明度
 * r' = r
 * g' = g
 * b' = b
 * a' = opacity * 255
 * @param {TypedArray} imageData
 * @param {Number} opacity: 0 ~ 1
 * @return Promise
 */
function Opacity(imageData, opacity) {
  var alpha = 225 * opacity;
  var N = 100 * 500 * 4;
  return new Promise((resolve, reject) => {
    // async way
    function doProcess(pos, len) {
      for(let i = 0; i < len; i += 4) {
        imageData[pos + i + 3] = alpha;
      }
      setTimeout(() => {
        pos += len;
        if (pos + N < imageData.length) {
          doProcess(pos, N);
        } else if (pos < imageData.length) {
          doProcess(pos, imageData.length - pos);
        } else {
          resolve(imageData);
        }
      }, 0);
    }
    doProcess(0, N);
    // sync way
    // for (let i = 0; i < imageData.length; i += 4) {
    //   imageData[i+3] = alpha;
    // }
    // resolve(imageData);
  });
}

/**
 * 二值化
 * 先转换为灰度图
 * c' = c < threshold ? 0 : 255
 * a' = a
 * @param {TypedArray} imageData
 * @param {Number} threshold
 * @return Promise
 */
function Binarization(imageData, threshold) {
  var N = 100 * 500 * 4;
  return new Promise((resolve, reject) => {
    // async way
    function doProcess(pos, len) {
      for(let i = 0; i < len; i += 4) {
        var gray = 0.299 * imageData[pos + i] + 0.587 * imageData[pos + i + 1] + 0.114 * imageData[pos + i + 2];
        imageData[pos + i] = imageData[pos + i + 1] = imageData[pos + i + 2] = gray < threshold ? 0 : 255;
      }
      setTimeout(() => {
        pos += len;
        if (pos + N < imageData.length) {
          doProcess(pos, N);
        } else if (pos < imageData.length) {
          doProcess(pos, imageData.length - pos);
        } else {
          resolve(imageData);
        }
      }, 0);
    }
    doProcess(0, N);
    // sync way
    // for(let i = 0; i < imageData.length; i += 4) {
    //   var gray = 0.299 * imageData[i] + 0.587 * imageData[i+1] + 0.114 * imageData[i+2];
    //   imageData[i] = imageData[i+1] = imageData[i+2] = gray < threshold ? 0 : 255;
    // }
    // resolve(imageData);
  });
}

/**
 * 转换为灰度
 * r' = g' = b' = 0.299 * r + 0.587 * g + 0.114 * b
 * a' = a
 * @param {TypedArray} imageData
 * @return Promise
 */
function Gray(imageData) {
  var N = 100 * 500 * 4;
  return new Promise((resolve, reject) => {
    // async way
    function doProcess(pos, len) {
      for(let i = 0; i < len; i += 4) {
        var gray = 0.299 * imageData[pos + i] + 0.587 * imageData[pos + i + 1] + 0.114 * imageData[pos + i + 2];
        imageData[pos + i] = imageData[pos + i + 1] = imageData[pos + i + 2] = gray;
      }
      setTimeout(() => {
        pos += len;
        if (pos + N < imageData.length) {
          doProcess(pos, N);
        } else if (pos < imageData.length) {
          doProcess(pos, imageData.length - pos);
        } else {
          resolve(imageData);
        }
      }, 0);
    }
    doProcess(0, N);
    // sync way
    // for(let i = 0; i < imageData.length; i += 4) {
    //   var gray = 0.299 * imageData[i] + 0.587 * imageData[i+1] + 0.114 * imageData[i+2];
    //   imageData[i] = imageData[i+1] = imageData[i+2] = gray;
    // }
    // resolve(imageData);
  });
}

/**
 * 卷积运算
 * @param matrix 矩阵
 * @param template 模板
 * @return result 返回矩阵和模板卷积运算的结果
 */
function Convolution(matrix, template) {
    var result = 0;
    for (var i = 0; i < matrix.length; ++i) {
      result += matrix[i] * template[i];
    }
    return result;
}

/// 辅助函数
/**
 * 升序函数，用于数组排序
 */
function AscendingOrder(a, b) {
  return a - b;
}

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

/**
 * Smooth Filter
 * @param {TypedArray} imageData
 * @param {Number} srcw
 * @param {Number} srch
 */
function SmoothFilter(imageData, srcw, srch, template, times) {
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
function CrossWindow(imageData, srcw, srch) {
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
function SquareWindow(imageData, srcw, srch) {
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
function HighPassFilter(imageData, srcw, srch, template) {
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
function SharpenFilter(imageData, srcw, srch, templateX, templateY) {
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

class Canvas {
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

  save() {
    return this.cvs.toDataURL();
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
    threshold = threshold || 128;
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

  highPassFilter(template) {
    return HighPassFilter(this.imageData.data, this.width, this.height, template);
  }

  sharpenFilter(templateX, templateY) {
    return SharpenFilter(this.imageData.data, this.width, this.height, templateX, templateY);
  }
}

const TemplateSmooth1 = new Array(1, 1, 1, 1, 0, 1, 1, 1, 1);         // 平滑模板 参数 1/8
const TemplateSmooth2 = new Array(1, 2, 1, 2, 4, 2, 1, 2, 1);         // 平滑模板 参数 1/16
const TemplateSmooth3 = new Array(1, 1, 1, 1, 2, 1, 1, 1, 1);         // 平滑模板 参数 1/10
const Laplacian0 = new Array(0, -1, 0, -1, 4, -1, 0, -1, 0);  // 拉普拉斯算子
const Laplacian1 = new Array(0, -1, 0, -1, 5, -1, 0, -1, 0);  // 拉普拉斯算子
const Laplacian2 = new Array(1, 4, 1, 4, -20, 4, 1, 4, 1);    // 拉普拉斯算子
const SobelX = new Array(1, 0, -1, 2, 0, -2, 1, 0, -1);       // Sobel算子x
const SobelY = new Array(-1, -2, -1, 0, 0, 0, 1, 2, 1);       // Sobel算子y
const PrewittX = new Array(1, 0, -1, 1, 0, -1, 1, 0, -1);     // Prewitt算子x
const PrewittY = new Array(-1, -1, -1, 0, 0, 0, 1, 1, 1);     // Prewitt算子y

/**
 * loadImage
 * @param {String} src
 * @return {Promise}
 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    var image = new Image();
    image.addEventListener("load", function() {
      resolve(image);
    }, false);
    image.addEventListener("error", function() {
      reject(new Error("Cannot load image"));
    }, false);
    image.src = src;
  });
}

var main = {
  Canvas,
  loadImage,
  
  TemplateSmooth1,
  TemplateSmooth2,
  TemplateSmooth3,
  Laplacian0,
  Laplacian1,
  Laplacian2,
  SobelX,
  SobelY,
  PrewittX,
  PrewittY
};

export default main;
//# sourceMappingURL=pixel.js.map