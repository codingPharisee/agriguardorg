
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Radar, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for the dashboard
const mockTrendingMyths = [
  {
    id: 1,
    claim: "GMOs cause cancer in laboratory animals",
    source: "Facebook",
    mentions: 342,
    rating: "False",
    trend: "rising",
  },
  {
    id: 2,
    claim: "New pesticide kills all bees within 10km radius",
    source: "WhatsApp",
    mentions: 289,
    rating: "Misleading",
    trend: "stable",
  },
  {
    id: 3,
    claim: "Organic farming produces higher yields than conventional",
    source: "Twitter",
    mentions: 211,
    rating: "Partly False",
    trend: "rising",
  },
  {
    id: 4,
    claim: "This new fertilizer doubles crop production overnight",
    source: "Radio",
    mentions: 187,
    rating: "Unverified",
    trend: "new",
  },
];

const ViralFarm = () => {
  const [activeTab, setActiveTab] = useState("trending");

  const getBadgeVariant = (rating: string) => {
    switch (rating.toLowerCase()) {
      case "false":
        return "destructive";
      case "misleading":
        return "warning";
      case "partly false":
        return "secondary";
      case "unverified":
        return "outline";
      default:
        return "default";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case "rising":
        return <TrendingUp className="h-4 w-4 text-destructive" />;
      case "stable":
        return <BarChart3 className="h-4 w-4 text-amber-500" />;
      case "new":
        return <Radar className="h-4 w-4 text-blue-500 animate-pulse-slow" />;
      default:
        return null;
    }
  };

  return (
    <Card className="module-card">
      <CardHeader className="pb-2">
        <CardTitle className="module-header">
          <Radar className="h-5 w-5" />
          ViralFarm
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          AI-powered detection of agricultural misinformation spreading on social media and radio
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trending" className="mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Trending Claims</h3>
                <Badge variant="outline" className="bg-primary/5">
                  Last 24 hours
                </Badge>
              </div>
              
              <div className="space-y-3">
                {mockTrendingMyths.map((myth) => (
                  <div 
                    key={myth.id}
                    className="p-3 border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between gap-2 mb-1">
                      <div className="font-medium">{myth.claim}</div>
                      <Badge variant={getBadgeVariant(myth.rating)}>
                        {myth.rating}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Source: {myth.source}</span>
                      <div className="flex items-center gap-1">
                        <span>{myth.mentions} mentions</span>
                        {getTrendIcon(myth.trend)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sources" className="mt-0">
            <div className="flex items-center justify-center h-[200px] border rounded-md bg-gray-50">
              <p className="text-muted-foreground">Source analytics will be shown here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="alerts" className="mt-0">
            <div className="flex items-center justify-center h-[200px] border rounded-md bg-gray-50">
              <p className="text-muted-foreground">Real-time alerts will be shown here</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ViralFarm;
