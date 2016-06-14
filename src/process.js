/**
 * 求补
 * r' = 255 - r
 * g' = 255 - g
 * b' = 255 - b
 * a' = a
 * @param {TypedArray} imageData
 * @return Promise
 */
export function Complement(imageData) {
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
export function Linear(imageData, x, y) {
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
export function Opacity(imageData, opacity) {
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
export function Binarization(imageData, threshold) {
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
export function Gray(imageData) {
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
 * 转换为灰度
 * r' = g' = b' = ( r + g + b )/3
 * a' = a
 * @param {TypedArray} imageData
 * @return Promise
 */
export function Gray2(imageData) {
  var N = 100 * 500 * 4;
  return new Promise((resolve, reject) => {
    // async way
    function doProcess(pos, len) {
      for(let i = 0; i < len; i += 4) {
        var gray = (imageData[pos + i] + imageData[pos + i + 1] + imageData[pos + i + 2]) / 3;
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
    //   var gray = (imageData[i] + imageData[i+1] + imageData[i+2]) / 3;
    //   imageData[i] = imageData[i+1] = imageData[i+2] = gray;
    // }
    // resolve(imageData);
  });
}
