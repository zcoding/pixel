function getAsyncProcessingPromise(processing, N) {
  N = N || 100 * 500 * 4;
  return function asyncProcessing(imageData) {
    var $rest = Array.prototype.slice.call(arguments, 1);
    return new Promise((resolve, reject) => {
      function doProcess(pos, len) {
        for(let i = 0; i < len; i += 4) {
          processing(imageData, pos + i, $rest);
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
    });
  };
}

/**
 * Complement
 * r' = 255 - r
 * g' = 255 - g
 * b' = 255 - b
 * a' = a
 * @param {TypedArray} imageData
 * @return Promise
 */
export let Complement = getAsyncProcessingPromise(function asyncProcessingComplement(imageData, pos) {
  imageData[pos] = 255 - imageData[pos];
  imageData[pos + 1] = 255 - imageData[pos + 1];
  imageData[pos + 2] = 255 - imageData[pos + 2];
});

/**
 * Linear
 * r' = r * x + y
 * g' = g * x + y
 * b' = b * x + y
 * a' = a
 * @param {TypedArray} imageData
 * @param {Number} x
 * @param {Number} y
 * @return Promise
 */
export let Linear = getAsyncProcessingPromise(function asyncProcessingLinear(imageData, pos, $rest) {
  imageData[pos] = $rest[0] * imageData[pos] + $rest[1];
  imageData[pos + 1] = $rest[0] * imageData[pos + 1] + $rest[1];
  imageData[pos + 2] = $rest[0] * imageData[pos + 2] + $rest[1];
});

/**
 * Opacity
 * r' = r
 * g' = g
 * b' = b
 * a' = opacity * 255
 * @param {TypedArray} imageData
 * @param {Number} opacity: 0 ~ 1
 * @return Promise
 */
export let Opacity = getAsyncProcessingPromise(function asyncProcessingOpacity(imageData, pos, $rest) {
  imageData[pos + 3] = 255 * $rest[0];
});

/**
 * Binarization
 * c' = c < threshold ? 0 : 255
 * a' = a
 * @param {TypedArray} imageData
 * @param {Number} threshold
 * @return Promise
 */
export let Binarization = getAsyncProcessingPromise(function asyncProcessingBinarization(imageData, pos, $rest) {
  var gray = 0.299 * imageData[pos] + 0.587 * imageData[pos + 1] + 0.114 * imageData[pos + 2];
  imageData[pos] = imageData[pos + 1] = imageData[pos + 2] = gray < $rest[0] ? 0 : 255;
});

/**
 * Gray
 * r' = g' = b' = 0.299 * r + 0.587 * g + 0.114 * b
 * a' = a
 * @param {TypedArray} imageData
 * @return Promise
 */
export let Gray = getAsyncProcessingPromise(function asyncProcessingGray(imageData, pos) {
  var gray = 0.299 * imageData[pos] + 0.587 * imageData[pos + 1] + 0.114 * imageData[pos + 2];
  imageData[pos] = imageData[pos + 1] = imageData[pos + 2] = gray;
});

/**
 * Gray
 * r' = g' = b' = ( r + g + b ) / 3
 * a' = a
 * @param {TypedArray} imageData
 * @return Promise
 */
export let Gray2 = getAsyncProcessingPromise(function asyncProcessingGray(imageData, pos) {
  var gray = (imageData[pos] + imageData[pos + 1] + imageData[pos + 2]) / 3;
  imageData[pos] = imageData[pos + 1] = imageData[pos + 2] = gray;
});
