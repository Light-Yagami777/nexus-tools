
import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Palette } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const SocialMediaColorPicker = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPlatforms, setFilteredPlatforms] = useState<any[]>([]);

  // Social media platform colors
  const platforms = [
    { name: "Facebook", primary: "#1877F2", secondary: "#3b5998", accent: "#4267B2" },
    { name: "Instagram", primary: "#E4405F", secondary: "#833AB4", accent: "#FCAF45" },
    { name: "Twitter", primary: "#1DA1F2", secondary: "#14171A", accent: "#657786" },
    { name: "LinkedIn", primary: "#0A66C2", secondary: "#004182", accent: "#0073b1" },
    { name: "Pinterest", primary: "#E60023", secondary: "#BD081C", accent: "#CB2027" },
    { name: "YouTube", primary: "#FF0000", secondary: "#282828", accent: "#0F0F0F" },
    { name: "TikTok", primary: "#000000", secondary: "#25F4EE", accent: "#FE2C55" },
    { name: "Snapchat", primary: "#FFFC00", secondary: "#000000", accent: "#FFFFFF" },
    { name: "WhatsApp", primary: "#25D366", secondary: "#075E54", accent: "#128C7E" },
    { name: "Reddit", primary: "#FF4500", secondary: "#1A1A1B", accent: "#FF8717" },
    { name: "Discord", primary: "#5865F2", secondary: "#36393F", accent: "#202225" },
    { name: "Twitch", primary: "#9146FF", secondary: "#18181B", accent: "#6441A4" },
    { name: "Slack", primary: "#4A154B", secondary: "#36C5F0", accent: "#ECB22E" },
    { name: "Spotify", primary: "#1DB954", secondary: "#191414", accent: "#1ED760" },
    { name: "Tumblr", primary: "#35465C", secondary: "#001935", accent: "#001935" },
    { name: "Dribbble", primary: "#EA4C89", secondary: "#444444", accent: "#ea4c89" },
    { name: "Behance", primary: "#053eff", secondary: "#0057ff", accent: "#003ecb" },
    { name: "Medium", primary: "#000000", secondary: "#292929", accent: "#757575" },
    { name: "Telegram", primary: "#26A5E4", secondary: "#0088cc", accent: "#31a9dd" },
    { name: "VK", primary: "#4680C2", secondary: "#5181b8", accent: "#4a76a8" },
    { name: "WeChat", primary: "#07C160", secondary: "#09BB07", accent: "#2DC100" },
    { name: "Line", primary: "#00C300", secondary: "#00b900", accent: "#00b300" },
    { name: "Patreon", primary: "#FF424D", secondary: "#f96854", accent: "#e85b46" },
    { name: "Quora", primary: "#A82400", secondary: "#b92b27", accent: "#a82400" },
    { name: "Soundcloud", primary: "#FF3300", secondary: "#ff5500", accent: "#ff7700" },
  ];

  // Filter platforms based on search term whenever it changes
  useEffect(() => {
    const performSearch = () => {
      const searchLower = searchTerm.toLowerCase().trim();
      
      if (!searchLower) {
        setFilteredPlatforms(platforms);
        return;
      }
      
      const filtered = platforms.filter(platform => 
        platform.name.toLowerCase().includes(searchLower)
      );
      setFilteredPlatforms(filtered);
    };

    performSearch();
  }, [searchTerm]);

  // Initialize with all platforms on first load
  useEffect(() => {
    setFilteredPlatforms(platforms);
  }, []);

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast({
      title: "Copied to clipboard",
      description: `Color ${color} has been copied to your clipboard.`
    });
  };

  const ColorCard = ({ color, label }: { color: string; label: string }) => (
    <div className="flex flex-col items-center space-y-1">
      <div 
        className="w-12 h-12 rounded-md border cursor-pointer transition-transform hover:scale-105"
        style={{ backgroundColor: color }}
        onClick={() => handleCopyColor(color)}
      ></div>
      <div className="text-xs text-center w-full">
        <div className="font-medium truncate">{label}</div>
        <div className="text-muted-foreground truncate">{color}</div>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Social Media Color Picker"
      description="Get brand colors for social media platforms to ensure consistent branding across channels"
      icon={<Palette className="h-6 w-6" />}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="search" className="text-sm font-medium">Search Platforms</label>
                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for a platform..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="grid">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="mt-4">
            <ScrollArea className="h-[500px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredPlatforms.length > 0 ? (
                  filteredPlatforms.map((platform) => (
                    <Card key={platform.name} className="overflow-hidden">
                      <div 
                        className="h-10" 
                        style={{ backgroundColor: platform.primary }}
                      ></div>
                      <CardContent className="pt-4">
                        <h3 className="text-sm font-semibold mb-3 truncate">{platform.name}</h3>
                        <div className="grid grid-cols-3 gap-2">
                          <ColorCard color={platform.primary} label="Primary" />
                          <ColorCard color={platform.secondary} label="Secondary" />
                          <ColorCard color={platform.accent} label="Accent" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    No platforms match your search.
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="list" className="mt-4">
            <Card>
              <ScrollArea className="h-[500px]">
                <div className="w-full overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Platform</th>
                        <th className="text-left p-3">Primary</th>
                        <th className="text-left p-3">Secondary</th>
                        <th className="text-left p-3">Accent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPlatforms.length > 0 ? (
                        filteredPlatforms.map((platform) => (
                          <tr key={platform.name} className="border-b">
                            <td className="p-3 font-medium">{platform.name}</td>
                            <td className="p-3">
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-6 h-6 rounded-md border"
                                  style={{ backgroundColor: platform.primary }}
                                ></div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleCopyColor(platform.primary)}
                                  className="truncate max-w-[100px]"
                                >
                                  {platform.primary}
                                </Button>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-6 h-6 rounded-md border"
                                  style={{ backgroundColor: platform.secondary }}
                                ></div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleCopyColor(platform.secondary)}
                                  className="truncate max-w-[100px]"
                                >
                                  {platform.secondary}
                                </Button>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-6 h-6 rounded-md border"
                                  style={{ backgroundColor: platform.accent }}
                                ></div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleCopyColor(platform.accent)}
                                  className="truncate max-w-[100px]"
                                >
                                  {platform.accent}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-10">
                            No platforms match your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-3">How to Use Brand Colors</h3>
            <ul className="space-y-2 list-disc pl-5">
              <li>Use primary colors for buttons, headers, and main UI elements</li>
              <li>Use secondary colors for accents, backgrounds, and supporting elements</li>
              <li>Maintain consistent branding across all social platforms</li>
              <li>Consider accessibility and ensure good contrast ratios</li>
              <li>Match your social media buttons to the official brand colors</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default SocialMediaColorPicker;
