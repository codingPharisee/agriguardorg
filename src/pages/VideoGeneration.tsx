
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import VideoGenerator from '@/components/video/VideoGenerator';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const VideoGeneration: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">MythBuster AI</h1>
            <p className="text-xl text-muted-foreground">
              Create AI-generated videos to debunk agricultural myths
            </p>
          </div>
          
          <ProtectedRoute>
            <VideoGenerator />
          </ProtectedRoute>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VideoGeneration;
