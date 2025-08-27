import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Loader2, Bug, AlertTriangle, CheckCircle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-6 w-6 text-green-600" />
            AI-Powered Pest & Disease Identification
          </CardTitle>
          <p className="text-sm text-gray-600">
            Upload or capture an image of your crop to identify pests, diseases, or plant health issues
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
            </div>

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

            {selectedImage && (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Selected for analysis"
                    className="w-full max-h-96 object-contain rounded-lg border"
                  />
                </div>
                <Button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isAnalyzing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                </Button>
              </div>
            )}
          </div>

          {/* Analysis Results */}
          {analysis && (
            <Card className="border-2 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(analysis.type)}
                    Analysis Results
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
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{analysis.name}</h3>
                  <p className="text-gray-600">{analysis.description}</p>
                  <div className="mt-2">
                    <span className="text-sm text-gray-500">Confidence: {analysis.confidence}%</span>
                    {analysis.crop_affected !== 'unknown' && (
                      <span className="text-sm text-gray-500 ml-4">
                        Crop: {analysis.crop_affected}
                      </span>
                    )}
                  </div>
                </div>

                {analysis.symptoms.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Visible Symptoms:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {analysis.symptoms.map((symptom, index) => (
                        <li key={index}>{symptom}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-red-700 mb-1">Immediate Action:</h4>
                      <p className="text-sm text-gray-700">{analysis.treatment.immediate}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-700 mb-1">Organic Treatment:</h4>
                      <p className="text-sm text-gray-700">{analysis.treatment.organic}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-blue-700 mb-1">Prevention:</h4>
                      <p className="text-sm text-gray-700">{analysis.treatment.preventive}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-700 mb-1">Chemical Treatment:</h4>
                      <p className="text-sm text-gray-700">{analysis.treatment.chemical}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PestIdentification;