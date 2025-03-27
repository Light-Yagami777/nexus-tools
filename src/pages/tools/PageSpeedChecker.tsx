
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Zap, Clock, Smartphone, Monitor, Info } from "lucide-react";
import { motion } from "framer-motion";
import { showRewardedAd } from "@/utils/adUtils";

const PageSpeedChecker = () => {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleAnalyzeSpeed = async () => {
    if (!url) {
      toast({
        variant: "destructive",
        title: "URL Required",
        description: "Please enter a valid URL to analyze page speed.",
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      
      // Show an ad before analyzing
      await showRewardedAd();
      
      // Simulate page speed analysis with a delay
      setTimeout(() => {
        // Mock results for demonstration purposes
        const mockResults = {
          performance: {
            mobile: 72,
            desktop: 85
          },
          metrics: {
            firstContentfulPaint: "1.2s",
            speedIndex: "2.4s",
            largestContentfulPaint: "2.8s",
            timeToInteractive: "3.5s",
            totalBlockingTime: "250ms",
            cumulativeLayoutShift: "0.05"
          },
          opportunities: [
            { title: "Properly size images", impact: "High", description: "Serve images that are appropriately-sized to save cellular data and improve load time." },
            { title: "Eliminate render-blocking resources", impact: "Medium", description: "Resources are blocking the first paint of your page. Consider delivering critical JS/CSS inline and deferring all non-critical JS/styles." },
            { title: "Efficiently encode images", impact: "Medium", description: "Optimized images load faster and consume less cellular data." }
          ]
        };
        
        setResults(mockResults);
        setIsAnalyzing(false);
        
        toast({
          title: "Analysis Complete",
          description: "Page speed analysis has been completed successfully.",
        });
      }, 2000);
    } catch (error) {
      setIsAnalyzing(false);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "An error occurred while analyzing page speed.",
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <ToolLayout
      title="Page Speed Checker"
      description="Test your website loading speed and get recommendations for improvements. Boost user experience and SEO ranking."
      icon={<Zap size={24} />}
      extraPadding
    >
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Enter Website URL</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAnalyzeSpeed} 
              disabled={isAnalyzing}
              className="whitespace-nowrap"
            >
              {isAnalyzing ? "Analyzing..." : "Check Speed"}
            </Button>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Enter the full URL of the page you want to analyze, including https://</p>
          </div>
        </Card>

        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Performance Score</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <span className="font-medium">Mobile</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle 
                          className="text-muted stroke-current" 
                          strokeWidth="10" 
                          stroke="currentColor" 
                          fill="transparent" 
                          r="40" 
                          cx="50" 
                          cy="50"
                        />
                        <circle 
                          className={`${getProgressColor(results.performance.mobile)} stroke-current`}
                          strokeWidth="10" 
                          strokeLinecap="round" 
                          stroke="currentColor" 
                          fill="transparent" 
                          r="40" 
                          cx="50" 
                          cy="50"
                          strokeDasharray={`${results.performance.mobile * 2.51} 251`}
                          strokeDashoffset="0"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <span className={`absolute font-bold text-2xl ${getScoreColor(results.performance.mobile)}`}>
                        {results.performance.mobile}
                      </span>
                    </div>
                    
                    <div className="space-y-2 flex-1">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Poor</span>
                          <span>Good</span>
                        </div>
                        <Progress value={results.performance.mobile} className="h-2" />
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        Your mobile page speed is 
                        {results.performance.mobile >= 90 ? " excellent." : 
                         results.performance.mobile >= 50 ? " average and needs some improvement." : 
                         " poor and needs significant improvement."}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-primary" />
                    <span className="font-medium">Desktop</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle 
                          className="text-muted stroke-current" 
                          strokeWidth="10" 
                          stroke="currentColor" 
                          fill="transparent" 
                          r="40" 
                          cx="50" 
                          cy="50"
                        />
                        <circle 
                          className={`${getProgressColor(results.performance.desktop)} stroke-current`}
                          strokeWidth="10" 
                          strokeLinecap="round" 
                          stroke="currentColor" 
                          fill="transparent" 
                          r="40" 
                          cx="50" 
                          cy="50"
                          strokeDasharray={`${results.performance.desktop * 2.51} 251`}
                          strokeDashoffset="0"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <span className={`absolute font-bold text-2xl ${getScoreColor(results.performance.desktop)}`}>
                        {results.performance.desktop}
                      </span>
                    </div>
                    
                    <div className="space-y-2 flex-1">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Poor</span>
                          <span>Good</span>
                        </div>
                        <Progress value={results.performance.desktop} className="h-2" />
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        Your desktop page speed is 
                        {results.performance.desktop >= 90 ? " excellent." : 
                         results.performance.desktop >= 50 ? " average and needs some improvement." : 
                         " poor and needs significant improvement."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Core Web Vitals</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">First Contentful Paint</span>
                  </div>
                  <p className="text-2xl font-bold">{results.metrics.firstContentfulPaint}</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Speed Index</span>
                  </div>
                  <p className="text-2xl font-bold">{results.metrics.speedIndex}</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Largest Contentful Paint</span>
                  </div>
                  <p className="text-2xl font-bold">{results.metrics.largestContentfulPaint}</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Time to Interactive</span>
                  </div>
                  <p className="text-2xl font-bold">{results.metrics.timeToInteractive}</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Total Blocking Time</span>
                  </div>
                  <p className="text-2xl font-bold">{results.metrics.totalBlockingTime}</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Cumulative Layout Shift</span>
                  </div>
                  <p className="text-2xl font-bold">{results.metrics.cumulativeLayoutShift}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Improvement Opportunities</h2>
              
              <div className="space-y-4">
                {results.opportunities.map((opportunity: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{opportunity.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        opportunity.impact === "High" ? "bg-red-100 text-red-800" :
                        opportunity.impact === "Medium" ? "bg-yellow-100 text-yellow-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {opportunity.impact} Impact
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
        
        <Card className="p-6 bg-muted/30">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Why Page Speed Matters</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>Page speed is a critical factor for both user experience and search engine rankings:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Users typically abandon sites that take longer than 3 seconds to load</li>
                  <li>Google uses page speed as a ranking factor for both mobile and desktop searches</li>
                  <li>Faster pages have higher conversion rates and lower bounce rates</li>
                  <li>Core Web Vitals are key metrics that measure user experience quality</li>
                </ul>
                <p>By improving your page speed, you can enhance user satisfaction, boost search rankings, and increase conversions.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default PageSpeedChecker;
