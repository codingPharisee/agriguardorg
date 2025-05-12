
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bug, Flame, ShieldCheck, TrendingUp, Twitter } from "lucide-react";

const RECENT_MYTHS = [
  {
    id: 1,
    title: "GMOs cause cancer",
    severity: "High",
    trend: "Rising",
    source: "Twitter",
  },
  {
    id: 2,
    title: "Organic food is pesticide-free",
    severity: "Medium",
    trend: "Stable",
    source: "Facebook",
  },
  {
    id: 3,
    title: "Eating local is always better",
    severity: "Low",
    trend: "Falling",
    source: "WhatsApp",
  },
  {
    id: 4,
    title: "Glyphosate is harmless",
    severity: "High",
    trend: "Rising",
    source: "Twitter",
  },
  {
    id: 5,
    title: "Bees are dying because of GMOs",
    severity: "Medium",
    trend: "Stable",
    source: "Blogs",
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

const ViralFarm = () => {
  return (
    <Card className="module-card">
      <CardHeader className="pb-2">
        <CardTitle className="module-header">
          <TrendingUp className="h-5 w-5" />
          ViralFarm
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Early detection of agricultural misinformation spreading online
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[450px] pr-4">
          <div className="space-y-4">
            {RECENT_MYTHS.map((myth) => {
              const severityVariant =
                SEVERITY_BADGE_VARIANTS[myth.severity as keyof typeof SEVERITY_BADGE_VARIANTS];
              const TrendIcon =
                TREND_ICONS[myth.trend as keyof typeof TREND_ICONS];
              const SourceIcon =
                SOURCE_ICONS[myth.source as keyof typeof SOURCE_ICONS];

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
                        <Badge variant={severityVariant}>{myth.severity}</Badge>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <SourceIcon className="h-4 w-4 text-muted-foreground" />
                      <TrendIcon className="h-6 w-6 text-red-500" />
                    </div>
                  </div>
                  <div className="pt-3 text-sm text-muted-foreground border-t mt-2">
                    <p>
                      Source: {myth.source} | Trend: {myth.trend}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <Alert className="mt-4">
          <AlertTitle>Mitigation Tips</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
              <li>
                Share verified information from trusted sources on your social
                media.
              </li>
              <li>
                Engage respectfully in conversations to correct
                misconceptions.
              </li>
              <li>Report misinformation to social media platforms.</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default ViralFarm;
