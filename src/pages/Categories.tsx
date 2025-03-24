
import { useState } from "react";
import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { ToolGrid } from "@/components/ToolGrid";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { categories, getToolsByCategory, searchTools, ToolCategory } from "@/utils/toolsData";

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const categoryTools = getToolsByCategory(selectedCategory);
  const filteredTools = searchQuery ? searchTools(searchQuery) : categoryTools;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <section className="pt-32 pb-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">NEXUS Tool Categories</h1>
            <p className="text-lg text-muted-foreground">
              Browse tools by category to find exactly what you need.
            </p>
          </motion.div>
          
          <div className="max-w-2xl mx-auto mb-12">
            <SearchBar onSearch={handleSearch} className="w-full" />
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-8">
              {searchQuery ? "Search Results" : `${selectedCategory} Tools`}
            </h2>
            <ToolGrid tools={filteredTools} initialCategory={selectedCategory} />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Categories;
