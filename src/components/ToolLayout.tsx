
import React from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BackButton } from "./BackButton";

interface ToolLayoutProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  extraPadding?: boolean;
  className?: string;
  hideBackButton?: boolean;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  title,
  description,
  icon,
  children,
  extraPadding = false,
  className,
  hideBackButton = false,
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "w-full max-w-7xl mx-auto",
        extraPadding ? "p-4 sm:p-6 md:p-10" : "p-4",
        className
      )}
    >
      <div className="flex flex-col">
        {!isHomePage && !hideBackButton && (
          <div className="mb-4">
            <BackButton />
          </div>
        )}
        
        <div className="mb-6 md:mb-10">
          <div className="flex items-center mb-2">
            {icon && <div className="mr-3 text-primary">{icon}</div>}
            <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
          </div>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>

        {children}
      </div>
    </motion.div>
  );
};

export default ToolLayout;
