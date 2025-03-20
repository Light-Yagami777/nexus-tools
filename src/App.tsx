
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WordCounter from "./pages/tools/WordCounter";
import PasswordGenerator from "./pages/tools/PasswordGenerator";
import AllTools from "./pages/AllTools";
import About from "./pages/About";
import Categories from "./pages/Categories";
import { Tool } from "./utils/toolsData";

const queryClient = new QueryClient();

const App = () => {
  // Temporary placeholder component for tool pages that aren't fully implemented yet
  const ToolPlaceholder = ({ toolName }: { toolName: string }) => (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-3xl w-full px-6 py-12">
          <h1 className="text-3xl font-bold mb-6">{toolName}</h1>
          <div className="p-8 rounded-xl border bg-card text-card-foreground shadow-sm">
            <p className="text-lg text-center">
              This tool is coming soon! We're working hard to implement it.
            </p>
            <div className="mt-6 flex justify-center">
              <a href="/" className="text-primary hover:underline font-medium">
                ← Return to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Implemented Tool Routes */}
              <Route path="/tools/word-counter" element={<WordCounter />} />
              <Route path="/tools/password-generator" element={<PasswordGenerator />} />
              
              {/* Placeholder Routes for All Other Tools */}
              
              {/* Image Tools */}
              <Route path="/tools/image-to-png" element={<ToolPlaceholder toolName="Image to PNG Converter" />} />
              <Route path="/tools/image-to-jpg" element={<ToolPlaceholder toolName="Image to JPG Converter" />} />
              <Route path="/tools/image-resizer" element={<ToolPlaceholder toolName="Image Resizer" />} />
              <Route path="/tools/image-compressor" element={<ToolPlaceholder toolName="Image Compressor" />} />
              <Route path="/tools/qr-code-generator" element={<ToolPlaceholder toolName="QR Code Generator" />} />
              <Route path="/tools/image-to-base64" element={<ToolPlaceholder toolName="Image to Base64" />} />
              <Route path="/tools/webp-to-png" element={<ToolPlaceholder toolName="WebP to PNG Converter" />} />
              <Route path="/tools/gif-maker" element={<ToolPlaceholder toolName="GIF Maker" />} />
              <Route path="/tools/image-cropper" element={<ToolPlaceholder toolName="Image Cropper" />} />
              <Route path="/tools/screenshot-to-pdf" element={<ToolPlaceholder toolName="Screenshot to PDF" />} />
              
              {/* SEO Tools */}
              <Route path="/tools/meta-tag-generator" element={<ToolPlaceholder toolName="Meta Tag Generator" />} />
              <Route path="/tools/keyword-density" element={<ToolPlaceholder toolName="Keyword Density Checker" />} />
              <Route path="/tools/sitemap-generator" element={<ToolPlaceholder toolName="Sitemap Generator" />} />
              <Route path="/tools/robots-txt-generator" element={<ToolPlaceholder toolName="Robots.txt Generator" />} />
              <Route path="/tools/google-index-checker" element={<ToolPlaceholder toolName="Google Index Checker" />} />
              <Route path="/tools/backlink-checker" element={<ToolPlaceholder toolName="Backlink Checker" />} />
              <Route path="/tools/page-speed-checker" element={<ToolPlaceholder toolName="Page Speed Checker" />} />
              <Route path="/tools/xml-sitemap-validator" element={<ToolPlaceholder toolName="XML Sitemap Validator" />} />
              <Route path="/tools/mobile-friendly-test" element={<ToolPlaceholder toolName="Mobile-Friendly Test" />} />
              <Route path="/tools/seo-analyzer" element={<ToolPlaceholder toolName="SEO Analyzer" />} />
              
              {/* Text Tools */}
              <Route path="/tools/character-counter" element={<ToolPlaceholder toolName="Character Counter" />} />
              <Route path="/tools/case-converter" element={<ToolPlaceholder toolName="Case Converter" />} />
              <Route path="/tools/lorem-ipsum" element={<ToolPlaceholder toolName="Lorem Ipsum Generator" />} />
              <Route path="/tools/text-to-speech" element={<ToolPlaceholder toolName="Text to Speech" />} />
              <Route path="/tools/url-encoder-decoder" element={<ToolPlaceholder toolName="URL Encoder/Decoder" />} />
              <Route path="/tools/text-diff" element={<ToolPlaceholder toolName="Text Diff Checker" />} />
              <Route path="/tools/text-formatter" element={<ToolPlaceholder toolName="Text Formatter" />} />
              <Route path="/tools/markdown-editor" element={<ToolPlaceholder toolName="Markdown Editor" />} />
              <Route path="/tools/string-utilities" element={<ToolPlaceholder toolName="String Utilities" />} />
              
              {/* Developer Tools */}
              <Route path="/tools/json-formatter" element={<ToolPlaceholder toolName="JSON Formatter" />} />
              <Route path="/tools/color-picker" element={<ToolPlaceholder toolName="Color Picker" />} />
              <Route path="/tools/css-minifier" element={<ToolPlaceholder toolName="CSS Minifier" />} />
              <Route path="/tools/js-minifier" element={<ToolPlaceholder toolName="JavaScript Minifier" />} />
              <Route path="/tools/html-minifier" element={<ToolPlaceholder toolName="HTML Minifier" />} />
              <Route path="/tools/base64" element={<ToolPlaceholder toolName="Base64 Encoder/Decoder" />} />
              <Route path="/tools/regex-tester" element={<ToolPlaceholder toolName="Regex Tester" />} />
              <Route path="/tools/html-to-markdown" element={<ToolPlaceholder toolName="HTML to Markdown" />} />
              <Route path="/tools/markdown-to-html" element={<ToolPlaceholder toolName="Markdown to HTML" />} />
              <Route path="/tools/sql-formatter" element={<ToolPlaceholder toolName="SQL Formatter" />} />
              
              {/* Math & Calculators */}
              <Route path="/tools/bmi-calculator" element={<ToolPlaceholder toolName="BMI Calculator" />} />
              <Route path="/tools/mortgage-calculator" element={<ToolPlaceholder toolName="Mortgage Calculator" />} />
              <Route path="/tools/percentage-calculator" element={<ToolPlaceholder toolName="Percentage Calculator" />} />
              <Route path="/tools/scientific-calculator" element={<ToolPlaceholder toolName="Scientific Calculator" />} />
              <Route path="/tools/age-calculator" element={<ToolPlaceholder toolName="Age Calculator" />} />
              <Route path="/tools/discount-calculator" element={<ToolPlaceholder toolName="Discount Calculator" />} />
              <Route path="/tools/time-calculator" element={<ToolPlaceholder toolName="Time Calculator" />} />
              <Route path="/tools/tip-calculator" element={<ToolPlaceholder toolName="Tip Calculator" />} />
              <Route path="/tools/currency-converter" element={<ToolPlaceholder toolName="Currency Converter" />} />
              <Route path="/tools/binary-decimal" element={<ToolPlaceholder toolName="Binary Decimal Converter" />} />
              
              {/* Unit Converters */}
              <Route path="/tools/unit-converter" element={<ToolPlaceholder toolName="Unit Converter" />} />
              <Route path="/tools/length-converter" element={<ToolPlaceholder toolName="Length Converter" />} />
              <Route path="/tools/weight-converter" element={<ToolPlaceholder toolName="Weight Converter" />} />
              <Route path="/tools/temperature-converter" element={<ToolPlaceholder toolName="Temperature Converter" />} />
              <Route path="/tools/speed-converter" element={<ToolPlaceholder toolName="Speed Converter" />} />
              <Route path="/tools/volume-converter" element={<ToolPlaceholder toolName="Volume Converter" />} />
              <Route path="/tools/area-converter" element={<ToolPlaceholder toolName="Area Converter" />} />
              <Route path="/tools/data-storage-converter" element={<ToolPlaceholder toolName="Data Storage Converter" />} />
              <Route path="/tools/pressure-converter" element={<ToolPlaceholder toolName="Pressure Converter" />} />
              <Route path="/tools/angle-converter" element={<ToolPlaceholder toolName="Angle Converter" />} />
              
              {/* Security & Encryption */}
              <Route path="/tools/md5-generator" element={<ToolPlaceholder toolName="MD5 Hash Generator" />} />
              <Route path="/tools/sha256-generator" element={<ToolPlaceholder toolName="SHA256 Hash Generator" />} />
              <Route path="/tools/hash-identifier" element={<ToolPlaceholder toolName="Hash Identifier" />} />
              <Route path="/tools/encryption" element={<ToolPlaceholder toolName="Encryption/Decryption" />} />
              <Route path="/tools/csrf-token-generator" element={<ToolPlaceholder toolName="CSRF Token Generator" />} />
              <Route path="/tools/ssl-checker" element={<ToolPlaceholder toolName="SSL Checker" />} />
              <Route path="/tools/random-string-generator" element={<ToolPlaceholder toolName="Random String Generator" />} />
              <Route path="/tools/password-strength" element={<ToolPlaceholder toolName="Password Strength Checker" />} />
              <Route path="/tools/jwt-decoder" element={<ToolPlaceholder toolName="JWT Decoder" />} />
              
              {/* Social Media Tools */}
              <Route path="/tools/youtube-thumbnail" element={<ToolPlaceholder toolName="YouTube Thumbnail Downloader" />} />
              <Route path="/tools/social-media-image-resizer" element={<ToolPlaceholder toolName="Social Media Image Resizer" />} />
              <Route path="/tools/hashtag-generator" element={<ToolPlaceholder toolName="Hashtag Generator" />} />
              <Route path="/tools/twitter-card-generator" element={<ToolPlaceholder toolName="Twitter Card Generator" />} />
              <Route path="/tools/instagram-font-generator" element={<ToolPlaceholder toolName="Instagram Font Generator" />} />
              <Route path="/tools/og-image-generator" element={<ToolPlaceholder toolName="OG Image Generator" />} />
              <Route path="/tools/social-media-color-picker" element={<ToolPlaceholder toolName="Social Media Color Picker" />} />
              <Route path="/tools/twitter-character-counter" element={<ToolPlaceholder toolName="Twitter Character Counter" />} />
              <Route path="/tools/social-profile-analyzer" element={<ToolPlaceholder toolName="Social Profile Analyzer" />} />
              <Route path="/tools/post-scheduler" element={<ToolPlaceholder toolName="Post Scheduler" />} />
              
              {/* Miscellaneous */}
              <Route path="/tools/random-number-generator" element={<ToolPlaceholder toolName="Random Number Generator" />} />
              <Route path="/tools/uuid-generator" element={<ToolPlaceholder toolName="UUID Generator" />} />
              <Route path="/tools/coin-flip" element={<ToolPlaceholder toolName="Coin Flip" />} />
              <Route path="/tools/dice-roller" element={<ToolPlaceholder toolName="Dice Roller" />} />
              <Route path="/tools/name-generator" element={<ToolPlaceholder toolName="Name Generator" />} />
              <Route path="/tools/lorem-ipsum-generator" element={<ToolPlaceholder toolName="Lorem Ipsum Generator" />} />
              <Route path="/tools/pomodoro-timer" element={<ToolPlaceholder toolName="Pomodoro Timer" />} />
              <Route path="/tools/notes" element={<ToolPlaceholder toolName="Quick Notes" />} />
              <Route path="/tools/screen-recorder" element={<ToolPlaceholder toolName="Screen Recorder" />} />
              <Route path="/tools/meme-generator" element={<ToolPlaceholder toolName="Meme Generator" />} />
              
              {/* Pages Routes */}
              <Route path="/categories" element={<Categories />} />
              <Route path="/about" element={<About />} />
              <Route path="/all-tools" element={<AllTools />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
