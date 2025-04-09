
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorPicker } from "@/components/ui/color-picker";
import { Image, Globe } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const OgImageGenerator = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState("Your Website Title");
  const [description, setDescription] = useState("A brief description of your website content");
  const [bgColor, setBgColor] = useState("#1e293b");
  const [textColor, setTextColor] = useState("#ffffff");
  const [template, setTemplate] = useState("gradient");
  const [logoUrl, setLogoUrl] = useState("");
  const [siteName, setSiteName] = useState("Your Website");
  
  // This would need a server component to actually generate the image
  // For now, we'll just show a preview and provide the meta tags
  
  const handleCopyCode = () => {
    const code = `
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://yourdomain.com/" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="https://yourdomain.com/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="${siteName}" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="https://yourdomain.com/" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="https://yourdomain.com/og-image.jpg" />
`;

    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: "OG Image meta tags have been copied to your clipboard."
    });
  };

  const renderPreview = () => {
    let style = {};
    
    switch (template) {
      case "gradient":
        style = {
          background: `linear-gradient(45deg, ${bgColor}, ${adjustColor(bgColor, -30)})`,
          color: textColor
        };
        break;
      case "solid":
        style = {
          backgroundColor: bgColor,
          color: textColor
        };
        break;
      case "pattern":
        style = {
          backgroundColor: bgColor,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
          color: textColor
        };
        break;
      default:
        style = {
          backgroundColor: bgColor,
          color: textColor
        };
    }
    
    return (
      <div className="w-full aspect-[1200/630] rounded-lg overflow-hidden shadow-lg" style={style}>
        <div className="w-full h-full flex flex-col justify-center items-center p-8 text-center">
          {logoUrl && (
            <div className="mb-6 w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/80?text=Logo";
                }}
              />
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
          <p className="text-lg opacity-80 mb-6">{description}</p>
          {siteName && <div className="text-sm opacity-60">{siteName}</div>}
        </div>
      </div>
    );
  };

  // Helper function to adjust color shade
  const adjustColor = (color: string, amount: number) => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => 
      ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).slice(-2)
    );
  };

  return (
    <ToolLayout
      title="OG Image Generator"
      description="Create Open Graph images for social sharing with customizable templates and designs"
      icon={<Globe className="h-6 w-6" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="template" className="text-sm font-medium">Template</label>
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="solid">Solid Color</SelectItem>
                    <SelectItem value="pattern">Pattern</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Your Website Title"
                  maxLength={70}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A brief description of your website content"
                  rows={3}
                  maxLength={150}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="siteName" className="text-sm font-medium">Site Name</label>
                <Input
                  id="siteName"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Your Website"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="logoUrl" className="text-sm font-medium">Logo URL (optional)</label>
                <Input
                  id="logoUrl"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="bgColor" className="text-sm font-medium">Background Color</label>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md border" style={{ backgroundColor: bgColor }}></div>
                    <Input 
                      id="bgColor"
                      type="text" 
                      value={bgColor} 
                      onChange={(e) => setBgColor(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="textColor" className="text-sm font-medium">Text Color</label>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md border" style={{ backgroundColor: textColor }}></div>
                    <Input 
                      id="textColor"
                      type="text" 
                      value={textColor} 
                      onChange={(e) => setTextColor(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleCopyCode} className="w-full">
                Copy OG Meta Tags
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preview</h3>
            {renderPreview()}

            <Tabs defaultValue="metatags">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="metatags">Meta Tags</TabsTrigger>
                <TabsTrigger value="tips">Tips</TabsTrigger>
              </TabsList>
              <TabsContent value="metatags" className="mt-4 space-y-4">
                <div className="bg-gray-100 p-4 rounded-md">
                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://yourdomain.com/" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="https://yourdomain.com/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="${siteName}" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="https://yourdomain.com/" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="https://yourdomain.com/og-image.jpg" />`}
                  </pre>
                </div>
              </TabsContent>
              <TabsContent value="tips" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Best Practices</h4>
                  <ul className="text-sm space-y-2 list-disc pl-5">
                    <li>OG image dimensions should be 1200×630 pixels</li>
                    <li>Keep your title under 70 characters</li>
                    <li>Keep your description under 150 characters</li>
                    <li>Use high contrast between text and background colors</li>
                    <li>Include your logo for brand recognition</li>
                    <li>Test your OG tags with Facebook's Sharing Debugger</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default OgImageGenerator;
