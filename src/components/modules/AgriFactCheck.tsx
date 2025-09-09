
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Check, X, Loader2, Globe, Book, Languages, Mic, Volume2, Camera, Upload, Scan } from "lucide-react";
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [healthScanResult, setHealthScanResult] = useState<{
    condition: string;
    confidence: number;
    recommendations: string[];
    severity: string;
  } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
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

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 shadow-2xl">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-400/3 to-green-600/5"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-300/10 to-green-400/10 rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative p-6">
        {/* AgriGuard Logo and Header - Centered */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-2 bg-green-600/20 backdrop-blur-sm rounded-lg mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AG</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            AgriGuard Fact Check
          </h2>
          <p className="text-slate-400 text-sm max-w-md leading-relaxed">
            Verify agricultural information with AI-powered fact-checking. Get instant analysis 
            of farming claims, techniques, and practices based on scientific research and expert knowledge.
          </p>
        </div>
      
      {/* Feature Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div 
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 hover:bg-slate-700/50 transition-colors cursor-pointer group"
            onClick={() => setActiveTab("faqs")}
          >
            <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center mb-2 group-hover:bg-green-600/30 transition-colors">
              <Book className="h-4 w-4 text-green-400" />
            </div>
            <h3 className="text-white font-semibold text-xs mb-1">Saved FAQs</h3>
            <p className="text-slate-400 text-xs leading-tight">Quick access to verified agricultural FAQs.</p>
          </div>

          <div 
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 hover:bg-slate-700/50 transition-colors cursor-pointer group"
            onClick={() => setActiveTab("scan")}
          >
            <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center mb-2 group-hover:bg-green-600/30 transition-colors">
              <Scan className="h-4 w-4 text-green-400" />
            </div>
            <h3 className="text-white font-semibold text-xs mb-1">Crop Analysis</h3>
            <p className="text-slate-400 text-xs leading-tight">Upload images for AI diagnosis.</p>
          </div>

          <div 
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 hover:bg-slate-700/50 transition-colors cursor-pointer group"
            onClick={() => setActiveTab("topics")}
          >
            <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center mb-2 group-hover:bg-green-600/30 transition-colors">
              <Languages className="h-4 w-4 text-green-400" />
            </div>
            <h3 className="text-white font-semibold text-xs mb-1">Multilingual Support</h3>
            <p className="text-slate-400 text-xs leading-tight">Choose your preferred language.</p>
          </div>
        </div>


        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          
          <TabsContent value="chat" className="mt-0">
            {/* Language Selection */}
            <div className="mb-6 flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <Languages className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium text-slate-300">Language:</span>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-[200px] bg-slate-800 border-slate-700 text-white focus:border-green-500">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value} className="text-white hover:bg-slate-700">
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Main Input */}
            <div className="relative">
              <div className="flex items-center gap-3 p-4 bg-slate-800/70 border border-slate-700/50 rounded-2xl">
                <div className="p-2 bg-green-600/20 rounded-lg">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">AG</span>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-3">
                  <Input
                    placeholder={selectedLanguage === "sw" ? "Uliza kuhusu madai ya kilimo Afrika..." : 
                                selectedLanguage === "am" ? "ስለ አፍሪካ ግብርና አባባሎች ይጠይቁ..." :
                                selectedLanguage === "ha" ? "Yi tambaya game da da'awar noma a Afirka..." :
                                selectedLanguage === "yo" ? "Béèrè nípa àwọn ìjápọ̀ àgbàtójọ ní Áfíríkà..." :
                                selectedLanguage === "fr" ? "Posez des questions sur les affirmations agricoles en Afrique..." :
                                selectedLanguage === "ar" ? "اسأل عن الادعاءات الزراعية في أفريقيا..." :
                                "Type your prompt here..."}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 bg-transparent border-0 text-white placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                    disabled={isLoading}
                  />
                  <Button 
                    type="button"
                    onClick={handleVoiceRecording}
                    disabled={isLoading || isProcessing}
                    variant="ghost"
                    size="sm"
                    className={`text-slate-400 hover:text-white p-2 ${isRecording ? 'text-red-400' : ''}`}
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
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </form>
              </div>
            </div>
            
            {showResults && factCheckResult && (
              <div className={`mt-6 border rounded-2xl p-5 space-y-3 animate-fade-in backdrop-blur-sm ${
                factCheckResult.isTrue === true ? 'border-emerald-500/50 bg-emerald-900/20' : 
                factCheckResult.isTrue === false ? 'border-red-500/50 bg-red-900/20' : 
                'border-amber-500/50 bg-amber-900/20'
              }`}>
                <div className="flex items-start gap-3">
                  <span className={`rounded-full p-2 mt-0.5 shadow-sm ${
                    factCheckResult.isTrue === true ? 'bg-emerald-600' : 
                    factCheckResult.isTrue === false ? 'bg-red-600' : 
                    'bg-amber-600'
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
                    <div className="text-sm leading-relaxed text-slate-300 space-y-3">
                      {factCheckResult.explanation.split(/[.!?]+(?:\s+|$)/).filter(sentence => sentence.trim()).map((sentence, index) => (
                        <p key={index} className="mb-2 last:mb-0">
                          {sentence.trim()}{sentence.includes('.') || sentence.includes('!') || sentence.includes('?') ? '' : '.'}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="pt-3 text-sm text-slate-400 border-t border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-green-400" />
                    <span className="font-medium">Source:</span>
                    <span>{factCheckResult.source}</span>
                  </div>
                  <Button
                    onClick={handlePlayResponse}
                    disabled={isGenerating}
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-slate-400 hover:text-white hover:bg-slate-800"
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
              <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-slate-800/30 border border-slate-700/30 mt-6">
                <div className="p-4 bg-green-600/20 rounded-full mb-4">
                  <MessageSquare className="h-12 w-12 text-green-400" />
                </div>
                <p className="text-slate-300 font-medium">
                  {selectedLanguage === "sw" ? "Uliza swali kuhusu hadithi au madai ya kilimo Afrika" :
                   selectedLanguage === "am" ? "ስለ አፍሪካ ግብርና አወያይ ወይም ጥያቄዎች ይጠይቁ" :
                   selectedLanguage === "ha" ? "Yi tambaya game da tatsuniyoyi ko da'awar noma a Afirka" :
                   selectedLanguage === "yo" ? "Béèrè ìbéèrè nípa àwọn àròsọ tàbí ìjápọ̀ àgbàtójọ ní Áfíríkà" :
                   selectedLanguage === "fr" ? "Posez une question sur les mythes ou affirmations agricoles en Afrique" :
                   selectedLanguage === "ar" ? "اسأل سؤالاً عن الأساطير أو الادعاءات الزراعية في أفريقيا" :
                   "Ask a question about agricultural myths or claims in Africa"}
                </p>
                <p className="text-slate-500 text-sm mt-1">
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
          
          <TabsContent value="faqs" className="mt-0">
            <div className="mb-4 flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <Book className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium text-slate-300">Filter by organization:</span>
              <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                <SelectTrigger className="w-[240px] bg-slate-800 border-slate-700 text-white focus:border-green-500">
                  <SelectValue placeholder="All Organizations" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {ORGANIZATIONS.map((org) => (
                    <SelectItem key={org.value} value={org.value} className="text-white hover:bg-slate-700">{org.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <ScrollArea className="h-[320px] pr-4">
              <div className="space-y-4">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq) => (
                    <div key={faq.id} className="border border-slate-700/60 rounded-2xl p-4 bg-slate-800/40 backdrop-blur-sm hover:bg-slate-700/50 hover:border-slate-600/60 transition-all cursor-pointer">
                      <h4 className="font-semibold mb-3 text-white">{faq.question}</h4>
                      <p className="text-sm text-slate-300 mb-3 leading-relaxed">{faq.answer}</p>
                      <p className="text-xs text-green-400 font-medium bg-green-600/20 px-2 py-1 rounded inline-block">
                        Source: {faq.source}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Book className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                    No FAQs available for this organization
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="topics" className="mt-0">
            <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 mb-4">
              <p className="text-sm text-slate-300 font-medium mb-1">Popular Agricultural Topics</p>
              <p className="text-xs text-slate-500">Click on any topic to ask about it</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {COMMON_TOPICS.map((topic, index) => (
                <Badge 
                  key={index}
                  variant="outline"
                  className="text-sm py-2 px-4 cursor-pointer border-slate-700 text-slate-300 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all shadow-sm bg-slate-800/40 backdrop-blur-sm"
                  onClick={() => handleTopicClick(topic)}
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scan" className="mt-0">
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Scan className="h-5 w-5 text-green-400" />
                  <span className="text-sm font-medium text-slate-300">Crop & Livestock Health Scanner</span>
                </div>
                <p className="text-xs text-slate-500">Upload or capture an image of your crops or livestock to get AI-powered health analysis and recommendations</p>
              </div>

              {!selectedImage ? (
                <div className="space-y-3">
                  <div 
                    className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center hover:border-slate-600 transition-colors cursor-pointer bg-slate-800/30"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <Camera className="h-12 w-12 text-green-400 mx-auto mb-3" />
                    <p className="text-slate-300 font-medium mb-1">Upload or Capture Image</p>
                    <p className="text-sm text-slate-500">Click to select an image of your crops or livestock</p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedImage(file);
                        setImagePreview(URL.createObjectURL(file));
                        setHealthScanResult(null);
                      }
                    }}
                  />
                  <Button 
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={imagePreview!} 
                      alt="Selected crop/livestock" 
                      className="w-full h-64 object-cover rounded-2xl border border-slate-700"
                    />
                    <Button
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                        setHealthScanResult(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 h-auto"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    onClick={async () => {
                      if (!selectedImage) return;
                      
                      setIsScanning(true);
                      setHealthScanResult(null);
                      
                      try {
                        const formData = new FormData();
                        formData.append('image', selectedImage);
                        
                        const { data, error } = await supabase.functions.invoke('pest-identification', {
                          body: formData
                        });

                        if (error) throw error;

                        // Transform the pest identification response for health scanning
                        setHealthScanResult({
                          condition: data.pest_name || 'Unknown condition',
                          confidence: Math.round((data.confidence || 0) * 100),
                          recommendations: data.treatment_recommendations || ['No specific recommendations available'],
                          severity: data.confidence > 0.8 ? 'High' : data.confidence > 0.5 ? 'Medium' : 'Low'
                        });

                        toast({
                          title: "Health scan complete",
                          description: "AI analysis of your crop/livestock image is ready",
                        });
                      } catch (error) {
                        console.error('Error scanning image:', error);
                        toast({
                          title: "Scan failed",
                          description: "Unable to analyze the image. Please try again.",
                          variant: "destructive",
                        });
                      } finally {
                        setIsScanning(false);
                      }
                    }}
                    disabled={isScanning}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing Image...
                      </>
                    ) : (
                      <>
                        <Scan className="h-4 w-4 mr-2" />
                        Scan for Health Issues
                      </>
                    )}
                  </Button>
                </div>
              )}

              {healthScanResult && (
                <div className={`border-2 rounded-2xl p-5 space-y-3 animate-fade-in backdrop-blur-sm ${
                  healthScanResult.severity === 'High' ? 'border-red-500/50 bg-red-900/20' : 
                  healthScanResult.severity === 'Medium' ? 'border-amber-500/50 bg-amber-900/20' : 
                  'border-green-500/50 bg-green-900/20'
                }`}>
                  <div className="flex items-start gap-3">
                    <span className={`rounded-full p-2 mt-0.5 shadow-sm ${
                      healthScanResult.severity === 'High' ? 'bg-red-600' : 
                      healthScanResult.severity === 'Medium' ? 'bg-amber-600' : 
                      'bg-green-600'
                    }`}>
                      <Scan className="h-4 w-4 text-white" />
                    </span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-2">Health Analysis Results</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-slate-400">Detected Condition:</p>
                          <p className="text-base font-semibold text-white">{healthScanResult.condition}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm font-medium text-slate-400">Confidence:</p>
                            <p className="text-lg font-bold text-white">{healthScanResult.confidence}%</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-400">Severity:</p>
                            <Badge 
                              variant={healthScanResult.severity === 'High' ? 'destructive' : 
                                      healthScanResult.severity === 'Medium' ? 'default' : 'secondary'}
                              className="font-semibold"
                            >
                              {healthScanResult.severity}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-400 mb-2">Recommendations:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                            {healthScanResult.recommendations.map((rec, index) => (
                              <li key={index}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgriFactCheck;
