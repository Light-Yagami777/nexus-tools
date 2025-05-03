
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Heart, 
  ChevronRight 
} from 'lucide-react';

const EnhancedFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-background border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-lg font-semibold mb-4">Nexus Tools</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Powerful web tools for developers, designers, writers, and digital professionals.
              </p>
              <div className="flex space-x-4">
                <SocialLink href="https://github.com" icon={<Github size={18} />} label="GitHub" />
                <SocialLink href="https://linkedin.com" icon={<Linkedin size={18} />} label="LinkedIn" />
                <SocialLink href="https://twitter.com" icon={<Twitter size={18} />} label="Twitter" />
                <SocialLink href="https://instagram.com" icon={<Instagram size={18} />} label="Instagram" />
              </div>
            </div>

            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4">Popular Tools</h3>
              <ul className="space-y-2">
                <FooterLink to="/tools/color-picker">Color Picker</FooterLink>
                <FooterLink to="/tools/image-resizer">Image Resizer</FooterLink>
                <FooterLink to="/tools/password-generator">Password Generator</FooterLink>
                <FooterLink to="/tools/lorem-ipsum-generator">Lorem Ipsum</FooterLink>
                <FooterLink to="/tools/qr-code-generator">QR Code Generator</FooterLink>
              </ul>
            </div>

            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                <FooterLink to="/categories?category=Developers">Developers</FooterLink>
                <FooterLink to="/categories?category=Design">Design</FooterLink>
                <FooterLink to="/categories?category=SEO">SEO</FooterLink>
                <FooterLink to="/categories?category=Content">Content</FooterLink>
                <FooterLink to="/categories?category=Utilities">Utilities</FooterLink>
              </ul>
            </div>

            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <ul className="space-y-2">
                <FooterLink to="/about">About Us</FooterLink>
                <FooterLink to="/privacy">Privacy Policy</FooterLink>
                <FooterLink to="/terms">Terms of Service</FooterLink>
                <FooterLink to="/contact">Contact Us</FooterLink>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/40">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground">
                © {currentYear} Nexus Tools. All rights reserved.
              </p>
              <div className="flex items-center mt-4 md:mt-0">
                <span className="text-sm text-muted-foreground flex items-center">
                  Made with <Heart className="h-3 w-3 mx-1 text-red-500" /> for developers worldwide
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <li>
    <Link 
      to={to} 
      className="text-muted-foreground hover:text-foreground transition-colors flex items-center text-sm"
    >
      <ChevronRight className="h-3 w-3 mr-1" />
      {children}
    </Link>
  </li>
);

const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    aria-label={label}
    className="p-2 rounded-full bg-secondary/50 hover:bg-primary/10 transition-colors"
  >
    {icon}
  </motion.a>
);

export default EnhancedFooter;
