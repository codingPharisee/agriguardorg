import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sprout, MapPin, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

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
      const { data, error } = await supabase.functions.invoke('crop-recommendations', {
        body: { soilData, location, season }
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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-green-600" />
            Personalized Crop Recommendations
          </CardTitle>
          <p className="text-sm text-gray-600">
            Get AI-powered crop recommendations based on your soil data, location, and weather patterns
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Form */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Location and Season */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Nairobi, Kenya"
                />
              </div>
              <div>
                <Label htmlFor="season" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Season/Time
                </Label>
                <Select value={season} onValueChange={setSeason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dry-season">Dry Season</SelectItem>
                    <SelectItem value="rainy-season">Rainy Season</SelectItem>
                    <SelectItem value="planting-season">Planting Season</SelectItem>
                    <SelectItem value="harvest-season">Harvest Season</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Soil Data */}
            <div className="space-y-4">
              <h3 className="font-medium">Soil Data (Optional)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="ph">pH Level</Label>
                  <Input
                    id="ph"
                    value={soilData.ph || ''}
                    onChange={(e) => handleSoilDataChange('ph', e.target.value)}
                    placeholder="6.5"
                  />
                </div>
                <div>
                  <Label htmlFor="texture">Soil Texture</Label>
                  <Select value={soilData.texture || ''} onValueChange={(value) => handleSoilDataChange('texture', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clay">Clay</SelectItem>
                      <SelectItem value="sandy">Sandy</SelectItem>
                      <SelectItem value="loam">Loam</SelectItem>
                      <SelectItem value="silty">Silty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="nitrogen">Nitrogen (%)</Label>
                  <Input
                    id="nitrogen"
                    value={soilData.nitrogen || ''}
                    onChange={(e) => handleSoilDataChange('nitrogen', e.target.value)}
                    placeholder="2.5"
                  />
                </div>
                <div>
                  <Label htmlFor="phosphorus">Phosphorus (ppm)</Label>
                  <Input
                    id="phosphorus"
                    value={soilData.phosphorus || ''}
                    onChange={(e) => handleSoilDataChange('phosphorus', e.target.value)}
                    placeholder="25"
                  />
                </div>
                <div>
                  <Label htmlFor="potassium">Potassium (ppm)</Label>
                  <Input
                    id="potassium"
                    value={soilData.potassium || ''}
                    onChange={(e) => handleSoilDataChange('potassium', e.target.value)}
                    placeholder="200"
                  />
                </div>
                <div>
                  <Label htmlFor="organic_matter">Organic Matter (%)</Label>
                  <Input
                    id="organic_matter"
                    value={soilData.organic_matter || ''}
                    onChange={(e) => handleSoilDataChange('organic_matter', e.target.value)}
                    placeholder="3.2"
                  />
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={getRecommendations}
            disabled={isAnalyzing}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <TrendingUp className="h-4 w-4 mr-2" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Get Recommendations'}
          </Button>

          {/* Results */}
          {recommendations && (
            <div className="space-y-6">
              {/* Primary Recommendations */}
              {recommendations.primary_recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recommended Crops</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {recommendations.primary_recommendations.map((crop, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">{crop.crop}</h3>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getScoreColor(crop.suitability_score)}`} />
                              <span className="text-sm font-medium">{crop.suitability_score}/10</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">Variety: {crop.variety}</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={getMarketValueColor(crop.market_value)}>
                              {crop.market_value} market value
                            </Badge>
                            <Badge variant="outline">
                              {crop.planting_window}
                            </Badge>
                            <Badge variant="outline">
                              Expected: {crop.expected_yield}
                            </Badge>
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Why this crop:</h4>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                              {crop.reasons.map((reason, idx) => (
                                <li key={idx}>{reason}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Soil Improvements */}
              {recommendations.soil_improvements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      Soil Improvements
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

              {/* Seasonal Calendar */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Activity Calendar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Current Activities:</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {recommendations.seasonal_calendar.current_activities.map((activity, index) => (
                          <li key={index}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-700 mb-2">Next Month:</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {recommendations.seasonal_calendar.next_month.map((activity, index) => (
                          <li key={index}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                    {recommendations.seasonal_calendar.harvest_time && (
                      <div>
                        <h4 className="font-medium text-orange-700 mb-1">Harvest Time:</h4>
                        <p className="text-sm">{recommendations.seasonal_calendar.harvest_time}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Additional Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside text-sm space-y-2">
                      {recommendations.additional_tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CropRecommendations;