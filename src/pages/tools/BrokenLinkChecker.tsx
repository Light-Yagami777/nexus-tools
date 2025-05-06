
import React, { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const BrokenLinkChecker = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const validateUrl = (url: string) => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleCheck = () => {
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    // Validate URL format
    if (!validateUrl(url)) {
      toast.error("Please enter a valid URL");
      return;
    }

    setLoading(true);
    setResults([]);
    
    // In a real application, this would call an API to check broken links
    // For demonstration, we'll simulate a response after a delay
    setTimeout(() => {
      // Generate mock results
      const mockLinks = [
        { url: "https://example.com/about", status: 200, statusText: "OK" },
        { url: "https://example.com/products", status: 200, statusText: "OK" },
        { url: "https://example.com/contact", status: 200, statusText: "OK" },
        { url: "https://example.com/old-page", status: 404, statusText: "Not Found" },
        { url: "https://example.com/blog/post-1", status: 200, statusText: "OK" },
        { url: "https://example.com/blog/deleted-post", status: 410, statusText: "Gone" },
        { url: "https://example.com/temp-down", status: 503, statusText: "Service Unavailable" },
        { url: "https://example.com/moved", status: 301, statusText: "Moved Permanently" },
        { url: "https://example.com/external-link", status: 200, statusText: "OK" },
      ];
      
      setResults(mockLinks);
      setLoading(false);
      
      // Count broken links
      const brokenCount = mockLinks.filter(link => link.status >= 400).length;
      if (brokenCount > 0) {
        toast.warning(`Found ${brokenCount} broken links on this page`);
      } else {
        toast.success("No broken links found on this page");
      }
    }, 3000);
  };

  const getStatusColor = (status: number) => {
    if (status < 300) return "text-green-600";
    if (status < 400) return "text-amber-600";
    return "text-red-600";
  };

  const getStatusIcon = (status: number) => {
    if (status < 400) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <ToolLayout title="Broken Link Checker" icon={<Link size={24} />}>
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-6">
              Find broken links on your website. Enter the URL of the page you want to check for broken links.
            </p>
            
            <div className="flex flex-col md:flex-row gap-2">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL (e.g., https://example.com)"
                className="flex-grow"
              />
              <Button 
                onClick={handleCheck} 
                disabled={loading}
                className="whitespace-nowrap"
              >
                {loading ? "Checking Links..." : "Check Links"}
              </Button>
            </div>
            
            {loading && (
              <div className="mt-6 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                </div>
                <p className="mt-2 text-muted-foreground">Scanning website for links, please wait...</p>
              </div>
            )}
          </div>

          {results.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Link Check Results</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left font-medium">URL</th>
                      <th className="py-2 px-4 text-left font-medium">Status</th>
                      <th className="py-2 px-4 text-left font-medium">Status Text</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((link, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {getStatusIcon(link.status)}
                            <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="ml-2 text-sm truncate hover:underline flex items-center"
                            >
                              {link.url}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                        </td>
                        <td className={`py-3 px-4 ${getStatusColor(link.status)}`}>
                          {link.status}
                        </td>
                        <td className={`py-3 px-4 ${getStatusColor(link.status)}`}>
                          {link.statusText}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">Summary</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Total links checked: {results.length}</li>
                  <li className="text-green-600">
                    Working links: {results.filter(link => link.status < 400).length}
                  </li>
                  <li className="text-red-600">
                    Broken links: {results.filter(link => link.status >= 400).length}
                  </li>
                  <li className="text-amber-600">
                    Redirects: {results.filter(link => link.status >= 300 && link.status < 400).length}
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </Card>
    </ToolLayout>
  );
};

export default BrokenLinkChecker;
