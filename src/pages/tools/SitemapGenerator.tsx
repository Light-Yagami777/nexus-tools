
import React, { useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { FilePlus, Check, Copy, Download, Trash, Table, FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface UrlEntry {
  url: string;
  changefreq: string;
  priority: string;
  lastmod: string;
}

const SitemapGenerator = () => {
  const [domain, setDomain] = useState('');
  const [urlList, setUrlList] = useState<UrlEntry[]>([
    { url: '', changefreq: 'weekly', priority: '0.5', lastmod: new Date().toISOString().split('T')[0] }
  ]);
  const [includeLastmod, setIncludeLastmod] = useState(true);
  const [includePriority, setIncludePriority] = useState(true);
  const [includeChangefreq, setIncludeChangefreq] = useState(true);
  const [xmlOutput, setXmlOutput] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const addNewUrl = () => {
    setUrlList([
      ...urlList,
      { url: '', changefreq: 'weekly', priority: '0.5', lastmod: new Date().toISOString().split('T')[0] }
    ]);
  };

  const removeUrl = (index: number) => {
    const newUrlList = [...urlList];
    newUrlList.splice(index, 1);
    setUrlList(newUrlList);
  };

  const updateUrl = (index: number, field: keyof UrlEntry, value: string) => {
    const newUrlList = [...urlList];
    newUrlList[index] = {
      ...newUrlList[index],
      [field]: value
    };
    setUrlList(newUrlList);
  };

  const generateSitemap = () => {
    if (!domain) {
      toast({
        variant: "destructive",
        title: "Domain is required",
        description: "Please enter your website domain.",
      });
      return;
    }

    // Validate domain format
    const domainRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/)?$/;
    if (!domainRegex.test(domain)) {
      toast({
        variant: "destructive",
        title: "Invalid domain",
        description: "Please enter a valid domain (e.g., example.com or https://example.com).",
      });
      return;
    }

    // Validate URLs
    const validUrls = urlList.filter(entry => entry.url.trim() !== '');
    if (validUrls.length === 0) {
      toast({
        variant: "destructive",
        title: "No URLs added",
        description: "Please add at least one URL to generate a sitemap.",
      });
      return;
    }

    // Normalize domain (ensure it has http:// and no trailing slash)
    let normalizedDomain = domain;
    if (!normalizedDomain.startsWith('http')) {
      normalizedDomain = 'https://' + normalizedDomain;
    }
    if (normalizedDomain.endsWith('/')) {
      normalizedDomain = normalizedDomain.slice(0, -1);
    }

    // Generate XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    validUrls.forEach(entry => {
      let path = entry.url;
      if (path.startsWith('/')) {
        path = path.substring(1);
      }
      
      xml += '  <url>\n';
      xml += `    <loc>${normalizedDomain}/${path}</loc>\n`;
      
      if (includeLastmod && entry.lastmod) {
        xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      }
      
      if (includeChangefreq && entry.changefreq) {
        xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      }
      
      if (includePriority && entry.priority) {
        xml += `    <priority>${entry.priority}</priority>\n`;
      }
      
      xml += '  </url>\n';
    });

    xml += '</urlset>';
    setXmlOutput(xml);
    
    toast({
      title: "Sitemap Generated",
      description: `Generated sitemap with ${validUrls.length} URLs.`,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(xmlOutput);
    setIsCopied(true);
    
    toast({
      title: "Copied to Clipboard",
      description: "Sitemap XML has been copied to your clipboard.",
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const downloadSitemap = () => {
    const blob = new Blob([xmlOutput], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Your sitemap.xml file is being downloaded.",
    });
  };

  const handleBulkUrlsInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const urls = e.target.value.split('\n').filter(url => url.trim() !== '');
    if (urls.length > 0) {
      const newUrlList = urls.map(url => ({
        url: url.trim(),
        changefreq: 'weekly',
        priority: '0.5',
        lastmod: new Date().toISOString().split('T')[0]
      }));
      setUrlList(newUrlList);
      
      toast({
        title: "URLs Added",
        description: `${newUrlList.length} URLs have been added.`,
      });
    }
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
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Sitemap Generator</h1>
            <p className="text-muted-foreground">
              Create XML sitemaps to help search engines better index your website
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Form */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Website Information</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="domain" className="block mb-2">
                    Domain Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="domain"
                    placeholder="example.com or https://example.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  />
                  <div className="mt-1 text-xs text-muted-foreground">
                    Include https:// if your site uses SSL
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bulk-urls" className="block mb-2">
                    Bulk Add URLs (one per line)
                  </Label>
                  <Textarea
                    id="bulk-urls"
                    placeholder="about\nproducts\ncontact\nblog/post-1"
                    className="mb-2"
                    onChange={handleBulkUrlsInput}
                  />
                  <div className="text-xs text-muted-foreground mb-4">
                    Enter paths relative to your domain, one per line (e.g., "about" for example.com/about)
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeLastmod">Include Last Modified Date</Label>
                    <Switch
                      id="includeLastmod"
                      checked={includeLastmod}
                      onCheckedChange={setIncludeLastmod}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="includePriority">Include Priority</Label>
                    <Switch
                      id="includePriority"
                      checked={includePriority}
                      onCheckedChange={setIncludePriority}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeChangefreq">Include Change Frequency</Label>
                    <Switch
                      id="includeChangefreq"
                      checked={includeChangefreq}
                      onCheckedChange={setIncludeChangefreq}
                    />
                  </div>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">URL Entries</h2>
              
              {urlList.map((entry, index) => (
                <div key={index} className="mb-4 p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">URL #{index + 1}</h3>
                    {urlList.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUrl(index)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`url-${index}`} className="block mb-1">
                        Path <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`url-${index}`}
                        placeholder="about or blog/post-1"
                        value={entry.url}
                        onChange={(e) => updateUrl(index, 'url', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {includeLastmod && (
                        <div>
                          <Label htmlFor={`lastmod-${index}`} className="block mb-1">
                            Last Modified
                          </Label>
                          <Input
                            id={`lastmod-${index}`}
                            type="date"
                            value={entry.lastmod}
                            onChange={(e) => updateUrl(index, 'lastmod', e.target.value)}
                          />
                        </div>
                      )}
                      
                      {includeChangefreq && (
                        <div>
                          <Label htmlFor={`changefreq-${index}`} className="block mb-1">
                            Change Frequency
                          </Label>
                          <select
                            id={`changefreq-${index}`}
                            value={entry.changefreq}
                            onChange={(e) => updateUrl(index, 'changefreq', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="always">Always</option>
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                            <option value="never">Never</option>
                          </select>
                        </div>
                      )}
                      
                      {includePriority && (
                        <div>
                          <Label htmlFor={`priority-${index}`} className="block mb-1">
                            Priority
                          </Label>
                          <select
                            id={`priority-${index}`}
                            value={entry.priority}
                            onChange={(e) => updateUrl(index, 'priority', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="1.0">1.0 (Highest)</option>
                            <option value="0.9">0.9</option>
                            <option value="0.8">0.8</option>
                            <option value="0.7">0.7</option>
                            <option value="0.6">0.6</option>
                            <option value="0.5">0.5 (Default)</option>
                            <option value="0.4">0.4</option>
                            <option value="0.3">0.3</option>
                            <option value="0.2">0.2</option>
                            <option value="0.1">0.1 (Lowest)</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-4 flex space-x-4">
                <Button variant="outline" onClick={addNewUrl} className="flex-1">
                  <FilePlus className="h-4 w-4 mr-1" />
                  Add URL
                </Button>
                <Button onClick={generateSitemap} className="flex-1">
                  <FileText className="h-4 w-4 mr-1" />
                  Generate Sitemap
                </Button>
              </div>
            </Card>

            {/* Output Section */}
            <Card className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Generated Sitemap</h2>
                {xmlOutput && (
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      {isCopied ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button size="sm" onClick={downloadSitemap}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
              
              {xmlOutput ? (
                <pre className="bg-muted p-4 rounded-md overflow-auto min-h-[400px] text-sm font-mono">
                  {xmlOutput}
                </pre>
              ) : (
                <div className="bg-muted min-h-[400px] flex flex-col items-center justify-center rounded-md text-muted-foreground">
                  <Table className="h-12 w-12 mb-4 opacity-50" />
                  <p>Fill in the form and click "Generate Sitemap" to see the XML output</p>
                </div>
              )}
              
              <div className="mt-6 text-sm text-muted-foreground">
                <p className="mb-2 font-medium">How to use your sitemap:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Download the XML file and upload it to your website's root directory</li>
                  <li>Add the following line to your robots.txt file:
                    <pre className="bg-muted p-2 rounded mt-1 mb-2">Sitemap: https://example.com/sitemap.xml</pre>
                  </li>
                  <li>Submit your sitemap URL to search engines:
                    <ul className="list-disc list-inside ml-4 mt-1">
                      <li>Google: <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-primary">Google Search Console</a></li>
                      <li>Bing: <a href="https://www.bing.com/webmasters/about" target="_blank" rel="noopener noreferrer" className="text-primary">Bing Webmaster Tools</a></li>
                    </ul>
                  </li>
                </ol>
              </div>
            </Card>
          </div>

          {/* Recommended Tools */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Try These Related Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link to="/tools/meta-tag-generator">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Meta Tag Generator</h3>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                </Card>
              </Link>
              <Link to="/tools/keyword-density">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Keyword Density Checker</h3>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                </Card>
              </Link>
              <Link to="/tools/dev-formatting">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Dev Formatter</h3>
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
