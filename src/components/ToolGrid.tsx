
import { useState, useEffect } from "react";
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
  const toolsPerPage = 12;

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when category changes
    
    if (selectedCategory === "All") {
      setFilteredTools(tools);
    } else {
      setFilteredTools(tools.filter(tool => tool.category === selectedCategory));
    }
  }, [selectedCategory, tools]);

  const indexOfLastTool = currentPage * toolsPerPage;
  const indexOfFirstTool = indexOfLastTool - toolsPerPage;
  const currentTools = filteredTools.slice(indexOfFirstTool, indexOfLastTool);
  const totalPages = Math.ceil(filteredTools.length / toolsPerPage);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <div className="w-full">
      {/* Category Pills */}
      <div className="mb-8 overflow-x-auto pb-2 flex items-center space-x-2 no-scrollbar">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 min-h-[48px] min-w-[48px] ${
              selectedCategory === category
                ? "bg-primary text-white shadow-md"
                : "bg-secondary text-foreground/70 hover:bg-secondary/80"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Tool Grid */}
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

      {/* Pagination Controls */}
      {filteredTools.length > toolsPerPage && (
        <div className="flex justify-center mt-8 items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-md bg-secondary text-foreground/70 hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] min-w-[48px]"
            aria-label="Previous page"
          >
            &larr;
          </button>
          
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-md bg-secondary text-foreground/70 hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] min-w-[48px]"
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
