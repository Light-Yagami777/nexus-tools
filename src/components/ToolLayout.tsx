
import { Link } from "react-router-dom";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface ToolLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ children, title }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <motion.div 
        className="tool-page-container flex-grow"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto w-full pt-40 px-6">
          <motion.div
            variants={itemVariants}
            className="back-button-container mb-6"
          >
            <Link 
              to="/" 
              className="back-button inline-flex items-center text-primary hover:text-primary/80 text-lg font-medium bg-primary/10 px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Tools
            </Link>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-3xl font-bold mb-8"
          >
            {title}
          </motion.h1>
          
          {children}
        </motion.div>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default ToolLayout;
