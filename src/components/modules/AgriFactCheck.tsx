
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Check, X, Loader2, Globe, Book } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Enhanced FAQ data from African agricultural organizations
const FAQS = [
  {
    id: 1,
    question: "Are GMOs safe for African farmers to use?",
    answer: "Scientific evidence supports that approved GMOs are safe to use and consume. Several African countries including South Africa, Kenya, Nigeria, and Ethiopia have adopted GMO crops with appropriate regulatory frameworks in place to ensure safety and effectiveness.",
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
    answer: "Many traditional farming methods incorporate sophisticated knowledge of local ecosystems developed over generations. These methods often include sustainable practices like intercropping, agroforestry, and natural pest management that are now being recognized by modern agricultural science as highly valuable, especially in the face of climate change.",
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
  "GMOs in African agriculture",
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

// Mock database of fact-checking responses
const FACT_CHECK_DATABASE = {
  "gmo": {
    isTrue: true,
    explanation: "Approved GMOs have been scientifically tested and are considered safe for consumption according to multiple African regulatory bodies including Kenya's National Biosafety Authority and South Africa's Department of Agriculture.",
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
  const [factCheckResult, setFactCheckResult] = useState<{
    isTrue: boolean | null;
    explanation: string;
    source: string;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedOrg === "all") {
      setFilteredFaqs(FAQS);
    } else {
      setFilteredFaqs(FAQS.filter(faq => faq.organization === selectedOrg));
    }
  }, [selectedOrg]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setFactCheckResult(null);
    
    // Simulate API call to fact-checking service
    setTimeout(() => {
      const lowercaseQuery = query.toLowerCase();
      let result = null;
      
      // Match query with appropriate response from database
      for (const [keyword, response] of Object.entries(FACT_CHECK_DATABASE)) {
        if (lowercaseQuery.includes(keyword)) {
          result = response;
          break;
        }
      }
      
      // Fallback response if no keyword matches
      if (!result) {
        result = {
          isTrue: null,
          explanation: "This specific claim requires more analysis. Consider consulting agricultural extension officers or check resources from FARA, AGRA, or other trusted African agricultural research organizations.",
          source: "General recommendation"
        };
      }
      
      setFactCheckResult(result);
      setIsLoading(false);
      setShowResults(true);
      
      toast({
        title: "Fact check complete",
        description: "Analysis based on data from African agricultural organizations",
      });
    }, 1500);
  };

  const handleTopicClick = (topic: string) => {
    setQuery(topic);
    setActiveTab("chat");
  };

  return (
    <Card className="module-card border-2 border-primary shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
      <CardHeader className="pb-2 bg-primary/10 rounded-t-lg">
        <CardTitle className="module-header">
          <MessageSquare className="h-5 w-5" />
          AgriFactCheck
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          African agricultural fact checking via AI chatbot and SMS system
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="mt-0 space-y-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                placeholder="Ask about agricultural claims or myths in Africa..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !query.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
            
            {showResults && factCheckResult && (
              <div className={`border-2 rounded-md p-4 space-y-2 animate-fade-in ${
                factCheckResult.isTrue === true ? 'border-green-500 bg-green-50/30' : 
                factCheckResult.isTrue === false ? 'border-red-500 bg-red-50/30' : 
                'border-amber-500 bg-amber-50/30'
              }`}>
                <div className="flex items-start gap-2">
                  <span className={`rounded-full p-1 mt-0.5 ${
                    factCheckResult.isTrue === true ? 'bg-green-500' : 
                    factCheckResult.isTrue === false ? 'bg-red-500' : 
                    'bg-amber-500'
                  }`}>
                    {factCheckResult.isTrue === true ? (
                      <Check className="h-3 w-3 text-white" />
                    ) : factCheckResult.isTrue === false ? (
                      <X className="h-3 w-3 text-white" />
                    ) : (
                      <MessageSquare className="h-3 w-3 text-white" />
                    )}
                  </span>
                  <div>
                    <p className="font-medium">
                      {factCheckResult.isTrue === true ? 'Claim is supported by evidence' : 
                       factCheckResult.isTrue === false ? 'Claim is not supported by evidence' : 
                       'Claim needs more context'}
                    </p>
                    <p className="text-sm mt-1">
                      {factCheckResult.explanation}
                    </p>
                  </div>
                </div>
                
                <div className="pt-2 text-sm text-muted-foreground border-t flex items-center gap-2">
                  <Globe className="h-3 w-3" />
                  <span>Source: {factCheckResult.source}</span>
                </div>
              </div>
            )}
            
            {!showResults && !isLoading && (
              <div className="flex flex-col items-center justify-center p-10 text-center border rounded-md bg-primary/5">
                <MessageSquare className="h-10 w-10 text-primary mb-2" />
                <p className="text-muted-foreground">Ask a question about agricultural myths or claims in Africa</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="faqs" className="mt-0">
            <div className="mb-4 flex items-center gap-2">
              <Book className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by organization:</span>
              <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="All Organizations" />
                </SelectTrigger>
                <SelectContent>
                  {ORGANIZATIONS.map((org) => (
                    <SelectItem key={org.value} value={org.value}>{org.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq) => (
                    <div key={faq.id} className="border rounded-md p-4 bg-card hover:bg-primary/5 transition-colors">
                      <h4 className="font-medium mb-2">{faq.question}</h4>
                      <p className="text-sm mb-2">{faq.answer}</p>
                      <p className="text-xs text-muted-foreground">Source: {faq.source}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No FAQs available for this organization
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="topics" className="mt-0">
            <p className="text-sm text-muted-foreground mb-4">Click on a topic to ask about it:</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_TOPICS.map((topic, index) => (
                <Badge 
                  key={index}
                  variant="outline"
                  className="text-sm py-2 px-3 cursor-pointer hover:bg-primary/10 transition-colors"
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
