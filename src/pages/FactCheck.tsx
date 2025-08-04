import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Search, Check, X, Loader2, Home } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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

const FactCheck = () => {
  const [query, setQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("auto");
  const [isLoading, setIsLoading] = useState(false);
  const [factCheckResults, setFactCheckResults] = useState<null | {
    isTrue: boolean | null;
    explanation: string;
    source: string;
  }>(null);
  const [activeTab, setActiveTab] = useState("search");
  const { toast } = useToast();
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setFactCheckResults(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('rag-fact-check', {
        body: { query: query.trim(), language: selectedLanguage }
      });

      if (error) throw error;

      setFactCheckResults(data);
      
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
    setActiveTab("search");
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
                    <form onSubmit={handleSearch} className="space-y-4">
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
                      <div className="flex gap-2">
                        <Input
                          placeholder={selectedLanguage === 'sw' ? "Ingiza madai ya kilimo kwa ukaguzi..." : 
                                     selectedLanguage === 'am' ? "የግብርና ክስተትን ለማረጋገጥ ያስገቡ..." :
                                     selectedLanguage === 'ha' ? "Shigar da ikirarin aikin gona don bincike..." :
                                     selectedLanguage === 'fr' ? "Entrez une affirmation agricole à vérifier..." :
                                     selectedLanguage === 'ar' ? "أدخل ادعاءً زراعياً للتحقق منه..." :
                                     "Enter an agricultural claim to fact check..."}
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          disabled={isLoading}
                          className="flex-1"
                        />
                        <Button type="submit" disabled={isLoading || !query.trim()}>
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                          {!isLoading && <span className="ml-1 hidden sm:inline">Check</span>}
                        </Button>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        Example: "Are drought-resistant crops effective in Africa?" or "Do organic methods work better in African farming?"
                      </p>
                    </form>
                    
                    {factCheckResults && (
                      <div className={`mt-6 p-4 rounded-lg border ${
                        factCheckResults.isTrue === true ? 'bg-green-50 border-green-200' : 
                        factCheckResults.isTrue === false ? 'bg-red-50 border-red-200' : 
                        'bg-yellow-50 border-yellow-200'
                      }`}>
                        <div className="flex items-start gap-2">
                          <div className={`rounded-full p-1 mt-0.5 ${
                            factCheckResults.isTrue === true ? 'bg-green-500' : 
                            factCheckResults.isTrue === false ? 'bg-red-500' : 
                            'bg-yellow-500'
                          }`}>
                            {factCheckResults.isTrue === true ? (
                              <Check className="h-3 w-3 text-white" />
                            ) : factCheckResults.isTrue === false ? (
                              <X className="h-3 w-3 text-white" />
                            ) : (
                              <Search className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="mt-1 text-sm">{factCheckResults.explanation}</p>
                            <p className="mt-3 text-xs text-muted-foreground">Source: {factCheckResults.source}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {!factCheckResults && !isLoading && (
                      <div className="flex flex-col items-center justify-center p-10 text-center border rounded-md bg-gray-50">
                        <MessageSquare className="h-10 w-10 text-muted-foreground/50 mb-2" />
                        <p className="text-muted-foreground">Enter a claim about agriculture to fact check using AI</p>
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
