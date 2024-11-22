import React, { useEffect, useRef } from 'react';

const VisualizerPreview = ({ style, audioFile }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);

  useEffect(() => {
    if (!audioFile || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    
    analyserRef.current.fftSize = 256;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const audioBuffer = await audioContextRef.current.decodeAudioData(e.target.result);
      sourceRef.current = audioContextRef.current.createBufferSource();
      sourceRef.current.buffer = audioBuffer;
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      sourceRef.current.start();
    };
    reader.readAsArrayBuffer(audioFile);

    const drawBars = () => {
      const width = canvas.width;
      const height = canvas.height;
      const barWidth = width / bufferLength * 2.5;

      analyserRef.current.getByteFrequencyData(dataArray);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, width, height);

      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height;
        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, '#7c3aed');
        gradient.addColorStop(1, '#c4b5fd');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    const drawCircularSpectrum = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 3;

      analyserRef.current.getByteFrequencyData(dataArray);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < bufferLength; i++) {
        const amplitude = dataArray[i] / 255;
        const angle = (i / bufferLength) * Math.PI * 2;
        const barHeight = amplitude * radius;
        
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barHeight);
        const y2 = centerY + Math.sin(angle) * (radius + barHeight);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `hsl(${(i / bufferLength) * 360}, 70%, 50%)`;
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    };

    const drawDNAHelix = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, width, height);

      const time = Date.now() * 0.001;
      const points = 50;
      
      for (let i = 0; i < points; i++) {
        const amplitude = dataArray[i % bufferLength] / 255;
        const y = (i / points) * height;
        const offset = Math.sin(time + i * 0.2) * 100 * amplitude;
        
        ctx.beginPath();
        ctx.arc(width/2 - offset, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${(i / points) * 360}, 70%, 50%)`;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(width/2 + offset, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${(i / points) * 360}, 70%, 50%)`;
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(width/2 - offset, y);
        ctx.lineTo(width/2 + offset, y);
        ctx.strokeStyle = `rgba(124, 58, 237, ${amplitude * 0.5})`;
        ctx.stroke();
      }
    };

    const drawStarfield = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, width, height);

      const avgFrequency = dataArray.reduce((a, b) => a + b) / bufferLength;
      const speed = avgFrequency / 255 * 5;

      for (let i = 0; i < bufferLength; i++) {
        const amplitude = dataArray[i] / 255;
        const angle = (i / bufferLength) * Math.PI * 2;
        const distance = (Date.now() * speed * 0.001 + i) % (width/2);
        
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        const size = amplitude * 3;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${1 - distance/(width/2)})`;
        ctx.fill();
      }
    };

    const drawMatrixRain = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      const fontSize = 15;
      const columns = width / fontSize;
      
      for (let i = 0; i < columns; i++) {
        const amplitude = dataArray[i % bufferLength] / 255;
        const y = (Date.now() * 0.01 * amplitude + i * fontSize) % height;
        
        const char = String.fromCharCode(0x30A0 + Math.random() * 96);
        ctx.fillStyle = `rgba(124, 58, 237, ${amplitude})`;
        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(char, i * fontSize, y);
      }
    };

    const animate = () => {
      switch (style) {
        case 'bars':
          drawBars();
          break;
        case 'circular':
          drawCircularSpectrum();
          break;
        case 'dna':
          drawDNAHelix();
          break;
        case 'starfield':
          drawStarfield();
          break;
        case 'matrix':
          drawMatrixRain();
          break;
        default:
          drawBars();
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (sourceRef.current) {
        sourceRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [style, audioFile]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      width={800}
      height={600}
    />
  );
};

export default VisualizerPreview; 