
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { ToolGrid } from "@/components/ToolGrid";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { tools, searchTools, ToolCategory, categories } from "@/utils/toolsData";
import { Grid3x3, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const TOOLS_PER_PAGE = 15; // Number of tools to show per page

const AllTools = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTools, setFilteredTools] = useState(tools);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>("All");
  
  // Calculate total pages based on filtered tools
  const totalPages = Math.ceil(filteredTools.length / TOOLS_PER_PAGE);
  
  // Get current page tools
  const getCurrentPageTools = () => {
    const startIndex = (currentPage - 1) * TOOLS_PER_PAGE;
    const endIndex = startIndex + TOOLS_PER_PAGE;
    return filteredTools.slice(startIndex, endIndex);
  };

  // Filter tools based on search query and category
  useEffect(() => {
    let result = tools;
    
    if (selectedCategory !== "All") {
      result = result.filter(tool => tool.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      result = searchTools(searchQuery).filter(tool => 
        selectedCategory === "All" || tool.category === selectedCategory
      );
    }
    
    setFilteredTools(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleCategoryChange = (category: ToolCategory) => {
    setSelectedCategory(category);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Generate pagination buttons
  const getPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5; // Maximum number of page buttons to show
    
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    // Previous button
    buttons.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    );
    
    // First page button
    if (startPage > 1) {
      buttons.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageClick(1)}
          className="hidden sm:inline-flex"
        >
          1
        </Button>
      );
      
      // Ellipsis if needed
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="px-2 flex items-center">
            ...
          </span>
        );
      }
    }
    
    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageClick(i)}
        >
          {i}
        </Button>
      );
    }
    
    // Last page button
    if (endPage < totalPages) {
      // Ellipsis if needed
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="px-2 flex items-center">
            ...
          </span>
        );
      }
      
      buttons.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageClick(totalPages)}
          className="hidden sm:inline-flex"
        >
          {totalPages}
        </Button>
      );
    }
    
    // Next button
    buttons.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    );
    
    return buttons;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <section className="pt-16 pb-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Grid3x3 size={28} className="text-primary mr-2" />
              <h1 className="text-4xl md:text-5xl font-bold">All Tools</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Explore our complete collection of tools to simplify your everyday tasks.
            </p>
          </motion.div>
          
          <div className="max-w-2xl mx-auto mb-12">
            <SearchBar onSearch={handleSearch} className="w-full" />
          </div>
          
          <ScrollArea className="w-full mb-8">
            <div className="flex items-center space-x-2 py-2 px-1">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </ScrollArea>
          
          <div className="mt-12">
            <ToolGrid tools={getCurrentPageTools()} initialCategory={selectedCategory} />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                {getPaginationButtons()}
              </div>
            )}
            
            {/* Tools count */}
            <div className="text-center text-sm text-muted-foreground mt-6">
              Showing {(currentPage - 1) * TOOLS_PER_PAGE + 1} - {Math.min(currentPage * TOOLS_PER_PAGE, filteredTools.length)} of {filteredTools.length} tools
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AllTools;
