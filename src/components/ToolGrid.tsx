
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToolCard } from "./ToolCard";
import { Tool, ToolCategory, categories } from "@/utils/toolsData";

interface ToolGridProps {
  tools: Tool[];
  initialCategory?: ToolCategory;
}

export const ToolGrid: React.FC<ToolGridProps> = ({ 
  tools, 
  initialCategory = "All" 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>(initialCategory);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const toolsPerPage = 12;

  // Memoized filtering function to optimize performance
  const filterToolsByCategory = useCallback((category: ToolCategory, toolsList: Tool[]) => {
    if (category === "All") {
      return toolsList;
    }
    return toolsList.filter(tool => tool.category === category);
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when category changes
    
    // Use requestAnimationFrame to optimize UI updates
    setIsLoading(true);
    requestAnimationFrame(() => {
      const filtered = filterToolsByCategory(selectedCategory, tools);
      setFilteredTools(filtered);
      setIsLoading(false);
    });
  }, [selectedCategory, tools, filterToolsByCategory]);

  const indexOfLastTool = currentPage * toolsPerPage;
  const indexOfFirstTool = indexOfLastTool - toolsPerPage;
  const currentTools = filteredTools.slice(indexOfFirstTool, indexOfLastTool);
  const totalPages = Math.ceil(filteredTools.length / toolsPerPage);

  // Handle category selection
  const handleCategoryChange = useCallback((category: ToolCategory) => {
    setSelectedCategory(category);
  }, []);

  return (
    <div className="w-full">
      {/* Category Pills - Improved touch target size */}
      <div className="mb-8 overflow-x-auto pb-2 flex items-center space-x-4 no-scrollbar">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-6 py-3 rounded-full text-base font-medium whitespace-nowrap transition-all duration-300 min-h-[48px] min-w-[48px] ${
              selectedCategory === category
                ? "bg-primary text-white shadow-md"
                : "bg-secondary text-foreground/70 hover:bg-secondary/80"
            }`}
            aria-label={`Filter by ${category}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}

      {/* Tool Grid - With lazy loading optimization */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory + currentPage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {currentTools.length > 0 ? (
            currentTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center h-40 text-muted-foreground">
              No tools found in this category.
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Pagination Controls - Improved touch targets */}
      {filteredTools.length > toolsPerPage && (
        <div className="flex justify-center mt-8 items-center gap-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-5 py-3 rounded-md bg-secondary text-foreground/70 hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] min-w-[48px]"
            aria-label="Previous page"
          >
            &larr;
          </button>
          
          <span className="text-base">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-5 py-3 rounded-md bg-secondary text-foreground/70 hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] min-w-[48px]"
            aria-label="Next page"
          >
            &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

export default ToolGrid;
