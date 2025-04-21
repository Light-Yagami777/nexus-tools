
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { ToolGrid } from "@/components/ToolGrid";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { AdBanner } from "@/components/AdBanner";
import { 
  getFeaturedTools, 
  getNewTools, 
  tools,
  searchTools
} from "@/utils/toolsData";
import { Link } from "react-router-dom";

const Index = () => {
  const [featuredTools, setFeaturedTools] = useState(getFeaturedTools());
  const [newTools, setNewTools] = useState(getNewTools());
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(tools);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Set the page title and meta description for SEO
    document.title = "Nexus Tools - 100+ Free Online Tools for Every Need";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Free online tools to boost your productivity. Access 100+ web tools for SEO analysis, image conversion, text formatting, and more - all in one place.');
    }
  }, []);

  // Memoize search function to avoid unnecessary re-renders
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length >= 1) {
      setSearchResults(searchTools(query));
    } else {
      setSearchResults(tools);
    }
  }, []);

  // Use requestAnimationFrame for animation
  useEffect(() => {
    if (searchQuery.trim().length >= 1) {
      requestAnimationFrame(() => {
        setSearchResults(searchTools(searchQuery));
      });
    } else {
      requestAnimationFrame(() => {
        setSearchResults(tools);
      });
    }
  }, [searchQuery]);

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      {/* Hero Section with proper H1 heading */}
      <section className="pt-32 pb-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={heroVariants}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4 px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
            >
              100+ Tools for Every Need
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Your Digital Toolbox for
              <span className="text-primary block">Everyday Tasks</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover our collection of free online tools designed to simplify your work, 
              boost productivity, and solve everyday problems.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/all-tools"
                className="px-8 py-3 rounded-lg bg-primary text-white font-medium transition-all hover:shadow-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 focus:outline-none min-h-[48px] min-w-[48px]"
              >
                Browse All Tools
              </Link>
              
              <Link
                to="/about"
                className="px-8 py-3 rounded-lg border border-border bg-background font-medium transition-all hover:bg-secondary focus:outline-none min-h-[48px] min-w-[48px]"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Search Section - Centered with H2 heading */}
      <section className="py-12 px-6 md:px-10 bg-gradient-subtle dark:bg-[#1a1b25]">
        <div className="max-w-7xl mx-auto flex justify-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerVariants}
            className="text-center w-full max-w-3xl"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-2xl md:text-3xl font-semibold mb-8"
            >
              Find the Perfect Tool
            </motion.h2>
            
            <motion.div
              variants={itemVariants}
              className="w-full"
            >
              <SearchBar onSearch={handleSearch} className="w-full" />
            </motion.div>
            
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-2 mt-4"
            >
              <span className="text-sm text-muted-foreground mr-2">Popular searches:</span>
              {["converter", "calculator", "generator", "formatter", "image"].map((term) => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="px-3 py-1 text-sm rounded-full bg-secondary hover:bg-secondary/80 transition-colors dark:bg-[#2a2b35] dark:hover:bg-[#3a3b45] min-h-[48px] min-w-[48px]"
                >
                  {term}
                </button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Ad Space - Top Banner */}
      <section className="py-8 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <span className="text-xs font-semibold text-primary/70 bg-primary/10 px-3 py-1 rounded-full">SPONSORED</span>
            <div className="h-24 flex items-center justify-center my-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20 dark:bg-[#1a1b25] dark:border-[#2a2b35]">
              <AdBanner adFormat="horizontal" className="w-full h-full" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Tools Section with proper H2 heading */}
      <section className="py-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerVariants}
          >
            <motion.div 
              variants={itemVariants}
              className="flex justify-between items-center mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-semibold">Featured Tools</h2>
              <Link 
                to="/all-tools" 
                className="text-primary font-medium flex items-center hover:underline min-h-[48px] min-w-[48px] px-2"
              >
                View All
                <span className="ml-1">→</span>
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <ToolGrid tools={featuredTools} />
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Ad Space - Mid Banner */}
      <section className="py-8 px-6 md:px-10 bg-gradient-subtle dark:bg-[#1a1b25]">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-4 rounded-xl border border-primary/10 shadow-md dark:bg-[#1a1b25] dark:border-[#2a2b35]">
            <div className="text-center">
              <span className="text-xs font-semibold text-primary/70 bg-primary/10 px-3 py-1 rounded-full">ADVERTISEMENT</span>
              <div className="h-32 flex items-center justify-center my-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg dark:bg-[#1a1b25] dark:border dark:border-[#2a2b35]">
                <AdBanner adFormat="rectangle" className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* New Tools Section with proper H2 heading */}
      {newTools.length > 0 && (
        <section className="py-16 px-6 md:px-10 bg-gradient-subtle dark:bg-[#1a1b25]">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerVariants}
            >
              <motion.h2 
                variants={itemVariants}
                className="text-2xl md:text-3xl font-semibold mb-10"
              >
                New Additions
              </motion.h2>
              
              <motion.div variants={itemVariants}>
                <ToolGrid tools={newTools} />
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}
      
      {/* Search Results & All Tools Section with proper H2 heading */}
      <section className="py-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerVariants}
          >
            <motion.h2 
              variants={itemVariants}
              className="text-2xl md:text-3xl font-semibold mb-10"
            >
              {searchQuery ? "Search Results" : "Browse All Tools"}
            </motion.h2>
            
            <motion.div variants={itemVariants}>
              <ToolGrid tools={searchResults} />
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
