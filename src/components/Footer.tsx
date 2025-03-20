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
  Globe
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
    { icon: <Globe className="h-5 w-5" />, text: "Available Everywhere" }
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-primary/10 blur-3xl" />
      
      {/* Newsletter Section */}
      <div className="relative z-10 max-w-7xl mx-auto mt-16 px-6 md:px-10">
        <div className="glass rounded-2xl p-8 md:p-10 lg:p-12 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h3>
              <p className="text-muted-foreground mb-6">
                Subscribe to our newsletter to get updates about new tools and features.
              </p>
              <div className="flex items-center gap-2">
                <div className="relative flex-grow">
                  <Input 
                    type="email" 
                    placeholder="Your email address" 
                    className="pl-4 pr-4 py-6 rounded-lg" 
                  />
                </div>
                <Button className="rounded-lg px-6 py-6 bg-primary hover:bg-primary/90">
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
                  className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full"
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
      <div className="relative z-10 pt-16 pb-8 px-6 md:px-10 bg-gradient-to-b from-transparent to-secondary/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Logo Section */}
            <div className="lg:col-span-2 space-y-6">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-primary text-white p-2 rounded-lg">
                  <span className="font-bold text-lg">MT</span>
                </div>
                <span className="font-semibold text-lg tracking-tight">MultiTools</span>
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
                    className={`p-2 rounded-full hover:text-white transition-colors ${link.color}`}
                    whileHover={{ scale: 1.1 }}
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
                <h4 className="font-semibold text-lg">{section.title}</h4>
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
          <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} MultiTools. All rights reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0 space-x-4">
              <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
              <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
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
