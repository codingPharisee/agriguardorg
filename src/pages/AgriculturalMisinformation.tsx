import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, TrendingDown, DollarSign, Clock, Target } from "lucide-react";
import { Link } from "react-router-dom";

const AgriculturalMisinformation = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-red-600 to-orange-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Misinformation in Agriculture
          </h1>
          <p className="text-xl mb-8 text-red-100 max-w-3xl mx-auto">
            Understanding the impact of false information on farming practices and food security
          </p>
        </div>
      </section>

      {/* Key Impact Statistics */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            The Impact of Agricultural Misinformation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-3xl font-bold mb-2">30-50%</div>
              <div className="text-muted-foreground text-sm">Potential crop yield decreases from false practices</div>
            </Card>
            
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-3xl font-bold mb-2">Billions</div>
              <div className="text-muted-foreground text-sm">Economic losses from poor decisions</div>
            </Card>
            
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold mb-2">Seconds</div>
              <div className="text-muted-foreground text-sm">Time for false info to spread online</div>
            </Card>
            
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold mb-2">Solutions</div>
              <div className="text-muted-foreground text-sm">Evidence-based fact checking</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Historical Examples */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Historical Examples
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  Lysenkoism (1928-1964)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Soviet rejection of genetics led to failed agricultural practices and widespread famines.
                </p>
                <Badge variant="destructive">Millions of lives lost</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-orange-800">
                  <Target className="h-5 w-5" />
                  Sparrow Campaign (1958)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Misguided policy to kill sparrows disrupted ecosystems, leading to locust swarms and crop failures.
                </p>
                <Badge variant="secondary">Ecological disaster</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Identify Misinformation */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            How to Identify Agricultural Misinformation
          </h2>
          
          <div className="space-y-6">
            <div className="flex gap-4 p-6 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-2">Verify the Source</h4>
                <p className="text-muted-foreground">Check if information comes from reputable agricultural institutions or peer-reviewed research.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-6 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-2">Look for Evidence</h4>
                <p className="text-muted-foreground">Reliable information is backed by scientific studies and field trials.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-6 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-2">Question Emotional Appeals</h4>
                <p className="text-muted-foreground">Be skeptical of information designed to provoke fear or strong emotions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-br from-green-600 to-blue-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">
            Fight Misinformation with Facts
          </h2>
          <p className="text-lg mb-8 text-green-100">
            Use our fact-checking tools to verify agricultural claims and make informed decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100" asChild>
              <Link to="/fact-check">Start Fact-Checking</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600" asChild>
              <Link to="/tools">Explore Tools</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AgriculturalMisinformation;