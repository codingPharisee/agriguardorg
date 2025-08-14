import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import VideoGenerator from '@/components/video/VideoGenerator';

const VideoGeneration: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <VideoGenerator />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VideoGeneration;