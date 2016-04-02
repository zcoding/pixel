
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
function ascendingOrder(a, b) {
  return a - b;
}
/**
 * 降序函数，用于数组排序
 */
function descendingOrder(a, b) {
  return b - a;
}


var Pixel = (function() {

  var Pixel = {};

  Pixel.smooth1 = new Array(1, 1, 1, 1, 0, 1, 1, 1, 1);         // 平滑模板 参数1/8
  Pixel.smooth2 = new Array(1, 2, 1, 2, 4, 2, 1, 2, 1);         // 平滑模板 参数1/16
  Pixel.smooth3 = new Array(1, 1, 1, 1, 2, 1, 1, 1, 1);         // 平滑模板 参数1/10
  Pixel.laplacian0 = new Array(0, -1, 0, -1, 4, -1, 0, -1, 0);  // 拉普拉斯算子
  Pixel.laplacian1 = new Array(0, -1, 0, -1, 5, -1, 0, -1, 0);  // 拉普拉斯算子
  Pixel.laplacian2 = new Array(1, 4, 1, 4, -20, 4, 1, 4, 1);    // 拉普拉斯算子
  Pixel.Sobelx = new Array(1, 0, -1, 2, 0, -2, 1, 0, -1);       // Sobel算子x
  Pixel.Sobely = new Array(-1, -2, -1, 0, 0, 0, 1, 2, 1);       // Sobel算子y
  Pixel.Prewittx = new Array(1, 0, -1, 1, 0, -1, 1, 0, -1);     // Prewitt算子x
  Pixel.Prewitty = new Array(-1, -1, -1, 0, 0, 0, 1, 1, 1);     // Prewitt算子y

  /**
   * 求补（异步）
   * rgb = 255 - rgb
   * a = a
   * @return Promise
   */
  Pixel.complement = function(data) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        for(var i = 0, len = data.length; i < len; i += 4) {
          data[i] = 255 - data[i];
          data[i+1] = 255 - data[i+1];
          data[i+2] = 255 - data[i+2];
        }
        resolve(data);
      }, 0);
    });
  };

  /**
   * 线性运算（异步）
   * rgb = x * rgb + y
   * a = a
   *
   * @param {Number} x
   * @param {Number} y
   * @return Promise
   */
  Pixel.linear = function(data, x, y) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        for(var i = 0, len = data.length; i < len; i += 4) {
          data[i] = x * data[i] + y;
          data[i+1] = x * data[i+1] + y;
          data[i+2] = x * data[i+2] + y;
        }
        resolve(data);
      }, 0);
    });
  };

  /**
   * 改变透明度（异步）
   * @param {Number} opacity: 0 ~ 1
   * @return Promise
   */
  Pixel.opacity = function(data, opacity) {
    opacity = 225 * opacity;
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        for (var i = 0, len = data.length; i < len; i += 4) {
          data[i+3] = opacity;
        }
        resolve(data);
      }, 0);
    });
  };

  /**
   * 二值化（异步）
   * @param {Number} threshold
   */
  Pixel.binarization = function(data, threshold) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        for(var i = 0, len = data.length; i < len; i += 4) {
          data[i] = data[i+1] = data[i+2] = data[i] < threshold ? 0 : 255;
        }
        resolve(data);
      }, 0);
    });
  };

  /**
   * 转换为灰度（异步）
   * @return Promise
   */
  Pixel.gray = function(data) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        for(var i = 0, len = data.length; i < len; i += 4) {
          var gray = (data[i] + data[i+1] + data[i+2]) / 3;
          data[i] = data[i+1] = data[i+2] = gray;
        }
        resolve(data);
      }, 0);
    });
  };

  /**
   * 平滑滤波器
   * @param image Image对象
   * @param template 模板
   * @param times 模板参数
   */
  Pixel.smoothFilter = function(imageData, srcw, srch, template, times) {
    var data = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
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
            imageData[i * srcw + j] = imageData[i * srcw + j+1] = imageData[i * srcw + j+2] = Convolution(data, template) / times;
          }
        }
        resolve(imageData);
      }, 0);
    });
  };

  /**
   * 中值滤波器-十字窗口
   * @param image Image对象
   */
  Pixel.CrossWindow = function(imageData, srcw, srch) {
    var data = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
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
  };

  /**
   * 中值滤波器-方形窗口
   * @param image Image对象
   */
  Pixel.SquareWindow = function(imageData, srcw, srch) {
    var data = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        for(var i = 0; i < srch; ++i) {
          for (var j = 0; j < srcw; j += 4) {
            // 边界不处理
            if(i === 0 || i === 1 || i === srch - 2 || i === srch - 1 || j === 0 || j === 1 || j === srcw - 8 || j === srcw - 4) {
              continue;
            }
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
            data.sort(ascendingOrder);
            imageData[i * srcw + j] = imageData[i * srcw + j+1] = imageData[i * srcw + j+2] = data[4];
          }
        }
        resolve(imageData);
      }, 0);
    });
  };

  /**
   * 高通滤波器
   * @param image Image对象
   * @param template 模板
   */
  Pixel.highPassFilter = function(imageData, srcw, srch, template) {
    var data = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
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
  };

  /**
   * 锐化滤波器
   */
  function sharpenFilter(imageData, srcw, srch, templateX, templateY) {
    var data = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
    return new Promise(function() {
      setTimeout(function() {
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

  return Pixel;

})();

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
