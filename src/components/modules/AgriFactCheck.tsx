
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Check, X, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

// Mock FAQ data
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
];

const AgriFactCheck = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
      toast({
        title: "Fact check complete",
        description: "We've found information related to your query",
      });
    }, 1500);
  };

  return (
    <Card className="module-card">
      <CardHeader className="pb-2">
        <CardTitle className="module-header">
          <MessageSquare className="h-5 w-5" />
          AgriFactCheck
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Instant agricultural fact checking via AI chatbot and SMS system
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="faqs">Common FAQs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="mt-0 space-y-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                placeholder="Ask about an agricultural claim or myth..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !query.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
            
            {showResults && (
              <div className="border rounded-md p-4 bg-primary/5 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="bg-primary-dark rounded-full p-1 mt-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                  <div>
                    <p className="font-medium">Claim Assessment</p>
                    <p className="text-sm">
                      Based on scientific evidence, GMOs are safe for human consumption according to major health organizations worldwide.
                    </p>
                  </div>
                </div>
                
                <div className="pt-2 text-sm text-muted-foreground border-t">
                  <p className="font-medium">Source:</p>
                  <p>World Health Organization (WHO), National Academy of Sciences, and the American Medical Association</p>
                </div>
              </div>
            )}
            
            {!showResults && !isLoading && (
              <div className="flex flex-col items-center justify-center p-10 text-center border rounded-md bg-gray-50">
                <MessageSquare className="h-10 w-10 text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground">Ask a question about agricultural myths or claims</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="faqs" className="mt-0">
            <ScrollArea className="h-[350px] pr-4">
              <div className="space-y-4">
                {FAQS.map((faq) => (
                  <div key={faq.id} className="border rounded-md p-4 bg-card hover:bg-secondary/50 transition-colors">
                    <h4 className="font-medium mb-2">{faq.question}</h4>
                    <p className="text-sm mb-2">{faq.answer}</p>
                    <p className="text-xs text-muted-foreground">Source: {faq.source}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AgriFactCheck;
