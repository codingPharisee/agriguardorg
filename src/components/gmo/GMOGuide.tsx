import React, { useState } from "react";
import GMOFilters from "./GMOFilters";
import GMOCard from "./GMOCard";
import GMOModal from "./GMOModal";

export interface GMOItem {
  id: string;
  name: string;
  type: "Crop" | "Animal";
  primaryTrait: string;
  imageUrl: string;
  descriptionText: string;
  benefitsList: string[];
  status: string;
  comparisonImageUrl?: string;
  secondaryTraits?: string[];
}

// Sample data based on ISAAA GM approval database
const gmoData: GMOItem[] = [
  {
    id: "1",
    name: "Bt Cotton",
    type: "Crop",
    primaryTrait: "Insect Resistance",
    imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop",
    descriptionText: "Bt cotton is genetically modified to produce Bacillus thuringiensis (Bt) toxin, which provides resistance against certain lepidopteran pests, particularly bollworm. This modification reduces the need for chemical insecticides and helps farmers maintain crop yields.",
    benefitsList: [
      "Reduced pesticide use by up to 50%",
      "Higher crop yields and quality",
      "Lower production costs",
      "Reduced environmental impact",
      "Safer for beneficial insects"
    ],
    status: "Commercially Available",
    secondaryTraits: ["Insect Resistance"]
  },
  {
    id: "2",
    name: "Roundup Ready Soybeans",
    type: "Crop",
    primaryTrait: "Herbicide Tolerance",
    imageUrl: "https://images.unsplash.com/photo-1571146175780-0e2d8a97e840?w=800&h=600&fit=crop",
    descriptionText: "These soybeans are genetically modified to be tolerant to glyphosate herbicide, allowing farmers to control weeds more effectively while preserving the crop. This technology simplifies weed management and reduces labor costs.",
    benefitsList: [
      "Effective weed control",
      "Reduced tillage requirements",
      "Lower labor costs",
      "Increased crop yields",
      "Simplified farm management"
    ],
    status: "Commercially Available",
    secondaryTraits: ["Herbicide Tolerance"]
  },
  {
    id: "3",
    name: "Golden Rice",
    type: "Crop",
    primaryTrait: "Nutritional Enhancement",
    imageUrl: "https://images.unsplash.com/photo-1550653727-21d4db5b0b6e?w=800&h=600&fit=crop",
    descriptionText: "Golden Rice is genetically modified to produce beta-carotene (Vitamin A precursor) in the grain. It was developed to address Vitamin A deficiency, particularly in developing countries where rice is a staple food.",
    benefitsList: [
      "Addresses Vitamin A deficiency",
      "Reduces childhood blindness",
      "Improves maternal health",
      "No change in taste or cooking properties",
      "Sustainable nutritional solution"
    ],
    status: "Under Development",
    secondaryTraits: ["Nutritional Enhancement"]
  },
  {
    id: "4",
    name: "AquAdvantage Salmon",
    type: "Animal",
    primaryTrait: "Rapid Growth",
    imageUrl: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800&h=600&fit=crop",
    descriptionText: "AquAdvantage Salmon is genetically modified to grow faster than conventional Atlantic salmon by incorporating a growth hormone gene from Chinook salmon. This allows the fish to reach market size in approximately half the time.",
    benefitsList: [
      "Faster growth to market size",
      "Reduced feed requirements",
      "Lower environmental impact",
      "Year-round production capability",
      "Same nutritional profile as conventional salmon"
    ],
    status: "Commercially Available"
  },
  {
    id: "5",
    name: "Bt Corn",
    type: "Crop",
    primaryTrait: "Insect Resistance",
    imageUrl: "https://images.unsplash.com/photo-1569375742-1a2896a4f4bb?w=800&h=600&fit=crop",
    descriptionText: "Bt corn is genetically modified to produce proteins from Bacillus thuringiensis that are toxic to certain insect pests, particularly corn borers and rootworms. This reduces crop damage and the need for chemical insecticides.",
    benefitsList: [
      "Protection against corn borers and rootworms",
      "Reduced mycotoxin levels",
      "Higher grain quality",
      "Decreased pesticide applications",
      "Improved farmer safety"
    ],
    status: "Commercially Available",
    secondaryTraits: ["Insect Resistance"]
  },
  {
    id: "6",
    name: "Virus-Resistant Papaya",
    type: "Crop",
    primaryTrait: "Disease Resistance",
    imageUrl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&h=600&fit=crop",
    descriptionText: "This papaya variety is genetically modified to resist Papaya Ringspot Virus (PRSV), which can devastate entire papaya orchards. The modification involves incorporating viral proteins that provide immunity to the virus.",
    benefitsList: [
      "Complete resistance to PRSV",
      "Saved the Hawaiian papaya industry",
      "Maintained fruit quality and taste",
      "Reduced crop losses",
      "Sustainable disease management"
    ],
    status: "Commercially Available",
    secondaryTraits: ["Disease Resistance"]
  }
];

const GMOGuide: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [selectedSecondaryFilter, setSelectedSecondaryFilter] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<GMOItem | null>(null);

  const filteredItems = gmoData.filter(item => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Crops") {
      if (selectedSecondaryFilter) {
        return item.type === "Crop" && item.secondaryTraits?.includes(selectedSecondaryFilter);
      }
      return item.type === "Crop";
    }
    if (selectedFilter === "Animals") {
      return item.type === "Animal";
    }
    return true;
  });

  return (
    <section className="py-16 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            A Guide to Genetically Modified Organisms (GMOs)
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore the world of genetically modified crops and animals. Learn about their benefits, 
            applications, and the science behind these innovative agricultural technologies that are 
            helping to address global food security challenges.
          </p>
        </div>

        <GMOFilters
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          selectedSecondaryFilter={selectedSecondaryFilter}
          onSecondaryFilterChange={setSelectedSecondaryFilter}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {filteredItems.map((item) => (
            <GMOCard
              key={item.id}
              item={item}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No GMOs found matching your current filters.
            </p>
          </div>
        )}
      </div>

      <GMOModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
};

export default GMOGuide;