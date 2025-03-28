
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
import JwtDecoder from "./pages/tools/JwtDecoder";
import CaseConverter from "./pages/tools/CaseConverter";
import LoremIpsumGenerator from "./pages/tools/LoremIpsumGenerator";
import TextToSpeech from "./pages/tools/TextToSpeech";
import SpeechToText from "./pages/tools/SpeechToText";
import UrlEncoderDecoder from "./pages/tools/UrlEncoderDecoder";
import BacklinkChecker from "./pages/tools/BacklinkChecker";
import PageSpeedChecker from "./pages/tools/PageSpeedChecker";
import MobileFriendlyTest from "./pages/tools/MobileFriendlyTest";
import CharacterCounter from "./pages/tools/CharacterCounter";
import TextDiffChecker from "./pages/tools/TextDiffChecker";
import TextFormatter from "./pages/tools/TextFormatter";
import MarkdownEditor from "./pages/tools/MarkdownEditor";
import StringUtilities from "./pages/tools/StringUtilities";
import ColorPicker from "./pages/tools/ColorPicker";
import HtmlMinifier from "./pages/tools/HtmlMinifier";
import CssMinifier from "./pages/tools/CssMinifier";
import JsMinifier from "./pages/tools/JsMinifier";
import Base64 from "./pages/tools/Base64";
import RegexTester from "./pages/tools/RegexTester";
import HtmlToMarkdown from "./pages/tools/HtmlToMarkdown";
import MarkdownToHtml from "./pages/tools/MarkdownToHtml";
import BmiCalculator from "./pages/tools/BmiCalculator";
import MortgageCalculator from "./pages/tools/MortgageCalculator";
import PercentageCalculator from "./pages/tools/PercentageCalculator";
import ScientificCalculator from "./pages/tools/ScientificCalculator";
import AgeCalculator from "./pages/tools/AgeCalculator";
import DiscountCalculator from "./pages/tools/DiscountCalculator";
import TimeCalculator from "./pages/tools/TimeCalculator";
import TipCalculator from "./pages/tools/TipCalculator";
import CurrencyConverter from "./pages/tools/CurrencyConverter";
import BinaryDecimalConverter from "./pages/tools/BinaryDecimalConverter";
import UnitConverter from "./pages/tools/UnitConverter";
import LengthConverter from "./pages/tools/LengthConverter";
import WeightConverter from "./pages/tools/WeightConverter";
import TemperatureConverter from "./pages/tools/TemperatureConverter";
import SpeedConverter from "./pages/tools/SpeedConverter";
import VolumeConverter from "./pages/tools/VolumeConverter";
import AreaConverter from "./pages/tools/AreaConverter";
import DataStorageConverter from "./pages/tools/DataStorageConverter";
import PressureConverter from "./pages/tools/PressureConverter";
import AngleConverter from "./pages/tools/AngleConverter";
import MD5HashGenerator from "./pages/tools/MD5HashGenerator";
import SHA256HashGenerator from "./pages/tools/SHA256HashGenerator";
import HashIdentifier from "./pages/tools/HashIdentifier";
import EncryptionDecryption from "./pages/tools/EncryptionDecryption";
import CSRFTokenGenerator from "./pages/tools/CSRFTokenGenerator";

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
              <Route path="/tools/screenshot-to-pdf" element={<ScreenshotToPdf />} />
              <Route path="/tools/robots-txt-generator" element={<RobotsTxtGenerator />} />
              <Route path="/tools/google-index-checker" element={<GoogleIndexChecker />} />
              <Route path="/tools/screen-recorder" element={<ScreenRecorder />} />
              <Route path="/tools/xml-sitemap-validator" element={<XmlSitemapValidator />} />
              <Route path="/tools/seo-analyzer" element={<SeoAnalyzer />} />
              <Route path="/tools/jwt-decoder" element={<JwtDecoder />} />
              <Route path="/tools/case-converter" element={<CaseConverter />} />
              <Route path="/tools/lorem-ipsum" element={<LoremIpsumGenerator />} />
              <Route path="/tools/text-to-speech" element={<TextToSpeech />} />
              <Route path="/tools/speech-to-text" element={<SpeechToText />} />
              <Route path="/tools/url-encoder-decoder" element={<UrlEncoderDecoder />} />
              
              {/* New tool pages we are adding */}
              <Route path="/tools/backlink-checker" element={<BacklinkChecker />} />
              <Route path="/tools/page-speed-checker" element={<PageSpeedChecker />} />
              <Route path="/tools/mobile-friendly-test" element={<MobileFriendlyTest />} />
              <Route path="/tools/character-counter" element={<CharacterCounter />} />
              <Route path="/tools/text-diff" element={<TextDiffChecker />} />
              <Route path="/tools/text-formatter" element={<TextFormatter />} />
              <Route path="/tools/markdown-editor" element={<MarkdownEditor />} />
              <Route path="/tools/string-utilities" element={<StringUtilities />} />
              
              {/* Newly implemented tool pages */}
              <Route path="/tools/color-picker" element={<ColorPicker />} />
              <Route path="/tools/html-minifier" element={<HtmlMinifier />} />
              <Route path="/tools/css-minifier" element={<CssMinifier />} />
              <Route path="/tools/js-minifier" element={<JsMinifier />} />
              <Route path="/tools/base64" element={<Base64 />} />
              <Route path="/tools/regex-tester" element={<RegexTester />} />
              <Route path="/tools/html-to-markdown" element={<HtmlToMarkdown />} />
              <Route path="/tools/markdown-to-html" element={<MarkdownToHtml />} />
              <Route path="/tools/bmi-calculator" element={<BmiCalculator />} />
              <Route path="/tools/mortgage-calculator" element={<MortgageCalculator />} />
              <Route path="/tools/percentage-calculator" element={<PercentageCalculator />} />
              <Route path="/tools/scientific-calculator" element={<ScientificCalculator />} />
              <Route path="/tools/age-calculator" element={<AgeCalculator />} />
              <Route path="/tools/discount-calculator" element={<DiscountCalculator />} />
              <Route path="/tools/time-calculator" element={<TimeCalculator />} />
              <Route path="/tools/tip-calculator" element={<TipCalculator />} />
              <Route path="/tools/currency-converter" element={<CurrencyConverter />} />
              <Route path="/tools/binary-decimal" element={<BinaryDecimalConverter />} />
              
              {/* Unit Converter Tools */}
              <Route path="/tools/unit-converter" element={<UnitConverter />} />
              <Route path="/tools/length-converter" element={<LengthConverter />} />
              <Route path="/tools/weight-converter" element={<WeightConverter />} />
              <Route path="/tools/temperature-converter" element={<TemperatureConverter />} />
              <Route path="/tools/speed-converter" element={<SpeedConverter />} />
              <Route path="/tools/volume-converter" element={<VolumeConverter />} />
              <Route path="/tools/area-converter" element={<AreaConverter />} />
              <Route path="/tools/data-storage-converter" element={<DataStorageConverter />} />
              <Route path="/tools/pressure-converter" element={<PressureConverter />} />
              <Route path="/tools/angle-converter" element={<AngleConverter />} />
              
              {/* Security & Encryption Tools */}
              <Route path="/tools/md5-generator" element={<MD5HashGenerator />} />
              <Route path="/tools/sha256-generator" element={<SHA256HashGenerator />} />
              <Route path="/tools/hash-identifier" element={<HashIdentifier />} />
              <Route path="/tools/encryption" element={<EncryptionDecryption />} />
              <Route path="/tools/csrf-token-generator" element={<CSRFTokenGenerator />} />
              
              {/* Placeholder tools */}
              <Route path="/tools/ssl-checker" element={<ToolPlaceholder toolName="SSL Checker" toolDescription="Check SSL certificates of websites for validity, expiration, and security issues." />} />
              <Route path="/tools/random-string-generator" element={<ToolPlaceholder toolName="Random String Generator" toolDescription="Generate random strings with customizable length, character sets, and patterns." />} />
              <Route path="/tools/password-strength" element={<ToolPlaceholder toolName="Password Strength Checker" toolDescription="Evaluate the strength of your passwords against common security standards and best practices." />} />
              
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
