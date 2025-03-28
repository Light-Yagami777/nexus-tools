
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Copy, Hash } from 'lucide-react';

const HashtagGenerator = () => {
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [maxHashtags, setMaxHashtags] = useState(15);

  // Sample lists of popular hashtags by category
  const popularHashtags = {
    business: ['marketing', 'entrepreneur', 'business', 'success', 'startup', 'smallbusiness', 'entrepreneurship', 'branding', 'motivation', 'goals'],
    fitness: ['fitness', 'workout', 'gym', 'training', 'fitnessmotivation', 'health', 'fit', 'motivation', 'healthy', 'bodybuilding'],
    food: ['food', 'foodporn', 'instafood', 'foodie', 'delicious', 'yummy', 'homemade', 'healthyfood', 'foodphotography', 'dinner'],
    travel: ['travel', 'travelgram', 'instatravel', 'travelphotography', 'wanderlust', 'adventure', 'traveling', 'nature', 'explore', 'trip'],
    fashion: ['fashion', 'style', 'ootd', 'fashionblogger', 'streetstyle', 'instafashion', 'moda', 'outfit', 'fashionista', 'shopping'],
    photography: ['photography', 'photooftheday', 'photo', 'photographer', 'instagood', 'nature', 'picoftheday', 'art', 'photoshoot', 'travel'],
    tech: ['technology', 'tech', 'innovation', 'programming', 'coding', 'developer', 'webdev', 'software', 'ai', 'machinelearning'],
  };

  const generateHashtags = () => {
    if (!content.trim()) {
      toast.error("Please enter some content to generate hashtags");
      return;
    }

    // Extract keywords from content
    const text = content.toLowerCase();
    const words = text.split(/\s+/);
    const filteredWords = words.filter(word => 
      word.length > 3 && 
      !['and', 'the', 'this', 'that', 'with', 'from', 'have', 'what'].includes(word)
    );
    
    // Convert keywords to hashtags
    const contentHashtags = [...new Set(filteredWords)]
      .slice(0, Math.min(7, filteredWords.length))
      .map(word => word.replace(/[^a-z0-9]/g, ''))
      .filter(word => word.length > 3)
      .map(word => `#${word}`);
    
    // Determine relevant categories based on content
    const categoryScores: Record<string, number> = {};
    Object.entries(popularHashtags).forEach(([category, tags]) => {
      const score = tags.reduce((count, tag) => {
        return text.includes(tag) ? count + 1 : count;
      }, 0);
      categoryScores[category] = score;
    });
    
    // Get top categories
    const topCategories = Object.entries(categoryScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([category]) => category);
    
    // If no clear categories, default to most general ones
    if (topCategories.length === 0 || (topCategories.length === 1 && topCategories[0] === 'business')) {
      topCategories.push('business', 'tech');
    }
    
    // Add popular hashtags from top categories
    let allHashtags = [...contentHashtags];
    
    topCategories.forEach(category => {
      const categoryTags = popularHashtags[category as keyof typeof popularHashtags]
        .map(tag => `#${tag}`);
      allHashtags = [...allHashtags, ...categoryTags];
    });
    
    // Add some general popular hashtags
    const generalHashtags = ['#instagood', '#photooftheday', '#love', '#instagram', '#follow', '#like', '#picoftheday'];
    allHashtags = [...allHashtags, ...generalHashtags];
    
    // Remove duplicates and limit to maxHashtags
    const uniqueHashtags = [...new Set(allHashtags)].slice(0, maxHashtags);
    
    // Shuffle the hashtags
    for (let i = uniqueHashtags.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [uniqueHashtags[i], uniqueHashtags[j]] = [uniqueHashtags[j], uniqueHashtags[i]];
    }
    
    setHashtags(uniqueHashtags);
  };

  const copyToClipboard = () => {
    if (hashtags.length === 0) {
      toast.error("No hashtags to copy");
      return;
    }
    
    navigator.clipboard.writeText(hashtags.join(' '))
      .then(() => toast.success("Hashtags copied to clipboard"))
      .catch(() => toast.error("Failed to copy hashtags"));
  };

  return (
    <ToolLayout title="Hashtag Generator" icon={<Hash size={24} />}>
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="content" className="block mb-2">Your Content</Label>
            <Textarea
              id="content"
              placeholder="Paste your post content here to generate relevant hashtags..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="h-32"
            />
          </div>
          
          <div>
            <Label className="block mb-2">
              Maximum number of hashtags: {maxHashtags}
            </Label>
            <Slider
              value={[maxHashtags]}
              min={5}
              max={30}
              step={1}
              onValueChange={([value]) => setMaxHashtags(value)}
            />
          </div>
          
          <Button 
            onClick={generateHashtags} 
            className="w-full"
          >
            <Hash className="mr-2 h-4 w-4" />
            Generate Hashtags
          </Button>
          
          {hashtags.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Generated Hashtags</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyToClipboard}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy All
                </Button>
              </div>
              
              <div className="p-4 bg-muted rounded-md">
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((hashtag, index) => (
                    <div key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {hashtag}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <Label className="block mb-2">Copy and Paste</Label>
                <p className="text-sm font-mono break-words">
                  {hashtags.join(' ')}
                </p>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>
                  Tips: Instagram allows up to 30 hashtags per post. Using 15-20 relevant hashtags 
                  can improve your post's discoverability.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </ToolLayout>
  );
};

export default HashtagGenerator;
