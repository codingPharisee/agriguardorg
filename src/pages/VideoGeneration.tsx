import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import VideoGenerator from '@/components/video/VideoGenerator';
import { VideoUploadManager } from '@/components/video/VideoUploadManager';
import MythBusterAg from '@/components/modules/MythBusterAg';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useAuth } from '@/contexts/AuthContext';

const VideoGeneration: React.FC = () => {
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const { user, loading: authLoading } = useAuth();

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-12 flex items-center justify-center">
          <div>Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Agriguard At a glance</h1>
            
            <Tabs defaultValue="view" className="w-full">
              <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-3' : 'grid-cols-1'}`}>
                <TabsTrigger value="view">Agriguard At a glance</TabsTrigger>
                {isAdmin && <TabsTrigger value="upload">Upload Videos</TabsTrigger>}
                {isAdmin && <TabsTrigger value="generate">Generate Videos</TabsTrigger>}
              </TabsList>
              
              <TabsContent value="view" className="mt-6">
                <MythBusterAg />
              </TabsContent>
              
              {isAdmin && (
                <TabsContent value="upload" className="mt-6">
                  <VideoUploadManager />
                </TabsContent>
              )}
              
              {isAdmin && (
                <TabsContent value="generate" className="mt-6">
                  <VideoGenerator />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VideoGeneration;