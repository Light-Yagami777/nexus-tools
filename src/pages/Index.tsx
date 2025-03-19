
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { ToolGrid } from "@/components/ToolGrid";
import { Footer } from "@/components/Footer";
import { 
  getFeaturedTools, 
  getNewTools, 
  tools 
} from "@/utils/toolsData";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [featuredTools, setFeaturedTools] = useState(getFeaturedTools());
  const [newTools, setNewTools] = useState(getNewTools());
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
      
      {/* Hero Section */}
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
                to="/categories"
                className="px-8 py-3 rounded-lg bg-primary text-white font-medium transition-all hover:shadow-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 focus:outline-none"
              >
                Browse All Tools
              </Link>
              
              <Link
                to="/about"
                className="px-8 py-3 rounded-lg border border-border bg-background font-medium transition-all hover:bg-secondary focus:outline-none"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Search Section */}
      <section className="py-12 px-6 md:px-10 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerVariants}
            className="text-center"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-2xl md:text-3xl font-semibold mb-8"
            >
              Find the Perfect Tool
            </motion.h2>
            
            <motion.div
              variants={itemVariants}
              className="max-w-3xl mx-auto relative"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a tool..."
                className="w-full py-4 pl-12 pr-4 rounded-full glass focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
              />
            </motion.div>
            
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-2 mt-4 max-w-3xl mx-auto"
            >
              <span className="text-sm text-muted-foreground mr-2">Popular searches:</span>
              {["converter", "calculator", "generator", "formatter", "image"].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="px-3 py-1 text-sm rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  {term}
                </button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Featured Tools Section */}
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
                to="/categories" 
                className="text-primary font-medium flex items-center hover:underline"
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
      
      {/* New Tools Section */}
      {newTools.length > 0 && (
        <section className="py-16 px-6 md:px-10 bg-gradient-subtle">
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
      
      {/* All Tools Section */}
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
              Browse All Tools
            </motion.h2>
            
            <motion.div variants={itemVariants}>
              <ToolGrid tools={tools} />
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
