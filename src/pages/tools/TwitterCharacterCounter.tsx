
import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Twitter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const TwitterCharacterCounter = () => {
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [urlCount, setUrlCount] = useState(0);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [mentions, setMentions] = useState<string[]>([]);
  
  const TWITTER_LIMIT = 280;
  const URL_LENGTH = 23; // Twitter counts all URLs as 23 characters

  useEffect(() => {
    // Extract URLs, hashtags and mentions for analysis
    const urls = content.match(/https?:\/\/\S+/g) || [];
    const extractedHashtags = content.match(/#[a-zA-Z0-9_]+/g) || [];
    const extractedMentions = content.match(/@[a-zA-Z0-9_]+/g) || [];
    
    setUrlCount(urls.length);
    setHashtags(extractedHashtags);
    setMentions(extractedMentions);
    
    // Calculate character count with Twitter's URL shortening
    let adjustedContent = content;
    urls.forEach(url => {
      adjustedContent = adjustedContent.replace(url, 'X'.repeat(URL_LENGTH));
    });
    
    setCharacterCount(adjustedContent.length);
  }, [content]);
  
  const getProgressColor = () => {
    const percentage = (characterCount / TWITTER_LIMIT) * 100;
    if (percentage < 80) return "bg-green-500";
    if (percentage < 95) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  const handleClear = () => {
    setContent("");
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Your tweet has been copied to the clipboard."
    });
  };

  return (
    <ToolLayout
      title="Twitter Character Counter"
      description="Count characters for Twitter posts with visual feedback on length limitations"
      icon={<Twitter className="h-6 w-6" />}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="tweetContent" className="text-sm font-medium">
                  Enter your tweet
                </label>
                <span className={`text-sm font-mono ${characterCount > TWITTER_LIMIT ? "text-red-500 font-bold" : ""}`}>
                  {characterCount}/{TWITTER_LIMIT}
                </span>
              </div>
              
              <Textarea
                id="tweetContent"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's happening?"
                rows={6}
                className="resize-none w-full"
              />
              
              <Progress 
                value={(characterCount / TWITTER_LIMIT) * 100} 
                className={`h-2 ${getProgressColor()}`}
              />
              
              <div className="flex flex-col sm:flex-row justify-between gap-2">
                <Button variant="outline" onClick={handleClear} className="flex-1">
                  Clear
                </Button>
                <Button onClick={handleCopy} className="flex-1">
                  Copy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3">Tweet Analysis</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Characters:</span>
                  <span className="font-mono">{characterCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Remaining:</span>
                  <span className={`font-mono ${TWITTER_LIMIT - characterCount < 0 ? "text-red-500" : ""}`}>
                    {TWITTER_LIMIT - characterCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">URLs:</span>
                  <span className="font-mono">{urlCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Hashtags:</span>
                  <span className="font-mono">{hashtags.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mentions:</span>
                  <span className="font-mono">{mentions.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3">Hashtags</h3>
              <div className="max-h-[120px] overflow-y-auto">
                {hashtags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {hashtags.map((hashtag, index) => (
                      <div key={index} className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-sm">
                        {hashtag}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No hashtags found</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3">Mentions</h3>
              <div className="max-h-[120px] overflow-y-auto">
                {mentions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {mentions.map((mention, index) => (
                      <div key={index} className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-sm">
                        {mention}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No mentions found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-3">Twitter Character Count Tips</h3>
            <ul className="space-y-2 list-disc pl-5">
              <li>Twitter counts all URLs (even long ones) as 23 characters</li>
              <li>Emojis typically count as 2 characters each</li>
              <li>Special characters and non-Latin scripts may count differently</li>
              <li>Include 1-2 relevant hashtags for better discoverability</li>
              <li>Use link shorteners to save space if posting multiple URLs</li>
              <li>Keep your tweets around 240-260 characters to leave room for people to quote tweet you</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default TwitterCharacterCounter;
