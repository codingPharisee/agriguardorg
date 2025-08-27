import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Loader2, Bug, AlertTriangle, CheckCircle, Eye, Home, ArrowLeft, Leaf, FileSearch } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import extensionServiceBg from "@/assets/extension-service-bg.jpg";

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
          title: "Diagnosis Failed",
          description: "Could not analyze the sample. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setAnalysis(data);
      toast({
        title: "Diagnosis Complete",
        description: `Assessment completed with ${data.confidence}% confidence`,
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Analysis Error",
        description: "Could not analyze the sample. Please check your connection and try again.",
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center py-16 text-white"
        style={{ backgroundImage: `url(${extensionServiceBg})` }}
      >
        <div className="absolute inset-0 bg-green-800/70"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Leaf className="h-8 w-8" />
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Agricultural Extension Service
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Crop Health Diagnostic Center
            </h1>
            <p className="text-xl mb-6 text-green-50">
              Professional plant health assessment and treatment recommendations from our agricultural specialists
            </p>
            <div className="flex justify-center">
              <Button asChild className="bg-white/95 text-green-800 hover:bg-white border-2 border-white shadow-lg font-semibold px-6 py-3 text-base">
                <Link to="/tools" className="flex items-center gap-2">
                  <ArrowLeft className="h-5 w-5" /> Extension Services
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <main className="flex-grow py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Image Upload Section */}
              <Card className="shadow-lg border-green-100">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Camera className="h-5 w-5" />
                    Submit Plant Sample
                  </CardTitle>
                  <p className="text-sm text-green-700 mt-2">
                    Upload clear images of affected plant parts for professional diagnosis
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  {!selectedImage ? (
                    <div className="space-y-6">
                      <div className="border-2 border-dashed border-green-200 rounded-lg p-8 text-center bg-green-50/30">
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                          <Camera className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-green-800 mb-2">Submit Plant Sample</h3>
                        <p className="text-green-700 mb-6 text-sm">
                          Take a clear photo or upload an image of the affected plant area
                        </p>
                        <div className="flex gap-4 justify-center">
                          <Button
                            onClick={() => cameraInputRef.current?.click()}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Capture Image
                          </Button>
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="outline"
                            className="border-green-300 text-green-700 hover:bg-green-50"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload File
                          </Button>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                          <FileSearch className="h-4 w-4" />
                          Photo Guidelines for Best Results
                        </h4>
                        <ul className="space-y-2 text-sm text-green-700">
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                            <span>Photograph in bright, natural daylight</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                            <span>Focus on affected areas with visible symptoms</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                            <span>Include both healthy and affected plant parts</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                            <span>Ensure images are sharp and well-focused</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                            <span>Capture the entire affected leaf or plant section</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <img
                          src={selectedImage}
                          alt="Plant sample for analysis"
                          className="w-full max-h-96 object-contain rounded-lg border border-green-200"
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
                            <FileSearch className="h-4 w-4 mr-2" />
                          )}
                          {isAnalyzing ? 'Analyzing Sample...' : 'Start Diagnosis'}
                        </Button>
                        <Button
                          onClick={resetAnalysis}
                          variant="outline"
                          className="border-green-300 text-green-700 hover:bg-green-50"
                        >
                          Submit New Sample
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
              <Card className="shadow-lg border-green-100">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <FileSearch className="h-5 w-5" />
                    Diagnostic Results
                  </CardTitle>
                  <p className="text-sm text-green-700 mt-2">
                    Professional plant health assessment and treatment recommendations
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  {!analysis && !isAnalyzing && (
                    <div className="text-center text-green-600 py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                        <Leaf className="h-8 w-8 text-green-600" />
                      </div>
                      <p className="text-lg mb-2 font-medium">Ready for Diagnosis</p>
                      <p className="text-sm text-green-700">Submit a plant sample to receive professional assessment</p>
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                      </div>
                      <p className="text-lg mb-2 font-medium text-green-800">Analyzing Plant Sample...</p>
                      <p className="text-sm text-green-700">Our specialists are examining your submission</p>
                    </div>
                  )}

                  {analysis && (
                    <ScrollArea className="max-h-96">
                      <div className="space-y-6">
                        {/* Main Result */}
                        <div className="border rounded-lg p-4 border-green-200 bg-green-50/30">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(analysis.type)}
                              <h3 className="text-xl font-semibold text-green-800">{analysis.name}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getTypeColor(analysis.type)}>
                                {analysis.type.replace('_', ' ').toUpperCase()}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <div className={`w-3 h-3 rounded-full ${getSeverityColor(analysis.severity)}`} />
                                <span className="text-sm text-green-700 capitalize">{analysis.severity}</span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-green-800 mb-3">{analysis.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-green-700">
                            <span>Confidence: {analysis.confidence}%</span>
                            {analysis.crop_affected !== 'unknown' && (
                              <span>Crop: {analysis.crop_affected}</span>
                            )}
                          </div>
                        </div>

                        {/* Symptoms */}
                        {analysis.symptoms.length > 0 && (
                          <div className="border rounded-lg p-4 border-orange-200 bg-orange-50/50">
                            <h4 className="font-semibold mb-3 flex items-center gap-2 text-orange-800">
                              <AlertTriangle className="h-4 w-4" />
                              Observed Symptoms
                            </h4>
                            <ul className="space-y-2">
                              {analysis.symptoms.map((symptom, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-orange-800">
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
                            <h4 className="font-semibold text-red-800 mb-2">🚨 Immediate Action Required</h4>
                            <p className="text-sm text-red-700">{analysis.treatment.immediate}</p>
                          </div>
                          
                          <div className="border rounded-lg p-4 border-green-200 bg-green-50">
                            <h4 className="font-semibold text-green-800 mb-2">🌱 Organic Treatment Options</h4>
                            <p className="text-sm text-green-700">{analysis.treatment.organic}</p>
                          </div>
                          
                          <div className="border rounded-lg p-4 border-blue-200 bg-blue-50">
                            <h4 className="font-semibold text-blue-800 mb-2">🛡️ Prevention Measures</h4>
                            <p className="text-sm text-blue-700">{analysis.treatment.preventive}</p>
                          </div>
                          
                          <div className="border rounded-lg p-4 border-orange-200 bg-orange-50">
                            <h4 className="font-semibold text-orange-800 mb-2">⚗️ Chemical Treatment (if necessary)</h4>
                            <p className="text-sm text-orange-700">{analysis.treatment.chemical}</p>
                          </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <p className="text-xs text-gray-600">
                            <strong>Professional Disclaimer:</strong> This assessment is provided for guidance only. 
                            For severe infestations or uncertain diagnoses, please consult with your local 
                            agricultural extension officer or certified crop protection specialist.
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