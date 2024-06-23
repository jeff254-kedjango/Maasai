import Pica from 'pica';

const pica = new Pica();

const resizeImage = (image) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      // Create an off-screen canvas for cropping
      const offScreenCanvas = document.createElement('canvas');
      const offScreenCtx = offScreenCanvas.getContext('2d');
      offScreenCanvas.width = img.width;
      offScreenCanvas.height = img.height;
      offScreenCtx.drawImage(img, 0, 0);

      // Calculate the cropping area to maintain the center
      const size = Math.min(img.width, img.height);
      const offsetX = (img.width - size) / 2;
      const offsetY = (img.height - size) / 2;

      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = 300;
      cropCanvas.height = 300;
      const cropCtx = cropCanvas.getContext('2d');
      cropCtx.drawImage(
        offScreenCanvas,
        offsetX, offsetY, size, size,
        0, 0, 300, 300
      );

      pica
        .resize(cropCanvas, canvas, {
          quality: 3,
          alpha: true,
        })
        .then((result) => pica.toBlob(result, 'image/jpeg', 0.90)) // Adjust the output quality here
        .then((blob) => {
          resolve(blob);
        })
        .catch((error) => {
          reject(error);
        });
    };

    img.onerror = (error) => {
      reject(error);
    };

    img.src = image;
  });
};

export default resizeImage;