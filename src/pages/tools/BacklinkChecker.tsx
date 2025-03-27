
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Link, BarChart, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { showRewardedAd } from "@/utils/adUtils";

const BacklinkChecker = () => {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleAnalyzeBacklinks = async () => {
    if (!url) {
      toast({
        variant: "destructive",
        title: "URL Required",
        description: "Please enter a valid URL to analyze backlinks.",
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      
      // Show an ad before analyzing
      await showRewardedAd();
      
      // Simulate backlink analysis with a delay
      setTimeout(() => {
        // Mock results for demonstration purposes
        const mockResults = {
          totalBacklinks: 124,
          uniqueDomains: 42,
          topDomains: [
            { domain: "example.com", count: 15, quality: "High" },
            { domain: "anotherdomain.com", count: 8, quality: "Medium" },
            { domain: "referrer.net", count: 6, quality: "High" },
          ],
          qualityMetrics: {
            high: 35,
            medium: 48,
            low: 41
          }
        };
        
        setResults(mockResults);
        setIsAnalyzing(false);
        
        toast({
          title: "Analysis Complete",
          description: "Backlink analysis has been completed successfully.",
        });
      }, 2000);
    } catch (error) {
      setIsAnalyzing(false);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "An error occurred while analyzing backlinks.",
      });
    }
  };

  return (
    <ToolLayout
      title="Backlink Checker"
      description="Analyze backlinks pointing to your website. Evaluate link quality, diversity, and identify potential opportunities."
      icon={<Link size={24} />}
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
              onClick={handleAnalyzeBacklinks} 
              disabled={isAnalyzing}
              className="whitespace-nowrap"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Backlinks"}
            </Button>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Enter the full URL of the website you want to analyze, including https://</p>
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
              <h2 className="text-xl font-semibold mb-4">Backlink Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">Total Backlinks</p>
                  <p className="text-3xl font-bold text-primary">{results.totalBacklinks}</p>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">Unique Domains</p>
                  <p className="text-3xl font-bold text-primary">{results.uniqueDomains}</p>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">Domain Diversity</p>
                  <p className="text-3xl font-bold text-primary">
                    {Math.round((results.uniqueDomains / results.totalBacklinks) * 100)}%
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Quality Distribution</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-green-500 h-4 rounded-sm" style={{ width: `${(results.qualityMetrics.high / results.totalBacklinks) * 100}%` }}></div>
                  <span className="text-sm">High Quality ({results.qualityMetrics.high})</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-yellow-500 h-4 rounded-sm" style={{ width: `${(results.qualityMetrics.medium / results.totalBacklinks) * 100}%` }}></div>
                  <span className="text-sm">Medium Quality ({results.qualityMetrics.medium})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-red-500 h-4 rounded-sm" style={{ width: `${(results.qualityMetrics.low / results.totalBacklinks) * 100}%` }}></div>
                  <span className="text-sm">Low Quality ({results.qualityMetrics.low})</span>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Top Referring Domains</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Domain</th>
                      <th className="text-left py-2 px-4">Backlinks</th>
                      <th className="text-left py-2 px-4">Quality</th>
                      <th className="text-left py-2 px-4">Visit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.topDomains.map((domain: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-4">{domain.domain}</td>
                        <td className="py-2 px-4">{domain.count}</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            domain.quality === "High" ? "bg-green-100 text-green-800" :
                            domain.quality === "Medium" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {domain.quality}
                          </span>
                        </td>
                        <td className="py-2 px-4">
                          <Button variant="ghost" size="sm" asChild>
                            <a href={`https://${domain.domain}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Note: This is a simplified demonstration. A real backlink checker would provide more comprehensive data and insights.</p>
              </div>
            </Card>
          </motion.div>
        )}
        
        <Card className="p-6 bg-muted/30">
          <h2 className="text-xl font-semibold mb-4">About Backlink Checking</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>Backlinks are links from other websites that point to your site. They are important for:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Search engine optimization (SEO)</li>
              <li>Driving referral traffic</li>
              <li>Building website authority</li>
              <li>Establishing relationships with other sites in your niche</li>
            </ul>
            <p>Quality backlinks from reputable, relevant websites are more valuable than quantity alone. This tool helps you analyze your backlink profile to identify strengths and opportunities for improvement.</p>
          </div>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default BacklinkChecker;
