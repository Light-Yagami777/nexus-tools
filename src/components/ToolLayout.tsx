
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
import { motion } from "framer-motion";
import { FileText } from "lucide-react"; // Import a default icon

interface ToolLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  extraPadding?: boolean; // Add option for extra padding
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ 
  children, 
  title, 
  description,
  icon,
  extraPadding = false // Default to false
}) => {
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

  // Calculate padding based on the prop
  const topPadding = extraPadding ? "pt-24" : "pt-16";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <motion.div 
        className="tool-page-container flex-grow"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className={`max-w-4xl mx-auto w-full ${topPadding} px-6`}>
          <motion.div
            variants={itemVariants}
            className="mb-6 flex flex-col items-center justify-center"
          >
            {icon ? (
              <span className="mb-3 text-primary text-xl">{icon}</span>
            ) : (
              <span className="mb-3 text-primary"><FileText size={24} /></span>
            )}
            <motion.h1 className="text-3xl font-bold text-center">
              {title}
            </motion.h1>
            {description && (
              <motion.p 
                variants={itemVariants}
                className="mt-2 text-muted-foreground text-center max-w-2xl"
              >
                {description}
              </motion.p>
            )}
          </motion.div>
          
          {children}
        </motion.div>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default ToolLayout;
