
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Wrench, 
  Users, 
  Check, 
  ShieldCheck, 
  Rocket 
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <section className="pt-32 pb-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About MultiTools</h1>
            <p className="text-lg text-muted-foreground">
              Your one-stop destination for all the digital tools you need in everyday life.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                We believe that powerful tools should be accessible to everyone. 
                Our mission is to provide a comprehensive collection of high-quality, 
                free online tools that simplify your digital tasks and boost productivity.
              </p>
              <p className="text-lg text-muted-foreground">
                Whether you're a developer, designer, writer, student, or professional, 
                we've created tools that make your work easier and more efficient.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass p-8 rounded-2xl"
            >
              <div className="aspect-w-4 aspect-h-3 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Wrench className="h-16 w-16 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">100+ Free Tools</h3>
              <p className="text-muted-foreground">
                Our growing collection includes tools for image editing, text manipulation, 
                development, SEO, calculations, and much more - all completely free.
              </p>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-secondary/40 rounded-2xl p-8 mb-20"
          >
            <h2 className="text-2xl font-bold mb-8 text-center">Why Choose MultiTools?</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  icon: <Check className="h-10 w-10 text-green-500" />,
                  title: "Easy to Use",
                  description: "Simple, intuitive interfaces that require no technical knowledge"
                },
                {
                  icon: <ShieldCheck className="h-10 w-10 text-blue-500" />,
                  title: "Privacy Focused",
                  description: "Your data never leaves your browser for most tools"
                },
                {
                  icon: <Rocket className="h-10 w-10 text-purple-500" />,
                  title: "Fast & Reliable",
                  description: "Optimized for performance on all devices"
                },
                {
                  icon: <Users className="h-10 w-10 text-orange-500" />,
                  title: "Community Driven",
                  description: "Regularly updated based on user feedback"
                }
              ].map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center p-4">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-bold mb-6">Start Using MultiTools Today</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Explore our collection of tools and discover how they can help you accomplish your tasks more efficiently.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/all-tools"
                className="px-8 py-3 rounded-lg bg-primary text-white font-medium transition-all hover:shadow-lg hover:bg-primary/90"
              >
                Browse All Tools
              </Link>
              <Link
                to="/categories"
                className="px-8 py-3 rounded-lg border border-border bg-background font-medium transition-all hover:bg-secondary"
              >
                Explore Categories
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
