
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Download, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface RobotRule {
  userAgent: string;
  allow: string[];
  disallow: string[];
}

const RobotsTxtGenerator = () => {
  const [siteUrl, setSiteUrl] = useState("");
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [includeSitemap, setIncludeSitemap] = useState(true);
  const [crawlDelay, setCrawlDelay] = useState("10");
  const [rules, setRules] = useState<RobotRule[]>([
    {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/admin/", "/private/", "/tmp/"]
    }
  ]);
  const [robotsTxt, setRobotsTxt] = useState("");

  const handleAddRule = () => {
    setRules([
      ...rules,
      {
        userAgent: "",
        allow: [],
        disallow: []
      }
    ]);
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleUserAgentChange = (index: number, value: string) => {
    const newRules = [...rules];
    newRules[index].userAgent = value;
    setRules(newRules);
  };

  const handleAddAllow = (ruleIndex: number) => {
    const newRules = [...rules];
    newRules[ruleIndex].allow.push("");
    setRules(newRules);
  };

  const handleAddDisallow = (ruleIndex: number) => {
    const newRules = [...rules];
    newRules[ruleIndex].disallow.push("");
    setRules(newRules);
  };

  const handleAllowChange = (ruleIndex: number, allowIndex: number, value: string) => {
    const newRules = [...rules];
    newRules[ruleIndex].allow[allowIndex] = value;
    setRules(newRules);
  };

  const handleDisallowChange = (ruleIndex: number, disallowIndex: number, value: string) => {
    const newRules = [...rules];
    newRules[ruleIndex].disallow[disallowIndex] = value;
    setRules(newRules);
  };

  const handleRemoveAllow = (ruleIndex: number, allowIndex: number) => {
    const newRules = [...rules];
    newRules[ruleIndex].allow = newRules[ruleIndex].allow.filter((_, i) => i !== allowIndex);
    setRules(newRules);
  };

  const handleRemoveDisallow = (ruleIndex: number, disallowIndex: number) => {
    const newRules = [...rules];
    newRules[ruleIndex].disallow = newRules[ruleIndex].disallow.filter((_, i) => i !== disallowIndex);
    setRules(newRules);
  };

  const generateRobotsTxt = () => {
    let robotsTxt = "";
    
    // Add user-agent rules
    rules.forEach(rule => {
      if (!rule.userAgent) return;
      
      robotsTxt += `User-agent: ${rule.userAgent}\n`;
      
      // Add allow rules
      rule.allow.forEach(allow => {
        if (allow) robotsTxt += `Allow: ${allow}\n`;
      });
      
      // Add disallow rules
      rule.disallow.forEach(disallow => {
        if (disallow) robotsTxt += `Disallow: ${disallow}\n`;
      });
      
      // Add crawl delay if provided
      if (crawlDelay) {
        robotsTxt += `Crawl-delay: ${crawlDelay}\n`;
      }
      
      robotsTxt += "\n";
    });
    
    // Add sitemap if enabled
    if (includeSitemap && sitemapUrl) {
      robotsTxt += `Sitemap: ${sitemapUrl}\n`;
    }
    
    // Add host if site URL is provided
    if (siteUrl) {
      robotsTxt += `Host: ${siteUrl.replace(/^https?:\/\//, "")}\n`;
    }
    
    setRobotsTxt(robotsTxt);
    toast.success("robots.txt generated successfully!");
  };

  const handleDownload = () => {
    const blob = new Blob([robotsTxt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "robots.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout title="Robots.txt Generator">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-4">
              Generate a robots.txt file to control search engine crawlers' access to your website. 
              This file tells web robots which pages to crawl and which to ignore.
            </p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="site-url" className="block mb-2">
                  Website URL
                </Label>
                <Input
                  id="site-url"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="sitemap-switch"
                  checked={includeSitemap}
                  onCheckedChange={setIncludeSitemap}
                />
                <Label htmlFor="sitemap-switch">Include Sitemap</Label>
              </div>
              
              {includeSitemap && (
                <div>
                  <Label htmlFor="sitemap-url" className="block mb-2">
                    Sitemap URL
                  </Label>
                  <Input
                    id="sitemap-url"
                    value={sitemapUrl}
                    onChange={(e) => setSitemapUrl(e.target.value)}
                    placeholder="https://example.com/sitemap.xml"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="crawl-delay" className="block mb-2">
                  Crawl Delay (seconds)
                </Label>
                <Input
                  id="crawl-delay"
                  value={crawlDelay}
                  onChange={(e) => setCrawlDelay(e.target.value)}
                  placeholder="10"
                  type="number"
                  min="0"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">User-agent Rules</h3>
              <Button variant="outline" size="sm" onClick={handleAddRule}>
                <Plus className="h-4 w-4 mr-1" />
                Add Rule
              </Button>
            </div>
            
            {rules.map((rule, ruleIndex) => (
              <div key={ruleIndex} className="border rounded-md p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Rule {ruleIndex + 1}</h4>
                  {rules.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRule(ruleIndex)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div>
                  <Label htmlFor={`user-agent-${ruleIndex}`} className="block mb-2">
                    User-agent
                  </Label>
                  <Input
                    id={`user-agent-${ruleIndex}`}
                    value={rule.userAgent}
                    onChange={(e) => handleUserAgentChange(ruleIndex, e.target.value)}
                    placeholder="*"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use * for all robots or specify a particular crawler (e.g., Googlebot)
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Allow Paths</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddAllow(ruleIndex)}
                      className="h-7 text-xs"
                    >
                      Add
                    </Button>
                  </div>
                  
                  {rule.allow.map((allow, allowIndex) => (
                    <div key={allowIndex} className="flex mb-2">
                      <Input
                        value={allow}
                        onChange={(e) => handleAllowChange(ruleIndex, allowIndex, e.target.value)}
                        placeholder="/path/"
                        className="mr-2"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAllow(ruleIndex, allowIndex)}
                        className="h-10 w-10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Disallow Paths</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddDisallow(ruleIndex)}
                      className="h-7 text-xs"
                    >
                      Add
                    </Button>
                  </div>
                  
                  {rule.disallow.map((disallow, disallowIndex) => (
                    <div key={disallowIndex} className="flex mb-2">
                      <Input
                        value={disallow}
                        onChange={(e) => handleDisallowChange(ruleIndex, disallowIndex, e.target.value)}
                        placeholder="/private/"
                        className="mr-2"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveDisallow(ruleIndex, disallowIndex)}
                        className="h-10 w-10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="flex justify-center mt-6">
              <Button 
                onClick={generateRobotsTxt} 
                className="w-full sm:w-auto"
              >
                Generate robots.txt
              </Button>
            </div>
          </div>
          
          {robotsTxt && (
            <div className="space-y-4 mt-6">
              <h3 className="font-medium">Generated robots.txt</h3>
              <Textarea
                value={robotsTxt}
                readOnly
                className="font-mono text-sm h-64 resize-none"
              />
              <div className="flex justify-center">
                <Button onClick={handleDownload} className="w-full sm:w-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Download robots.txt
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </ToolLayout>
  );
};

export default RobotsTxtGenerator;
