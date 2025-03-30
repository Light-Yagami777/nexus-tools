
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Hash, Copy, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const HashtagGenerator = () => {
  const [topic, setTopic] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [customHashtag, setCustomHashtag] = useState('');
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Common hashtags by category
  const commonHashtags: Record<string, string[]> = {
    business: ['business', 'entrepreneur', 'success', 'marketing', 'startup', 'smallbusiness', 'motivation', 'entrepreneurship', 'branding', 'digitalmarketing'],
    travel: ['travel', 'wanderlust', 'adventure', 'travelgram', 'explore', 'vacation', 'instatravel', 'travelphotography', 'nature', 'trip'],
    food: ['food', 'foodie', 'foodporn', 'instafood', 'delicious', 'yummy', 'homemade', 'foodphotography', 'foodstagram', 'healthyfood'],
    fitness: ['fitness', 'workout', 'gym', 'fitnessmotivation', 'health', 'training', 'fit', 'healthy', 'lifestyle', 'exercise'],
    fashion: ['fashion', 'style', 'ootd', 'fashionblogger', 'instafashion', 'streetstyle', 'shopping', 'trend', 'outfit', 'stylish'],
    beauty: ['beauty', 'makeup', 'skincare', 'hair', 'beautiful', 'natural', 'cosmetics', 'selfcare', 'mua', 'makeupartist'],
    photography: ['photography', 'photo', 'photooftheday', 'photographer', 'naturephotography', 'travelphotography', 'portrait', 'canon', 'nikon', 'landscape'],
    technology: ['technology', 'tech', 'innovation', 'digital', 'software', 'programming', 'coding', 'developer', 'ai', 'smartphone'],
  };

  // Function to generate hashtags based on topic
  const generateHashtags = () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsGenerating(true);

    // Simulate API call or processing delay
    setTimeout(() => {
      const words = topic.toLowerCase().split(' ');
      let generatedTags: string[] = [];
      
      // Generate hashtags based on the topic
      words.forEach(word => {
        if (word.length > 2) {
          generatedTags.push(`#${word.replace(/[^a-zA-Z0-9]/g, '')}`);
        }
      });
      
      // Add topic as a hashtag
      generatedTags.push(`#${topic.replace(/\s+/g, '')}`);
      
      // Add related hashtags
      Object.entries(commonHashtags).forEach(([category, tags]) => {
        if (topic.toLowerCase().includes(category) || 
            words.some(word => tags.includes(word))) {
          tags.forEach(tag => {
            generatedTags.push(`#${tag}`);
          });
        }
      });
      
      // Add some popular general hashtags
      const generalTags = ['#trending', '#viral', '#instagood', '#love', '#followme', '#photooftheday', '#amazing', '#follow', '#picoftheday', '#bestoftheday'];
      generatedTags = [...generatedTags, ...generalTags.slice(0, 5)];
      
      // Remove duplicates and limit to 30 hashtags
      const uniqueTags = Array.from(new Set(generatedTags)).slice(0, 30);
      
      setHashtags(uniqueTags);
      setIsGenerating(false);
      
      if (uniqueTags.length > 0) {
        toast.success(`Generated ${uniqueTags.length} hashtags`);
      }
    }, 1500);
  };

  const addCustomHashtag = () => {
    if (!customHashtag.trim()) {
      return;
    }
    
    let tag = customHashtag.trim();
    if (!tag.startsWith('#')) {
      tag = `#${tag}`;
    }
    
    // Remove spaces and special characters
    tag = tag.replace(/\s+/g, '').replace(/[^a-zA-Z0-9#]/g, '');
    
    if (tag.length <= 1) {
      toast.error('Please enter a valid hashtag');
      return;
    }
    
    if (!hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
    }
    
    setCustomHashtag('');
  };

  const toggleHashtagSelection = (tag: string) => {
    if (selectedHashtags.includes(tag)) {
      setSelectedHashtags(selectedHashtags.filter(t => t !== tag));
    } else {
      setSelectedHashtags([...selectedHashtags, tag]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomHashtag();
    }
  };

  const copySelectedHashtags = () => {
    if (selectedHashtags.length === 0) {
      toast.error('Please select hashtags to copy');
      return;
    }
    
    const text = selectedHashtags.join(' ');
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${selectedHashtags.length} hashtags copied to clipboard`);
    }).catch(() => {
      toast.error('Failed to copy hashtags');
    });
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter(t => t !== tag));
    setSelectedHashtags(selectedHashtags.filter(t => t !== tag));
  };

  return (
    <ToolLayout 
      title="Hashtag Generator" 
      description="Generate relevant hashtags for your social media content"
      icon={<Hash className="h-6 w-6" />}
      extraPadding={true}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Generate Hashtags</CardTitle>
          <CardDescription>Enter a topic to generate related hashtags</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="topic">Topic</Label>
              <Textarea
                id="topic"
                placeholder="Enter a topic (e.g., travel photography in New York)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={generateHashtags} 
                disabled={isGenerating || !topic.trim()}
              >
                {isGenerating ? 'Generating...' : 'Generate Hashtags'}
              </Button>
              
              {hashtags.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedHashtags(hashtags);
                    toast.success('All hashtags selected');
                  }}
                >
                  Select All
                </Button>
              )}
              
              {selectedHashtags.length > 0 && (
                <Button 
                  variant="secondary"
                  onClick={copySelectedHashtags}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy {selectedHashtags.length} Selected
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {hashtags.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Custom Hashtag</CardTitle>
            <CardDescription>Add your own hashtags to the list</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Add a custom hashtag (e.g., #mycustomtag)"
                value={customHashtag}
                onChange={(e) => setCustomHashtag(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button onClick={addCustomHashtag}>Add</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {hashtags.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              Generated Hashtags ({selectedHashtags.length}/{hashtags.length} selected)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {hashtags.map((tag, index) => (
                <Badge 
                  key={index}
                  variant={selectedHashtags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1 text-sm flex items-center gap-1"
                  onClick={() => toggleHashtagSelection(tag)}
                >
                  {tag}
                  <X 
                    className="h-3 w-3 ml-1 hover:text-red-500" 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeHashtag(tag);
                    }}
                  />
                </Badge>
              ))}
            </div>
            
            {selectedHashtags.length > 0 && (
              <div className="pt-4 border-t">
                <Label>Selected Hashtags</Label>
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <p className="text-sm break-words">{selectedHashtags.join(' ')}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {30 - selectedHashtags.length} hashtags remaining (Instagram allows up to 30 hashtags per post)
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Hashtag Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="list-disc pl-5 space-y-2">
            <li>Use 15-30 relevant hashtags for maximum reach on Instagram.</li>
            <li>Mix popular hashtags with niche ones for better visibility.</li>
            <li>Avoid using banned or flagged hashtags to prevent shadowbanning.</li>
            <li>Create a branded hashtag for your business or campaign.</li>
            <li>Research trending hashtags in your industry for increased exposure.</li>
            <li>Use location-based hashtags for local targeting.</li>
          </ul>
        </CardContent>
      </Card>
    </ToolLayout>
  );
};

export default HashtagGenerator;
