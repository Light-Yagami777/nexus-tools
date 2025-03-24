
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
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
