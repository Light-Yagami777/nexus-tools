
import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Globe, Tool, Zap } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <Tool className="h-8 w-8 text-primary" />,
      title: "100+ Useful Tools",
      description: "Access a vast collection of tools designed to simplify your everyday tasks and boost productivity."
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Lightning Fast",
      description: "All tools are optimized for speed and performance, ensuring quick results without delays."
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "Always Accessible",
      description: "Access all tools from any device with internet connection - no downloads or installations required."
    }
  ];

  const benefits = [
    "Time-saving utilities for everyday tasks",
    "Professional-grade tools accessible to everyone",
    "Intuitive interfaces with no learning curve",
    "Regularly updated with new tools and features",
    "No account registration required"
  ];

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
              Your comprehensive toolbox for simplifying digital tasks and boosting productivity.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg mb-6 text-muted-foreground">
                MultiTools was created with a simple mission: to provide free, accessible, 
                and high-quality online tools that solve everyday problems.
              </p>
              <p className="text-lg mb-6 text-muted-foreground">
                Whether you're a professional developer, a student, or just someone looking 
                to simplify digital tasks, our collection of tools is designed to save you 
                time and make your life easier.
              </p>
              <Link
                to="/all-tools"
                className="flex items-center text-primary font-medium hover:underline mt-4"
              >
                Explore our tools
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6 glass rounded-2xl"
            >
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                <div className="bg-primary text-white p-4 rounded-xl text-2xl font-bold">
                  MT
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                  className="glass p-6 rounded-xl"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Us</h2>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-xl">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex items-start"
                  >
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6">Start Using MultiTools Today</h2>
            <p className="text-lg mb-8 text-muted-foreground">
              Explore our collection of free tools and simplify your digital tasks.
            </p>
            <Link
              to="/all-tools"
              className="px-8 py-3 rounded-lg bg-primary text-white font-medium transition-all hover:shadow-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 focus:outline-none inline-block"
            >
              Browse All Tools
            </Link>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
