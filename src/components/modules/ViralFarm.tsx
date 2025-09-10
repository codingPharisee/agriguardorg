
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Bug, 
  Flame, 
  ShieldCheck, 
  TrendingUp, 
  Twitter, 
  RefreshCw,
  Info,
  ChartBar,
  Filter,
  SlidersHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChartContainer } from "@/components/ui/chart";
import { 
  Legend,
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid, 
} from "recharts";
import { useToast } from "@/hooks/use-toast";

const INITIAL_MYTHS = [
  {
    id: 1,
    title: "Modern crop breeding causes cancer",
    severity: "High",
    trend: "Rising",
    source: "Twitter",
    timestamp: new Date().getTime() - 24 * 60 * 60 * 1000,
    engagementRate: 89,
  },
  {
    id: 2,
    title: "Organic food is pesticide-free",
    severity: "Medium",
    trend: "Stable",
    source: "Facebook",
    timestamp: new Date().getTime() - 36 * 60 * 60 * 1000,
    engagementRate: 72,
  },
  {
    id: 3,
    title: "Eating local is always better",
    severity: "Low",
    trend: "Falling",
    source: "WhatsApp",
    timestamp: new Date().getTime() - 48 * 60 * 60 * 1000,
    engagementRate: 34,
  },
  {
    id: 4,
    title: "Glyphosate is harmless",
    severity: "High",
    trend: "Rising",
    source: "Twitter",
    timestamp: new Date().getTime() - 12 * 60 * 60 * 1000,
    engagementRate: 91,
  },
  {
    id: 5,
    title: "Bees are dying because of agricultural technologies",
    severity: "Medium",
    trend: "Stable",
    source: "Blogs",
    timestamp: new Date().getTime() - 60 * 60 * 1000,
    engagementRate: 68,
  },
];

// Additional myths for simulating real-time data
const ADDITIONAL_MYTHS = [
  {
    id: 6,
    title: "Regenerative agriculture is a scam",
    severity: "Medium",
    trend: "Rising",
    source: "Twitter",
    timestamp: new Date().getTime(),
    engagementRate: 76,
  },
  {
    id: 7,
    title: "Soil health doesn't affect crop yields",
    severity: "High",
    trend: "Rising",
    source: "Facebook",
    timestamp: new Date().getTime(),
    engagementRate: 83,
  },
  {
    id: 8,
    title: "All synthetic fertilizers are dangerous",
    severity: "Medium",
    trend: "Stable",
    source: "Blogs",
    timestamp: new Date().getTime(),
    engagementRate: 64,
  },
];

const SEVERITY_BADGE_VARIANTS = {
  High: "destructive",
  Medium: "secondary",
  Low: "outline",
} as const;

const TREND_ICONS = {
  Rising: TrendingUp,
  Stable: ShieldCheck,
  Falling: Flame,
};

const SOURCE_ICONS = {
  Twitter: Twitter,
  Facebook: Bug,
  WhatsApp: Bug,
  Blogs: Bug,
};

const generateTimeSeriesData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 7; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      twitter: Math.floor(Math.random() * 50) + 30,
      facebook: Math.floor(Math.random() * 40) + 20,
      whatsapp: Math.floor(Math.random() * 30) + 10,
      blogs: Math.floor(Math.random() * 20) + 5,
    });
  }
  
  return data;
};

const ViralFarm = ({ fullPage = false }) => {
  const [myths, setMyths] = useState(INITIAL_MYTHS);
  const [loading, setLoading] = useState(false);
  const [timeSeriesData, setTimeSeriesData] = useState(generateTimeSeriesData());
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const { toast } = useToast();
  
  // Filter function for myths
  const [filter, setFilter] = useState<{
    severity?: "High" | "Medium" | "Low";
    trend?: "Rising" | "Stable" | "Falling";
    source?: "Twitter" | "Facebook" | "WhatsApp" | "Blogs";
  }>({});
  
  // Function to simulate real-time data fetching
  const fetchRealTimeData = async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Randomly add a new myth, update trends, and shuffle order
    const updatedMyths = [...myths];
    
    // 33% chance to add a new myth
    if (Math.random() > 0.66 && ADDITIONAL_MYTHS.length > 0) {
      const newMythIndex = Math.floor(Math.random() * ADDITIONAL_MYTHS.length);
      const newMyth = {
        ...ADDITIONAL_MYTHS[newMythIndex],
        timestamp: new Date().getTime(),
      };
      updatedMyths.unshift(newMyth);
      
      // Show toast notification for new myth
      toast({
        title: "New Misinformation Detected",
        description: newMyth.title,
        variant: "destructive",
      });
      
      // Remove from additional myths to avoid duplicates
      ADDITIONAL_MYTHS.splice(newMythIndex, 1);
    }
    
    // Update trends randomly for some myths
    updatedMyths.forEach(myth => {
      if (Math.random() > 0.7) {
        const trends = ["Rising", "Stable", "Falling"];
        const currentIndex = trends.indexOf(myth.trend);
        const possibleTrends = trends.filter((_, i) => i !== currentIndex);
        const previousTrend = myth.trend;
        myth.trend = possibleTrends[Math.floor(Math.random() * possibleTrends.length)];
        
        // If trend changed from not rising to rising, show toast
        if (previousTrend !== "Rising" && myth.trend === "Rising" && myth.severity === "High") {
          toast({
            title: "Alert: Trend Change",
            description: `"${myth.title}" is now rapidly spreading`,
            variant: "default",
          });
        }
        
        // Update engagement rate based on trend
        if (myth.trend === "Rising") {
          myth.engagementRate = Math.min(100, myth.engagementRate + Math.floor(Math.random() * 10));
        } else if (myth.trend === "Falling") {
          myth.engagementRate = Math.max(10, myth.engagementRate - Math.floor(Math.random() * 10));
        }
      }
    });
    
    // Update time series data
    const newTimeSeriesPoint = {
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      twitter: timeSeriesData[timeSeriesData.length - 1].twitter + Math.floor(Math.random() * 20 - 10),
      facebook: timeSeriesData[timeSeriesData.length - 1].facebook + Math.floor(Math.random() * 20 - 10),
      whatsapp: timeSeriesData[timeSeriesData.length - 1].whatsapp + Math.floor(Math.random() * 20 - 10),
      blogs: timeSeriesData[timeSeriesData.length - 1].blogs + Math.floor(Math.random() * 20 - 10),
    };
    
    // Ensure values stay positive
    Object.keys(newTimeSeriesPoint).forEach(key => {
      if (key !== 'date' && newTimeSeriesPoint[key] < 0) {
        newTimeSeriesPoint[key] = Math.floor(Math.random() * 10) + 1;
      }
    });
    
    const updatedTimeSeriesData = [...timeSeriesData.slice(1), newTimeSeriesPoint];
    
    setMyths(updatedMyths.slice(0, 10)); // Limit to 10 myths
    setTimeSeriesData(updatedTimeSeriesData);
    setLastUpdated(new Date());
    setLoading(false);
  };
  
  // Handle auto-refresh toggle
  const toggleAutoRefresh = () => {
    setAutoRefresh(prev => !prev);
    if (!autoRefresh) {
      toast({
        title: "Auto-refresh enabled",
        description: `Data will refresh every ${refreshInterval} seconds`,
      });
    }
  };
  
  // Set up auto-refresh interval
  useEffect(() => {
    let intervalId: number | undefined;
    
    if (fullPage && autoRefresh) {
      intervalId = window.setInterval(fetchRealTimeData, refreshInterval * 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, refreshInterval, fullPage]);
  
  // Initial data fetch
  useEffect(() => {
    if (fullPage) {
      fetchRealTimeData();
    }
  }, []);
  
  // Filter myths based on selected filters
  const filteredMyths = myths.filter(myth => {
    if (filter.severity && myth.severity !== filter.severity) return false;
    if (filter.trend && myth.trend !== filter.trend) return false;
    if (filter.source && myth.source !== filter.source) return false;
    return true;
  });
  
  // Function to clear all filters
  const clearFilters = () => {
    setFilter({});
    setActiveSource(null);
  };
  
  // Handle chart legend click - FIX for TypeScript error
  const handleLegendClick = (data: any) => {
    if (typeof data.dataKey === 'string') {
      setActiveSource(activeSource === data.dataKey ? null : data.dataKey);
    }
  };
  
  // Component to render the myths list
  const MythsList = () => (
    <ScrollArea className={fullPage ? "h-[600px] pr-4" : "h-[280px] pr-4"}>
      <div className="space-y-4">
        {filteredMyths.slice(0, 3).map((myth) => {
          const severityVariant = 
            SEVERITY_BADGE_VARIANTS[myth.severity as keyof typeof SEVERITY_BADGE_VARIANTS];
          const TrendIcon = TREND_ICONS[myth.trend as keyof typeof TREND_ICONS];
          const SourceIcon = SOURCE_ICONS[myth.source as keyof typeof SOURCE_ICONS];
          
          // Calculate how long ago the myth was detected
          const timeAgo = Math.floor((new Date().getTime() - myth.timestamp) / (1000 * 60 * 60));
          const timeAgoText = timeAgo < 1 
            ? 'Just now' 
            : timeAgo === 1 
              ? '1 hour ago' 
              : `${timeAgo} hours ago`;

          return (
            <div
              key={myth.id}
              className="border rounded-md p-4 bg-card hover:bg-secondary/50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium mb-1">{myth.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    Severity:
                    <Badge 
                      variant={severityVariant}
                      className="cursor-pointer hover:opacity-80"
                      onClick={() => setFilter({...filter, severity: myth.severity as any})}
                    >
                      {myth.severity}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <SourceIcon 
                    className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary"
                    onClick={() => setFilter({...filter, source: myth.source as any})}
                  />
                  <TrendIcon 
                    className={cn(
                      "h-6 w-6 cursor-pointer hover:opacity-80",
                      myth.trend === "Rising" ? "text-red-500" : 
                      myth.trend === "Falling" ? "text-green-500" : "text-amber-500"
                    )}
                    onClick={() => setFilter({...filter, trend: myth.trend as any})}
                  />
                </div>
              </div>
              <div className="pt-3 text-sm text-muted-foreground border-t mt-2 flex justify-between items-center">
                <p>
                  Source: {myth.source} | Trend: {myth.trend}
                </p>
                <span className="text-xs italic">{timeAgoText}</span>
              </div>
              {fullPage && (
                <div className="mt-2 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Engagement Rate:</span>
                    <span className={cn(
                      "text-sm font-medium",
                      myth.engagementRate > 75 ? "text-red-500" : 
                      myth.engagementRate > 50 ? "text-amber-500" : "text-green-500"
                    )}>
                      {myth.engagementRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div 
                      className={cn(
                        "h-2.5 rounded-full",
                        myth.engagementRate > 75 ? "bg-red-500" : 
                        myth.engagementRate > 50 ? "bg-amber-500" : "bg-green-500"
                      )}
                      style={{ width: `${myth.engagementRate}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filteredMyths.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Info className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>No myths found matching your filters</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2" 
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  );
  
  // Component for the trend chart
  const TrendChart = () => (
    <div className={cn("mt-6", fullPage ? "h-[300px]" : "h-[200px]")}>
      <h4 className="font-medium mb-2 flex items-center justify-between">
        <span>Misinformation Trend Analysis</span>
        {activeSource && (
          <Badge 
            variant="outline" 
            className="cursor-pointer flex items-center gap-1"
            onClick={() => setActiveSource(null)}
          >
            {activeSource} <span className="text-xs">×</span>
          </Badge>
        )}
      </h4>
      <ChartContainer
        className="h-full"
        config={{
          twitter: {
            label: "Twitter",
            theme: {
              light: "#1DA1F2",
              dark: "#1DA1F2",
            },
          },
          facebook: {
            label: "Facebook",
            theme: {
              light: "#4267B2",
              dark: "#4267B2",
            },
          },
          whatsapp: {
            label: "WhatsApp",
            theme: {
              light: "#25D366",
              dark: "#25D366",
            },
          },
          blogs: {
            label: "Blogs",
            theme: {
              light: "#FF5700",
              dark: "#FF5700",
            },
          },
        }}
      >
        <LineChart data={timeSeriesData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            label={{ 
              value: 'Misinformation Rate', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fontSize: 12 }
            }} 
          />
          <Tooltip />
          <Legend onClick={handleLegendClick} />
          {(!activeSource || activeSource === "twitter") && (
            <Line 
              type="monotone" 
              dataKey="twitter" 
              name="Twitter"
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          )}
          {(!activeSource || activeSource === "facebook") && (
            <Line 
              type="monotone" 
              dataKey="facebook" 
              name="Facebook"
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          )}
          {(!activeSource || activeSource === "whatsapp") && (
            <Line 
              type="monotone" 
              dataKey="whatsapp" 
              name="WhatsApp"
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          )}
          {(!activeSource || activeSource === "blogs") && (
            <Line 
              type="monotone" 
              dataKey="blogs" 
              name="Blogs"
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          )}
        </LineChart>
      </ChartContainer>
    </div>
  );
  
  // Settings panel for auto-refresh and interval
  const SettingsPanel = () => (
    <div className="mt-4 flex flex-col gap-2 p-4 bg-primary-dark/5 rounded-lg">
      <h4 className="font-medium flex items-center gap-2 mb-2">
        <SlidersHorizontal className="h-4 w-4" />
        Monitoring Settings
      </h4>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">Auto-refresh data:</span>
          <button
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
              autoRefresh ? "bg-primary" : "bg-gray-300"
            )}
            onClick={toggleAutoRefresh}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                autoRefresh ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Interval:</span>
          <select
            className="rounded border p-1 text-sm"
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            disabled={!autoRefresh}
          >
            <option value="5">5s</option>
            <option value="10">10s</option>
            <option value="30">30s</option>
            <option value="60">1m</option>
          </select>
        </div>
      </div>
    </div>
  );
  
  return (
    <Card className={cn("module-card", fullPage && "w-full max-w-5xl mx-auto")}>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <CardTitle className="module-header flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            ViralFarm
            {fullPage && (
              <Badge variant="outline" className="ml-2 text-xs">Real-time</Badge>
            )}
          </CardTitle>
          {fullPage && (
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                onClick={fetchRealTimeData} 
                disabled={loading}
                className="gap-1"
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                Refresh
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={clearFilters}
                disabled={!filter.severity && !filter.trend && !filter.source}
                className="gap-1"
              >
                <Filter className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Early detection of agricultural misinformation spreading online
          {fullPage && (
            <span className="block mt-1 text-xs">
              Last updated: {lastUpdated.toLocaleString()}
            </span>
          )}
        </p>
        {fullPage && Object.keys(filter).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {filter.severity && (
              <Badge 
                variant={SEVERITY_BADGE_VARIANTS[filter.severity]} 
                className="cursor-pointer flex items-center gap-1"
                onClick={() => setFilter({...filter, severity: undefined})}
              >
                Severity: {filter.severity} <span className="text-xs">×</span>
              </Badge>
            )}
            {filter.trend && (
              <Badge 
                variant="outline" 
                className="cursor-pointer flex items-center gap-1"
                onClick={() => setFilter({...filter, trend: undefined})}
              >
                Trend: {filter.trend} <span className="text-xs">×</span>
              </Badge>
            )}
            {filter.source && (
              <Badge 
                variant="outline"
                className="cursor-pointer flex items-center gap-1" 
                onClick={() => setFilter({...filter, source: undefined})}
              >
                Source: {filter.source} <span className="text-xs">×</span>
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <MythsList />
        
        {fullPage && <TrendChart />}
        
        {fullPage && <SettingsPanel />}
        
        <Alert className="mt-4">
          <AlertTitle className="flex items-center gap-2">
            <ChartBar className="h-4 w-4" />
            Mitigation Tips
          </AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
              <li>
                Share verified information from trusted sources on your social media.
              </li>
              <li>
                Engage respectfully in conversations to correct misconceptions.
              </li>
              <li>Report misinformation to social media platforms.</li>
              {fullPage && (
                <>
                  <li>Access factual responses to common agricultural myths from reliable sources.</li>
                  <li>Monitor trending agricultural topics to stay ahead of misinformation waves.</li>
                </>
              )}
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default ViralFarm;
