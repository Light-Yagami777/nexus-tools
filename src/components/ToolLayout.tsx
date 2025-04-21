
import React from "react";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
import { motion } from "framer-motion";
import { FileText } from "lucide-react"; // Import a default icon

interface ToolLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  extraPadding?: boolean; 
  metaDescription?: string; // Add metadata for SEO
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ 
  children, 
  title, 
  description,
  icon,
  extraPadding = false,
  metaDescription
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

  // Always add enough padding to clear the navbar
  const topPadding = extraPadding ? "pt-28" : "pt-24";
  
  // Set meta tags for SEO
  React.useEffect(() => {
    // Update page title
    document.title = `${title} | Nexus Tools`;
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && metaDescription) {
      metaDesc.setAttribute('content', metaDescription);
    } else if (metaDesc && description) {
      // Fallback to regular description if meta description isn't provided
      metaDesc.setAttribute('content', `${title} - ${description} | Free online tool by Nexus Tools.`);
    }
  }, [title, description, metaDescription]);

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
            <motion.h1 className="text-3xl md:text-4xl font-bold text-center">
              {title}
            </motion.h1>
            {description && (
              <motion.p 
                variants={itemVariants}
                className="mt-2 text-muted-foreground text-center max-w-2xl text-base md:text-lg"
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
