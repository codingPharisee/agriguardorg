
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ViralFarm from '@/components/modules/ViralFarm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const ViralFarmPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">ViralFarm Monitor</h1>
            <p className="text-xl text-muted-foreground">
              Real-time detection and tracking of agricultural misinformation
            </p>
          </div>
          
          <ProtectedRoute>
            <ViralFarm fullPage={true} />
          </ProtectedRoute>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ViralFarmPage;
