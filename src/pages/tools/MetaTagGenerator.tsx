
import React, { useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Check, Copy, RefreshCw, Code, Globe, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MetaTagGenerator = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [ogUrl, setOgUrl] = useState('');
  const [twitterCard, setTwitterCard] = useState('summary_large_image');
  const [canonical, setCanonical] = useState('');
  const [robots, setRobots] = useState('index, follow');
  const [viewport, setViewport] = useState(true);
  const [charset, setCharset] = useState(true);
  const [openGraph, setOpenGraph] = useState(true);
  const [twitter, setTwitter] = useState(true);
  const [generatedMeta, setGeneratedMeta] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const generateMetaTags = () => {
    if (!title) {
      toast({
        variant: "destructive",
        title: "Title is required",
        description: "Please enter at least a title for your meta tags.",
      });
      return;
    }

    let metaTags = '';

    if (charset) {
      metaTags += '<meta charset="UTF-8">\n';
    }

    if (viewport) {
      metaTags += '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    }

    metaTags += `<title>${title}</title>\n`;

    if (description) {
      metaTags += `<meta name="description" content="${description}">\n`;
    }

    if (keywords) {
      metaTags += `<meta name="keywords" content="${keywords}">\n`;
    }

    if (author) {
      metaTags += `<meta name="author" content="${author}">\n`;
    }

    if (robots) {
      metaTags += `<meta name="robots" content="${robots}">\n`;
    }

    if (canonical) {
      metaTags += `<link rel="canonical" href="${canonical}">\n`;
    }

    // Open Graph tags
    if (openGraph) {
      metaTags += `<meta property="og:title" content="${ogTitle || title}">\n`;
      if (ogDescription || description) {
        metaTags += `<meta property="og:description" content="${ogDescription || description}">\n`;
      }
      if (ogUrl || canonical) {
        metaTags += `<meta property="og:url" content="${ogUrl || canonical}">\n`;
      }
      metaTags += '<meta property="og:type" content="website">\n';
      if (ogImage) {
        metaTags += `<meta property="og:image" content="${ogImage}">\n`;
      }
    }

    // Twitter Card tags
    if (twitter) {
      metaTags += `<meta name="twitter:card" content="${twitterCard}">\n`;
      metaTags += `<meta name="twitter:title" content="${ogTitle || title}">\n`;
      if (ogDescription || description) {
        metaTags += `<meta name="twitter:description" content="${ogDescription || description}">\n`;
      }
      if (ogImage) {
        metaTags += `<meta name="twitter:image" content="${ogImage}">\n`;
      }
    }

    setGeneratedMeta(metaTags);
    
    toast({
      title: "Meta Tags Generated",
      description: "Copy and paste these tags into the head section of your HTML.",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMeta);
    setIsCopied(true);
    
    toast({
      title: "Copied to Clipboard",
      description: "Meta tags have been copied to your clipboard.",
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setKeywords('');
    setAuthor('');
    setOgTitle('');
    setOgDescription('');
    setOgImage('');
    setOgUrl('');
    setTwitterCard('summary_large_image');
    setCanonical('');
    setRobots('index, follow');
    setViewport(true);
    setCharset(true);
    setOpenGraph(true);
    setTwitter(true);
    setGeneratedMeta('');
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
            <h1 className="text-3xl font-bold mb-2">Meta Tag Generator</h1>
            <p className="text-muted-foreground">
              Create optimized meta tags for better SEO and social media sharing
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Form */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Meta Tags</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="block mb-2">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Page title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={60}
                  />
                  <div className="mt-1 text-xs text-muted-foreground flex justify-between">
                    <span>Recommended: 50-60 characters</span>
                    <span>{title.length}/60</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description" className="block mb-2">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Page description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={160}
                  />
                  <div className="mt-1 text-xs text-muted-foreground flex justify-between">
                    <span>Recommended: 150-160 characters</span>
                    <span>{description.length}/160</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="keywords" className="block mb-2">
                    Keywords
                  </Label>
                  <Input
                    id="keywords"
                    placeholder="keyword1, keyword2, keyword3"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="author" className="block mb-2">
                    Author
                  </Label>
                  <Input
                    id="author"
                    placeholder="Author name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="canonical" className="block mb-2">
                    Canonical URL
                  </Label>
                  <Input
                    id="canonical"
                    placeholder="https://example.com/page"
                    value={canonical}
                    onChange={(e) => setCanonical(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="robots" className="block mb-2">
                    Robots
                  </Label>
                  <Input
                    id="robots"
                    placeholder="index, follow"
                    value={robots}
                    onChange={(e) => setRobots(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="viewport" className="cursor-pointer">
                    Include Viewport Meta Tag
                  </Label>
                  <Switch
                    id="viewport"
                    checked={viewport}
                    onCheckedChange={setViewport}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="charset" className="cursor-pointer">
                    Include Charset Meta Tag
                  </Label>
                  <Switch
                    id="charset"
                    checked={charset}
                    onCheckedChange={setCharset}
                  />
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">Social Media Tags</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="openGraph" className="cursor-pointer">
                    Include Open Graph Tags
                  </Label>
                  <Switch
                    id="openGraph"
                    checked={openGraph}
                    onCheckedChange={setOpenGraph}
                  />
                </div>
                
                {openGraph && (
                  <div className="space-y-4 pl-4 border-l-2 border-l-primary/20">
                    <div>
                      <Label htmlFor="ogTitle" className="block mb-2">
                        OG Title (optional, defaults to main title)
                      </Label>
                      <Input
                        id="ogTitle"
                        placeholder="Open Graph title"
                        value={ogTitle}
                        onChange={(e) => setOgTitle(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="ogDescription" className="block mb-2">
                        OG Description (optional, defaults to main description)
                      </Label>
                      <Textarea
                        id="ogDescription"
                        placeholder="Open Graph description"
                        value={ogDescription}
                        onChange={(e) => setOgDescription(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="ogImage" className="block mb-2">
                        OG Image URL
                      </Label>
                      <Input
                        id="ogImage"
                        placeholder="https://example.com/image.jpg"
                        value={ogImage}
                        onChange={(e) => setOgImage(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="ogUrl" className="block mb-2">
                        OG URL (optional, defaults to canonical URL)
                      </Label>
                      <Input
                        id="ogUrl"
                        placeholder="https://example.com/page"
                        value={ogUrl}
                        onChange={(e) => setOgUrl(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="twitter" className="cursor-pointer">
                    Include Twitter Card Tags
                  </Label>
                  <Switch
                    id="twitter"
                    checked={twitter}
                    onCheckedChange={setTwitter}
                  />
                </div>
                
                {twitter && (
                  <div className="pl-4 border-l-2 border-l-primary/20">
                    <Label htmlFor="twitterCard" className="block mb-2">
                      Twitter Card Type
                    </Label>
                    <select
                      id="twitterCard"
                      value={twitterCard}
                      onChange={(e) => setTwitterCard(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="summary_large_image">Summary Card with Large Image</option>
                      <option value="summary">Summary Card</option>
                      <option value="app">App Card</option>
                      <option value="player">Player Card</option>
                    </select>
                  </div>
                )}
              </div>
              
              <div className="mt-8 flex space-x-4">
                <Button onClick={generateMetaTags} className="flex-1">
                  <Code className="h-4 w-4 mr-1" />
                  Generate Meta Tags
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
                <h2 className="text-xl font-semibold">Generated Meta Tags</h2>
                {generatedMeta && (
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
                )}
              </div>
              
              {generatedMeta ? (
                <pre className="bg-muted p-4 rounded-md overflow-auto min-h-[300px] text-sm font-mono">
                  {generatedMeta}
                </pre>
              ) : (
                <div className="bg-muted min-h-[300px] flex flex-col items-center justify-center rounded-md text-muted-foreground">
                  <Globe className="h-12 w-12 mb-4 opacity-50" />
                  <p>Fill in the form and click "Generate Meta Tags" to see the results</p>
                </div>
              )}
              
              <div className="mt-6 text-sm text-muted-foreground">
                <p className="mb-2 font-medium">How to use:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Copy the generated meta tags</li>
                  <li>Paste them inside the <code>&lt;head&gt;</code> section of your HTML</li>
                  <li>Add before any other stylesheets or scripts</li>
                </ol>
              </div>
            </Card>
          </div>

          {/* Tips Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">SEO Meta Tag Tips</h2>
            <Card className="p-6">
              <ul className="list-disc list-inside space-y-2">
                <li>Keep your title under 60 characters to ensure it displays properly in search results</li>
                <li>Write descriptive meta descriptions under 160 characters to improve click-through rates</li>
                <li>Include your main keywords in both title and description, but don't overdo it</li>
                <li>Use Open Graph tags to control how your content appears when shared on social media</li>
                <li>Always include a high-quality OG image that's at least 1200×630 pixels</li>
                <li>Set the canonical URL to prevent duplicate content issues</li>
                <li>Use different Twitter Card types based on your content needs</li>
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
              <Link to="/tools/sitemap-generator">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Sitemap Generator</h3>
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

export default MetaTagGenerator;
