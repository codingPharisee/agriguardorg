import React from "react";
import { Button } from "@/components/ui/button";

interface GMOFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  selectedSecondaryFilter: string;
  onSecondaryFilterChange: (filter: string) => void;
}

const primaryFilters = ["All", "Crops", "Animals"];
const cropTraits = [
  "Insect Resistance",
  "Herbicide Tolerance", 
  "Disease Resistance",
  "Nutritional Enhancement"
];

const GMOFilters: React.FC<GMOFiltersProps> = ({
  selectedFilter,
  onFilterChange,
  selectedSecondaryFilter,
  onSecondaryFilterChange,
}) => {
  return (
    <div className="flex flex-col space-y-6">
      {/* Primary Filters */}
      <div className="flex flex-wrap justify-center gap-3">
        {primaryFilters.map((filter) => (
          <Button
            key={filter}
            variant={selectedFilter === filter ? "default" : "outline"}
            onClick={() => {
              onFilterChange(filter);
              onSecondaryFilterChange(""); // Reset secondary filter
            }}
            className="px-6 py-2 rounded-full font-medium transition-all duration-200 hover:scale-105"
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Secondary Filters - Only show when "Crops" is selected */}
      {selectedFilter === "Crops" && (
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant={selectedSecondaryFilter === "" ? "default" : "ghost"}
            size="sm"
            onClick={() => onSecondaryFilterChange("")}
            className="px-4 py-1 rounded-full text-sm transition-all duration-200"
          >
            All Traits
          </Button>
          {cropTraits.map((trait) => (
            <Button
              key={trait}
              variant={selectedSecondaryFilter === trait ? "default" : "ghost"}
              size="sm"
              onClick={() => onSecondaryFilterChange(trait)}
              className="px-4 py-1 rounded-full text-sm transition-all duration-200"
            >
              {trait}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GMOFilters;