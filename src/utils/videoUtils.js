import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

let ffmpeg = null;

export const createVideo = async (audioFile, imageUrl, duration, onProgress) => {
  try {
    if (!ffmpeg) {
      ffmpeg = new FFmpeg();
      console.log('Loading FFmpeg...');
      await ffmpeg.load({
        log: true,
        corePath: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/ffmpeg-core.js'
      });
      console.log('FFmpeg loaded');
    }

    // Log progress
    ffmpeg.on('progress', ({ ratio }) => {
      if (onProgress) {
        onProgress(ratio * 100);
      }
    });

    console.log('Writing files...');
    // Write input files
    await ffmpeg.writeFile('audio.mp3', await fetchFile(audioFile));

    // Handle image URL properly
    let imageData;
    if (imageUrl.startsWith('blob:')) {
      // For local uploaded images
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      imageData = await fetchFile(blob);
    } else if (imageUrl.startsWith('http')) {
      // For Pixabay images
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      imageData = await fetchFile(blob);
    } else {
      throw new Error('Invalid image URL');
    }

    await ffmpeg.writeFile('image.jpg', imageData);
    console.log('Files written');

    console.log('Starting FFmpeg processing...');
    // Execute FFmpeg command with specific duration and better quality settings
    await ffmpeg.exec([
      '-loop', '1',
      '-framerate', '30',
      '-i', 'image.jpg',
      '-i', 'audio.mp3',
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-tune', 'stillimage',
      '-crf', '23',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-pix_fmt', 'yuv420p',
      '-shortest',
      '-movflags', '+faststart',
      '-y',
      'output.mp4'
    ]);
    console.log('FFmpeg processing completed');

    // Read the output file
    const data = await ffmpeg.readFile('output.mp4');
    console.log('Output file read, size:', data.length);

    if (data.length === 0) {
      throw new Error('Generated video file is empty');
    }

    // Create blob with proper MIME type and all data
    const blob = new Blob([data.buffer], { type: 'video/mp4' });
    console.log('Blob created, size:', blob.size);

    if (blob.size === 0) {
      throw new Error('Generated video blob is empty');
    }

    // Cleanup files
    try {
      await ffmpeg.deleteFile('audio.mp3');
      await ffmpeg.deleteFile('image.jpg');
      await ffmpeg.deleteFile('output.mp4');
    } catch (e) {
      console.warn('Cleanup error:', e);
    }

    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Detailed error in video creation:', error);
    throw error;
  }
};

export const downloadVideo = (videoUrl, filename = 'music-visualizer.mp4') => {
  try {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  } finally {
    // Clean up the URL after a short delay to ensure download starts
    setTimeout(() => {
      URL.revokeObjectURL(videoUrl);
    }, 1000);
  }
}; 