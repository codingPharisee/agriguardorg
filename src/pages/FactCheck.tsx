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
import { ArrowLeft, Search, MessageSquare, HelpCircle, Lightbulb, Mic, MicOff, Volume2, VolumeX, Home } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
    question: "Are GMOs safe to eat?",
    answer: "Yes. The scientific consensus shows that currently approved GMO foods are safe to eat. Major scientific organizations worldwide, including the World Health Organization, have evaluated the safety of GMOs and found no evidence that they are harmful to humans.",
    source: "World Health Organization, 2023"
  },
  {
    id: 2,
    question: "Do GMOs cause allergies?",
    answer: "GMOs undergo extensive testing for potential allergenicity before approval. No approved GMO foods have been found to introduce new allergens. In fact, genetic engineering can be used to remove proteins that trigger allergic reactions.",
    source: "Food and Agriculture Organization, 2022"
  },
  {
    id: 3,
    question: "Do pesticides used with GMOs harm bees?",
    answer: "The relationship between pesticides and bee health is complex. Some studies show certain pesticides like neonicotinoids can harm bees, while others show minimal impact when used according to label instructions. This is an active area of research not specific to GMOs.",
    source: "ISAAA Agricultural Research Report, 2023"
  },
  {
    id: 4,
    question: "Can GMOs cross-pollinate with non-GMO crops?",
    answer: "Yes, cross-pollination between GMO and non-GMO crops can occur naturally, just as it can between any compatible plant varieties. Farmers use buffer zones, timing planting to avoid overlapping pollination periods, and other management practices to minimize this when needed.",
    source: "American Society of Agronomy, 2022"
  },
  {
    id: 5,
    question: "Are GMOs environmentally harmful?",
    answer: "GMO environmental impacts vary by application. Some GMO crops have reduced pesticide use and improved soil conservation through reduced tillage. Each GMO variety needs to be evaluated individually for its specific environmental effects rather than making broad generalizations.",
    source: "National Academies of Sciences, Engineering, and Medicine, 2023"
  },
];

// Common claims data
const COMMON_CLAIMS = [
  "GMOs are unsafe for human consumption",
  "GMOs increase crop yields",
  "Organic farming is better for the environment",
  "GMOs cause cancer",
  "GMOs can solve world hunger"
];

const getPlaceholderText = (language: string) => {
  switch (language) {
    case 'sw': return "Ingiza madai ya kilimo kwa ukaguzi...";
    case 'am': return "የግብርና ክስተትን ለማረጋገጥ ያስገቡ...";
    case 'ha': return "Shigar da ikirarin aikin gona don bincike...";
    case 'fr': return "Entrez une affirmation agricole à vérifier...";
    case 'ar': return "أدخل ادعاءً زراعياً للتحقق منه...";
    default: return "Enter an agricultural claim to fact check...";
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
        title: "Fact check complete",
        description: "AI analysis based on African agricultural research",
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-center">Agricultural Fact Checker</h1>
              <Button variant="outline" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" /> Return to Homepage
                </Link>
              </Button>
            </div>
            
            <Card className="mb-8">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Verify Agricultural Claims
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="search">Search</TabsTrigger>
                    <TabsTrigger value="faqs">Common FAQs</TabsTrigger>
                    <TabsTrigger value="claims">Common Claims</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="search" className="space-y-4">
                    <div className="flex gap-2 mb-4">
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="w-[200px]">
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
                          className="pr-12"
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
                      <Button onClick={handleSearch} disabled={isLoading || !query.trim()}>
                        <Search className="h-4 w-4 mr-2" />
                        {isLoading ? 'Checking...' : 'Check'}
                      </Button>
                    </div>

                    {factCheckResult && (
                      <div className="mt-6 p-4 bg-muted rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              factCheckResult.isTrue === true ? 'bg-green-500' : 
                              factCheckResult.isTrue === false ? 'bg-red-500' : 'bg-yellow-500'
                            }`} />
                            <span className="font-medium">
                              {factCheckResult.isTrue === true ? 'Supported' : 
                               factCheckResult.isTrue === false ? 'Not Supported' : 'Mixed Evidence'}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handlePlayResponse}
                            disabled={isGenerating}
                            className="h-8 w-8 p-0"
                          >
                            {isPlaying ? (
                              <VolumeX className="h-4 w-4" />
                            ) : (
                              <Volume2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-sm mb-2">{factCheckResult.explanation}</p>
                        <p className="text-xs text-muted-foreground">Source: {factCheckResult.source}</p>
                      </div>
                    )}

                    {(isProcessing || isGenerating) && (
                      <div className="mt-4 text-center text-sm text-muted-foreground">
                        {isProcessing && "Processing voice..."}
                        {isGenerating && "Generating audio..."}
                      </div>
                    )}

                    {!factCheckResult && (
                      <div className="mt-6 text-center text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Enter a claim above to get started with fact-checking</p>
                        <p className="text-xs mt-2">Use the microphone button to record your voice</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="faqs">
                    <ScrollArea className="h-[500px] pr-4">
                      <div className="space-y-4">
                        {FAQS.map((faq) => (
                          <div key={faq.id} className="border rounded-md p-4 hover:bg-gray-50">
                            <h4 className="font-medium mb-2">{faq.question}</h4>
                            <p className="text-sm mb-2">{faq.answer}</p>
                            <p className="text-xs text-muted-foreground">Source: {faq.source}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="claims">
                    <div className="flex flex-wrap gap-2">
                      {COMMON_CLAIMS.map((claim, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-sm py-2 px-3 cursor-pointer hover:bg-accent"
                          onClick={() => handleCommonClaimClick(claim)}
                        >
                          {claim}
                        </Badge>
                      ))}
                    </div>
                    
                    <Alert className="mt-6">
                      <AlertTitle>Tips for evaluating agricultural information</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
                          <li>Look for peer-reviewed scientific sources rather than anecdotes</li>
                          <li>Consider the consensus among experts rather than isolated studies</li>
                          <li>Check if the information comes from organizations with relevant expertise</li>
                          <li>Be cautious of claims that are absolute or overly simplistic</li>
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