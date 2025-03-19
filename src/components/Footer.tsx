
import { Link } from "react-router-dom";
import { Github, Twitter, Mail, Heart } from "lucide-react";
import { motion } from "framer-motion";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Github className="h-5 w-5" />, href: "https://github.com", label: "GitHub" },
    { icon: <Twitter className="h-5 w-5" />, href: "https://twitter.com", label: "Twitter" },
    { icon: <Mail className="h-5 w-5" />, href: "mailto:contact@multitools.com", label: "Email" }
  ];

  const footerLinks = [
    { title: "Quick Links", items: [
      { name: "Home", href: "/" },
      { name: "Categories", href: "/categories" },
      { name: "About", href: "/about" }
    ]},
    { title: "Popular Tools", items: [
      { name: "Password Generator", href: "/tools/password-generator" },
      { name: "Unit Converter", href: "/tools/unit-converter" },
      { name: "Word Counter", href: "/tools/word-counter" }
    ]},
    { title: "Resources", items: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Contact", href: "/contact" }
    ]}
  ];

  return (
    <footer className="mt-16 pt-16 pb-8 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary text-white p-2 rounded-lg">
                <span className="font-bold text-lg">MT</span>
              </div>
              <span className="font-semibold text-lg tracking-tight">MultiTools</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A collection of useful web tools to simplify your daily tasks.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((link, i) => (
                <motion.a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="p-2 rounded-full hover:bg-primary/10 transition-colors"
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
              <h4 className="font-semibold">{section.title}</h4>
              <ul className="space-y-2">
                {section.items.map((link, j) => (
                  <li key={j}>
                    <Link 
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} MultiTools. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-2 md:mt-0 flex items-center">
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
