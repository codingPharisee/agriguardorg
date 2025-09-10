import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, BookOpen, Users, Target, CheckCircle, XCircle, TrendingDown, DollarSign, Clock, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const AgriculturalMisinformation = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-red-600 to-orange-600 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              The True Cost of Agricultural Misinformation
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100 max-w-4xl mx-auto leading-relaxed">
              Understanding How False Information Impacts Food Security, Farmer Livelihoods, and Global Agriculture
            </p>
            <p className="text-lg text-red-100 max-w-3xl mx-auto">
              From historical famines caused by pseudoscience to modern social media myths affecting crop yields, 
              agricultural misinformation has measurable impacts on our food systems and economy.
            </p>
          </div>
        </div>
      </section>

      {/* Key Impact Statistics */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            The Measurable Impact of Agricultural Misinformation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg border-2 border-gray-200">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">Millions</div>
              <div className="text-gray-600">Lives lost to historical agricultural misinformation campaigns</div>
            </div>
            
            <div className="text-center p-8 bg-white rounded-xl shadow-lg border-2 border-gray-200">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingDown className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">30-50%</div>
              <div className="text-gray-600">Crop yield decreases from following false agricultural practices</div>
            </div>
            
            <div className="text-center p-8 bg-white rounded-xl shadow-lg border-2 border-gray-200">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">Billions</div>
              <div className="text-gray-600">Economic losses from misinformation-driven agricultural decisions</div>
            </div>
            
            <div className="text-center p-8 bg-white rounded-xl shadow-lg border-2 border-gray-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">Seconds</div>
              <div className="text-gray-600">Time it takes for false information to spread on social media</div>
            </div>
          </div>
        </div>
      </section>

      {/* Historical Case Studies */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Historical Case Studies: When Misinformation Becomes Catastrophe
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="border-2 border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-red-800">
                  <AlertTriangle className="h-6 w-6" />
                  Lysenkoism (1928-1964)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700 leading-relaxed">
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">The False Promise</h4>
                  <p>Soviet agronomist Trofim Lysenko claimed crops could be "educated" to adapt to their environment, rejecting genetics and evolution.</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">The Catastrophic Result</h4>
                  <p>Forced implementation led to dramatic crop yield decreases and famines that cost millions of lives across the Soviet Union.</p>
                </div>
                <Badge variant="destructive" className="text-sm">Economic Impact: Massive agricultural collapse</Badge>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-orange-800">
                  <Target className="h-6 w-6" />
                  Chinese Sparrow Campaign (1958)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700 leading-relaxed">
                <div className="bg-white p-4 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">The Misguided Policy</h4>
                  <p>Farmers were ordered to kill sparrows believing they consumed too much grain, disrupting the natural ecosystem.</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">The Ecological Disaster</h4>
                  <p>Without natural predators, locust swarms devastated crops, contributing to one of history's largest famines.</p>
                </div>
                <Badge variant="secondary" className="text-sm bg-orange-100 text-orange-800">Impact: 15-45 million deaths</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Modern Misinformation Challenges */}
      <section className="py-20 px-4 bg-blue-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Modern Agricultural Misinformation: The Social Media Age
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="text-xl text-blue-800">Viral Food Myths</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">False claims about "superfoods" and "cancer-causing" foods spread rapidly on social platforms.</p>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <p className="font-semibold text-blue-800">Example: Canadian Buttergate (2021)</p>
                  <p className="text-sm text-blue-700">Social media myth about palm oil in cow feed led to significant economic losses for dairy farmers.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200">
              <CardHeader>
                <CardTitle className="text-xl text-green-800">GMO Misinformation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">False claims about genetically modified crops create fear and resistance to beneficial agricultural innovations.</p>
                <div className="bg-green-100 p-3 rounded-lg">
                  <p className="font-semibold text-green-800">Impact: Reduced Adoption</p>
                  <p className="text-sm text-green-700">Countries ban beneficial crops due to misinformation, limiting food security improvements.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="text-xl text-purple-800">Pesticide Panic</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">Exaggerated or false claims about agricultural chemicals lead to poor farming decisions.</p>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <p className="font-semibold text-purple-800">Consequence: Crop Losses</p>
                  <p className="text-sm text-purple-700">Farmers avoid effective treatments, leading to increased pest damage and yield losses.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Framework */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Evidence-Based Solutions: Building Information Literacy
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Critical Evaluation Framework</h3>
              <div className="space-y-6">
                <div className="flex gap-4 p-6 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Verify the Source</h4>
                    <p className="text-gray-700">Research the author's credentials and check if the information comes from reputable agricultural institutions.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-6 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Cross-Reference Information</h4>
                    <p className="text-gray-700">Compare claims across multiple reliable sources and look for peer-reviewed research supporting the information.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-6 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Question Emotional Appeals</h4>
                    <p className="text-gray-700">Be skeptical of information designed to provoke strong emotional reactions or fear-based responses.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-6 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Seek Multiple Perspectives</h4>
                    <p className="text-gray-700">Read diverse viewpoints and avoid sources that only confirm your existing beliefs.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Agricultural Science Fundamentals</h3>
              <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="p-4 bg-white rounded-lg border">
                      <h4 className="font-semibold text-gray-900 mb-2">Agri-food Sector</h4>
                      <p className="text-gray-700 text-sm">Includes primary food production, processing, distribution, and consumption of agricultural products.</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border">
                      <h4 className="font-semibold text-gray-900 mb-2">Evidence-Based Agriculture</h4>
                      <p className="text-gray-700 text-sm">Agricultural practices supported by scientific research, field trials, and peer-reviewed studies.</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border">
                      <h4 className="font-semibold text-gray-900 mb-2">Agricultural Extension</h4>
                      <p className="text-gray-700 text-sm">Services that help farmers apply scientific knowledge to real-world farming situations.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-br from-black to-green-800 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Ready to Combat Agricultural Misinformation?
          </h2>
          <p className="text-lg mb-12 text-green-200">
            Join our network of agricultural experts, extension officers, and farmers to help build a more informed and prosperous farming community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-black hover:bg-green-100 px-8 py-4 text-lg" asChild>
              <Link to="/fact-check">Get Started Today</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black px-8 py-4 text-lg" asChild>
              <Link to="/tools">Explore All Tools</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AgriculturalMisinformation;