import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgricultureItem } from "./AgricultureGuide";

interface AgricultureCardProps {
  item: AgricultureItem;
  onClick: () => void;
}

const AgricultureCard: React.FC<AgricultureCardProps> = ({ item, onClick }) => {
  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden border border-border/50 hover:border-primary/20"
      onClick={onClick}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          <Badge 
            variant="secondary" 
            className="ml-2 shrink-0 bg-primary/10 text-primary border-primary/20"
          >
            {item.type}
          </Badge>
        </div>
        
        <Badge 
          variant="outline" 
          className="text-xs border-accent/50 text-accent-foreground bg-accent/10"
        >
          {item.primaryTrait}
        </Badge>
        
        <div className="mt-3 mb-2">
          <Badge 
            className={`text-xs font-bold ${
              item.verdict === "CONFIRMED" 
                ? "bg-green-500/20 text-green-700 border-green-500/30"
                : item.verdict === "BUSTED"
                ? "bg-red-500/20 text-red-700 border-red-500/30" 
                : "bg-yellow-500/20 text-yellow-700 border-yellow-500/30"
            }`}
          >
            {item.verdict}
          </Badge>
        </div>
        
        <div className="mt-2 flex items-center text-xs text-muted-foreground">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            item.status === "Commercially Available" 
              ? "bg-green-500" 
              : "bg-yellow-500"
          }`} />
          {item.status}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgricultureCard;