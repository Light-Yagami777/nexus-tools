
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Box } from "lucide-react";

export const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when changing routes
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  const menuVariants = {
    closed: { opacity: 0, scale: 0.95, y: -10 },
    open: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 25 
      } 
    }
  };

  return (
    <motion.header
      initial="initial"
      animate="animate"
      variants={navVariants}
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-10 transition-all duration-300 ${
        isScrolled ? "glass shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-primary text-white p-1.5 rounded-lg">
            <motion.div 
              className="font-bold text-lg flex items-center justify-center w-6 h-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box className="w-4 h-4" />
            </motion.div>
          </div>
          <span className="font-semibold text-lg md:text-xl tracking-tight">Nexus Tools</span>
        </Link>

        {/* Desktop Nav - Centered SearchBar */}
        <div className="hidden md:block flex-1 mx-auto max-w-xl px-4">
          <SearchBar className="w-full" />
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            className="p-2 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="absolute top-full left-0 right-0 glass shadow-lg p-6 flex flex-col space-y-6 md:hidden z-50"
          >
            <SearchBar className="w-full" />
            <nav className="flex flex-col space-y-4">
              <NavLink to="/" mobile>Home</NavLink>
              <NavLink to="/categories" mobile>Categories</NavLink>
              <NavLink to="/about" mobile>About</NavLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Background overlay when mobile menu is open */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden z-40"
            style={{ pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  mobile?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, mobile }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`relative ${
        mobile ? "text-lg font-medium" : "text-sm font-medium"
      } transition-colors duration-200 ${
        isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"
      }`}
    >
      {children}
      {isActive && (
        <motion.span
          layoutId="activeNavIndicator"
          className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Link>
  );
};

export default NavBar;
