
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AgriFactCheck from '@/components/modules/AgriFactCheck';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const FactCheck = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">AgriFactCheck</h1>
            <p className="text-xl text-muted-foreground">
              AI-powered fact checking for agricultural claims and myths
            </p>
          </div>
          
          <ProtectedRoute>
            <AgriFactCheck />
          </ProtectedRoute>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FactCheck;
