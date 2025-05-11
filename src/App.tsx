
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

import Index from "@/pages/Index";
import AllTools from "@/pages/AllTools";
import Categories from "@/pages/Categories";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";

// Tool imports
import IpAddressLookup from "@/pages/tools/IpAddressLookup";
import SeoAnalyzer from "@/pages/tools/SeoAnalyzer";
import BacklinkChecker from "@/pages/tools/BacklinkChecker";
import PageSpeedChecker from "@/pages/tools/PageSpeedChecker";
import MobileFriendlyTest from "@/pages/tools/MobileFriendlyTest";
import LoremIpsumGenerator from "@/pages/tools/LoremIpsumGenerator";
import ImageResizer from "@/pages/tools/ImageResizer";
import ImageCompressor from "@/pages/tools/ImageCompressor";
import ImageConverter from "@/pages/tools/ImageConverter";
import PasswordGenerator from "@/pages/tools/PasswordGenerator";
import QrCodeGenerator from "@/pages/tools/QrCodeGenerator";
import HtmlFormatter from "@/pages/tools/HtmlFormatter";
import CssFormatter from "@/pages/tools/CssFormatter";
import JavascriptFormatter from "@/pages/tools/JavascriptFormatter";
import ColorPicker from "@/pages/tools/ColorPicker";
import TextCaseConverter from "@/pages/tools/TextCaseConverter";
import UnitConverter from "@/pages/tools/UnitConverter";
import DomainAgeChecker from "@/pages/tools/DomainAgeChecker";
import WordCounter from "@/pages/tools/WordCounter";
import CharacterCounter from "@/pages/tools/CharacterCounter";
import EmailValidator from "@/pages/tools/EmailValidator";
import BrokenLinkChecker from "@/pages/tools/BrokenLinkChecker";
import KeywordDensityAnalyzer from "@/pages/tools/KeywordDensityAnalyzer";
import SHA256HashGenerator from "@/pages/tools/SHA256HashGenerator";
import ScreenRecorder from "@/pages/tools/ScreenRecorder";
import ScreenshotToPdf from "@/pages/tools/ScreenshotToPdf";
import SSLChecker from "@/pages/tools/SSLChecker";
import RobotsTxtGenerator from "@/pages/tools/RobotsTxtGenerator";
import Base64 from "@/pages/tools/Base64";
import JwtDecoder from "@/pages/tools/JwtDecoder";
import CssMinifier from "@/pages/tools/CssMinifier";
import CaseConverter from "@/pages/tools/CaseConverter";

// Converter tools
import LengthConverter from "@/pages/tools/LengthConverter";
import WeightConverter from "@/pages/tools/WeightConverter";
import TemperatureConverter from "@/pages/tools/TemperatureConverter";
import SpeedConverter from "@/pages/tools/SpeedConverter";
import VolumeConverter from "@/pages/tools/VolumeConverter";
import AngleConverter from "@/pages/tools/AngleConverter";
import AreaConverter from "@/pages/tools/AreaConverter";
import DataStorageConverter from "@/pages/tools/DataStorageConverter";
import PressureConverter from "@/pages/tools/PressureConverter";
import AgeCalculator from "@/pages/tools/AgeCalculator";
import MetaTagGenerator from "@/pages/tools/MetaTagGenerator";
import WebpToPng from "@/pages/tools/WebpToPng";
import SpeechToText from "@/pages/tools/SpeechToText";
import TextToSpeech from "@/pages/tools/TextToSpeech";

// New tools to add
import CoinFlip from "@/pages/tools/CoinFlip";
import DiceRoller from "@/pages/tools/DiceRoller";
import XmlSitemapGenerator from "@/pages/tools/XmlSitemapGenerator";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/tools" element={<AllTools />} />
            <Route path="/categories" element={<Categories />} />

            {/* Tool routes */}
            <Route path="/tools/seo-analyzer" element={<SeoAnalyzer />} />
            <Route path="/tools/mobile-friendly-test" element={<MobileFriendlyTest />} />
            <Route path="/tools/backlink-checker" element={<BacklinkChecker />} />
            <Route path="/tools/page-speed-checker" element={<PageSpeedChecker />} />
            <Route path="/tools/lorem-ipsum-generator" element={<LoremIpsumGenerator />} />
            <Route path="/tools/ip-address-lookup" element={<IpAddressLookup />} />
            <Route path="/tools/image-resizer" element={<ImageResizer />} />
            <Route path="/tools/image-compressor" element={<ImageCompressor />} />
            <Route path="/tools/image-converter" element={<ImageConverter />} />
            <Route path="/tools/password-generator" element={<PasswordGenerator />} />
            <Route path="/tools/qr-code-generator" element={<QrCodeGenerator />} />
            <Route path="/tools/html-formatter" element={<HtmlFormatter />} />
            <Route path="/tools/css-formatter" element={<CssFormatter />} />
            <Route path="/tools/javascript-formatter" element={<JavascriptFormatter />} />
            <Route path="/tools/color-picker" element={<ColorPicker />} />
            <Route path="/tools/text-case-converter" element={<TextCaseConverter />} />
            <Route path="/tools/unit-converter" element={<UnitConverter />} />
            <Route path="/tools/domain-age-checker" element={<DomainAgeChecker />} />
            <Route path="/tools/word-counter" element={<WordCounter />} />
            <Route path="/tools/character-counter" element={<CharacterCounter />} />
            <Route path="/tools/email-validator" element={<EmailValidator />} />
            <Route path="/tools/broken-link-checker" element={<BrokenLinkChecker />} />
            <Route path="/tools/keyword-density-analyzer" element={<KeywordDensityAnalyzer />} />
            <Route path="/tools/sha256-hash-generator" element={<SHA256HashGenerator />} />
            <Route path="/tools/screen-recorder" element={<ScreenRecorder />} />
            <Route path="/tools/screenshot-to-pdf" element={<ScreenshotToPdf />} />
            <Route path="/tools/ssl-checker" element={<SSLChecker />} />
            <Route path="/tools/robots-txt-generator" element={<RobotsTxtGenerator />} />
            <Route path="/tools/base64" element={<Base64 />} />
            <Route path="/tools/jwt-decoder" element={<JwtDecoder />} />
            <Route path="/tools/css-minifier" element={<CssMinifier />} />
            <Route path="/tools/case-converter" element={<CaseConverter />} />
            
            {/* Converter routes */}
            <Route path="/tools/length-converter" element={<LengthConverter />} />
            <Route path="/tools/weight-converter" element={<WeightConverter />} />
            <Route path="/tools/temperature-converter" element={<TemperatureConverter />} />
            <Route path="/tools/speed-converter" element={<SpeedConverter />} />
            <Route path="/tools/volume-converter" element={<VolumeConverter />} />
            <Route path="/tools/angle-converter" element={<AngleConverter />} />
            <Route path="/tools/area-converter" element={<AreaConverter />} />
            <Route path="/tools/data-storage-converter" element={<DataStorageConverter />} />
            <Route path="/tools/pressure-converter" element={<PressureConverter />} />
            
            {/* New tools */}
            <Route path="/tools/age-calculator" element={<AgeCalculator />} />
            <Route path="/tools/meta-tag-generator" element={<MetaTagGenerator />} />
            <Route path="/tools/webp-to-png" element={<WebpToPng />} />
            <Route path="/tools/speech-to-text" element={<SpeechToText />} />
            <Route path="/tools/text-to-speech" element={<TextToSpeech />} />
            
            {/* Newest tools */}
            <Route path="/tools/coin-flip" element={<CoinFlip />} />
            <Route path="/tools/dice-roller" element={<DiceRoller />} />
            <Route path="/tools/xml-sitemap-generator" element={<XmlSitemapGenerator />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster richColors closeButton />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
