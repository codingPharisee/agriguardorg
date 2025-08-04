import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GMOGuide from "@/components/gmo/GMOGuide";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, Beaker, Video, Sprout, Network } from "lucide-react";

const Tools = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Agricultural Tools & Resources</h1>
            <Button variant="outline" asChild>
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" /> Return to Homepage
              </Link>
            </Button>
          </div>
          
          {/* Tools Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-5 w-5 text-primary" />
                  ViralFarm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  AI-powered platform for creating viral agricultural content and videos.
                </p>
                <Button asChild size="sm" className="w-full">
                  <Link to="/viral-farm">Open ViralFarm</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  MythBuster Ag
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate educational videos that debunk agricultural myths and misinformation.
                </p>
                <Button asChild size="sm" className="w-full">
                  <Link to="/myth-buster">Open MythBuster</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-primary" />
                  Integrated Ecosystem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Comprehensive agricultural ecosystem management platform.
                </p>
                <Button asChild size="sm" className="w-full" variant="outline">
                  <Link to="/ecosystem">Coming Soon</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* GMO Guide Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Sprout className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">GMO Information Guide</h2>
            </div>
            <p className="text-muted-foreground mb-8 max-w-3xl">
              Comprehensive guide to genetically modified organisms in agriculture. 
              Learn about different GMO crops and animals, their benefits, and the science behind them.
            </p>
          </div>

          <GMOGuide />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Tools;