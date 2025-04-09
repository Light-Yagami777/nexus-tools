
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Twitter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const TwitterCardGenerator = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState("Your page title here");
  const [description, setDescription] = useState("A brief description of your page content (50-60 characters)");
  const [imageUrl, setImageUrl] = useState("https://via.placeholder.com/1200x675");
  const [twitterHandle, setTwitterHandle] = useState("@yourusername");
  const [cardType, setCardType] = useState("summary_large_image");

  const previewCardStyle = {
    width: "100%",
    maxWidth: "550px",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
    backgroundColor: "#ffffff",
    margin: "0 auto",
  };

  const handleCopyCode = () => {
    const code = `
<!-- Twitter Card Meta Tags -->
<meta name="twitter:card" content="${cardType}" />
<meta name="twitter:site" content="${twitterHandle}" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${imageUrl}" />
`;

    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: "Twitter card code has been copied to your clipboard."
    });
  };

  return (
    <ToolLayout
      title="Twitter Card Generator"
      description="Create Twitter card previews for your website or blog posts to enhance social sharing"
      icon={<Twitter className="h-6 w-6" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="cardType" className="text-sm font-medium">Card Type</label>
                <Select value={cardType} onValueChange={setCardType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select card type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Summary Card</SelectItem>
                    <SelectItem value="summary_large_image">Summary Card with Large Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Your page title here"
                  maxLength={70}
                />
                <p className="text-xs text-muted-foreground">
                  {title.length}/70 characters
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A brief description of your page content"
                  rows={3}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">
                  {description.length}/200 characters
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="imageUrl" className="text-sm font-medium">Image URL</label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Recommended size: 1200×675 pixels (2:1 ratio)
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="twitterHandle" className="text-sm font-medium">Twitter Handle</label>
                <Input
                  id="twitterHandle"
                  value={twitterHandle}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                  placeholder="@yourusername"
                />
              </div>

              <Button onClick={handleCopyCode} className="w-full">
                Copy Twitter Card Code
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preview</h3>
            <div style={previewCardStyle}>
              <div className="p-3">
                {imageUrl && cardType === "summary_large_image" && (
                  <div className="w-full h-64 bg-gray-200 mb-3 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt="Twitter Card Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/1200x675?text=Invalid+Image+URL";
                      }}
                    />
                  </div>
                )}
                
                <div className="flex items-center mb-2">
                  {imageUrl && cardType === "summary" && (
                    <div className="w-16 h-16 bg-gray-200 mr-3 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt="Twitter Card Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/120x120?text=Invalid+Image";
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">{twitterHandle}</p>
                  <h4 className="text-base font-semibold leading-tight">{title}</h4>
                  <p className="text-sm text-gray-700 line-clamp-2">{description}</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="html">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="tips">Tips</TabsTrigger>
              </TabsList>
              <TabsContent value="html" className="mt-4 space-y-4">
                <div className="bg-gray-100 p-4 rounded-md">
                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`<!-- Twitter Card Meta Tags -->
<meta name="twitter:card" content="${cardType}" />
<meta name="twitter:site" content="${twitterHandle}" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${imageUrl}" />`}
                  </pre>
                </div>
              </TabsContent>
              <TabsContent value="tips" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Best Practices</h4>
                  <ul className="text-sm space-y-2 list-disc pl-5">
                    <li>Keep titles under 70 characters</li>
                    <li>Create descriptions between 50-200 characters</li>
                    <li>Use high-quality images with a 2:1 ratio (1200×675px)</li>
                    <li>Test your cards using Twitter's Card Validator</li>
                    <li>Include your Twitter handle to attribute content</li>
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

export default TwitterCardGenerator;
