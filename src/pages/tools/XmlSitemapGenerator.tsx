import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileCode, Copy, Download, Plus, Trash, Link, Calendar, Gauge } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface SitemapUrl {
  url: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

const XmlSitemapGenerator = () => {
  const [tab, setTab] = useState('url-list');
  const [sitemapUrls, setSitemapUrls] = useState<SitemapUrl[]>([
    {
      url: 'https://example.com/',
      lastmod: format(new Date(), 'yyyy-MM-dd'),
      changefreq: 'weekly',
      priority: '1.0'
    }
  ]);
  const [urlListInput, setUrlListInput] = useState('');
  const [sitemapXml, setSitemapXml] = useState('');
  const [domainName, setDomainName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  
  const createSitemap = () => {
    let urls: SitemapUrl[];
    
    if (tab === 'url-list') {
      if (!urlListInput.trim()) {
        toast.error('Please enter at least one URL');
        return;
      }
      
      const urlLines = urlListInput.split('\n').filter(line => line.trim());
      urls = urlLines.map(url => ({
        url: url.trim(),
        lastmod: format(new Date(), 'yyyy-MM-dd'),
        changefreq: 'weekly',
        priority: '0.8'
      }));
    } else {
      // Using manually added URLs
      if (sitemapUrls.length === 0) {
        toast.error('Please add at least one URL');
        return;
      }
      urls = sitemapUrls;
    }
    
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    const urlsXml = urls.map(item => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n');
    
    const footer = `</urlset>`;
    
    const generatedXml = `${header}\n${urlsXml}\n${footer}`;
    setSitemapXml(generatedXml);
    toast.success('XML sitemap generated successfully');
  };
  
  const addUrl = () => {
    if (!newUrl.trim()) {
      toast.error('Please enter a URL');
      return;
    }
    
    // Basic URL validation
    let url = newUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    
    setSitemapUrls([...sitemapUrls, {
      url,
      lastmod: format(new Date(), 'yyyy-MM-dd'),
      changefreq: 'weekly',
      priority: '0.8'
    }]);
    setNewUrl('');
    toast.success('URL added');
  };
  
  const removeUrl = (index: number) => {
    const newUrls = [...sitemapUrls];
    newUrls.splice(index, 1);
    setSitemapUrls(newUrls);
    toast.success('URL removed');
  };
  
  const updateUrl = (index: number, field: keyof SitemapUrl, value: string) => {
    const newUrls = [...sitemapUrls];
    newUrls[index] = { ...newUrls[index], [field]: value };
    setSitemapUrls(newUrls);
  };
  
  const addSampleUrls = () => {
    if (!domainName.trim()) {
      toast.error('Please enter a domain name');
      return;
    }
    
    let domain = domainName.trim();
    if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
      domain = `https://${domain}`;
    }
    
    if (domain.endsWith('/')) {
      domain = domain.slice(0, -1);
    }
    
    const samplePaths = [
      '/',
      '/about',
      '/contact',
      '/products',
      '/services',
      '/blog',
      '/faq',
    ];
    
    const today = format(new Date(), 'yyyy-MM-dd');
    
    const sampleUrls = samplePaths.map(path => ({
      url: `${domain}${path}`,
      lastmod: today,
      changefreq: path === '/' ? 'daily' : 'weekly',
      priority: path === '/' ? '1.0' : '0.8',
    }));
    
    setSitemapUrls(sampleUrls);
    toast.success('Sample URLs added');
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(sitemapXml)
      .then(() => toast.success('Copied to clipboard'))
      .catch(() => toast.error('Failed to copy'));
  };
  
  const downloadSitemap = () => {
    const blob = new Blob([sitemapXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Sitemap downloaded');
  };

  return (
    <ToolLayout 
      title="XML Sitemap Generator" 
      description="Create XML sitemaps for your website"
      icon={<FileCode className="h-6 w-6" />}
    >
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="manual-entry" onValueChange={setTab}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="manual-entry">Manual Entry</TabsTrigger>
                <TabsTrigger value="url-list">URL List</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual-entry" className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-grow">
                    <Input
                      placeholder="Enter your domain (e.g., example.com)"
                      value={domainName}
                      onChange={(e) => setDomainName(e.target.value)}
                    />
                  </div>
                  <Button onClick={addSampleUrls}>
                    Add Sample URLs
                  </Button>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-grow">
                    <Input
                      placeholder="Add a new URL (e.g., https://example.com/page)"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                    />
                  </div>
                  <Button onClick={addUrl}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add URL
                  </Button>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-muted p-3 text-sm font-medium grid grid-cols-12 gap-2">
                    <div className="col-span-5">URL</div>
                    <div className="col-span-2">Last Modified</div>
                    <div className="col-span-2">Change Frequency</div>
                    <div className="col-span-2">Priority</div>
                    <div className="col-span-1"></div>
                  </div>
                  
                  <div className="divide-y max-h-80 overflow-y-auto">
                    {sitemapUrls.map((item, index) => (
                      <div key={index} className="p-3 grid grid-cols-12 gap-2 items-center text-sm">
                        <div className="col-span-5 truncate" title={item.url}>
                          {item.url}
                        </div>
                        
                        <div className="col-span-2">
                          <Input
                            type="date"
                            value={item.lastmod}
                            onChange={(e) => updateUrl(index, 'lastmod', e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <Select
                            value={item.changefreq}
                            onValueChange={(value) => updateUrl(index, 'changefreq', value)}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="always">Always</SelectItem>
                              <SelectItem value="hourly">Hourly</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
                              <SelectItem value="never">Never</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="col-span-2">
                          <Select
                            value={item.priority}
                            onValueChange={(value) => updateUrl(index, 'priority', value)}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1.0">1.0</SelectItem>
                              <SelectItem value="0.9">0.9</SelectItem>
                              <SelectItem value="0.8">0.8</SelectItem>
                              <SelectItem value="0.7">0.7</SelectItem>
                              <SelectItem value="0.6">0.6</SelectItem>
                              <SelectItem value="0.5">0.5</SelectItem>
                              <SelectItem value="0.4">0.4</SelectItem>
                              <SelectItem value="0.3">0.3</SelectItem>
                              <SelectItem value="0.2">0.2</SelectItem>
                              <SelectItem value="0.1">0.1</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="col-span-1 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeUrl(index)}
                            className="h-6 w-6"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="url-list" className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Enter URLs (one per line)
                  </label>
                  <Textarea
                    placeholder="https://example.com/&#10;https://example.com/about&#10;https://example.com/contact"
                    value={urlListInput}
                    onChange={(e) => setUrlListInput(e.target.value)}
                    className="h-60"
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6">
              <Button onClick={createSitemap}>
                Generate XML Sitemap
              </Button>
            </div>
            
            {sitemapXml && (
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Generated XML Sitemap</h3>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadSitemap}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <div className="bg-muted rounded-md p-4 overflow-auto max-h-80">
                  <pre className="text-xs">{sitemapXml}</pre>
                </div>
                
                <div className="bg-muted/50 rounded-md p-4 space-y-2 text-sm">
                  <p className="font-medium flex items-center">
                    <Link className="h-4 w-4 mr-2" />
                    Save the file as "sitemap.xml" in your website's root directory
                  </p>
                  <p className="font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Update your sitemap regularly to ensure search engines have the latest information
                  </p>
                  <p className="font-medium flex items-center">
                    <Gauge className="h-4 w-4 mr-2" />
                    Submit your sitemap to Google Search Console to improve indexing
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default XmlSitemapGenerator;
