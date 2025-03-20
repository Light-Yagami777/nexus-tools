
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="flex-grow flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full px-6 py-12 text-center"
        >
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-destructive" />
            </div>
            <h1 className="text-8xl font-bold text-primary">404</h1>
            <div className="h-1 w-16 bg-primary mx-auto my-6 rounded-full"></div>
            <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
            <p className="text-muted-foreground mb-8">
              The page you are looking for doesn't exist or has been moved.
              This tool might be under development.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/"
              className="px-6 py-2 rounded-lg bg-primary text-white font-medium transition-all hover:shadow-lg hover:bg-primary/90 w-full sm:w-auto"
            >
              Return Home
            </Link>
            
            <Link
              to="/all-tools"
              className="px-6 py-2 rounded-lg border border-border bg-background font-medium transition-all hover:bg-secondary w-full sm:w-auto"
            >
              Browse Tools
            </Link>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
