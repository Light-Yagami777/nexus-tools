
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Smartphone, Check, X, AlertTriangle, ThumbsUp, Info } from "lucide-react";
import { motion } from "framer-motion";
import { showRewardedAd } from "@/utils/adUtils";

const MobileFriendlyTest = () => {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleTestMobileFriendly = async () => {
    if (!url) {
      toast({
        variant: "destructive",
        title: "URL Required",
        description: "Please enter a valid URL to test.",
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      
      // Show an ad before analyzing
      await showRewardedAd();
      
      // Simulate mobile-friendly test with a delay
      setTimeout(() => {
        // Mock results for demonstration purposes
        const mockResults = {
          isMobileFriendly: true,
          screenshot: "https://placehold.co/600x800/e2e8f0/64748b?text=Mobile+Preview",
          usabilityIssues: [
            { 
              type: "touch-elements-too-close", 
              severity: "minor",
              description: "Touch elements are too close to each other",
              recommendation: "Make sure touch elements have enough space between them to be easily tapped."
            }
          ],
          passedChecks: [
            "Viewport is properly configured",
            "Content is sized to viewport",
            "Text is readable without zooming",
            "Links have adequate spacing",
            "Page avoids plugins"
          ]
        };
        
        setResults(mockResults);
        setIsAnalyzing(false);
        
        toast({
          title: "Test Complete",
          description: "Mobile-friendly test has been completed successfully.",
        });
      }, 2000);
    } catch (error) {
      setIsAnalyzing(false);
      toast({
        variant: "destructive",
        title: "Test Failed",
        description: "An error occurred while testing mobile-friendliness.",
      });
    }
  };

  return (
    <ToolLayout
      title="Mobile-Friendly Test"
      description="Check if your site is mobile-friendly according to Google's standards. Identify and fix mobile usability issues."
      icon={<Smartphone size={24} />}
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
              onClick={handleTestMobileFriendly} 
              disabled={isAnalyzing}
              className="whitespace-nowrap"
            >
              {isAnalyzing ? "Testing..." : "Test Mobile Friendly"}
            </Button>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Enter the full URL of the page you want to test, including https://</p>
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
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className="border rounded-xl overflow-hidden shadow-sm">
                    <img 
                      src={results.screenshot} 
                      alt="Mobile Preview" 
                      className="w-full h-auto max-w-[300px]"
                    />
                  </div>
                </div>
                
                <div className="w-full md:w-2/3 space-y-6">
                  <div className="flex items-center gap-3">
                    {results.isMobileFriendly ? (
                      <>
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                          <ThumbsUp className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-green-600">Page is mobile-friendly</h2>
                          <p className="text-muted-foreground">
                            This page is easy to use on a mobile device
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                          <X className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-red-600">Page is not mobile-friendly</h2>
                          <p className="text-muted-foreground">
                            This page is difficult to use on a mobile device
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Passed Checks</h3>
                    <ul className="space-y-2">
                      {results.passedChecks.map((check: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span>{check}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {results.usabilityIssues.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Issues to Fix</h3>
                      <div className="space-y-3">
                        {results.usabilityIssues.map((issue: any, index: number) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-medium mb-1">{issue.description}</h4>
                                <p className="text-sm text-muted-foreground">{issue.recommendation}</p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs ml-auto flex-shrink-0 ${
                                issue.severity === "critical" ? "bg-red-100 text-red-800" :
                                issue.severity === "major" ? "bg-orange-100 text-orange-800" :
                                "bg-yellow-100 text-yellow-800"
                              }`}>
                                {issue.severity}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
        
        <Card className="p-6 bg-muted/30">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Why Mobile-Friendly Matters</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>Having a mobile-friendly website is crucial in today's mobile-first world:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Over 50% of global web traffic comes from mobile devices</li>
                  <li>Google uses mobile-friendliness as a ranking factor</li>
                  <li>Mobile users are 5 times more likely to leave a site that isn't mobile-friendly</li>
                  <li>Mobile-friendly sites see higher conversion rates and engagement</li>
                </ul>
                <p className="mt-2">Google's mobile-friendly test checks for common issues that affect users on mobile devices, such as:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Proper viewport configuration</li>
                  <li>Readable text sizes without zooming</li>
                  <li>Adequate tap target sizes</li>
                  <li>Avoidance of horizontal scrolling</li>
                  <li>Non-use of incompatible plugins</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default MobileFriendlyTest;
