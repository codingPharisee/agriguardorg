import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Loader2, Bug, AlertTriangle, CheckCircle, Eye, Home, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";

interface PestAnalysis {
  identified: boolean;
  type: 'pest' | 'disease' | 'nutrient_deficiency' | 'healthy' | 'unknown' | 'error';
  name: string;
  confidence: number;
  description: string;
  symptoms: string[];
  treatment: {
    immediate: string;
    preventive: string;
    organic: string;
    chemical: string;
  };
  severity: 'low' | 'medium' | 'high' | 'unknown';
  crop_affected: string;
}

const PestIdentification: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PestAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 10MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
      setAnalysis(null);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('pest-identification', {
        body: { image: selectedImage }
      });

      if (error) {
        console.error('Pest identification error:', error);
        toast({
          title: "Analysis Failed",
          description: "Could not analyze the image. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setAnalysis(data);
      toast({
        title: "Analysis Complete",
        description: `Analysis completed with ${data.confidence}% confidence`,
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Analysis Error",
        description: "Could not analyze the image. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysis(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pest':
        return <Bug className="h-5 w-5" />;
      case 'disease':
        return <AlertTriangle className="h-5 w-5" />;
      case 'healthy':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Eye className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pest':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'disease':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'nutrient_deficiency':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <Button variant="outline" asChild>
                  <Link to="/tools" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Tools
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Bug className="h-8 w-8 text-green-600" />
                    AI Pest & Disease Identification
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Upload or capture images of your crops to identify pests, diseases, and plant health issues
                  </p>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" /> Home
                </Link>
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Image Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-blue-600" />
                    Capture or Upload Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!selectedImage ? (
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-4">
                          Take a photo or upload an image of your crop
                        </p>
                        <div className="flex gap-4 justify-center">
                          <Button
                            onClick={() => cameraInputRef.current?.click()}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Take Photo
                          </Button>
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="outline"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                          </Button>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 space-y-2">
                        <h4 className="font-medium">Tips for best results:</h4>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          <li>Take photos in good natural lighting</li>
                          <li>Get close to the affected area</li>
                          <li>Include some healthy parts for comparison</li>
                          <li>Avoid blurry or dark images</li>
                          <li>Show the entire leaf or plant part</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <img
                          src={selectedImage}
                          alt="Selected for analysis"
                          className="w-full max-h-96 object-contain rounded-lg border"
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={analyzeImage}
                          disabled={isAnalyzing}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          {isAnalyzing ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Eye className="h-4 w-4 mr-2" />
                          )}
                          {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                        </Button>
                        <Button
                          onClick={resetAnalysis}
                          variant="outline"
                        >
                          New Image
                        </Button>
                      </div>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </CardContent>
              </Card>

              {/* Analysis Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-green-600" />
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!analysis && !isAnalyzing && (
                    <div className="text-center text-gray-500 py-12">
                      <Bug className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg mb-2">No analysis yet</p>
                      <p className="text-sm">Upload an image to get started</p>
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="text-center py-12">
                      <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin text-green-600" />
                      <p className="text-lg mb-2">Analyzing image...</p>
                      <p className="text-sm text-gray-600">This may take a few seconds</p>
                    </div>
                  )}

                  {analysis && (
                    <ScrollArea className="max-h-96">
                      <div className="space-y-6">
                        {/* Main Result */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(analysis.type)}
                              <h3 className="text-xl font-semibold">{analysis.name}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getTypeColor(analysis.type)}>
                                {analysis.type.replace('_', ' ').toUpperCase()}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <div className={`w-3 h-3 rounded-full ${getSeverityColor(analysis.severity)}`} />
                                <span className="text-sm text-gray-600 capitalize">{analysis.severity}</span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-3">{analysis.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Confidence: {analysis.confidence}%</span>
                            {analysis.crop_affected !== 'unknown' && (
                              <span>Crop: {analysis.crop_affected}</span>
                            )}
                          </div>
                        </div>

                        {/* Symptoms */}
                        {analysis.symptoms.length > 0 && (
                          <div className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                              Visible Symptoms
                            </h4>
                            <ul className="space-y-2">
                              {analysis.symptoms.map((symptom, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                                  <span>{symptom}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Treatment Options */}
                        <div className="grid gap-4">
                          <div className="border rounded-lg p-4 border-red-200 bg-red-50">
                            <h4 className="font-semibold text-red-800 mb-2">🚨 Immediate Action</h4>
                            <p className="text-sm text-red-700">{analysis.treatment.immediate}</p>
                          </div>
                          
                          <div className="border rounded-lg p-4 border-green-200 bg-green-50">
                            <h4 className="font-semibold text-green-800 mb-2">🌱 Organic Treatment</h4>
                            <p className="text-sm text-green-700">{analysis.treatment.organic}</p>
                          </div>
                          
                          <div className="border rounded-lg p-4 border-blue-200 bg-blue-50">
                            <h4 className="font-semibold text-blue-800 mb-2">🛡️ Prevention</h4>
                            <p className="text-sm text-blue-700">{analysis.treatment.preventive}</p>
                          </div>
                          
                          <div className="border rounded-lg p-4 border-orange-200 bg-orange-50">
                            <h4 className="font-semibold text-orange-800 mb-2">⚗️ Chemical Treatment</h4>
                            <p className="text-sm text-orange-700">{analysis.treatment.chemical}</p>
                          </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <p className="text-xs text-gray-600">
                            <strong>Disclaimer:</strong> This AI analysis is for guidance only. 
                            For serious infestations or uncertain identifications, consult with local 
                            agricultural extension services or plant pathology experts.
                          </p>
                        </div>
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PestIdentification;