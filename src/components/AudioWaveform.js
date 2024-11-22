import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

const AudioWaveform = ({ audioFile }) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (audioFile) {
      // Create WaveSurfer instance
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#8b5cf6',
        progressColor: '#4c1d95',
        cursorColor: '#4c1d95',
        barWidth: 2,
        barRadius: 3,
        cursorWidth: 1,
        height: 100,
        barGap: 3,
      });

      // Load audio file
      wavesurfer.current.loadBlob(audioFile);

      // Add event listeners
      wavesurfer.current.on('ready', () => {
        setDuration(wavesurfer.current.getDuration());
      });

      wavesurfer.current.on('audioprocess', () => {
        setCurrentTime(wavesurfer.current.getCurrentTime());
      });

      wavesurfer.current.on('finish', () => {
        setIsPlaying(false);
      });

      // Cleanup
      return () => {
        wavesurfer.current.destroy();
      };
    }
  }, [audioFile]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <div ref={waveformRef} className="w-full" />
      </div>
      
      <div className="flex items-center justify-between">
        <button
          onClick={handlePlayPause}
          className="px-4 py-2 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition-colors"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        
        <div className="text-sm text-gray-600">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
};

export default AudioWaveform; 