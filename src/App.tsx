import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import EnhancedFooter from "@/components/EnhancedFooter";
import { Toaster } from "@/components/ui/sonner";
import { CSSTransition, TransitionGroup } from "react-transition-group";

// Root pages
const Index = lazy(() => import("@/pages/Index"));
const AllTools = lazy(() => import("@/pages/AllTools"));
const Categories = lazy(() => import("@/pages/Categories"));
const About = lazy(() => import("@/pages/About"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Tool pages
const LoremIpsumGenerator = lazy(() => import("@/pages/tools/LoremIpsumGenerator"));
const ColorPicker = lazy(() => import("@/pages/tools/ColorPicker"));
const ImageResizer = lazy(() => import("@/pages/tools/ImageResizer"));
const PasswordGenerator = lazy(() => import("@/pages/tools/PasswordGenerator"));
const QrCodeGenerator = lazy(() => import("@/pages/tools/QrCodeGenerator"));
const MobileFriendlyTest = lazy(() => import("@/pages/tools/MobileFriendlyTest"));
const SeoAnalyzer = lazy(() => import("@/pages/tools/SeoAnalyzer"));
const BacklinkChecker = lazy(() => import("@/pages/tools/BacklinkChecker"));
const PageSpeedChecker = lazy(() => import("@/pages/tools/PageSpeedChecker"));

// Define the ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Define the main app content
const AppContent = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-grow pb-16 pt-24">
        <TransitionGroup component={null}>
          <CSSTransition key={location.key} timeout={300} classNames="page-transition">
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-[50vh]">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                </div>
              }
            >
              <Routes location={location}>
                <Route path="/" element={<Index />} />
                <Route path="/all-tools" element={<AllTools />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/about" element={<About />} />
                
                {/* Tools Routes */}
                <Route path="/tools/lorem-ipsum-generator" element={<LoremIpsumGenerator />} />
                <Route path="/tools/color-picker" element={<ColorPicker />} />
                <Route path="/tools/image-resizer" element={<ImageResizer />} />
                <Route path="/tools/password-generator" element={<PasswordGenerator />} />
                <Route path="/tools/qr-code-generator" element={<QrCodeGenerator />} />
                <Route path="/tools/mobile-friendly-test" element={<MobileFriendlyTest />} />
                <Route path="/tools/seo-analyzer" element={<SeoAnalyzer />} />
                <Route path="/tools/backlink-checker" element={<BacklinkChecker />} />
                <Route path="/tools/page-speed-checker" element={<PageSpeedChecker />} />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </CSSTransition>
        </TransitionGroup>
      </div>
      <EnhancedFooter />
      <Toaster position="bottom-right" />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
