import { useState } from 'react';
import './App.css';
import AudioUpload from './components/AudioUpload';
import ImageSelection from './components/ImageSelection';
import VideoComposition from './components/VideoComposition';

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-violet-50 to-purple-50">
      <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-violet-100">
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600 animate-gradient">
              Music Visualizer Creator
            </h1>
            <p className="text-gray-600 mt-3 text-lg animate-fade-in">
              Transform your music into stunning visual experiences
            </p>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto py-12 px-4 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="transform hover:scale-[1.01] transition-all duration-300">
            <AudioUpload onAudioSelect={setAudioFile} />
          </div>
          <div className="transform hover:scale-[1.01] transition-all duration-300">
            <ImageSelection onImageSelect={setSelectedImage} />
          </div>
        </div>
        
        {(audioFile || selectedImage) && (
          <div className="animate-fade-in">
            <VideoComposition
              audioFile={audioFile}
              selectedImage={selectedImage}
            />
          </div>
        )}
      </main>

      <footer className="bg-white/90 backdrop-blur-md border-t border-violet-100 mt-12">
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="text-center space-y-4">
            <div className="text-gray-600 text-lg font-medium">
              Create amazing music visualizations for your videos
            </div>
            <div className="flex justify-center items-center space-x-8">
              <button className="text-gray-500 hover:text-violet-600 transition-colors hover:scale-105 transform duration-200">
                About
              </button>
              <span className="text-gray-300">|</span>
              <button className="text-gray-500 hover:text-violet-600 transition-colors hover:scale-105 transform duration-200">
                Help
              </button>
              <span className="text-gray-300">|</span>
              <button className="text-gray-500 hover:text-violet-600 transition-colors hover:scale-105 transform duration-200">
                Contact
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
