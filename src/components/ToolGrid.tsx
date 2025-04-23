
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToolCard } from "./ToolCard";
import { Tool, ToolCategory, categories } from "@/utils/toolsData";
import { Button } from "@/components/ui/button";

interface ToolGridProps {
  tools: Tool[];
  initialCategory?: ToolCategory;
}

export const ToolGrid: React.FC<ToolGridProps> = ({ 
  tools, 
  initialCategory = "All" 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>(initialCategory);
  const [filteredTools, setFilteredTools] = useState<Tool[]>(tools);
  const [visibleCount, setVisibleCount] = useState(12); // Initial load count

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredTools(tools);
    } else {
      setFilteredTools(tools.filter(tool => tool.category === selectedCategory));
    }
    setVisibleCount(12); // Reset visible count when category changes
  }, [selectedCategory, tools]);

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 12, filteredTools.length));
  };

  const visibleTools = filteredTools.slice(0, visibleCount);

  return (
    <div className="w-full">
      <div className="mb-8 overflow-x-auto pb-4 flex items-center space-x-4 no-scrollbar">
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => setSelectedCategory(category)}
            variant={selectedCategory === category ? "default" : "outline"}
            className="min-w-[120px] h-12 px-6 whitespace-nowrap text-base"
            aria-pressed={selectedCategory === category}
          >
            {category}
          </Button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {visibleTools.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>

      {visibleCount < filteredTools.length && (
        <div className="mt-12 text-center">
          <Button 
            onClick={loadMore}
            variant="outline"
            size="lg"
            className="h-14 px-8 text-lg"
          >
            Load More Tools
          </Button>
        </div>
      )}
    </div>
  );
};

export default ToolGrid;
