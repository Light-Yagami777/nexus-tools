
import { 
  Rocket, Search, ShieldCheck, Image, Type, LayoutDashboard, 
  ListChecks, FileText, Fingerprint, Key, Code, Palette, 
  QrCode, Download, TextCursor, Link, BarChart, 
  Mail, MessageSquare, Calendar, Clock, FileSearch2, 
  FileDown, Users, FileCode2, CheckCircle2, LucideIcon,
  Smartphone, Globe, Video, FileImage, Shield,
  MonitorSmartphone, FileCog, Binary, Ruler, Scale,
  Thermometer, Gauge, Beaker, Compass, SquareStack,
  Database, Activity, CalendarCheck, FileJson, 
  FileType2, Speech, Text, Coins, Dices, FileCode
} from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  path: string;
  category:
    | "Utilities"
    | "SEO"
    | "Image"
    | "Text"
    | "Security"
    | "Development"
    | "Design"
    | "Content"
    | "Miscellaneous"
    | "Converter";
  icon: LucideIcon;
  featured: boolean;
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
}

// Enhanced search function for better matching
export const searchTools = (query: string): Tool[] => {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) return [];
  
  // First check for exact matches in name or direct substring
  const exactMatches = TOOLS.filter(
    tool => 
      tool.name.toLowerCase() === normalizedQuery ||
      tool.name.toLowerCase().includes(normalizedQuery)
  );
  
  // Then check for partial matches in other fields
  const partialMatches = TOOLS.filter(
    tool => 
      !exactMatches.includes(tool) && (
        tool.tags.some(tag => tag.toLowerCase().includes(normalizedQuery)) ||
        tool.category.toLowerCase().includes(normalizedQuery) ||
        tool.description.toLowerCase().includes(normalizedQuery)
      )
  );
  
  // Return exact matches first, then partial matches
  return [...exactMatches, ...partialMatches];
};

export const TOOLS: Tool[] = [
  {
    id: "seo-analyzer",
    name: "SEO Analyzer",
    description: "Analyze your website's SEO and identify issues",
    path: "/tools/seo-analyzer",
    category: "SEO",
    icon: Search,
    featured: true,
    tags: ["seo", "analyzer", "website", "analysis", "optimization"],
  },
  {
    id: "mobile-friendly-test",
    name: "Mobile-Friendly Test",
    description: "Check if your website is mobile-friendly",
    path: "/tools/mobile-friendly-test",
    category: "SEO",
    icon: Smartphone,
    featured: true,
    tags: ["mobile", "friendly", "test", "website", "responsive"],
  },
  {
    id: "backlink-checker",
    name: "Backlink Checker",
    description: "Check the backlinks of your website",
    path: "/tools/backlink-checker",
    category: "SEO",
    icon: Link,
    featured: false,
    tags: ["backlink", "checker", "website", "links", "referrals"],
  },
  {
    id: "page-speed-checker",
    name: "Page Speed Checker",
    description: "Check your website's speed and performance",
    path: "/tools/page-speed-checker",
    category: "SEO",
    icon: BarChart,
    featured: false,
    tags: ["page", "speed", "checker", "website", "performance"],
  },
  {
    id: "keyword-density-analyzer",
    name: "Keyword Density Analyzer",
    description: "Analyze the keyword density of your website's content",
    path: "/tools/keyword-density-analyzer",
    category: "SEO",
    icon: FileText,
    featured: false,
    tags: ["keyword", "density", "analyzer", "content", "analysis"],
  },
  {
    id: "broken-link-checker",
    name: "Broken Link Checker",
    description: "Find broken links on your website",
    path: "/tools/broken-link-checker",
    category: "SEO",
    icon: Link,
    featured: false,
    tags: ["broken", "link", "checker", "website", "links"],
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    description: "Resize your images online",
    path: "/tools/image-resizer",
    category: "Image",
    icon: Image,
    featured: true,
    tags: ["image", "resizer", "resize", "online", "photo"],
  },
  {
    id: "image-compressor",
    name: "Image Compressor",
    description: "Compress your images online",
    path: "/tools/image-compressor",
    category: "Image",
    icon: Image,
    featured: false,
    tags: ["image", "compressor", "compress", "online", "photo"],
  },
  {
    id: "image-converter",
    name: "Image Converter",
    description: "Convert your images to different formats",
    path: "/tools/image-converter",
    category: "Image",
    icon: FileImage,
    featured: false,
    tags: ["image", "converter", "convert", "online", "photo"],
  },
  {
    id: "password-generator",
    name: "Password Generator",
    description: "Generate secure passwords online",
    path: "/tools/password-generator",
    category: "Security",
    icon: Key,
    featured: true,
    tags: ["password", "generator", "secure", "online", "security"],
  },
  {
    id: "qr-code-generator",
    name: "QR Code Generator",
    description: "Generate QR codes online",
    path: "/tools/qr-code-generator",
    category: "Utilities",
    icon: QrCode,
    featured: true,
    tags: ["qr", "code", "generator", "online", "utility"],
  },
  {
    id: "html-formatter",
    name: "HTML Formatter",
    description: "Format your HTML code online",
    path: "/tools/html-formatter",
    category: "Development",
    icon: Code,
    featured: false,
    tags: ["html", "formatter", "format", "online", "code"],
  },
  {
    id: "css-formatter",
    name: "CSS Formatter",
    description: "Format your CSS code online",
    path: "/tools/css-formatter",
    category: "Development",
    icon: Code,
    featured: false,
    tags: ["css", "formatter", "format", "online", "code"],
  },
  {
    id: "javascript-formatter",
    name: "JavaScript Formatter",
    description: "Format your JavaScript code online",
    path: "/tools/javascript-formatter",
    category: "Development",
    icon: Code,
    featured: false,
    tags: ["javascript", "formatter", "format", "online", "code"],
  },
  {
    id: "color-picker",
    name: "Color Picker",
    description: "Pick colors from an image or using a color wheel",
    path: "/tools/color-picker",
    category: "Design",
    icon: Palette,
    featured: true,
    tags: ["color", "picker", "image", "wheel", "online"],
  },
  {
    id: "text-case-converter",
    name: "Text Case Converter",
    description: "Convert text case online",
    path: "/tools/text-case-converter",
    category: "Text",
    icon: TextCursor,
    featured: false,
    tags: ["text", "case", "converter", "online", "utility"],
  },
  {
    id: "unit-converter",
    name: "Unit Converter",
    description: "Convert between different units",
    path: "/tools/unit-converter",
    category: "Utilities",
    icon: Download,
    featured: false,
    tags: ["unit", "converter", "online", "utility"],
  },
  {
    id: "ip-address-lookup",
    name: "IP Address Lookup",
    description: "Look up information about an IP address or domain name",
    path: "/tools/ip-address-lookup",
    category: "Utilities",
    icon: Globe,
    featured: false,
    isNew: true,
    tags: ["ip", "address", "lookup", "geolocation", "domain", "utility"],
  },
  {
    id: "domain-age-checker",
    name: "Domain Age Checker",
    description: "Check the age of a domain",
    path: "/tools/domain-age-checker",
    category: "SEO",
    icon: Calendar,
    featured: false,
    tags: ["domain", "age", "checker", "online", "seo"],
  },
  {
    id: "word-counter",
    name: "Word Counter",
    description: "Count the number of words in a text",
    path: "/tools/word-counter",
    category: "Text",
    icon: FileText,
    featured: false,
    tags: ["word", "counter", "online", "text", "utility"],
  },
  {
    id: "character-counter",
    name: "Character Counter",
    description: "Count the number of characters in a text",
    path: "/tools/character-counter",
    category: "Text",
    icon: FileText,
    featured: false,
    tags: ["character", "counter", "online", "text", "utility"],
  },
  {
    id: "email-validator",
    name: "Email Validator",
    description: "Validate an email address",
    path: "/tools/email-validator",
    category: "Utilities",
    icon: Mail,
    featured: false,
    tags: ["email", "validator", "online", "utility"],
  },
  {
    id: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text for designs and layouts",
    path: "/tools/lorem-ipsum-generator",
    category: "Content",
    icon: Type,
    featured: true,
    tags: ["lorem", "ipsum", "generator", "online", "text", "utility"],
  },
  {
    id: "sha256-hash-generator",
    name: "SHA256 Hash Generator",
    description: "Generate SHA256 hash values from text or files",
    path: "/tools/sha256-hash-generator",
    category: "Security",
    icon: Key,
    featured: false,
    tags: ["sha256", "hash", "generator", "encryption", "security"],
  },
  {
    id: "screen-recorder",
    name: "Screen Recorder",
    description: "Record your screen directly in your browser",
    path: "/tools/screen-recorder",
    category: "Utilities",
    icon: Video,
    featured: false,
    isNew: true,
    tags: ["screen", "recorder", "video", "capture", "recording"],
  },
  {
    id: "screenshot-to-pdf",
    name: "Screenshot to PDF",
    description: "Convert screenshots to a PDF document",
    path: "/tools/screenshot-to-pdf",
    category: "Utilities",
    icon: FileImage,
    featured: false,
    tags: ["screenshot", "pdf", "converter", "image", "document"],
  },
  {
    id: "ssl-checker",
    name: "SSL Checker",
    description: "Check SSL certificates for validity and security issues",
    path: "/tools/ssl-checker",
    category: "Security",
    icon: Shield,
    featured: false,
    tags: ["ssl", "certificate", "security", "checker", "website"],
  },
  {
    id: "robots-txt-generator",
    name: "Robots.txt Generator",
    description: "Generate a robots.txt file for your website",
    path: "/tools/robots-txt-generator",
    category: "SEO",
    icon: FileCog,
    featured: false,
    tags: ["robots.txt", "generator", "seo", "website", "crawler"],
  },
  {
    id: "base64",
    name: "Base64 Encoder/Decoder",
    description: "Encode or decode text and files to/from Base64",
    path: "/tools/base64",
    category: "Development",
    icon: Binary,
    featured: false,
    tags: ["base64", "encoder", "decoder", "text", "file", "conversion"],
  },
  {
    id: "jwt-decoder",
    name: "JWT Decoder",
    description: "Decode and verify JWT tokens",
    path: "/tools/jwt-decoder",
    category: "Development",
    icon: Key,
    featured: false,
    tags: ["jwt", "token", "decoder", "json", "web", "token", "development"],
  },
  {
    id: "css-minifier",
    name: "CSS Minifier",
    description: "Minify CSS code to reduce file size",
    path: "/tools/css-minifier",
    category: "Development",
    icon: Code,
    featured: false,
    tags: ["css", "minifier", "compress", "development", "code", "optimizer"],
  },
  // Add new converter tools
  {
    id: "length-converter",
    name: "Length Converter",
    description: "Convert between different units of length",
    path: "/tools/length-converter",
    category: "Converter",
    icon: Ruler,
    featured: true,
    isNew: true,
    tags: ["length", "distance", "converter", "units", "measurement", "meters", "feet", "inches"],
  },
  {
    id: "weight-converter",
    name: "Weight Converter",
    description: "Convert between different units of weight and mass",
    path: "/tools/weight-converter",
    category: "Converter",
    icon: Scale,
    featured: true,
    isNew: true,
    tags: ["weight", "mass", "converter", "units", "measurement", "kilograms", "pounds", "ounces"],
  },
  {
    id: "temperature-converter",
    name: "Temperature Converter",
    description: "Convert between Celsius, Fahrenheit, and Kelvin",
    path: "/tools/temperature-converter",
    category: "Converter",
    icon: Thermometer,
    featured: true,
    isNew: true,
    tags: ["temperature", "converter", "celsius", "fahrenheit", "kelvin", "units"],
  },
  {
    id: "speed-converter",
    name: "Speed Converter",
    description: "Convert between different units of speed",
    path: "/tools/speed-converter",
    category: "Converter",
    icon: Gauge,
    featured: false,
    isNew: true,
    tags: ["speed", "velocity", "converter", "mph", "kph", "m/s", "knots"],
  },
  {
    id: "volume-converter",
    name: "Volume Converter",
    description: "Convert between different units of volume",
    path: "/tools/volume-converter",
    category: "Converter",
    icon: Beaker,
    featured: false,
    isNew: true,
    tags: ["volume", "converter", "liters", "gallons", "cubic", "fluid", "measurement"],
  },
  {
    id: "angle-converter",
    name: "Angle Converter",
    description: "Convert between different angle measurement units",
    path: "/tools/angle-converter",
    category: "Converter",
    icon: Compass,
    featured: false,
    isNew: true,
    tags: ["angle", "converter", "degrees", "radians", "gradians", "measurement"],
  },
  // New tools
  {
    id: "area-converter",
    name: "Area Converter",
    description: "Convert between different units of area",
    path: "/tools/area-converter",
    category: "Converter",
    icon: SquareStack,
    featured: false,
    isNew: true,
    tags: ["area", "converter", "square meters", "square feet", "acres", "hectares", "measurement"],
  },
  {
    id: "data-storage-converter",
    name: "Data Storage Converter",
    description: "Convert between different units of digital storage",
    path: "/tools/data-storage-converter",
    category: "Converter",
    icon: Database,
    featured: false,
    isNew: true,
    tags: ["data", "storage", "converter", "bytes", "kilobytes", "megabytes", "gigabytes", "terabytes"],
  },
  {
    id: "pressure-converter",
    name: "Pressure Converter",
    description: "Convert between different units of pressure",
    path: "/tools/pressure-converter",
    category: "Converter",
    icon: Activity,
    featured: false,
    isNew: true,
    tags: ["pressure", "converter", "pascal", "bar", "psi", "atmosphere", "measurement"],
  },
  {
    id: "age-calculator",
    name: "Age Calculator",
    description: "Calculate age between two dates",
    path: "/tools/age-calculator",
    category: "Utilities",
    icon: CalendarCheck,
    featured: false,
    isNew: true,
    tags: ["age", "calculator", "date", "birthday", "years", "months", "days"],
  },
  {
    id: "meta-tag-generator",
    name: "Meta Tag Generator",
    description: "Generate meta tags for your website",
    path: "/tools/meta-tag-generator",
    category: "SEO",
    icon: FileJson,
    featured: false,
    isNew: true,
    tags: ["meta", "tag", "generator", "seo", "html", "website", "description"],
  },
  {
    id: "webp-to-png",
    name: "WebP to PNG Converter",
    description: "Convert WebP images to PNG format",
    path: "/tools/webp-to-png",
    category: "Image",
    icon: FileType2,
    featured: false,
    isNew: true,
    tags: ["webp", "png", "converter", "image", "format", "conversion"],
  },
  {
    id: "speech-to-text",
    name: "Speech to Text",
    description: "Convert speech to text using your microphone",
    path: "/tools/speech-to-text",
    category: "Text",
    icon: Speech,
    featured: false,
    isNew: true,
    tags: ["speech", "text", "voice", "recognition", "transcription", "audio"],
  },
  {
    id: "text-to-speech",
    name: "Text to Speech",
    description: "Convert text to speech with different voices",
    path: "/tools/text-to-speech",
    category: "Text",
    icon: Text,
    featured: false,
    isNew: true,
    tags: ["text", "speech", "voice", "audio", "synthesis", "read"],
  },
  // Newest tools
  {
    id: "coin-flip",
    name: "Coin Flip",
    description: "Flip a virtual coin for making decisions",
    path: "/tools/coin-flip",
    category: "Utilities",
    icon: Coins,
    featured: false,
    isNew: true,
    tags: ["coin", "flip", "random", "decision", "heads", "tails", "chance"],
  },
  {
    id: "dice-roller",
    name: "Dice Roller",
    description: "Roll virtual dice for games and random decisions",
    path: "/tools/dice-roller",
    category: "Utilities",
    icon: Dices,
    featured: false,
    isNew: true,
    tags: ["dice", "roll", "random", "game", "d20", "d6", "rpg", "tabletop"],
  },
  {
    id: "xml-sitemap-generator",
    name: "XML Sitemap Generator",
    description: "Create XML sitemaps for your website",
    path: "/tools/xml-sitemap-generator",
    category: "SEO",
    icon: FileCode,
    featured: false,
    isNew: true,
    tags: ["sitemap", "xml", "seo", "website", "search engine", "google", "indexing"],
  }
];

// Define the allowed tool categories
export type ToolCategory = "All" | Tool["category"];

// Export categories array for use in components
export const categories: ToolCategory[] = [
  "All",
  "Utilities",
  "SEO",
  "Image",
  "Text",
  "Security",
  "Development",
  "Design",
  "Content",
  "Converter",
  "Miscellaneous",
];

// Get featured tools
export const getFeaturedTools = (): Tool[] => {
  return TOOLS.filter(tool => tool.featured);
};

// Get new tools
export const getNewTools = (): Tool[] => {
  return TOOLS.filter(tool => tool.isNew);
};

// Export tools constant to match what's being imported in files
export const tools = TOOLS;

// Get tools by category
export const getToolsByCategory = (category: ToolCategory): Tool[] => {
  if (category === "All") {
    return TOOLS;
  }
  return TOOLS.filter(tool => tool.category === category);
};
