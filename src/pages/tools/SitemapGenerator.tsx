
import React, { useState, useEffect } from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Copy, RefreshCw, FileText, ChevronLeft, ArrowRight, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const SitemapGenerator = () => {
  const [baseUrl, setBaseUrl] = useState('');
  const [urls, setUrls] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [priority, setPriority] = useState('0.8');
  const [includeLastmod, setIncludeLastmod] = useState(true);
  const [generatedSitemap, setGeneratedSitemap] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const addUrl = () => {
    if (newUrl.trim()) {
      setUrls([...urls, newUrl.trim()]);
      setNewUrl('');
    }
  };

  const removeUrl = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addUrl();
    }
  };

  const generateSitemap = () => {
    if (!baseUrl) {
      toast({
        variant: "destructive",
        title: "Base URL is required",
        description: "Please enter the base URL of your website.",
      });
      return;
    }

    if (urls.length === 0) {
      toast({
        variant: "destructive",
        title: "No URLs added",
        description: "Please add at least one URL to your sitemap.",
      });
      return;
    }

    const baseUrlFormatted = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const today = new Date().toISOString().split('T')[0];

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    urls.forEach(url => {
      sitemap += '  <url>\n';
      
      // Format the URL with the base URL if it's not a full URL
      const fullUrl = url.startsWith('http') ? url : `${baseUrlFormatted}${url.startsWith('/') ? url : '/' + url}`;
      sitemap += `    <loc>${fullUrl}</loc>\n`;
      
      if (includeLastmod) {
        sitemap += `    <lastmod>${today}</lastmod>\n`;
      }
      
      sitemap += `    <changefreq>${frequency}</changefreq>\n`;
      sitemap += `    <priority>${priority}</priority>\n`;
      sitemap += '  </url>\n';
    });

    sitemap += '</urlset>';
    
    setGeneratedSitemap(sitemap);
    
    toast({
      title: "Sitemap Generated",
      description: `Successfully created a sitemap with ${urls.length} URLs.`,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSitemap);
    setIsCopied(true);
    
    toast({
      title: "Copied to Clipboard",
      description: "Sitemap XML has been copied to your clipboard.",
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const resetForm = () => {
    setBaseUrl('');
    setUrls([]);
    setNewUrl('');
    setFrequency('weekly');
    setPriority('0.8');
    setIncludeLastmod(true);
    setGeneratedSitemap('');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack} 
              className="mr-2"
              aria-label="Go back"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="text-center flex-grow">
              <h1 className="text-3xl font-bold mb-2">XML Sitemap Generator</h1>
              <p className="text-muted-foreground">
                Create XML sitemaps to help search engines discover and index your pages
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Form */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Site Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="baseUrl" className="block mb-2">
                    Base URL <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="baseUrl"
                    placeholder="https://example.com"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    className="mb-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the base URL of your website (e.g., https://example.com)
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="frequency" className="block mb-2">
                    Change Frequency
                  </Label>
                  <select
                    id="frequency"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="always">always</option>
                    <option value="hourly">hourly</option>
                    <option value="daily">daily</option>
                    <option value="weekly">weekly</option>
                    <option value="monthly">monthly</option>
                    <option value="yearly">yearly</option>
                    <option value="never">never</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="priority" className="block mb-2">
                    Priority
                  </Label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="1.0">1.0 (Highest)</option>
                    <option value="0.9">0.9</option>
                    <option value="0.8">0.8</option>
                    <option value="0.7">0.7</option>
                    <option value="0.6">0.6</option>
                    <option value="0.5">0.5</option>
                    <option value="0.4">0.4</option>
                    <option value="0.3">0.3</option>
                    <option value="0.2">0.2</option>
                    <option value="0.1">0.1</option>
                    <option value="0.0">0.0 (Lowest)</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="lastmod" className="cursor-pointer">
                    Include Last Modified Date
                  </Label>
                  <Switch
                    id="lastmod"
                    checked={includeLastmod}
                    onCheckedChange={setIncludeLastmod}
                  />
                </div>
                
                <div className="pt-4 border-t">
                  <Label htmlFor="newUrl" className="block mb-2">
                    Add URLs <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      id="newUrl"
                      placeholder="/page, /about, /contact, etc."
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <Button type="button" onClick={addUrl}>Add</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Enter relative paths or full URLs. Press Enter to add quickly.
                  </p>
                  
                  {urls.length > 0 && (
                    <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                      <h3 className="text-sm font-medium mb-2">Added URLs:</h3>
                      <ul className="text-sm space-y-1">
                        {urls.map((url, index) => (
                          <li key={index} className="flex justify-between items-center py-1 px-2 hover:bg-muted/50 rounded">
                            <span className="truncate">{url}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeUrl(index)}
                              className="h-6 w-6 p-0"
                            >
                              ×
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8 flex space-x-4">
                <Button onClick={generateSitemap} className="flex-1">
                  <FileText className="h-4 w-4 mr-1" />
                  Generate Sitemap
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </div>
            </Card>

            {/* Output Section */}
            <Card className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Generated Sitemap</h2>
                {generatedSitemap && (
                  <Button size="sm" variant="outline" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-1" />
                    {isCopied ? "Copied!" : "Copy XML"}
                  </Button>
                )}
              </div>
              
              {generatedSitemap ? (
                <pre className="bg-muted p-4 rounded-md overflow-auto text-xs font-mono whitespace-pre-wrap min-h-[300px]">
                  {generatedSitemap}
                </pre>
              ) : (
                <div className="bg-muted min-h-[300px] flex flex-col items-center justify-center rounded-md text-muted-foreground">
                  <Globe className="h-12 w-12 mb-4 opacity-50" />
                  <p>Configure your site settings and click "Generate Sitemap" to see the results</p>
                </div>
              )}
              
              <div className="mt-6 text-sm text-muted-foreground">
                <p className="mb-2 font-medium">How to use:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Generate the sitemap XML</li>
                  <li>Copy the XML and save it as sitemap.xml</li>
                  <li>Upload the file to your website's root directory</li>
                  <li>Add <code>Sitemap: https://yourdomain.com/sitemap.xml</code> to your robots.txt file</li>
                  <li>Submit the sitemap URL to search engines like Google and Bing</li>
                </ol>
              </div>
            </Card>
          </div>

          {/* Tips Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Sitemap Best Practices</h2>
            <Card className="p-6">
              <ul className="list-disc list-inside space-y-2">
                <li>Keep your sitemap under 50MB and 50,000 URLs</li>
                <li>Use proper priorities - your most important pages should have higher priority</li>
                <li>Don't include URLs that return error codes (4xx or 5xx)</li>
                <li>Include canonical URLs to avoid duplicate content issues</li>
                <li>Update your sitemap when you add new pages to your website</li>
                <li>Use the <code>lastmod</code> tag to indicate when pages were last updated</li>
                <li>Submit your sitemap to Google Search Console and Bing Webmaster Tools</li>
              </ul>
            </Card>
          </div>

          {/* Recommended Tools */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Try These Related Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link to="/tools/keyword-density">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Keyword Density Checker</h3>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                </Card>
              </Link>
              <Link to="/tools/meta-tag-generator">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Meta Tag Generator</h3>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                </Card>
              </Link>
              <Link to="/tools/dev-formatting">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Formatter</h3>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default SitemapGenerator;
