
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

export function EnhancedFooter() {
  const [hoverLink, setHoverLink] = useState<string | null>(null);
  
  const footerLinks = [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "All Tools", href: "/all-tools" },
    { title: "Categories", href: "/categories" },
  ];

  const toolCategories = [
    { title: "SEO", href: "/categories?category=SEO" },
    { title: "Development", href: "/categories?category=Development" },
    { title: "Design", href: "/categories?category=Design" },
    { title: "Utilities", href: "/categories?category=Utilities" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-4">
            <h3 className="font-semibold text-lg">Tools Hub</h3>
            <p className="text-muted-foreground text-sm">
              A comprehensive collection of free online utilities and tools to help with everyday tasks,
              from SEO analysis to design work and development tasks.
            </p>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <span className="text-sm text-muted-foreground">Switch Theme</span>
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-medium">Navigation</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <motion.li 
                  key={link.title}
                  onHoverStart={() => setHoverLink(link.title)}
                  onHoverEnd={() => setHoverLink(null)}
                  className="relative"
                >
                  <Link 
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.title}
                  </Link>
                  {hoverLink === link.title && (
                    <motion.div 
                      className="absolute -bottom-1 left-0 h-0.5 bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-medium">Categories</h4>
            <ul className="space-y-2">
              {toolCategories.map((category) => (
                <motion.li 
                  key={category.title}
                  onHoverStart={() => setHoverLink(category.title)}
                  onHoverEnd={() => setHoverLink(null)}
                  className="relative"
                >
                  <Link 
                    to={category.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {category.title}
                  </Link>
                  {hoverLink === category.title && (
                    <motion.div 
                      className="absolute -bottom-1 left-0 h-0.5 bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-medium">About</h4>
            <p className="text-sm text-muted-foreground">
              This collection of tools is designed to help professionals and hobbyists alike
              to accomplish tasks more efficiently. All tools are free to use and no registration is required.
            </p>
            <div className="pt-2">
              <div className="h-10 flex items-center justify-start space-x-2">
                <span className="text-sm text-muted-foreground">© {currentYear} Tools Hub. All rights reserved.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default EnhancedFooter;
