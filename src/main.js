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
