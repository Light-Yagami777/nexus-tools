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
import QrCodeGenerator from "./pages/tools/QrCodeGenerator";
import DevFormatting from "./pages/tools/DevFormatting";
import ImageToPng from "./pages/tools/ImageToPng";
import ImageToJpg from "./pages/tools/ImageToJpg";
import ImageResizer from "./pages/tools/ImageResizer";
import ImageCompressor from "./pages/tools/ImageCompressor";
import ImageToBase64 from "./pages/tools/ImageToBase64";
import WebpToPng from "./pages/tools/WebpToPng";
import KeywordDensity from "./pages/tools/KeywordDensity";
import MetaTagGenerator from "./pages/tools/MetaTagGenerator";
import SitemapGenerator from "./pages/tools/SitemapGenerator";
import GifMaker from "./pages/tools/GifMaker";
import ImageCropper from "./pages/tools/ImageCropper";
import ScreenshotToPdf from "./pages/tools/ScreenshotToPdf";
import RobotsTxtGenerator from "./pages/tools/RobotsTxtGenerator";
import GoogleIndexChecker from "./pages/tools/GoogleIndexChecker";
import AllTools from "./pages/AllTools";
import About from "./pages/About";
import Categories from "./pages/Categories";
import { Tool } from "./utils/toolsData";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ToolLayout from "./components/ToolLayout";
import ScreenRecorder from "./pages/tools/ScreenRecorder";
import XmlSitemapValidator from "./pages/tools/XmlSitemapValidator";
import SeoAnalyzer from "./pages/tools/SeoAnalyzer";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

const queryClient = new QueryClient();

const App = () => {
  const ToolPlaceholder = ({ toolName, toolDescription = "This tool is coming soon! We're working hard to implement it." }: { toolName: string, toolDescription?: string }) => (
    <ToolLayout title={toolName}>
      <div className="p-8 rounded-xl border bg-card text-card-foreground shadow-sm">
        <p className="text-lg text-center">
          {toolDescription}
        </p>
      </div>
    </ToolLayout>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Active tools */}
              <Route path="/tools/word-counter" element={<WordCounter />} />
              <Route path="/tools/password-generator" element={<PasswordGenerator />} />
              <Route path="/tools/qr-code-generator" element={<QrCodeGenerator />} />
              <Route path="/tools/dev-formatting" element={<DevFormatting />} />
              <Route path="/tools/image-to-png" element={<ImageToPng />} />
              <Route path="/tools/image-to-jpg" element={<ImageToJpg />} />
              <Route path="/tools/image-resizer" element={<ImageResizer />} />
              <Route path="/tools/image-compressor" element={<ImageCompressor />} />
              <Route path="/tools/image-to-base64" element={<ImageToBase64 />} />
              <Route path="/tools/webp-to-png" element={<WebpToPng />} />
              <Route path="/tools/keyword-density" element={<KeywordDensity />} />
              <Route path="/tools/meta-tag-generator" element={<MetaTagGenerator />} />
              <Route path="/tools/sitemap-generator" element={<SitemapGenerator />} />
              <Route path="/tools/gif-maker" element={<GifMaker />} />
              <Route path="/tools/image-cropper" element={<ImageCropper />} />
              <Route path="/tools/screenshot-to-pdf" element={<ScreenshotToPdf />} />
              <Route path="/tools/robots-txt-generator" element={<RobotsTxtGenerator />} />
              <Route path="/tools/google-index-checker" element={<GoogleIndexChecker />} />
              <Route path="/tools/screen-recorder" element={<ScreenRecorder />} />
              <Route path="/tools/xml-sitemap-validator" element={<XmlSitemapValidator />} />
              <Route path="/tools/seo-analyzer" element={<SeoAnalyzer />} />
              
              {/* Tool pages with working placeholders */}
              <Route path="/tools/backlink-checker" element={<ToolPlaceholder toolName="Backlink Checker" toolDescription="Analyze backlinks pointing to your website. Evaluate link quality, diversity, and identify potential opportunities." />} />
              <Route path="/tools/page-speed-checker" element={<ToolPlaceholder toolName="Page Speed Checker" toolDescription="Test your website loading speed and get recommendations for improvements. Boost user experience and SEO ranking." />} />
              <Route path="/tools/mobile-friendly-test" element={<ToolPlaceholder toolName="Mobile-Friendly Test" toolDescription="Check if your site is mobile-friendly according to Google's standards. Identify and fix mobile usability issues." />} />
              
              <Route path="/tools/character-counter" element={<ToolPlaceholder toolName="Character Counter" toolDescription="Count characters with and without spaces. Track your character usage for social media posts, essays, and more." />} />
              <Route path="/tools/case-converter" element={<ToolPlaceholder toolName="Case Converter" toolDescription="Convert text between different cases: uppercase, lowercase, title case, sentence case, and more." />} />
              <Route path="/tools/lorem-ipsum" element={<ToolPlaceholder toolName="Lorem Ipsum Generator" toolDescription="Generate dummy text for your designs. Customize length, format, and style to fit your project needs." />} />
              <Route path="/tools/text-to-speech" element={<ToolPlaceholder toolName="Text to Speech" toolDescription="Convert text to natural-sounding speech. Choose from multiple voices and download as audio files." />} />
              <Route path="/tools/speech-to-text" element={<ToolPlaceholder toolName="Speech to Text" toolDescription="Convert spoken language into written text. Transcribe audio files or record directly in your browser." />} />
              <Route path="/tools/url-encoder-decoder" element={<ToolPlaceholder toolName="URL Encoder/Decoder" toolDescription="Encode or decode URL strings for safe transmission in HTTP requests and responses." />} />
              <Route path="/tools/text-diff" element={<ToolPlaceholder toolName="Text Diff Checker" toolDescription="Compare two texts and find differences. Highlight additions, deletions, and modifications between versions." />} />
              <Route path="/tools/text-formatter" element={<ToolPlaceholder toolName="Text Formatter" toolDescription="Format and beautify your text with options for indentation, line breaks, and spacing." />} />
              <Route path="/tools/markdown-editor" element={<ToolPlaceholder toolName="Markdown Editor" toolDescription="Write and preview markdown in real-time. Export to HTML or formatted text for documentation." />} />
              <Route path="/tools/string-utilities" element={<ToolPlaceholder toolName="String Utilities" toolDescription="Various string manipulation utilities including trim, replace, extract, and more." />} />
              
              <Route path="/tools/color-picker" element={<ToolPlaceholder toolName="Color Picker" toolDescription="Select and generate color codes for your projects. Convert between RGB, HEX, HSL, and more." />} />
              <Route path="/tools/css-minifier" element={<ToolPlaceholder toolName="CSS Minifier" toolDescription="Minify your CSS files to reduce file size and improve loading speed." />} />
              <Route path="/tools/js-minifier" element={<ToolPlaceholder toolName="JavaScript Minifier" toolDescription="Minify your JavaScript code to improve website performance and reduce bandwidth usage." />} />
              
              <Route path="/tools/base64" element={<ToolPlaceholder toolName="Base64 Encoder/Decoder" toolDescription="Encode and decode Base64 data. Convert text, images, and binary files to and from Base64 format." />} />
              <Route path="/tools/regex-tester" element={<ToolPlaceholder toolName="Regex Tester" toolDescription="Test and debug regular expressions with real-time highlighting and explanation." />} />
              <Route path="/tools/html-to-markdown" element={<ToolPlaceholder toolName="HTML to Markdown" toolDescription="Convert HTML to Markdown syntax for easier editing and version control." />} />
              <Route path="/tools/markdown-to-html" element={<ToolPlaceholder toolName="Markdown to HTML" toolDescription="Convert Markdown to HTML code. Preview and download the generated HTML." />} />
              
              <Route path="/tools/bmi-calculator" element={<ToolPlaceholder toolName="BMI Calculator" toolDescription="Calculate your Body Mass Index and understand what it means for your health." />} />
              <Route path="/tools/mortgage-calculator" element={<ToolPlaceholder toolName="Mortgage Calculator" toolDescription="Calculate mortgage payments and generate amortization schedules based on loan terms." />} />
              <Route path="/tools/percentage-calculator" element={<ToolPlaceholder toolName="Percentage Calculator" toolDescription="Calculate percentages easily. Find percentage increases, decreases, and differences." />} />
              <Route path="/tools/scientific-calculator" element={<ToolPlaceholder toolName="Scientific Calculator" toolDescription="Perform complex mathematical calculations with advanced functions and operations." />} />
              <Route path="/tools/age-calculator" element={<ToolPlaceholder toolName="Age Calculator" toolDescription="Calculate precise age between two dates in years, months, and days." />} />
              <Route path="/tools/discount-calculator" element={<ToolPlaceholder toolName="Discount Calculator" toolDescription="Calculate discounts and final prices after applying percentage or fixed amount reductions." />} />
              <Route path="/tools/time-calculator" element={<ToolPlaceholder toolName="Time Calculator" toolDescription="Add or subtract times and convert between different time formats and time zones." />} />
              <Route path="/tools/tip-calculator" element={<ToolPlaceholder toolName="Tip Calculator" toolDescription="Calculate tips for restaurants and services. Split bills among multiple people." />} />
              <Route path="/tools/currency-converter" element={<ToolPlaceholder toolName="Currency Converter" toolDescription="Convert between different currencies using up-to-date exchange rates." />} />
              <Route path="/tools/binary-decimal" element={<ToolPlaceholder toolName="Binary Decimal Converter" toolDescription="Convert between binary, decimal, hexadecimal, and octal number systems." />} />
              
              <Route path="/tools/unit-converter" element={<ToolPlaceholder toolName="Unit Converter" toolDescription="Convert between different units of measurement across multiple categories." />} />
              <Route path="/tools/length-converter" element={<ToolPlaceholder toolName="Length Converter" toolDescription="Convert between different units of length such as meters, feet, inches, and more." />} />
              <Route path="/tools/weight-converter" element={<ToolPlaceholder toolName="Weight Converter" toolDescription="Convert between different units of weight including kilograms, pounds, ounces, and more." />} />
              <Route path="/tools/temperature-converter" element={<ToolPlaceholder toolName="Temperature Converter" toolDescription="Convert between Celsius, Fahrenheit, Kelvin, and other temperature units." />} />
              <Route path="/tools/speed-converter" element={<ToolPlaceholder toolName="Speed Converter" toolDescription="Convert between different units of speed such as mph, km/h, m/s, and knots." />} />
              <Route path="/tools/volume-converter" element={<ToolPlaceholder toolName="Volume Converter" toolDescription="Convert between different units of volume like liters, gallons, cubic meters, and more." />} />
              <Route path="/tools/area-converter" element={<ToolPlaceholder toolName="Area Converter" toolDescription="Convert between different units of area including square meters, acres, hectares, and more." />} />
              <Route path="/tools/data-storage-converter" element={<ToolPlaceholder toolName="Data Storage Converter" toolDescription="Convert between different digital storage units from bits to petabytes." />} />
              <Route path="/tools/pressure-converter" element={<ToolPlaceholder toolName="Pressure Converter" toolDescription="Convert between different pressure units like pascals, bars, psi, and more." />} />
              <Route path="/tools/angle-converter" element={<ToolPlaceholder toolName="Angle Converter" toolDescription="Convert between different angle units including degrees, radians, and gradians." />} />
              
              <Route path="/tools/md5-generator" element={<ToolPlaceholder toolName="MD5 Hash Generator" toolDescription="Generate MD5 hashes from text or files. Verify data integrity with checksum comparison." />} />
              <Route path="/tools/sha256-generator" element={<ToolPlaceholder toolName="SHA256 Hash Generator" toolDescription="Generate secure SHA256 hashes for passwords, files, and data verification." />} />
              <Route path="/tools/hash-identifier" element={<ToolPlaceholder toolName="Hash Identifier" toolDescription="Identify different types of cryptographic hashes by pattern recognition." />} />
              <Route path="/tools/encryption" element={<ToolPlaceholder toolName="Encryption/Decryption" toolDescription="Encrypt and decrypt text with a password using strong encryption algorithms." />} />
              <Route path="/tools/csrf-token-generator" element={<ToolPlaceholder toolName="CSRF Token Generator" toolDescription="Generate secure CSRF tokens for web applications to prevent cross-site request forgery attacks." />} />
              <Route path="/tools/ssl-checker" element={<ToolPlaceholder toolName="SSL Checker" toolDescription="Check SSL certificates of websites for validity, expiration, and security issues." />} />
              <Route path="/tools/random-string-generator" element={<ToolPlaceholder toolName="Random String Generator" toolDescription="Generate random strings with customizable length, character sets, and patterns." />} />
              <Route path="/tools/password-strength" element={<ToolPlaceholder toolName="Password Strength Checker" toolDescription="Evaluate the strength of your passwords against common security standards and best practices." />} />
              <Route path="/tools/jwt-decoder" element={<ToolPlaceholder toolName="JWT Decoder" toolDescription="Decode and verify JSON Web Tokens to inspect their contents and validate signatures." />} />
              
              <Route path="/tools/youtube-thumbnail" element={<ToolPlaceholder toolName="YouTube Thumbnail Downloader" toolDescription="Download thumbnails from YouTube videos in different resolutions." />} />
              <Route path="/tools/social-media-image-resizer" element={<ToolPlaceholder toolName="Social Media Image Resizer" toolDescription="Resize images for different social platforms with optimal dimensions for each network." />} />
              <Route path="/tools/hashtag-generator" element={<ToolPlaceholder toolName="Hashtag Generator" toolDescription="Generate relevant hashtags for your content based on keywords and trending topics." />} />
              <Route path="/tools/twitter-card-generator" element={<ToolPlaceholder toolName="Twitter Card Generator" toolDescription="Create Twitter card previews for your website or blog posts to enhance social sharing." />} />
              <Route path="/tools/instagram-font-generator" element={<ToolPlaceholder toolName="Instagram Font Generator" toolDescription="Create fancy text for Instagram bios and captions that stand out from the crowd." />} />
              <Route path="/tools/og-image-generator" element={<ToolPlaceholder toolName="OG Image Generator" toolDescription="Create Open Graph images for social sharing with customizable templates and designs." />} />
              <Route path="/tools/social-media-color-picker" element={<ToolPlaceholder toolName="Social Media Color Picker" toolDescription="Get brand colors for social media platforms to ensure consistent branding across channels." />} />
              <Route path="/tools/twitter-character-counter" element={<ToolPlaceholder toolName="Twitter Character Counter" toolDescription="Count characters for Twitter posts with visual feedback on length limitations." />} />
              <Route path="/tools/social-profile-analyzer" element={<ToolPlaceholder toolName="Social Profile Analyzer" toolDescription="Analyze social media profiles for engagement metrics and optimization opportunities." />} />
              <Route path="/tools/post-scheduler" element={<ToolPlaceholder toolName="Post Scheduler" toolDescription="Find the optimal times to post on social media based on audience activity patterns." />} />
              
              <Route path="/tools/random-number-generator" element={<ToolPlaceholder toolName="Random Number Generator" toolDescription="Generate random numbers within a specified range with options for uniqueness and distribution." />} />
              <Route path="/tools/uuid-generator" element={<ToolPlaceholder toolName="UUID Generator" toolDescription="Generate UUIDs/GUIDs in various formats for database and application use." />} />
              <Route path="/tools/coin-flip" element={<ToolPlaceholder toolName="Coin Flip" toolDescription="Flip a virtual coin for making decisions with randomized outcomes." />} />
              <Route path="/tools/dice-roller" element={<ToolPlaceholder toolName="Dice Roller" toolDescription="Roll virtual dice with customizable number of sides and dice count." />} />
              <Route path="/tools/name-generator" element={<ToolPlaceholder toolName="Name Generator" toolDescription="Generate random names for characters, businesses, products, and more." />} />
              <Route path="/tools/lorem-ipsum-generator" element={<ToolPlaceholder toolName="Lorem Ipsum Generator" toolDescription="Generate placeholder text in various formats and lengths for design mockups." />} />
              <Route path="/tools/pomodoro-timer" element={<ToolPlaceholder toolName="Pomodoro Timer" toolDescription="Boost productivity with the Pomodoro technique. Customize work and break intervals." />} />
              <Route path="/tools/notes" element={<ToolPlaceholder toolName="Quick Notes" toolDescription="Take quick notes in your browser with auto-save and organization features." />} />
              <Route path="/tools/screen-recorder" element={<ToolPlaceholder toolName="Screen Recorder" toolDescription="Record your screen directly in browser with audio narration and editing options." />} />
              <Route path="/tools/meme-generator" element={<ToolPlaceholder toolName="Meme Generator" toolDescription="Create custom memes with popular templates or upload your own images." />} />
              
              <Route path="/categories" element={<Categories />} />
              <Route path="/about" element={<About />} />
              <Route path="/all-tools" element={<AllTools />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
