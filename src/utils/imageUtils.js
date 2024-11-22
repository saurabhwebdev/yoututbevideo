export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!file) return false;
  return validTypes.includes(file.type);
};

export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}; 