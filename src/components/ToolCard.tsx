
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Tool } from "@/utils/toolsData";
import { Activity, LucideIcon } from "lucide-react";

interface ToolCardProps {
  tool: Tool;
  index: number;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = () => {
    const iconProps = { className: "h-5 w-5" };
    const Icon = tool.icon || Activity;
    return <Icon {...iconProps} />;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.43, 0.13, 0.23, 0.96]
      } 
    },
    hover: { 
      y: -5,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const getCategoryColor = () => {
    switch (tool.category) {
      case "Image": return "bg-blue-100 text-blue-800";
      case "Text": return "bg-green-100 text-green-800";
      case "Development": return "bg-purple-100 text-purple-800";
      case "Security": return "bg-red-100 text-red-800";
      case "Utilities": return "bg-yellow-100 text-yellow-800";
      case "SEO": return "bg-teal-100 text-teal-800";
      case "Design": return "bg-pink-100 text-pink-800";
      case "Content": return "bg-indigo-100 text-indigo-800";
      case "Miscellaneous": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-full"
    >
      <Link
        to={tool.path}
        className="block h-full"
      >
        <div className="glass-card rounded-2xl h-full p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              {getIcon()}
            </div>
            
            <div className="flex items-center space-x-2">
              {tool.isNew && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                  New
                </span>
              )}
              {tool.isFeatured && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                  Featured
                </span>
              )}
            </div>
          </div>
          
          <h3 className="font-semibold text-lg mb-2">{tool.name}</h3>
          <p className="text-sm text-muted-foreground mb-4 flex-grow">
            {tool.description}
          </p>
          
          <div className="flex justify-between items-center mt-auto">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor()}`}>
              {tool.category}
            </span>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-medium text-primary flex items-center"
            >
              Try it
              <motion.span 
                initial={{ x: 0 }}
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ duration: 0.2 }}
                className="ml-1"
              >
                →
              </motion.span>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ToolCard;
