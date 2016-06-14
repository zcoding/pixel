import Canvas from './canvas';
import {
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
} from './const';

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

/**
 * saveImage
 * @param {Pixel.Canvas} canvas
 * @return {Promise}
 */
function saveImage(canvas) {
  return new Promise((resolve, reject) => {
    var src = canvas.save();
    var image = new Image();
    image.addEventListener('load', function() {
      resolve(image);
    }, false);
    image.addEventListener('error', function() {
      reject(new Error("Cannot load image"));
    }, false);
    image.src = src;
  });
}

export default {
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
