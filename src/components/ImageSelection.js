import React, { useState } from 'react';
import { searchPixabayImages } from '../services/pixabayService';

const ImageSelection = ({ onImageSelect }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPixabayMode, setIsPixabayMode] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('music');
  const [pixabayImages, setPixabayImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (file && allowedTypes.includes(file.type)) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      onImageSelect(imageUrl);
      setError('');
    } else {
      setError('Please upload a valid image file (JPEG, PNG)');
      setSelectedImage(null);
      onImageSelect(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handlePixabaySearch = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await searchPixabayImages(searchQuery);
      setPixabayImages(data.hits);
    } catch (err) {
      setError('Failed to fetch images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectPixabayImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    onImageSelect(imageUrl);
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-card transition-all duration-300 hover:shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
          Select Background Image
        </h2>
        <p className="text-gray-500 mb-6">Choose an image or search from Pixabay</p>
        
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-8 py-3 rounded-xl transition-all duration-300 transform ${
              !isPixabayMode 
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white scale-105 shadow-glow' 
                : 'bg-gray-100 hover:bg-gray-200 hover:scale-105'
            }`}
            onClick={() => setIsPixabayMode(false)}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Upload Image</span>
            </div>
          </button>
          <button
            className={`px-8 py-3 rounded-xl transition-all duration-300 transform ${
              isPixabayMode 
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white scale-105 shadow-glow' 
                : 'bg-gray-100 hover:bg-gray-200 hover:scale-105'
            }`}
            onClick={() => {
              setIsPixabayMode(true);
              handlePixabaySearch();
            }}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search Pixabay</span>
            </div>
          </button>
        </div>

        {!isPixabayMode ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 transition-all duration-300 
              ${isDragging
                ? 'border-violet-500 bg-violet-50 shadow-glow'
                : 'border-gray-200 hover:border-violet-400 hover:bg-violet-50/30'
              }
              ${selectedImage ? 'border-green-500/50 bg-green-50/50' : ''}
            `}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center
                ${isDragging 
                  ? 'bg-violet-100 text-violet-600' 
                  : 'bg-gray-100 text-gray-400 group-hover:bg-violet-100 group-hover:text-violet-600'
                } transition-all duration-300`}
              >
                <svg
                  className="w-8 h-8 transform transition-transform group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-gray-600 group-hover:text-violet-600 transition-colors duration-300">
                {isDragging ? 'Drop your image here' : 'Click to browse or drag & drop'}
              </span>
              <span className="text-sm text-gray-400 mt-2">
                Supports JPEG and PNG formats
              </span>
            </label>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePixabaySearch()}
                  placeholder="Search images..."
                  className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300"
                />
                <svg 
                  className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                onClick={handlePixabaySearch}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </span>
                ) : (
                  'Search'
                )}
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {pixabayImages.map((image) => (
                <div
                  key={image.id}
                  className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105"
                  onClick={() => selectPixabayImage(image.largeImageURL)}
                >
                  <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300">
                    <img
                      src={image.previewURL}
                      alt={image.tags}
                      className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-2 left-2 right-2 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {image.tags.split(',')[0]}
                    </div>
                  </div>
                  {selectedImage === image.largeImageURL && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 animate-fade-in bg-red-50 text-red-500 p-3 rounded-xl flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        )}
        
        {selectedImage && (
          <div className="mt-6 animate-fade-in">
            <div className="relative group rounded-xl overflow-hidden shadow-lg">
              <img
                src={selectedImage}
                alt="Selected background"
                className="w-full h-auto rounded-xl transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <button
                onClick={() => {
                  setSelectedImage(null);
                  onImageSelect(null);
                }}
                className="absolute bottom-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 transform hover:scale-110 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSelection; 