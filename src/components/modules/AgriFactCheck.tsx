
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Check, X, Loader2, Globe, Book, Languages, Mic, Volume2, Camera, Upload, Eye, Bug, AlertTriangle, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

// Enhanced FAQ data from African agricultural organizations
const FAQS = [
  {
    id: 1,
    question: "Are modern agricultural technologies safe for African farmers to use?",
    answer: "Scientific evidence supports that approved agricultural biotechnologies are safe to use and consume. Several African countries including South Africa, Kenya, Nigeria, and Ethiopia have adopted modern crop technologies with appropriate regulatory frameworks in place to ensure safety and effectiveness.",
    source: "African Agricultural Technology Foundation (AATF), 2023",
    organization: "AATF"
  },
  {
    id: 2,
    question: "Does organic farming produce higher yields than conventional farming in Africa?",
    answer: "Research shows that yields from organic farming can be lower than conventional farming in the short term, but often become comparable over time as soil health improves. In Africa, context matters - in some regions with limited access to synthetic inputs, well-managed organic systems can outperform poorly resourced conventional systems.",
    source: "Alliance for a Green Revolution in Africa (AGRA), 2022",
    organization: "AGRA"
  },
  {
    id: 3,
    question: "Are pesticides causing mass bee deaths across African farmlands?",
    answer: "While some pesticides can harm bees, particularly neonicotinoids, there is no evidence of continental-scale bee deaths in Africa due to pesticide use. Proper application, following label instructions, and integrated pest management can minimize risks to pollinators while protecting crops.",
    source: "African Union - Interafrican Bureau for Animal Resources (AU-IBAR), 2023",
    organization: "AU-IBAR"
  },
  {
    id: 4,
    question: "Will climate-smart agriculture practices work in all African regions?",
    answer: "Climate-smart agriculture is not a one-size-fits-all solution. Effectiveness varies by region, local climate conditions, soil types, and farming systems. Successful implementation requires localization and adaptation to specific contexts across Africa's diverse agroecological zones.",
    source: "Forum for Agricultural Research in Africa (FARA), 2023",
    organization: "FARA"
  },
  {
    id: 5,
    question: "Does irrigation always increase crop yields in African farming?",
    answer: "While irrigation can significantly increase yields, outcomes depend on water management, soil conditions, and crop selection. In some cases, improper irrigation can lead to salinization and soil degradation. Sustainable water management systems tailored to local conditions are essential.",
    source: "International Water Management Institute (IWMI) - Africa, 2022",
    organization: "IWMI"
  },
  {
    id: 6,
    question: "Are traditional African farming methods outdated compared to modern techniques?",
    answer: "Many traditional farming methods incorporate sophisticated knowledge of local environments developed over generations. These methods often include sustainable practices like intercropping, agroforestry, and natural pest management that are now being recognized by modern agricultural science as highly valuable, especially in the face of climate change.",
    source: "Alliance for Food Sovereignty in Africa (AFSA), 2023",
    organization: "AFSA"
  },
  {
    id: 7,
    question: "Can African smallholder farmers benefit from digital agriculture?",
    answer: "Evidence shows that digital agriculture tools adapted to local contexts can benefit smallholder farmers through better market access, weather information, and farming advice. However, barriers include connectivity issues, digital literacy, and affordability that need to be addressed for widespread adoption.",
    source: "Technical Centre for Agricultural and Rural Cooperation (CTA), 2022",
    organization: "CTA"
  },
];

// Common agricultural topics relevant to African farming
const COMMON_TOPICS = [
  "Agricultural biotechnology in African agriculture",
  "Drought-resistant crops",
  "Pesticide safety",
  "Climate-smart farming",
  "Organic vs. conventional",
  "Digital agriculture tools",
  "Traditional farming methods"
];

// African agricultural organizations
const ORGANIZATIONS = [
  { value: "all", label: "All Organizations" },
  { value: "AATF", label: "African Agricultural Technology Foundation" },
  { value: "AGRA", label: "Alliance for a Green Revolution in Africa" },
  { value: "AU-IBAR", label: "AU - Interafrican Bureau for Animal Resources" },
  { value: "FARA", label: "Forum for Agricultural Research in Africa" },
  { value: "IWMI", label: "International Water Management Institute - Africa" },
  { value: "AFSA", label: "Alliance for Food Sovereignty in Africa" },
  { value: "CTA", label: "Technical Centre for Agricultural and Rural Cooperation" }
];

// Supported languages for fact-checking
const LANGUAGES = [
  { value: "auto", label: "Auto-detect", flag: "🌍" },
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "sw", label: "Kiswahili", flag: "🇰🇪" },
  { value: "am", label: "አማርኛ (Amharic)", flag: "🇪🇹" },
  { value: "ha", label: "Hausa", flag: "🇳🇬" },
  { value: "yo", label: "Yorùbá", flag: "🇳🇬" },
  { value: "ig", label: "Igbo", flag: "🇳🇬" },
  { value: "zu", label: "isiZulu", flag: "🇿🇦" },
  { value: "xh", label: "isiXhosa", flag: "🇿🇦" },
  { value: "af", label: "Afrikaans", flag: "🇿🇦" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "ar", label: "العربية", flag: "🇪🇬" },
  { value: "pt", label: "Português", flag: "🇵🇹" }
];

// Interface for health analysis results
interface HealthAnalysis {
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

// Mock database of fact-checking responses
const FACT_CHECK_DATABASE = {
  "agricultural_biotech": {
    isTrue: true,
    explanation: "Approved agricultural biotechnologies have been scientifically tested and are considered safe for consumption according to multiple African regulatory bodies including Kenya's National Biosafety Authority and South Africa's Department of Agriculture.",
    source: "African Agricultural Technology Foundation (AATF), 2023"
  },
  "organic": {
    isTrue: null,
    explanation: "The benefits of organic farming in Africa depend on local conditions, farmer resources, and market access. While it can reduce input costs and premium prices may be available, yields may be lower initially and certification can be costly.",
    source: "Alliance for Food Sovereignty in Africa (AFSA), 2023"
  },
  "drought": {
    isTrue: true,
    explanation: "Drought-resistant crop varieties developed through both conventional breeding and genetic modification have shown increased yields in drought-prone regions of Africa, though effectiveness varies by location and severity of water stress.",
    source: "Forum for Agricultural Research in Africa (FARA), 2023"
  },
  "pesticide": {
    isTrue: false,
    explanation: "Claims that all pesticides are safe when used as directed overlook evidence that some compounds pose risks to farmers without proper protective equipment, which is often unavailable to smallholders in rural Africa.",
    source: "Pesticide Action Network Africa, 2022"
  },
  "traditional": {
    isTrue: false,
    explanation: "The narrative that traditional farming methods are always less productive than modern techniques ignores evidence that many indigenous practices are well-adapted to local conditions and provide resilience against climate shocks.",
    source: "Alliance for Food Sovereignty in Africa (AFSA), 2023"
  }
};

const AgriFactCheck = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [filteredFaqs, setFilteredFaqs] = useState(FAQS);
  const [selectedOrg, setSelectedOrg] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("auto");
  const [factCheckResult, setFactCheckResult] = useState<{
    isTrue: boolean | null;
    explanation: string;
    source: string;
  } | null>(null);

  // Image scanning states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<HealthAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Voice functionality
  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording();
  const { speak, stop: stopSpeaking, isPlaying, isGenerating } = useTextToSpeech();

  useEffect(() => {
    if (selectedOrg === "all") {
      setFilteredFaqs(FAQS);
    } else {
      setFilteredFaqs(FAQS.filter(faq => faq.organization === selectedOrg));
    }
  }, [selectedOrg]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setFactCheckResult(null);
    
    try {
      console.log('Submitting fact-check query:', query);
      
      const { data, error } = await supabase.functions.invoke('rag-fact-check', {
        body: { 
          query: query.trim(),
          language: selectedLanguage 
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Fact-check response:', data);
      setFactCheckResult(data);
      setShowResults(true);
      
      toast({
        title: "Fact check complete",
        description: "AI analysis based on agricultural research and expert knowledge",
      });
    } catch (error) {
      console.error('Error fact-checking:', error);
      toast({
        title: "Error",
        description: "Unable to fact-check the claim. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicClick = (topic: string) => {
    setQuery(topic);
    setActiveTab("chat");
  };

  const handleVoiceRecording = async () => {
    if (isRecording) {
      const transcribedText = await stopRecording();
      if (transcribedText) {
        setQuery(transcribedText);
        toast({
          title: "Voice recorded",
          description: "Audio has been transcribed successfully",
        });
      }
    } else {
      await startRecording();
      toast({
        title: "Recording started",
        description: "Speak your question now...",
      });
    }
  };

  const handlePlayResponse = async () => {
    if (isPlaying) {
      stopSpeaking();
    } else if (factCheckResult?.explanation) {
      await speak(factCheckResult.explanation);
    }
  };

  // Image scanning functions
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
        console.error('Health analysis error:', error);
        toast({
          title: "Analysis Failed",
          description: "Could not analyze the image. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setAnalysis(data);
      toast({
        title: "Health Analysis Complete",
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
    <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-green-50 via-emerald-50/80 to-green-100/60 backdrop-blur-sm">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-400/5 to-green-600/10"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-300/15 to-green-400/15 rounded-full translate-y-12 -translate-x-12"></div>
      
      <CardHeader className="relative pb-3 bg-gradient-to-r from-green-600/90 to-emerald-600/90 text-white">
        <CardTitle className="flex items-center gap-3 text-xl font-bold">
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
            <MessageSquare className="h-6 w-6" />
          </div>
          AgriFactCheck
        </CardTitle>
        <p className="text-green-50/90 text-sm leading-relaxed">
          African agricultural fact checking via AI chatbot and SMS system
        </p>
      </CardHeader>
      
      <CardContent className="relative pt-6 pb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6 bg-green-100/60 p-1 rounded-lg">
            <TabsTrigger 
              value="chat" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all"
            >
              Chat
            </TabsTrigger>
            <TabsTrigger 
              value="scanner"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all"
            >
              Health Scan
            </TabsTrigger>
            <TabsTrigger 
              value="faqs"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all"
            >
              FAQs
            </TabsTrigger>
            <TabsTrigger 
              value="topics"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all"
            >
              Topics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="mt-0 space-y-4">
            <div className="mb-4 flex items-center gap-3 p-3 bg-green-50/60 rounded-lg border border-green-200/40">
              <Languages className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Language:</span>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-[200px] border-green-200 focus:border-green-500">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                placeholder={selectedLanguage === "sw" ? "Uliza kuhusu madai ya kilimo Afrika..." : 
                            selectedLanguage === "am" ? "ስለ አፍሪካ ግብርና አባባሎች ይጠይቁ..." :
                            selectedLanguage === "ha" ? "Yi tambaya game da da'awar noma a Afirka..." :
                            selectedLanguage === "yo" ? "Béèrè nípa àwọn ìjápọ̀ àgbàtójọ ní Áfíríkà..." :
                            selectedLanguage === "fr" ? "Posez des questions sur les affirmations agricoles en Afrique..." :
                            selectedLanguage === "ar" ? "اسأل عن الادعاءات الزراعية في أفريقيا..." :
                            "Ask about agricultural claims or myths in Africa..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-white/80 backdrop-blur-sm"
                disabled={isLoading}
              />
              <Button 
                type="button"
                onClick={handleVoiceRecording}
                disabled={isLoading || isProcessing}
                className={`px-4 ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white shadow-lg`}
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mic className={`h-4 w-4 ${isRecording ? 'animate-pulse' : ''}`} />
                )}
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || !query.trim()}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 shadow-lg"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
            
            {showResults && factCheckResult && (
              <div className={`border-2 rounded-lg p-5 space-y-3 animate-fade-in backdrop-blur-sm ${
                factCheckResult.isTrue === true ? 'border-emerald-400 bg-emerald-50/80' : 
                factCheckResult.isTrue === false ? 'border-red-400 bg-red-50/80' : 
                'border-amber-400 bg-amber-50/80'
              }`}>
                <div className="flex items-start gap-3">
                  <span className={`rounded-full p-2 mt-0.5 shadow-sm ${
                    factCheckResult.isTrue === true ? 'bg-emerald-500' : 
                    factCheckResult.isTrue === false ? 'bg-red-500' : 
                    'bg-amber-500'
                  }`}>
                    {factCheckResult.isTrue === true ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : factCheckResult.isTrue === false ? (
                      <X className="h-4 w-4 text-white" />
                    ) : (
                      <MessageSquare className="h-4 w-4 text-white" />
                    )}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm leading-relaxed text-gray-700 space-y-3">
                      {factCheckResult.explanation.split(/[.!?]+(?:\s+|$)/).filter(sentence => sentence.trim()).map((sentence, index) => (
                        <p key={index} className="mb-2 last:mb-0">
                          {sentence.trim()}{sentence.includes('.') || sentence.includes('!') || sentence.includes('?') ? '' : '.'}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="pt-3 text-sm text-gray-600 border-t border-gray-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Source:</span>
                    <span>{factCheckResult.source}</span>
                  </div>
                  <Button
                    onClick={handlePlayResponse}
                    disabled={isGenerating}
                    variant="outline"
                    size="sm"
                    className="ml-auto border-green-200 hover:bg-green-50"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isPlaying ? (
                      <>
                        <X className="h-4 w-4 mr-1" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-4 w-4 mr-1" />
                        Listen
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
            
            {!showResults && !isLoading && (
              <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg bg-gradient-to-br from-green-50/60 to-emerald-50/60 border border-green-200/40">
                <div className="p-4 bg-green-100/60 rounded-full mb-4">
                  <MessageSquare className="h-12 w-12 text-green-600" />
                </div>
                <p className="text-gray-600 font-medium">
                  {selectedLanguage === "sw" ? "Uliza swali kuhusu hadithi au madai ya kilimo Afrika" :
                   selectedLanguage === "am" ? "ስለ አፍሪካ ግብርና አወያይ ወይም ጥያቄዎች ይጠይቁ" :
                   selectedLanguage === "ha" ? "Yi tambaya game da tatsuniyoyi ko da'awar noma a Afirka" :
                   selectedLanguage === "yo" ? "Béèrè ìbéèrè nípa àwọn àròsọ tàbí ìjápọ̀ àgbàtójọ ní Áfíríkà" :
                   selectedLanguage === "fr" ? "Posez une question sur les mythes ou affirmations agricoles en Afrique" :
                   selectedLanguage === "ar" ? "اسأل سؤالاً عن الأساطير أو الادعاءات الزراعية في أفريقيا" :
                   "Ask a question about agricultural myths or claims in Africa"}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {selectedLanguage === "sw" ? "Pata ukaguzi wa haraka wa ukweli unaotumia AI pamoja na marejeo" :
                   selectedLanguage === "am" ? "በ AI የተደገፈ ፈጣን የእውነት ማረጋገጫ ከዋቢዎች ጋር ያግኙ" :
                   selectedLanguage === "ha" ? "Samu binciken gaskiya na gaggawa da AI tare da ambato" :
                   selectedLanguage === "yo" ? "Gba àyẹ̀wò òtítọ́ kíá pẹ̀lú AI àti àwọn ìtọ́kasí" :
                   selectedLanguage === "fr" ? "Obtenez une vérification instantanée des faits alimentée par l'IA avec citations" :
                   selectedLanguage === "ar" ? "احصل على فحص فوري للحقائق مدعوم بالذكاء الاصطناعي مع المراجع" :
                   "Get instant AI-powered fact checking with citations"}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="scanner" className="mt-0 space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-green-50/60 rounded-lg border border-green-200/40">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Health Scanner:</strong> Upload or capture an image of your crops or livestock to identify pests, diseases, or health issues.
                </p>
                <p className="text-xs text-gray-600">
                  Supports: crops, plants, livestock, and animal health analysis
                </p>
              </div>

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
                  className="flex-1 border-green-200 hover:bg-green-50"
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
                      alt="Selected for health analysis"
                      className="w-full max-h-96 object-contain rounded-lg border border-green-200"
                    />
                  </div>
                  <Button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Eye className="h-4 w-4 mr-2" />
                    )}
                    {isAnalyzing ? 'Analyzing Health...' : 'Analyze Health'}
                  </Button>
                </div>
              )}

              {analysis && (
                <Card className="border-2 border-green-200 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(analysis.type)}
                        <span>Health Analysis Results</span>
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
                      <h3 className="font-semibold text-lg text-gray-800">{analysis.name}</h3>
                      <p className="text-gray-600 leading-relaxed">{analysis.description}</p>
                      <div className="mt-2 flex flex-wrap gap-4">
                        <span className="text-sm text-gray-500">
                          <strong>Confidence:</strong> {analysis.confidence}%
                        </span>
                        {analysis.crop_affected !== 'unknown' && (
                          <span className="text-sm text-gray-500">
                            <strong>Subject:</strong> {analysis.crop_affected}
                          </span>
                        )}
                      </div>
                    </div>

                    {analysis.symptoms.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 text-gray-800">Visible Signs & Symptoms:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                          {analysis.symptoms.map((symptom, index) => (
                            <li key={index}>{symptom}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <h4 className="font-medium text-red-700 mb-1">🚨 Immediate Action:</h4>
                          <p className="text-sm text-gray-700">{analysis.treatment.immediate}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <h4 className="font-medium text-green-700 mb-1">🌿 Organic Treatment:</h4>
                          <p className="text-sm text-gray-700">{analysis.treatment.organic}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="font-medium text-blue-700 mb-1">🛡️ Prevention:</h4>
                          <p className="text-sm text-gray-700">{analysis.treatment.preventive}</p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <h4 className="font-medium text-orange-700 mb-1">⚗️ Chemical Treatment:</h4>
                          <p className="text-sm text-gray-700">{analysis.treatment.chemical}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="faqs" className="mt-0">
            <div className="mb-4 flex items-center gap-3 p-3 bg-green-50/60 rounded-lg border border-green-200/40">
              <Book className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Filter by organization:</span>
              <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                <SelectTrigger className="w-[240px] border-green-200 focus:border-green-500">
                  <SelectValue placeholder="All Organizations" />
                </SelectTrigger>
                <SelectContent>
                  {ORGANIZATIONS.map((org) => (
                    <SelectItem key={org.value} value={org.value}>{org.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <ScrollArea className="h-[320px] pr-4">
              <div className="space-y-4">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq) => (
                    <div key={faq.id} className="border border-green-200/60 rounded-lg p-4 bg-white/70 backdrop-blur-sm hover:bg-green-50/80 hover:border-green-300/60 transition-all cursor-pointer">
                      <h4 className="font-semibold mb-3 text-gray-800">{faq.question}</h4>
                      <p className="text-sm text-gray-700 mb-3 leading-relaxed">{faq.answer}</p>
                      <p className="text-xs text-green-700 font-medium bg-green-100/60 px-2 py-1 rounded inline-block">
                        Source: {faq.source}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Book className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    No FAQs available for this organization
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="topics" className="mt-0">
            <div className="p-4 bg-green-50/60 rounded-lg border border-green-200/40 mb-4">
              <p className="text-sm text-gray-700 font-medium mb-1">Popular Agricultural Topics</p>
              <p className="text-xs text-gray-600">Click on any topic to ask about it</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {COMMON_TOPICS.map((topic, index) => (
                <Badge 
                  key={index}
                  variant="outline"
                  className="text-sm py-2 px-4 cursor-pointer border-green-300 text-green-700 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all shadow-sm bg-white/70 backdrop-blur-sm"
                  onClick={() => handleTopicClick(topic)}
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AgriFactCheck;
