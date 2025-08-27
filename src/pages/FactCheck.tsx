import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, MessageSquare, HelpCircle, Lightbulb, Mic, MicOff, Volume2, VolumeX, Home, Shield, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import infoCenterBg from "@/assets/info-center-bg.jpg";

// Language options for fact-checking
const LANGUAGES = [
  { value: 'auto', label: 'Auto-detect' },
  { value: 'en', label: 'English' },
  { value: 'sw', label: 'Kiswahili' },
  { value: 'am', label: 'Amharic (አማርኛ)' },
  { value: 'ha', label: 'Hausa' },
  { value: 'yo', label: 'Yoruba' },
  { value: 'ig', label: 'Igbo' },
  { value: 'zu', label: 'Zulu' },
  { value: 'xh', label: 'Xhosa' },
  { value: 'af', label: 'Afrikaans' },
  { value: 'fr', label: 'French' },
  { value: 'ar', label: 'Arabic' },
  { value: 'pt', label: 'Portuguese' }
];

// Example FAQ data
const FAQS = [
  {
    id: 1,
    question: "Are modern agricultural technologies safe to eat?",
    answer: "Yes. The scientific consensus shows that currently approved agricultural biotechnologies are safe to eat. Major scientific organizations worldwide, including the World Health Organization, have evaluated the safety of these technologies and found no evidence that they are harmful to humans.",
    source: "World Health Organization, 2023"
  },
  {
    id: 2,
    question: "Do modern agricultural technologies cause allergies?",
    answer: "Agricultural biotechnologies undergo extensive testing for potential allergenicity before approval. No approved biotechnology foods have been found to introduce new allergens. In fact, genetic engineering can be used to remove proteins that trigger allergic reactions.",
    source: "Food and Agriculture Organization, 2022"
  },
  {
    id: 3,
    question: "Do pesticides used with modern crops harm bees?",
    answer: "The relationship between pesticides and bee health is complex. Some studies show certain pesticides like neonicotinoids can harm bees, while others show minimal impact when used according to label instructions. This is an active area of research not specific to modern agricultural technologies.",
    source: "ISAAA Agricultural Research Report, 2023"
  },
  {
    id: 4,
    question: "Can modern crops cross-pollinate with traditional crops?",
    answer: "Yes, cross-pollination between modern and traditional crops can occur naturally, just as it can between any compatible plant varieties. Farmers use buffer zones, timing planting to avoid overlapping pollination periods, and other management practices to minimize this when needed.",
    source: "American Society of Agronomy, 2022"
  },
  {
    id: 5,
    question: "Are modern agricultural technologies environmentally harmful?",
    answer: "Modern agricultural technology environmental impacts vary by application. Some crop varieties have reduced pesticide use and improved soil conservation through reduced tillage. Each technology needs to be evaluated individually for its specific environmental effects rather than making broad generalizations.",
    source: "National Academies of Sciences, Engineering, and Medicine, 2023"
  },
];

// Common claims data
const COMMON_CLAIMS = [
  "Modern agricultural technologies are unsafe for human consumption",
  "Agricultural innovations increase crop yields",
  "Organic farming is better for the environment",
  "Modern crop technologies cause cancer",
  "Agricultural innovation can solve world hunger"
];

const getPlaceholderText = (language: string) => {
  switch (language) {
    case 'sw': return "Ingiza madai ya kilimo kwa ukaguzi...";
    case 'am': return "የግብርና ክስተትን ለማረጋገጥ ያስገቡ...";
    case 'ha': return "Shigar da ikirarin aikin gona don bincike...";
    case 'fr': return "Entrez une affirmation agricole à vérifier...";
    case 'ar': return "أدخل ادعاءً زراعياً للتحقق منه...";
    default: return "Enter an agricultural claim to verify...";
  }
};

const FactCheck = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [factCheckResult, setFactCheckResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('search');
  
  // Voice features
  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording();
  const { speak, stop: stopSpeaking, isPlaying, isGenerating } = useTextToSpeech();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setFactCheckResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('rag-fact-check', {
        body: { query: query.trim(), language: selectedLanguage }
      });

      if (error) throw error;

      setFactCheckResult(data);
      
      toast({
        title: "Verification complete",
        description: "Information verified against agricultural research",
      });
    } catch (error) {
      console.error('Error fact-checking:', error);
      toast({
        title: "Error",
        description: "Unable to verify the claim. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommonClaimClick = (claim: string) => {
    setQuery(claim);
    setActiveTab('search');
  };

  const handleVoiceRecording = async () => {
    if (isRecording) {
      const transcribedText = await stopRecording();
      if (transcribedText) {
        setQuery(transcribedText);
        toast({
          title: "Voice Recorded",
          description: "Your voice has been transcribed successfully.",
        });
      }
    } else {
      await startRecording();
    }
  };

  const handlePlayResponse = () => {
    if (isPlaying) {
      stopSpeaking();
    } else if (factCheckResult?.explanation) {
      speak(factCheckResult.explanation);
    }
  };

  const getResultIcon = (isTrue: boolean | null) => {
    if (isTrue === true) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (isTrue === false) return <XCircle className="h-5 w-5 text-red-600" />;
    return <AlertCircle className="h-5 w-5 text-yellow-600" />;
  };

  const getResultColor = (isTrue: boolean | null) => {
    if (isTrue === true) return 'border-green-200 bg-green-50';
    if (isTrue === false) return 'border-red-200 bg-red-50';
    return 'border-yellow-200 bg-yellow-50';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center py-16 text-white"
        style={{ backgroundImage: `url(${infoCenterBg})` }}
      >
        <div className="absolute inset-0 bg-blue-800/70"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-8 w-8" />
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Agricultural Information Center
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Agricultural Information Verification
            </h1>
            <p className="text-xl mb-6 text-blue-50">
              Verify agricultural claims against peer-reviewed research and expert consensus
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
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8 shadow-lg border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <MessageSquare className="h-5 w-5" />
                  Information Verification Service
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Verify agricultural claims against scientific research and expert consensus
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="search">Verify Claim</TabsTrigger>
                    <TabsTrigger value="faqs">Common Questions</TabsTrigger>
                    <TabsTrigger value="claims">Research Topics</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="search" className="space-y-4">
                    <div className="flex gap-2 mb-4">
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="w-[200px] border-blue-200 focus:border-blue-500">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGES.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <Input
                          placeholder={getPlaceholderText(selectedLanguage)}
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                          className="pr-12 border-blue-200 focus:border-blue-500"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                          onClick={handleVoiceRecording}
                          disabled={isProcessing}
                        >
                          {isRecording ? (
                            <MicOff className="h-4 w-4 text-red-500" />
                          ) : (
                            <Mic className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <Button 
                        onClick={handleSearch} 
                        disabled={isLoading || !query.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        {isLoading ? 'Verifying...' : 'Verify'}
                      </Button>
                    </div>

                    {factCheckResult && (
                      <div className={`mt-6 p-4 rounded-lg border-2 ${getResultColor(factCheckResult.isTrue)}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getResultIcon(factCheckResult.isTrue)}
                            <span className="font-medium text-lg">
                              {factCheckResult.isTrue === true ? 'Supported by Evidence' : 
                               factCheckResult.isTrue === false ? 'Not Supported by Evidence' : 'Mixed Evidence'}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handlePlayResponse}
                            disabled={isGenerating}
                            className="h-8 w-8 p-0"
                            title={isPlaying ? "Stop audio" : isGenerating ? "Generating audio..." : "Play audio"}
                          >
                            {isGenerating ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                            ) : isPlaying ? (
                              <VolumeX className="h-4 w-4" />
                            ) : (
                              <Volume2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-sm mb-3 leading-relaxed">{factCheckResult.explanation}</p>
                        <div className="bg-white/50 p-2 rounded text-xs">
                          <strong>Research Source:</strong> {factCheckResult.source}
                        </div>
                      </div>
                    )}

                    {(isProcessing || isGenerating) && (
                      <div className="mt-4 text-center text-sm text-blue-600">
                        {isProcessing && "Processing voice..."}
                        {isGenerating && "Generating audio response..."}
                      </div>
                    )}

                    {!factCheckResult && (
                      <div className="mt-6 text-center text-blue-600">
                        <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-lg mb-2">Ready to Verify Information</p>
                        <p className="text-sm">Enter an agricultural claim to verify against research</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="faqs">
                    <ScrollArea className="h-[500px] pr-4">
                      <div className="space-y-4">
                        {FAQS.map((faq) => (
                          <div key={faq.id} className="border rounded-md p-4 hover:bg-blue-50 border-blue-200">
                            <h4 className="font-medium mb-2 text-blue-800">{faq.question}</h4>
                            <p className="text-sm mb-2 text-blue-700">{faq.answer}</p>
                            <p className="text-xs text-blue-600">Research Source: {faq.source}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="claims">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {COMMON_CLAIMS.map((claim, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-sm py-2 px-3 cursor-pointer hover:bg-blue-50 border-blue-300 text-blue-700"
                          onClick={() => handleCommonClaimClick(claim)}
                        >
                          {claim}
                        </Badge>
                      ))}
                    </div>
                    
                    <Alert className="border-blue-200 bg-blue-50">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <AlertTitle className="text-blue-800">Evidence-Based Information Guidelines</AlertTitle>
                      <AlertDescription className="text-blue-700">
                        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
                          <li>Look for peer-reviewed scientific sources rather than anecdotes</li>
                          <li>Consider the consensus among agricultural experts and researchers</li>
                          <li>Check if information comes from recognized agricultural institutions</li>
                          <li>Be cautious of claims that are absolute or overly simplistic</li>
                          <li>Cross-reference with multiple credible agricultural sources</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FactCheck;