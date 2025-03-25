
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { AdBanner } from "./AdBanner";

interface ToolLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  
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

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-[#0c0c14]">
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
            className="flex items-center mb-6"
          >
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBack}
              className="mr-2 dark:text-white"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </Button>
            <motion.h1 className="text-3xl font-bold dark:text-white">
              {title}
            </motion.h1>
          </motion.div>
          
          {/* Ad Banner at the top of each tool */}
          <motion.div variants={itemVariants} className="mb-6">
            <AdBanner className="w-full min-h-[100px] bg-secondary/20 dark:bg-gray-800/30 rounded-lg overflow-hidden" />
          </motion.div>
          
          {children}
        </motion.div>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default ToolLayout;
