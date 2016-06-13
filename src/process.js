/**
 * 求补（异步）
 * r = 255 - r
 * g = 255 - g
 * b = 255 - b
 * a = a
 * @param {Array} data
 * @return Promise
 */
export function Complement(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      for(let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i+1] = 255 - data[i+1];
        data[i+2] = 255 - data[i+2];
      }
      resolve(data);
    }, 0);
  });
}

/**
 * 线性运算（异步）
 * r = r * x + y
 * g = g * x + y
 * b = b * x + y
 * a = a
 * @param {Array} data
 * @param {Number} x
 * @param {Number} y
 * @return Promise
 */
export function Linear(data, x, y) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      for(let i = 0; i < data.length; i += 4) {
        data[i] = x * data[i] + y;
        data[i+1] = x * data[i+1] + y;
        data[i+2] = x * data[i+2] + y;
      }
      resolve(data);
    }, 0);
  });
}

/**
 * 改变透明度（异步）
 * r = r
 * g = g
 * b = b
 * a = opacity * 255
 * @param {Array} data
 * @param {Number} opacity: 0 ~ 1
 * @return Promise
 */
export function Opacity(data, opacity) {
  opacity = 225 * opacity;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      for (let i = 0; i < data.length; i += 4) {
        data[i+3] = opacity;
      }
      resolve(data);
    }, 0);
  });
}

/**
 * 二值化（异步）
 * r = r < threshold ? 0 : 255
 * g = g < threshold ? 0 : 255
 * b = b < threshold ? 0 : 255
 * a = a
 * @param {Number} threshold
 */
export function Binarization(data, threshold) {
  return Gray(data).then((data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        for(let i = 0; i < data.length; i += 4) {
          data[i] = data[i+1] = data[i+2] = data[i] < threshold ? 0 : 255;
        }
        resolve(data);
      }, 0);
    });
  });
}

/**
 * 转换为灰度（异步）
 * r' = g' = b' = 0.299 * r + 0.587 * g + 0.114 * b
 * a' = a
 * @return Promise
 */
export function Gray(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      for(let i = 0; i < data.length; i += 4) {
        var gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
        data[i] = data[i+1] = data[i+2] = gray;
      }
      resolve(data);
    }, 0);
  });
}

/**
 * 转换为灰度（异步）
 * r = g = b = (r+g+b)/3
 * a = a
 * @return Promise
 */
export function Gray2(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      for(let i = 0; i < data.length; i += 4) {
        var gray = (data[i] + data[i+1] + data[i+2]) / 3;
        data[i] = data[i+1] = data[i+2] = gray;
      }
      resolve(data);
    }, 0);
  });
}
