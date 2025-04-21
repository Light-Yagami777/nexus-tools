
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { ToolGrid } from "@/components/ToolGrid";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { tools, searchTools } from "@/utils/toolsData";
import { Grid3x3 } from "lucide-react";

const AllTools = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTools, setFilteredTools] = useState(tools);
  
  // Memoize search function to avoid unnecessary re-renders
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (query.trim()) {
      requestAnimationFrame(() => {
        setFilteredTools(searchTools(query));
      });
    } else {
      requestAnimationFrame(() => {
        setFilteredTools(tools);
      });
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Set the page title and meta description for SEO
    document.title = "All Tools - 100+ Free Online Utilities | Nexus Tools";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Access our complete collection of 100+ free online tools for SEO, image conversion, text formatting, calculations, and more. Find the perfect tool for your needs.');
    }
  }, []);

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
          
          <div className="mt-12">
            <ToolGrid tools={filteredTools} />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AllTools;
