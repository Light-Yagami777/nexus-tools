
import { Link } from "react-router-dom";
import { 
  Github, 
  Twitter, 
  Mail, 
  Heart, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube,
  ArrowRight,
  Wrench,
  ShieldCheck,
  Clock,
  Globe,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Github className="h-5 w-5" />, href: "https://github.com", label: "GitHub", color: "hover:bg-gray-800" },
    { icon: <Twitter className="h-5 w-5" />, href: "https://twitter.com", label: "Twitter", color: "hover:bg-blue-400" },
    { icon: <Facebook className="h-5 w-5" />, href: "https://facebook.com", label: "Facebook", color: "hover:bg-blue-600" },
    { icon: <Instagram className="h-5 w-5" />, href: "https://instagram.com", label: "Instagram", color: "hover:bg-pink-600" },
    { icon: <Linkedin className="h-5 w-5" />, href: "https://linkedin.com", label: "LinkedIn", color: "hover:bg-blue-700" },
    { icon: <Youtube className="h-5 w-5" />, href: "https://youtube.com", label: "YouTube", color: "hover:bg-red-600" },
    { icon: <Mail className="h-5 w-5" />, href: "mailto:contact@multitools.com", label: "Email", color: "hover:bg-green-600" }
  ];

  const footerLinks = [
    { title: "Quick Links", items: [
      { name: "Home", href: "/" },
      { name: "All Tools", href: "/all-tools" },
      { name: "Categories", href: "/categories" },
      { name: "About", href: "/about" }
    ]},
    { title: "Popular Tools", items: [
      { name: "Password Generator", href: "/tools/password-generator" },
      { name: "Unit Converter", href: "/tools/unit-converter" },
      { name: "Word Counter", href: "/tools/word-counter" },
      { name: "JSON Formatter", href: "/tools/json-formatter" }
    ]},
    { title: "Tool Categories", items: [
      { name: "Image Tools", href: "/categories" },
      { name: "Text Tools", href: "/categories" },
      { name: "Developer Tools", href: "/categories" },
      { name: "Security Tools", href: "/categories" }
    ]},
    { title: "Resources", items: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Contact", href: "/contact" },
      { name: "FAQ", href: "/faq" }
    ]}
  ];

  const features = [
    { icon: <Wrench className="h-5 w-5" />, text: "100+ Free Tools" },
    { icon: <ShieldCheck className="h-5 w-5" />, text: "No Registration Required" },
    { icon: <Clock className="h-5 w-5" />, text: "Fast & Easy to Use" },
    { icon: <Globe className="h-5 w-5" />, text: "Available Everywhere" },
    { icon: <Sparkles className="h-5 w-5" />, text: "New Tools Added Regularly" }
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-transparent to-secondary/20">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-40 right-20 w-60 h-60 rounded-full bg-pink-500/10 blur-3xl" />
      <div className="absolute bottom-20 left-40 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl" />
      
      {/* Ad Space */}
      <div className="relative z-10 max-w-7xl mx-auto mt-16 px-6 md:px-10">
        <div className="glass-card p-6 rounded-2xl mb-10 border border-primary/20 shadow-lg overflow-hidden">
          <div className="text-center">
            <span className="text-xs font-semibold text-primary/70 bg-primary/10 px-3 py-1 rounded-full">ADVERTISEMENT</span>
            <div className="h-28 sm:h-36 flex items-center justify-center my-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
              <p className="text-muted-foreground">Ad Space Available</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <div className="glass rounded-2xl p-8 md:p-10 lg:p-12 mb-16 border border-primary/20 shadow-lg overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-full blur-xl"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Stay Updated</h3>
              <p className="text-muted-foreground mb-6">
                Subscribe to our newsletter to get updates about new tools and features.
              </p>
              <div className="flex items-center gap-2">
                <div className="relative flex-grow">
                  <Input 
                    type="email" 
                    placeholder="Your email address" 
                    className="pl-4 pr-4 py-6 rounded-lg border-primary/20 focus:border-primary focus:ring-primary/30" 
                  />
                </div>
                <Button className="rounded-lg px-6 py-6 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300">
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-end">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20"
                >
                  <span className="text-primary">{feature.icon}</span>
                  <span className="text-sm font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div className="relative z-10 pt-16 pb-8 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Additional Ad Space */}
          <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-3 text-center mb-4">
              <span className="text-xs font-semibold text-primary/70 bg-primary/10 px-3 py-1 rounded-full">SPONSORED</span>
            </div>
            <div className="glass-card p-4 rounded-xl border border-primary/10 shadow-md h-40 flex items-center justify-center">
              <p className="text-muted-foreground">Advertisement Spot 1</p>
            </div>
            <div className="glass-card p-4 rounded-xl border border-primary/10 shadow-md h-40 flex items-center justify-center">
              <p className="text-muted-foreground">Advertisement Spot 2</p>
            </div>
            <div className="glass-card p-4 rounded-xl border border-primary/10 shadow-md h-40 flex items-center justify-center">
              <p className="text-muted-foreground">Advertisement Spot 3</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Logo Section */}
            <div className="lg:col-span-2 space-y-6">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-2 rounded-lg shadow-md">
                  <span className="font-bold text-lg">MT</span>
                </div>
                <span className="font-semibold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">MultiTools</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-md">
                MultiTools provides a comprehensive collection of useful web tools designed to simplify your daily tasks,
                enhance productivity, and solve common digital problems - all for free.
              </p>
              <div className="flex items-center space-x-3">
                {socialLinks.map((link, i) => (
                  <motion.a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className={`p-2 rounded-full border border-primary/20 hover:text-white transition-colors ${link.color}`}
                    whileHover={{ scale: 1.1, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {link.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerLinks.map((section, i) => (
              <div key={i} className="space-y-4">
                <h4 className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">{section.title}</h4>
                <ul className="space-y-3">
                  {section.items.map((link, j) => (
                    <li key={j}>
                      <Link 
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center group"
                      >
                        <span>{link.name}</span>
                        <ArrowRight className="h-3 w-0 ml-1 overflow-hidden transition-all duration-300 group-hover:w-3 text-primary" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="mt-16 pt-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} MultiTools. All rights reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0 space-x-4">
              <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <div className="w-1 h-1 rounded-full bg-primary/30"></div>
              <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <div className="w-1 h-1 rounded-full bg-primary/30"></div>
              <Link to="/cookies" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
          
          <p className="text-sm text-center text-muted-foreground mt-8 flex items-center justify-center">
            Made with 
            <motion.span
              whileHover={{ scale: 1.2 }}
              className="inline-block mx-1 text-red-500"
            >
              <Heart className="h-4 w-4 fill-current" />
            </motion.span>
            for productivity
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
