
import React, { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, FileText } from "lucide-react";
import { toast } from "sonner";

interface KeywordResult {
  keyword: string;
  count: number;
  density: number;
}

const KeywordDensityAnalyzer = () => {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<KeywordResult[]>([]);
  const [totalWords, setTotalWords] = useState(0);
  const [excludeWords, setExcludeWords] = useState<string[]>([
    "a", "an", "the", "and", "or", "but", "is", "are", "was", "were", 
    "be", "been", "being", "to", "of", "for", "with", "in", "on", "at", 
    "by", "this", "that", "these", "those"
  ]);

  const analyzeContent = () => {
    if (!content.trim()) {
      toast.error("Please enter some content to analyze");
      return;
    }

    setLoading(true);
    
    try {
      // Calculate word count
      const words = content
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(word => word.length > 0);
      
      setTotalWords(words.length);
      
      // Count keywords (excluding common words)
      const keywordCounts: Record<string, number> = {};
      words.forEach(word => {
        if (word.length > 2 && !excludeWords.includes(word)) {
          keywordCounts[word] = (keywordCounts[word] || 0) + 1;
        }
      });
      
      // Calculate density and sort by count
      const keywordResults: KeywordResult[] = Object.keys(keywordCounts).map(keyword => {
        return {
          keyword,
          count: keywordCounts[keyword],
          density: (keywordCounts[keyword] / words.length) * 100
        };
      });
      
      // Sort by count (descending)
      keywordResults.sort((a, b) => b.count - a.count);
      
      // Take top 20 keywords
      setResults(keywordResults.slice(0, 20));
      toast.success("Content analyzed successfully");
    } catch (error) {
      console.error("Error analyzing content:", error);
      toast.error("Error analyzing content");
    } finally {
      setLoading(false);
    }
  };

  const fetchUrl = () => {
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    // Check if URL is valid
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch (e) {
      toast.error("Please enter a valid URL");
      return;
    }

    setLoading(true);
    
    // In a real app, this would fetch the content from the URL
    // For demonstration, we'll simulate this with a timeout
    setTimeout(() => {
      const mockContent = `
        Keyword density is a fundamental concept in search engine optimization (SEO). 
        It refers to the percentage of times a keyword or phrase appears on a web page 
        compared to the total number of words on that page. Keyword density can play a role 
        in how search engines determine what a page is about and how relevant it is to specific 
        search queries. However, there's no ideal keyword density percentage that guarantees 
        high rankings, as search engines use complex algorithms with many factors.
        
        Why is keyword density important? When search engines crawl a web page, they analyze 
        the content to understand what the page is about. The keywords used in that content 
        provide clues. If a particular keyword appears multiple times, it signals to search 
        engines that the keyword is important to the page's topic.
        
        However, keyword stuffing, or overusing a keyword, can have negative effects. Search engines 
        like Google have evolved to recognize and penalize keyword stuffing, as it often results in 
        poor-quality content that doesn't provide value to users. Instead, they favor content that 
        uses keywords naturally and provides valuable information.
        
        A more effective approach is to use keywords strategically and naturally throughout your content, 
        focusing on creating value for your readers rather than optimizing for a specific keyword density. 
        This includes using related terms, synonyms, and variations of your keywords, which can help search 
        engines better understand your content while keeping it readable and engaging for users.
        
        Remember, while keyword density is a factor in SEO, it's just one of many. Other factors like 
        content quality, user engagement, backlinks, and website authority also play significant roles 
        in search engine rankings. Focus on creating comprehensive, valuable content that addresses user 
        needs, and use keywords naturally within that context.
      `;
      
      setContent(mockContent);
      analyzeContent();
    }, 1500);
  };

  const getDensityColorClass = (density: number) => {
    if (density > 5) return "text-red-500"; // Too high
    if (density > 3) return "text-amber-500"; // Good but watch out
    if (density > 1) return "text-green-500"; // Good
    return ""; // Normal
  };

  return (
    <ToolLayout title="Keyword Density Analyzer" icon={<FileText size={24} />}>
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-6">
              Analyze the keyword density of your content to optimize for SEO. Enter your content directly or fetch from a URL.
            </p>
            
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-2">
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter website URL (e.g., https://example.com)"
                  className="flex-grow"
                />
                <Button 
                  onClick={fetchUrl} 
                  disabled={loading}
                  className="whitespace-nowrap"
                >
                  {loading ? "Fetching..." : "Fetch Content"}
                </Button>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="content" className="block text-sm font-medium">
                  Content to Analyze
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter your content here or fetch from a URL..."
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="flex justify-between">
                <Button 
                  onClick={analyzeContent} 
                  disabled={loading || !content.trim()}
                >
                  {loading ? "Analyzing..." : "Analyze Content"}
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  {content ? `${content.split(/\s+/).filter(w => w.length > 0).length} words` : "0 words"}
                </div>
              </div>
            </div>
          </div>

          {results.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Keyword Density Analysis</h3>
                <div className="text-sm text-muted-foreground">
                  Total words analyzed: {totalWords}
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left font-medium">Keyword</th>
                      <th className="py-2 px-4 text-left font-medium">Count</th>
                      <th className="py-2 px-4 text-left font-medium">Density</th>
                      <th className="py-2 px-4 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4 font-medium">{result.keyword}</td>
                        <td className="py-3 px-4">{result.count}</td>
                        <td className={`py-3 px-4 ${getDensityColorClass(result.density)}`}>
                          {result.density.toFixed(2)}%
                        </td>
                        <td className="py-3 px-4">
                          {result.density > 5 ? (
                            <span className="text-red-500">Too high</span>
                          ) : result.density > 3 ? (
                            <span className="text-amber-500">Watch out</span>
                          ) : result.density > 1 ? (
                            <span className="text-green-500 flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Good
                            </span>
                          ) : (
                            <span>Low</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">Keyword Density Tips</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Aim for a keyword density of 1-3% for primary keywords</li>
                  <li>Avoid keyword stuffing (density {'>'} 5%) as it can trigger search engine penalties</li>
                  <li>Use related keywords and synonyms to improve content relevance</li>
                  <li>Focus on creating high-quality, readable content for users</li>
                  <li>Place important keywords in headings, introduction, and conclusion</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </Card>
    </ToolLayout>
  );
};

export default KeywordDensityAnalyzer;
