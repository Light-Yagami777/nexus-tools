
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { ToolGrid } from "@/components/ToolGrid";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { getToolsByCategory, searchTools, ToolCategory, categories } from "@/utils/toolsData";
import { FolderKanban } from "lucide-react";

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const categoryTools = getToolsByCategory(selectedCategory);
  const filteredTools = searchQuery ? searchTools(searchQuery) : categoryTools;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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
              <FolderKanban size={28} className="text-primary mr-2" />
              <h1 className="text-4xl md:text-5xl font-bold">Tool Categories</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Browse tools by category to find exactly what you need.
            </p>
          </motion.div>
          
          <div className="max-w-2xl mx-auto mb-12">
            <SearchBar onSearch={handleSearch} className="w-full" />
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-8 text-center">
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
