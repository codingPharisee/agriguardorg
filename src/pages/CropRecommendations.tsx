import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sprout, MapPin, Calendar, TrendingUp, AlertCircle, Home, ArrowLeft, Thermometer, Droplets, Zap, Leaf, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import agricultureHeroBg from "@/assets/agriculture-hero-bg.jpg";

interface SoilData {
  ph?: string;
  nitrogen?: string;
  phosphorus?: string;
  potassium?: string;
  organic_matter?: string;
  moisture?: string;
  texture?: string;
}

interface CropRecommendation {
  crop: string;
  variety: string;
  suitability_score: number;
  reasons: string[];
  planting_window: string;
  expected_yield: string;
  market_value: 'high' | 'medium' | 'low';
}

interface SoilImprovement {
  issue: string;
  solution: string;
  priority: 'high' | 'medium' | 'low';
}

interface Recommendations {
  primary_recommendations: CropRecommendation[];
  soil_improvements: SoilImprovement[];
  seasonal_calendar: {
    current_activities: string[];
    next_month: string[];
    harvest_time: string;
  };
  additional_tips: string[];
}

const CropRecommendations: React.FC = () => {
  const [soilData, setSoilData] = useState<SoilData>({});
  const [location, setLocation] = useState('');
  const [season, setSeason] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [experience, setExperience] = useState('');
  const [budget, setBudget] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const { toast } = useToast();

  const handleSoilDataChange = (field: keyof SoilData, value: string) => {
    setSoilData(prev => ({ ...prev, [field]: value }));
  };

  const getRecommendations = async () => {
    if (!location && Object.keys(soilData).length === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide at least location or soil data",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const enhancedData = {
        soilData,
        location,
        season,
        farmSize,
        experience,
        budget,
        timestamp: new Date().toISOString()
      };

      const { data, error } = await supabase.functions.invoke('crop-recommendations', {
        body: enhancedData
      });

      if (error) {
        console.error('Crop recommendations error:', error);
        toast({
          title: "Analysis Failed",
          description: "Could not generate recommendations. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setRecommendations(data);
      toast({
        title: "Recommendations Generated",
        description: `Found ${data.primary_recommendations.length} crop recommendations`,
      });
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        title: "Analysis Error",
        description: "Could not generate recommendations. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setSoilData({});
    setLocation('');
    setSeason('');
    setFarmSize('');
    setExperience('');
    setBudget('');
    setRecommendations(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMarketValueColor = (value: string) => {
    switch (value) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center py-16 text-white"
        style={{ backgroundImage: `url(${agricultureHeroBg})` }}
      >
        <div className="absolute inset-0 bg-green-800/70"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sprout className="h-8 w-8" />
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Agricultural Planning Center
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Crop Advisory & Planning Service
            </h1>
            <p className="text-xl mb-6 text-green-50">
              Get expert crop recommendations tailored to your soil conditions, climate, and farming objectives
            </p>
            <div className="flex justify-center">
              <Button variant="outline" asChild className="border-white/30 text-white hover:bg-white/10">
                <Link to="/tools" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Extension Services
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <main className="flex-grow py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid xl:grid-cols-3 gap-8">
              {/* Input Form */}
              <div className="xl:col-span-1 space-y-6">
                <Card className="shadow-lg border-green-100">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <MapPin className="h-5 w-5" />
                      Farm Profile
                    </CardTitle>
                    <p className="text-sm text-green-700 mt-2">
                      Provide your farm details for personalized recommendations
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div>
                      <Label htmlFor="location" className="flex items-center gap-2 text-green-800">
                        <MapPin className="h-4 w-4" />
                        Location *
                      </Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Nakuru County, Kenya"
                        className="border-green-200 focus:border-green-500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="season" className="flex items-center gap-2 text-green-800">
                        <Calendar className="h-4 w-4" />
                        Current Season
                      </Label>
                      <Select value={season} onValueChange={setSeason}>
                        <SelectTrigger className="border-green-200 focus:border-green-500">
                          <SelectValue placeholder="Select growing season" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dry-season">Dry Season</SelectItem>
                          <SelectItem value="rainy-season">Rainy Season</SelectItem>
                          <SelectItem value="planting-season">Planting Season</SelectItem>
                          <SelectItem value="harvest-season">Harvest Season</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="farmSize" className="text-green-800">Farm Size</Label>
                      <Select value={farmSize} onValueChange={setFarmSize}>
                        <SelectTrigger className="border-green-200 focus:border-green-500">
                          <SelectValue placeholder="Select farm size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small Scale (&lt; 1 hectare)</SelectItem>
                          <SelectItem value="medium">Medium Scale (1-5 hectares)</SelectItem>
                          <SelectItem value="large">Large Scale (&gt; 5 hectares)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="experience" className="text-green-800">Farming Experience</Label>
                      <Select value={experience} onValueChange={setExperience}>
                        <SelectTrigger className="border-green-200 focus:border-green-500">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">New Farmer (0-2 years)</SelectItem>
                          <SelectItem value="intermediate">Experienced (3-10 years)</SelectItem>
                          <SelectItem value="experienced">Expert Farmer (&gt; 10 years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="budget" className="text-green-800">Investment Capacity</Label>
                      <Select value={budget} onValueChange={setBudget}>
                        <SelectTrigger className="border-green-200 focus:border-green-500">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Limited Budget</SelectItem>
                          <SelectItem value="medium">Moderate Investment</SelectItem>
                          <SelectItem value="high">High Investment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-green-100">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                      <Thermometer className="h-5 w-5" />
                      Soil Analysis (Optional)
                    </CardTitle>
                    <p className="text-sm text-blue-700 mt-2">
                      Add soil test results for more precise recommendations
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="ph" className="text-blue-800">pH Level</Label>
                        <Input
                          id="ph"
                          value={soilData.ph || ''}
                          onChange={(e) => handleSoilDataChange('ph', e.target.value)}
                          placeholder="6.5"
                          className="border-blue-200 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="texture" className="text-blue-800">Soil Type</Label>
                        <Select value={soilData.texture || ''} onValueChange={(value) => handleSoilDataChange('texture', value)}>
                          <SelectTrigger className="border-blue-200 focus:border-blue-500">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="clay">Clay Soil</SelectItem>
                            <SelectItem value="sandy">Sandy Soil</SelectItem>
                            <SelectItem value="loam">Loam Soil</SelectItem>
                            <SelectItem value="silty">Silty Soil</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="nitrogen" className="text-blue-800">Nitrogen (%)</Label>
                        <Input
                          id="nitrogen"
                          value={soilData.nitrogen || ''}
                          onChange={(e) => handleSoilDataChange('nitrogen', e.target.value)}
                          placeholder="2.5"
                          className="border-blue-200 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phosphorus" className="text-blue-800">Phosphorus (ppm)</Label>
                        <Input
                          id="phosphorus"
                          value={soilData.phosphorus || ''}
                          onChange={(e) => handleSoilDataChange('phosphorus', e.target.value)}
                          placeholder="25"
                          className="border-blue-200 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="potassium" className="text-blue-800">Potassium (ppm)</Label>
                        <Input
                          id="potassium"
                          value={soilData.potassium || ''}
                          onChange={(e) => handleSoilDataChange('potassium', e.target.value)}
                          placeholder="200"
                          className="border-blue-200 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="organic_matter" className="text-blue-800">Organic Matter (%)</Label>
                        <Input
                          id="organic_matter"
                          value={soilData.organic_matter || ''}
                          onChange={(e) => handleSoilDataChange('organic_matter', e.target.value)}
                          placeholder="3.2"
                          className="border-blue-200 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="pt-4 space-y-3">
                      <Button
                        onClick={getRecommendations}
                        disabled={isAnalyzing}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isAnalyzing ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <BarChart3 className="h-4 w-4 mr-2" />
                        )}
                        {isAnalyzing ? 'Analyzing Farm Data...' : 'Get Crop Recommendations'}
                      </Button>
                      
                      <Button
                        onClick={resetForm}
                        variant="outline"
                        className="w-full border-green-300 text-green-700 hover:bg-green-50"
                      >
                        Reset Form
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Results */}
              <div className="xl:col-span-2">
                {!recommendations && !isAnalyzing && (
                  <Card className="h-96 flex items-center justify-center shadow-lg border-green-100">
                    <div className="text-center text-green-600">
                      <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                        <Sprout className="h-8 w-8 text-green-600" />
                      </div>
                      <p className="text-xl mb-2 font-medium">Agricultural Planning Ready</p>
                      <p className="text-sm text-green-700">Complete your farm profile to receive expert crop recommendations</p>
                    </div>
                  </Card>
                )}

                {isAnalyzing && (
                  <Card className="h-96 flex items-center justify-center shadow-lg border-green-100">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                      </div>
                      <p className="text-xl mb-2 font-medium text-green-800">Analyzing Your Farm Profile...</p>
                      <p className="text-sm text-green-700">Our agricultural specialists are preparing your recommendations</p>
                    </div>
                  </Card>
                )}

                {recommendations && (
                  <div className="space-y-6">
                    {/* Primary Recommendations */}
                    {recommendations.primary_recommendations.length > 0 && (
                      <Card className="shadow-lg border-green-100">
                        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                          <CardTitle className="text-xl flex items-center gap-2 text-green-800">
                            <TrendingUp className="h-6 w-6" />
                            Recommended Crops for Your Farm
                          </CardTitle>
                          <p className="text-sm text-green-700 mt-2">
                            Expert-selected crops based on your conditions and goals
                          </p>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <ScrollArea className="max-h-96">
                            <div className="grid gap-4">
                              {recommendations.primary_recommendations.map((crop, index) => (
                                <div key={index} className="border rounded-lg p-4 space-y-3 hover:bg-green-50/50 border-green-200">
                                  <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-lg text-green-800">{crop.crop}</h3>
                                    <div className="flex items-center gap-2">
                                      <div className={`w-4 h-4 rounded-full ${getScoreColor(crop.suitability_score)}`} />
                                      <span className="text-sm font-medium text-green-700">{crop.suitability_score}/10 Match</span>
                                    </div>
                                  </div>
                                  <p className="text-sm text-green-700">
                                    <strong>Recommended Variety:</strong> {crop.variety}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    <Badge className={getMarketValueColor(crop.market_value)}>
                                      {crop.market_value} Market Value
                                    </Badge>
                                    <Badge variant="outline" className="border-green-300 text-green-700">
                                      Plant: {crop.planting_window}
                                    </Badge>
                                    <Badge variant="outline" className="border-blue-300 text-blue-700">
                                      Yield: {crop.expected_yield}
                                    </Badge>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-green-800 mb-2">Why This Crop:</h4>
                                    <ul className="space-y-1">
                                      {crop.reasons.map((reason, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-green-700">
                                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                                          <span>{reason}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    )}

                    {/* Soil Improvements */}
                    {recommendations.soil_improvements.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-orange-600" />
                            Soil Enhancement Recommendations
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {recommendations.soil_improvements.map((improvement, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                                <Badge className={getPriorityColor(improvement.priority)}>
                                  {improvement.priority}
                                </Badge>
                                <div className="flex-1">
                                  <h4 className="font-medium">{improvement.issue}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{improvement.solution}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Activity Calendar and Tips */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            Farming Calendar
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                              <Zap className="h-4 w-4" />
                              Current Activities:
                            </h4>
                            <ul className="space-y-1">
                              {recommendations.seasonal_calendar.current_activities.map((activity, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                                  <span>{activity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-700 mb-2 flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Next Month:
                            </h4>
                            <ul className="space-y-1">
                              {recommendations.seasonal_calendar.next_month.map((activity, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                  <span>{activity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {recommendations.seasonal_calendar.harvest_time && (
                            <div>
                              <h4 className="font-medium text-orange-700 mb-1 flex items-center gap-2">
                                <Sprout className="h-4 w-4" />
                                Harvest Time:
                              </h4>
                              <p className="text-sm">{recommendations.seasonal_calendar.harvest_time}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Droplets className="h-5 w-5 text-green-600" />
                            Expert Tips
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {recommendations.additional_tips.map((tip, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Disclaimer */}
                    <Card className="bg-gray-50 border-gray-200">
                      <CardContent className="pt-6">
                        <p className="text-sm text-gray-600">
                          <strong>Disclaimer:</strong> These recommendations are AI-generated based on the information provided. 
                          Local conditions, market fluctuations, and other factors may affect actual results. 
                          Always consult with local agricultural extension services and experienced farmers in your area.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CropRecommendations;
