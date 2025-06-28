
import React from "react";
import { Check, X, MessageSquare, Globe, Book, Sparkles, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FactCheckResultProps {
  result: {
    isTrue: boolean | null;
    explanation: string;
    source: string;
    confidence?: string;
    retrievedDocs?: number;
    hasCustomDocs?: boolean;
    enhancedWithAI?: boolean;
  };
}

const AgriFactCheckResults = ({ result }: FactCheckResultProps) => {
  return (
    <div className={`border-2 rounded-lg p-5 space-y-4 animate-fade-in backdrop-blur-sm ${
      result.isTrue === true ? 'border-emerald-400 bg-emerald-50/80' : 
      result.isTrue === false ? 'border-red-400 bg-red-50/80' : 
      'border-amber-400 bg-amber-50/80'
    }`}>
      <div className="flex items-start gap-3">
        <span className={`rounded-full p-2 mt-0.5 shadow-sm ${
          result.isTrue === true ? 'bg-emerald-500' : 
          result.isTrue === false ? 'bg-red-500' : 
          'bg-amber-500'
        }`}>
          {result.isTrue === true ? (
            <Check className="h-4 w-4 text-white" />
          ) : result.isTrue === false ? (
            <X className="h-4 w-4 text-white" />
          ) : (
            <MessageSquare className="h-4 w-4 text-white" />
          )}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            {result.enhancedWithAI && (
              <Badge variant="outline" className="bg-purple-50 border-purple-300 text-purple-700">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Enhanced
              </Badge>
            )}
            {result.confidence && (
              <Badge variant="outline" className={`text-xs ${
                result.confidence === 'high' ? 'border-green-400 text-green-700' :
                result.confidence === 'low' ? 'border-red-400 text-red-700' :
                'border-yellow-400 text-yellow-700'
              }`}>
                {result.confidence} confidence
              </Badge>
            )}
          </div>
          
          <div className="prose prose-sm max-w-none">
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
              {result.explanation}
            </p>
          </div>
        </div>
      </div>
      
      <div className="pt-3 space-y-2 text-sm text-gray-600 border-t border-gray-200/60">
        <div className="flex items-start gap-2">
          <Globe className="h-4 w-4 text-green-600 mt-0.5" />
          <div>
            <span className="font-medium">Sources: </span>
            <span>{result.source}</span>
          </div>
        </div>
        
        {result.retrievedDocs !== undefined && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {result.hasCustomDocs ? (
              <>
                <Database className="h-3 w-3" />
                <span>Analyzed {result.retrievedDocs} custom documents + OpenAI knowledge</span>
              </>
            ) : (
              <>
                <Book className="h-3 w-3" />
                <span>Based on OpenAI agricultural knowledge (no custom documents matched)</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgriFactCheckResults;
