import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import VideoGenerator from '@/components/video/VideoGenerator';
import { VideoUploadManager } from '@/components/video/VideoUploadManager';
import MythBusterAg from '@/components/modules/MythBusterAg';

const VideoGeneration: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Video Management Center</h1>
            
            <Tabs defaultValue="view" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="view">View Videos</TabsTrigger>
                <TabsTrigger value="upload">Upload Videos</TabsTrigger>
                <TabsTrigger value="generate">Generate Videos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="view" className="mt-6">
                <MythBusterAg />
              </TabsContent>
              
              <TabsContent value="upload" className="mt-6">
                <VideoUploadManager />
              </TabsContent>
              
              <TabsContent value="generate" className="mt-6">
                <VideoGenerator />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VideoGeneration;