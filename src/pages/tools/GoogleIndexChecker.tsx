
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, Check, X, Loader2 } from "lucide-react";

interface CheckResult {
  url: string;
  indexed: boolean;
  checked: boolean;
  loading: boolean;
}

const GoogleIndexChecker = () => {
  const [url, setUrl] = useState("");
  const [bulkUrls, setBulkUrls] = useState("");
  const [results, setResults] = useState<CheckResult[]>([]);
  const [checking, setChecking] = useState(false);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSingleCheck = () => {
    if (!validateUrl(url)) {
      toast.error("Please enter a valid URL");
      return;
    }
    
    // Clear previous results
    setResults([]);
    setChecking(true);
    
    // Add the URL to results
    const newResult: CheckResult = {
      url,
      indexed: false,
      checked: false,
      loading: true
    };
    
    setResults([newResult]);
    
    // Simulate checking process
    setTimeout(() => {
      const random = Math.random();
      setResults([{
        url,
        indexed: random > 0.3, // Simulate 70% chance of being indexed
        checked: true,
        loading: false
      }]);
      setChecking(false);
    }, 2000);
  };

  const handleBulkCheck = () => {
    if (!bulkUrls.trim()) {
      toast.error("Please enter at least one URL");
      return;
    }
    
    // Parse URLs (one per line)
    const urlList = bulkUrls
      .split("\n")
      .map(url => url.trim())
      .filter(url => url.length > 0);
    
    // Validate URLs
    const invalidUrls = urlList.filter(url => !validateUrl(url));
    if (invalidUrls.length > 0) {
      toast.error(`${invalidUrls.length} invalid URLs found. Please correct them.`);
      return;
    }
    
    // Clear previous results
    setResults([]);
    setChecking(true);
    
    // Add all URLs to results as loading
    const newResults: CheckResult[] = urlList.map(url => ({
      url,
      indexed: false,
      checked: false,
      loading: true
    }));
    
    setResults(newResults);
    
    // Simulate checking process for each URL with delay
    let count = 0;
    urlList.forEach((url, index) => {
      setTimeout(() => {
        const random = Math.random();
        setResults(prev => {
          const updated = [...prev];
          updated[index] = {
            url,
            indexed: random > 0.3, // Simulate 70% chance of being indexed
            checked: true,
            loading: false
          };
          return updated;
        });
        
        count++;
        if (count === urlList.length) {
          setChecking(false);
          toast.success("All URLs checked");
        }
      }, 1000 + index * 500); // Stagger the checks
    });
  };

  return (
    <ToolLayout title="Google Index Checker">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-4">
              Check if your webpages are indexed by Google. Simply enter the URL you want to check.
            </p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="single-url" className="block mb-2">
                  Check Single URL
                </Label>
                <div className="flex">
                  <Input
                    id="single-url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/page"
                    className="rounded-r-none"
                  />
                  <Button 
                    onClick={handleSingleCheck} 
                    disabled={checking || !url}
                    className="rounded-l-none"
                  >
                    {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="relative pt-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-2 text-xs text-muted-foreground">
                    OR
                  </span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="bulk-urls" className="block mb-2">
                  Bulk Check (One URL per line)
                </Label>
                <textarea
                  id="bulk-urls"
                  value={bulkUrls}
                  onChange={(e) => setBulkUrls(e.target.value)}
                  placeholder="https://example.com/page1&#10;https://example.com/page2&#10;https://example.com/page3"
                  className="w-full min-h-[120px] p-2 rounded-md border border-input bg-background"
                />
                <div className="mt-2">
                  <Button 
                    onClick={handleBulkCheck} 
                    disabled={checking || !bulkUrls}
                    className="w-full"
                  >
                    {checking ? "Checking..." : "Check All URLs"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {results.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Results</h3>
              
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left py-2 px-4 font-medium">URL</th>
                      <th className="text-center py-2 px-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index} className="border-t border-border">
                        <td className="py-3 px-4 truncate max-w-[300px]">
                          <a 
                            href={result.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {result.url}
                          </a>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {result.loading ? (
                            <div className="flex justify-center">
                              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                          ) : result.indexed ? (
                            <div className="flex items-center justify-center">
                              <Check className="h-5 w-5 text-green-500 mr-1" />
                              <span className="font-medium text-green-500">Indexed</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <X className="h-5 w-5 text-red-500 mr-1" />
                              <span className="font-medium text-red-500">Not Indexed</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {!checking && results.every(r => r.checked) && (
                <div className="text-center text-sm">
                  <p className="text-muted-foreground">
                    Note: This is a simulation. In a real implementation, this would check against 
                    Google's index via API or search queries.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </ToolLayout>
  );
};

export default GoogleIndexChecker;
