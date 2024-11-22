import React, { useState } from 'react';
import { validateAudioFile, formatFileSize } from '../utils/audioUtils';
import AudioWaveform from './AudioWaveform';

const AudioUpload = ({ onAudioSelect }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleAudioUpload = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file && validateAudioFile(file)) {
      setAudioFile(file);
      onAudioSelect(file);
      setError('');
    } else {
      setError('Please upload a valid MP3 or WAV file');
      setAudioFile(null);
      onAudioSelect(null);
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

  const removeAudio = () => {
    setAudioFile(null);
    onAudioSelect(null);
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-card transition-all duration-300 hover:shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
          Upload Audio
        </h2>
        <p className="text-gray-500 mb-6">Select or drag & drop your audio file</p>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 transition-all duration-300 
            ${isDragging
              ? 'border-violet-500 bg-violet-50 shadow-glow'
              : 'border-gray-200 hover:border-violet-400 hover:bg-violet-50/30'
            }
            ${audioFile ? 'border-green-500/50 bg-green-50/50' : ''}
          `}
        >
          <input
            type="file"
            accept=".mp3,.wav"
            onChange={handleAudioUpload}
            className="hidden"
            id="audio-upload"
          />
          <label
            htmlFor="audio-upload"
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <span className="text-gray-600 group-hover:text-violet-600 transition-colors duration-300">
              {isDragging ? 'Drop your audio file here' : 'Click to browse or drag & drop'}
            </span>
            <span className="text-sm text-gray-400 mt-2">
              Supports MP3 and WAV formats
            </span>
          </label>
        </div>

        {error && (
          <div className="mt-4 animate-fade-in bg-red-50 text-red-500 p-3 rounded-lg flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        )}
        
        {audioFile && (
          <div className="mt-6 animate-fade-in">
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-green-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="font-medium">
                    {audioFile.name} ({formatFileSize(audioFile.size)})
                  </p>
                </div>
                <button
                  onClick={removeAudio}
                  className="p-1 hover:bg-green-100 rounded-full transition-colors duration-300"
                >
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <AudioWaveform audioFile={audioFile} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioUpload; 