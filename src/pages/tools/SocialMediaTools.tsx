
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Copy, Instagram, Twitter, Youtube, Image, Hash, Clock, Users } from 'lucide-react';

type SocialToolType = 
  | 'youtubeThumbnail' 
  | 'imageResizer' 
  | 'hashtagGenerator' 
  | 'twitterCard' 
  | 'instagramFont' 
  | 'ogImage' 
  | 'colorPicker' 
  | 'twitterCounter' 
  | 'profileAnalyzer' 
  | 'postScheduler';

const SocialMediaTools = () => {
  const [activeType, setActiveType] = useState<SocialToolType>('youtubeThumbnail');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [keywords, setKeywords] = useState('');
  const [hashTags, setHashTags] = useState<string[]>([]);
  const [twitterText, setTwitterText] = useState('');
  const [twitterCharCount, setTwitterCharCount] = useState(0);
  const [instagramText, setInstagramText] = useState('');
  const [fancyText, setFancyText] = useState('');
  const [socialUrl, setSocialUrl] = useState('');
  const [socialProfile, setSocialProfile] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');

  // Handle YouTube Thumbnail extraction
  const extractYoutubeThumbnail = () => {
    if (!youtubeUrl) {
      toast.error('Please enter a YouTube video URL');
      return;
    }

    // Extract video ID from URL
    let videoId = '';
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = youtubeUrl.match(youtubeRegex);

    if (match && match[1]) {
      videoId = match[1];
      // Generate thumbnail URLs
      const maxResThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      const highQualityThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      const mediumQualityThumbnail = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
      const standardThumbnail = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;

      // Set the thumbnail URL to display
      setThumbnailUrl(maxResThumbnail);
      toast.success('Thumbnail extracted successfully');
    } else {
      toast.error('Invalid YouTube URL');
    }
  };

  // Handle Hashtag Generation
  const generateHashtags = () => {
    if (!keywords) {
      toast.error('Please enter keywords to generate hashtags');
      return;
    }

    // Simple hashtag generation logic
    const words = keywords.split(/[\s,;]+/).filter(word => word.trim() !== '');
    
    // Generate hashtags
    const generatedTags = words.map(word => `#${word.toLowerCase().trim()}`);
    
    // Add some popular hashtags based on keywords (this would be more sophisticated in real app)
    const popularHashtags = ['#trending', '#viral', '#content', '#socialmedia', '#influencer'];
    const randomPopular = popularHashtags.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    setHashTags([...generatedTags, ...randomPopular]);
    toast.success('Hashtags generated successfully');
  };

  // Handle Twitter Character Counter
  const countTwitterCharacters = (text: string) => {
    setTwitterText(text);
    // Twitter counts URLs as 23 characters regardless of length
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const textWithoutUrls = text.replace(urlRegex, 'URLPLACEHOLDER');
    const urlCount = (text.match(urlRegex) || []).length;
    
    // Calculate character count
    const baseCount = textWithoutUrls.length + (urlCount * 23);
    setTwitterCharCount(baseCount);
  };

  // Handle Instagram Fancy Text Generator
  const generateFancyText = () => {
    if (!instagramText) {
      toast.error('Please enter text to convert');
      return;
    }

    // Simple text transformation for demonstration
    const styles = [
      { name: 'Bold', transform: (text: string) => text.split('').join(' ').toUpperCase() },
      { name: 'Circle', transform: (text: string) => text.split('').map(c => {
        const code = c.charCodeAt(0);
        return code >= 97 && code <= 122 ? String.fromCharCode(code - 32 + 9327) : c;
      }).join('') },
      { name: 'Italic', transform: (text: string) => `𝘐𝘵𝘢𝘭𝘪𝘤 ${text}` },
      { name: 'Script', transform: (text: string) => `𝓢𝓬𝓻𝓲𝓹𝓽 ${text}` },
      { name: 'Double-struck', transform: (text: string) => `𝔻𝕠𝕦𝕓𝕝𝕖-𝕤𝕥𝕣𝕦𝕔𝕜 ${text}` }
    ];

    // Generate all fancy text variations
    const fancy = styles.map(style => `${style.name}: ${style.transform(instagramText)}`).join('\n\n');
    setFancyText(fancy);
    toast.success('Fancy text generated');
  };

  // Handle Social Profile Analysis
  const analyzeSocialProfile = () => {
    if (!socialProfile) {
      toast.error('Please enter a social media profile');
      return;
    }

    // This would connect to an API in a real implementation
    // For demonstration, we'll return a simulated analysis
    const analysis = `
Analysis for profile: @${socialProfile}

Engagement Rate: 3.2% (Above average)
Follower Growth: +12% in the last month
Best Posting Time: Between 6-8 PM
Optimal Post Frequency: 3-4 posts per week
Content Type Analysis:
- Images: 65% engagement
- Videos: 85% engagement
- Text: 40% engagement

Hashtag Performance:
#travel: 250% more engagement
#photography: 180% more engagement
#lifestyle: 120% more engagement

Recommendations:
1. Increase video content
2. Post consistently at peak times
3. Use high-performing hashtags
4. Engage more with follower comments
`;

    setAnalysisResult(analysis);
    toast.success('Profile analysis complete');
  };

  // Handle Copy to Clipboard
  const handleCopy = (text: string) => {
    if (!text) {
      toast.error('Nothing to copy');
      return;
    }
    
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  // Get the current tool configuration
  const getToolConfig = () => {
    switch (activeType) {
      case 'youtubeThumbnail':
        return {
          title: 'YouTube Thumbnail Downloader',
          description: 'Download thumbnails from YouTube videos in different resolutions.',
          icon: <Youtube size={24} />
        };
      case 'imageResizer':
        return {
          title: 'Social Media Image Resizer',
          description: 'Resize images for different social platforms with optimal dimensions for each network.',
          icon: <Image size={24} />
        };
      case 'hashtagGenerator':
        return {
          title: 'Hashtag Generator',
          description: 'Generate relevant hashtags for your content based on keywords and trending topics.',
          icon: <Hash size={24} />
        };
      case 'twitterCard':
        return {
          title: 'Twitter Card Generator',
          description: 'Create Twitter card previews for your website or blog posts to enhance social sharing.',
          icon: <Twitter size={24} />
        };
      case 'instagramFont':
        return {
          title: 'Instagram Font Generator',
          description: 'Create fancy text for Instagram bios and captions that stand out from the crowd.',
          icon: <Instagram size={24} />
        };
      case 'ogImage':
        return {
          title: 'OG Image Generator',
          description: 'Create Open Graph images for social sharing with customizable templates and designs.',
          icon: <Image size={24} />
        };
      case 'colorPicker':
        return {
          title: 'Social Media Color Picker',
          description: 'Get brand colors for social media platforms to ensure consistent branding across channels.',
          icon: <Image size={24} />
        };
      case 'twitterCounter':
        return {
          title: 'Twitter Character Counter',
          description: 'Count characters for Twitter posts with visual feedback on length limitations.',
          icon: <Twitter size={24} />
        };
      case 'profileAnalyzer':
        return {
          title: 'Social Profile Analyzer',
          description: 'Analyze social media profiles for engagement metrics and optimization opportunities.',
          icon: <Users size={24} />
        };
      case 'postScheduler':
        return {
          title: 'Post Scheduler',
          description: 'Find the optimal times to post on social media based on audience activity patterns.',
          icon: <Clock size={24} />
        };
      default:
        return {
          title: 'Social Media Tools',
          description: 'Tools for social media management and optimization.',
          icon: <Users size={24} />
        };
    }
  };

  const toolConfig = getToolConfig();

  // Render tool-specific content
  const renderToolContent = () => {
    switch (activeType) {
      case 'youtubeThumbnail':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="youtube-url">YouTube Video URL</Label>
              <Input
                id="youtube-url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <Button onClick={extractYoutubeThumbnail} className="w-full">
              Extract Thumbnail
            </Button>
            {thumbnailUrl && (
              <div className="space-y-4">
                <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={thumbnailUrl} 
                    alt="YouTube Thumbnail" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to high quality if maxres is not available
                      const target = e.target as HTMLImageElement;
                      const videoId = youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1] || '';
                      target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.open(thumbnailUrl, '_blank')}
                  >
                    Open Full Size
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = thumbnailUrl;
                      link.download = 'youtube-thumbnail.jpg';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    Download
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'hashtagGenerator':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (comma or space separated)</Label>
              <Textarea
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="travel, photography, nature, adventure"
                className="min-h-[100px]"
              />
            </div>
            <Button onClick={generateHashtags} className="w-full">
              Generate Hashtags
            </Button>
            {hashTags.length > 0 && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {hashTags.map((tag, index) => (
                      <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleCopy(hashTags.join(' '))}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All Hashtags
                </Button>
              </div>
            )}
          </div>
        );
        
      case 'twitterCounter':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="twitter-text">Twitter Post</Label>
              <Textarea
                id="twitter-text"
                value={twitterText}
                onChange={(e) => countTwitterCharacters(e.target.value)}
                placeholder="Type your tweet here..."
                className="min-h-[150px]"
              />
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span>Character Count:</span>
                <span className={`font-bold ${twitterCharCount > 280 ? 'text-destructive' : ''}`}>
                  {twitterCharCount}/280
                </span>
              </div>
              <div className="mt-2 w-full bg-background rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    twitterCharCount > 280 ? 'bg-destructive' :
                    twitterCharCount > 240 ? 'bg-amber-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(twitterCharCount / 280 * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        );
        
      case 'instagramFont':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="instagram-text">Your Text</Label>
              <Input
                id="instagram-text"
                value={instagramText}
                onChange={(e) => setInstagramText(e.target.value)}
                placeholder="Type your text here"
              />
            </div>
            <Button onClick={generateFancyText} className="w-full">
              Generate Fancy Text
            </Button>
            {fancyText && (
              <div className="space-y-4">
                <Textarea
                  readOnly
                  value={fancyText}
                  className="min-h-[200px]"
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleCopy(fancyText)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Fancy Text
                </Button>
              </div>
            )}
          </div>
        );
        
      case 'profileAnalyzer':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="social-profile">Social Media Username</Label>
              <Input
                id="social-profile"
                value={socialProfile}
                onChange={(e) => setSocialProfile(e.target.value)}
                placeholder="username (without @)"
              />
            </div>
            <div className="space-y-2">
              <Label>Platform</Label>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Instagram className="h-4 w-4 mr-2" />
                  Instagram
                </Button>
                <Button variant="outline" className="flex-1">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
              </div>
            </div>
            <Button onClick={analyzeSocialProfile} className="w-full">
              Analyze Profile
            </Button>
            {analysisResult && (
              <div className="space-y-4">
                <Textarea
                  readOnly
                  value={analysisResult}
                  className="min-h-[300px] font-mono text-sm"
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleCopy(analysisResult)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Analysis
                </Button>
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <div className="p-8 text-center">
            <h3 className="text-xl font-medium mb-4">Coming Soon</h3>
            <p className="text-muted-foreground">
              This feature is still under development. Please check back later!
            </p>
          </div>
        );
    }
  };

  return (
    <ToolLayout title={toolConfig.title} description={toolConfig.description} icon={toolConfig.icon}>
      <Card className="p-6">
        <Tabs 
          defaultValue="youtubeThumbnail" 
          value={activeType}
          onValueChange={(value) => setActiveType(value as SocialToolType)} 
          className="w-full mb-6"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-1 mb-4">
            <TabsTrigger value="youtubeThumbnail">YouTube Thumbnail</TabsTrigger>
            <TabsTrigger value="imageResizer">Image Resizer</TabsTrigger>
            <TabsTrigger value="hashtagGenerator">Hashtag Generator</TabsTrigger>
            <TabsTrigger value="twitterCard">Twitter Card</TabsTrigger>
            <TabsTrigger value="instagramFont">Instagram Font</TabsTrigger>
            <TabsTrigger value="ogImage">OG Image</TabsTrigger>
            <TabsTrigger value="colorPicker">Brand Colors</TabsTrigger>
            <TabsTrigger value="twitterCounter">Twitter Counter</TabsTrigger>
            <TabsTrigger value="profileAnalyzer">Profile Analyzer</TabsTrigger>
            <TabsTrigger value="postScheduler">Post Scheduler</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid md:grid-cols-1 gap-6">
          {renderToolContent()}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">About {toolConfig.title}</h3>
          <p className="text-sm text-muted-foreground">
            {toolConfig.description} Use this tool to enhance your social media presence and workflow.
          </p>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default SocialMediaTools;
