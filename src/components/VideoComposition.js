import React, { useState, useRef } from 'react';
import { createVideo, downloadVideo } from '../utils/videoUtils';
import VisualizerPreview from './VisualizerPreview';

const VideoComposition = ({ audioFile, selectedImage }) => {
  const [textOverlay, setTextOverlay] = useState('');
  const [textPosition, setTextPosition] = useState('center');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textSize, setTextSize] = useState('medium');
  const [visualizerStyle, setVisualizerStyle] = useState('bars');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportError, setExportError] = useState('');
  const previewRef = useRef(null);

  const textSizes = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl'
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportError('');
      setExportProgress(0);

      const videoUrl = await createVideo(
        audioFile,
        selectedImage,
        audioFile.duration,
        (progress) => setExportProgress(Math.round(progress * 100))
      );

      downloadVideo(videoUrl, `${audioFile.name.split('.')[0]}-visualizer.mp4`);
    } catch (error) {
      setExportError('Failed to create video. Please try again.');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-card transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
        Video Composition
      </h2>
      <p className="text-gray-500 mb-6">Customize your video appearance</p>
      
      {/* Preview Window */}
      <div 
        ref={previewRef}
        className="relative w-full aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden mb-8 shadow-lg group"
      >
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {audioFile && (
          <VisualizerPreview
            style={visualizerStyle}
            audioFile={audioFile}
          />
        )}
        {textOverlay && (
          <div className={`absolute inset-0 flex items-${textPosition} justify-center p-4 backdrop-blur-sm bg-black/10`}>
            <h3
              className={`${textSizes[textSize]} font-bold tracking-wider drop-shadow-lg transition-all duration-300 hover:scale-105`}
              style={{ color: textColor }}
            >
              {textOverlay}
            </h3>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Text Controls */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-xl shadow-inner-glow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center space-x-2">
              <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Text Overlay</span>
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                value={textOverlay}
                onChange={(e) => setTextOverlay(e.target.value)}
                placeholder="Enter text overlay"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Position
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['start', 'center', 'end'].map((position) => (
                    <button
                      key={position}
                      onClick={() => setTextPosition(position)}
                      className={`px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        textPosition === position
                          ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-glow'
                          : 'bg-white hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {position}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(textSizes).map((size) => (
                    <button
                      key={size}
                      onClick={() => setTextSize(size)}
                      className={`px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        textSize === size
                          ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-glow'
                          : 'bg-white hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <div className="flex gap-4">
                  <div className="relative group">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-14 h-14 rounded-xl cursor-pointer border-2 border-gray-200 group-hover:border-violet-400 transition-colors duration-300"
                    />
                    <div className="absolute inset-0 rounded-xl shadow-inner pointer-events-none"></div>
                  </div>
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visualizer Controls */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-xl shadow-inner-glow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center space-x-2">
              <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Visualizer Style</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {['bars', 'circular', 'dna', 'starfield', 'matrix'].map((style) => (
                <button
                  key={style}
                  onClick={() => setVisualizerStyle(style)}
                  className={`group px-4 py-4 rounded-xl transition-all duration-300 ${
                    visualizerStyle === style
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-glow transform scale-105'
                      : 'bg-white hover:bg-gray-50 border border-gray-200 hover:scale-105'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <span className={`text-lg font-medium ${visualizerStyle === style ? 'text-white' : 'text-gray-700'}`}>
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Export Button */}
            <div className="mt-8">
              <button
                onClick={handleExport}
                disabled={isExporting || !audioFile || !selectedImage}
                className={`w-full py-4 rounded-xl font-semibold shadow-lg transform transition-all duration-300
                  ${isExporting || !audioFile || !selectedImage
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 hover:scale-105 hover:shadow-glow'
                  }`}
              >
                {isExporting ? (
                  <div className="flex flex-col items-center">
                    <span className="flex items-center mb-2">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating your video...
                    </span>
                    <div className="w-full bg-violet-200 rounded-full h-2 max-w-xs mx-auto">
                      <div 
                        className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${exportProgress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Export Video</span>
                  </span>
                )}
              </button>
              {exportError && (
                <p className="text-red-500 text-sm mt-2 text-center animate-fade-in">
                  {exportError}
                </p>
              )}
              {(!audioFile || !selectedImage) && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Please upload both audio and image to export
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoComposition; 