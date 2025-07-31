import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GMOItem } from "./GMOGuide";

interface GMOModalProps {
  item: GMOItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const GMOModal: React.FC<GMOModalProps> = ({ item, isOpen, onClose }) => {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute -right-2 -top-2 h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogTitle className="text-2xl font-bold pr-8">
            {item.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Image */}
          <div className="aspect-[16/9] overflow-hidden rounded-lg">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Key Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Primary Trait</h4>
              <Badge variant="default" className="bg-primary text-primary-foreground">
                {item.primaryTrait}
              </Badge>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Type</h4>
              <Badge variant="secondary">
                {item.type}
              </Badge>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Status</h4>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  item.status === "Commercially Available" 
                    ? "bg-green-500" 
                    : "bg-yellow-500"
                }`} />
                <span className="text-sm font-medium">{item.status}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-bold text-lg mb-3">Description</h4>
            <p className="text-muted-foreground leading-relaxed">
              {item.descriptionText}
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h4 className="font-bold text-lg mb-3">Key Benefits</h4>
            <ul className="space-y-2">
              {item.benefitsList.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Comparison Image (if available) */}
          {item.comparisonImageUrl && (
            <div>
              <h4 className="font-bold text-lg mb-3">Comparison</h4>
              <div className="aspect-[16/9] overflow-hidden rounded-lg border">
                <img
                  src={item.comparisonImageUrl}
                  alt={`${item.name} comparison`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GMOModal;