
import React, { useState, useEffect } from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { SearchCheck, Upload, BarChart2, Copy, Trash, FileText, ArrowRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

interface KeywordData {
  keyword: string;
  count: number;
  density: number;
}

const KeywordDensity = () => {
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [minLength, setMinLength] = useState(3);
  const [excludeCommonWords, setExcludeCommonWords] = useState(true);
  const [totalWords, setTotalWords] = useState(0);
  const [totalCharacters, setTotalCharacters] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Common words to exclude
  const commonWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do',
    'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would',
    'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like',
    'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
    'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our',
    'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'is', 'are', 'was', 'were'
  ]);

  const analyzeText = () => {
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "No content",
        description: "Please enter some text to analyze.",
      });
      return;
    }

    // Count words and characters
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length >= minLength);
    
    const wordCount = words.length;
    const charCount = content.length;
    
    // Count keyword occurrences
    const keywordCounts: Record<string, number> = {};
    words.forEach(word => {
      if (excludeCommonWords && commonWords.has(word)) return;
      keywordCounts[word] = (keywordCounts[word] || 0) + 1;
    });
    
    // Calculate keyword densities
    const keywordData: KeywordData[] = Object.keys(keywordCounts).map(keyword => ({
      keyword,
      count: keywordCounts[keyword],
      density: (keywordCounts[keyword] / wordCount) * 100
    }));
    
    // Sort by count (descending)
    keywordData.sort((a, b) => b.count - a.count);
    
    setKeywords(keywordData);
    setTotalWords(wordCount);
    setTotalCharacters(charCount);
    
    toast({
      title: "Analysis Complete",
      description: `Analyzed ${wordCount} words and ${charCount} characters.`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setContent(content);
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    setContent('');
    setKeywords([]);
    setTotalWords(0);
    setTotalCharacters(0);
  };

  const copyToClipboard = () => {
    // Format the keyword data as a table
    const keywordTable = keywords.map(k => 
      `${k.keyword}\t${k.count}\t${k.density.toFixed(2)}%`
    ).join('\n');
    
    const header = "Keyword\tCount\tDensity\n";
    const summary = `\nTotal Words: ${totalWords}\nTotal Characters: ${totalCharacters}`;
    
    navigator.clipboard.writeText(header + keywordTable + summary);
    
    toast({
      title: "Copied to Clipboard",
      description: "Keyword analysis data has been copied to your clipboard.",
    });
  };

  const handleBack = () => {
    navigate(-1);
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
          <div className="mb-6 flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack} 
              className="mr-2"
              aria-label="Go back"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="text-center flex-grow">
              <h1 className="text-3xl font-bold mb-2">Keyword Density Checker</h1>
              <p className="text-muted-foreground">
                Analyze keyword density and distribution in your content
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card className="p-4">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Content</h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleClear}>
                    <Trash className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                  <Button size="sm" variant="outline" className="relative">
                    <input
                      type="file"
                      accept=".txt,.md,.html"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleFileUpload}
                    />
                    <Upload className="h-4 w-4 mr-1" />
                    Upload
                  </Button>
                </div>
              </div>
              
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your content here to analyze keyword density..."
                className="min-h-[200px] mb-4"
              />
              
              <div className="mb-4">
                <Label className="mb-2 block">
                  Minimum keyword length: {minLength} characters
                </Label>
                <Slider
                  value={[minLength]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => setMinLength(value[0])}
                  className="mb-6"
                />
                
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="excludeCommon"
                    checked={excludeCommonWords}
                    onChange={(e) => setExcludeCommonWords(e.target.checked)}
                    className="mr-2"
                  />
                  <Label htmlFor="excludeCommon">
                    Exclude common words (a, the, is, etc.)
                  </Label>
                </div>
              </div>
              
              <Button onClick={analyzeText} className="w-full">
                <SearchCheck className="h-4 w-4 mr-1" />
                Analyze Content
              </Button>
            </Card>

            {/* Results Section */}
            <Card className="p-4">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Keyword Analysis</h2>
                {keywords.length > 0 && (
                  <Button size="sm" variant="outline" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy Results
                  </Button>
                )}
              </div>
              
              {keywords.length > 0 ? (
                <div>
                  <div className="flex justify-between mb-4 text-sm">
                    <div>
                      <span className="font-medium">Total Words:</span> {totalWords}
                    </div>
                    <div>
                      <span className="font-medium">Total Characters:</span> {totalCharacters}
                    </div>
                  </div>
                  
                  <div className="overflow-auto max-h-[400px] border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Keyword</TableHead>
                          <TableHead className="text-right">Count</TableHead>
                          <TableHead className="text-right">Density</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {keywords.slice(0, 50).map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.keyword}</TableCell>
                            <TableCell className="text-right">{item.count}</TableCell>
                            <TableCell className="text-right">{item.density.toFixed(2)}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {keywords.length > 50 && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Showing top 50 of {keywords.length} keywords.
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground">
                  <BarChart2 className="h-12 w-12 mb-4 opacity-50" />
                  <p>Enter your content and click "Analyze Content" to see keyword density</p>
                </div>
              )}
            </Card>
          </div>

          {/* Tips Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">SEO Tips for Keyword Density</h2>
            <Card className="p-6">
              <ul className="list-disc list-inside space-y-2">
                <li>Aim for a keyword density of 1-2% for primary keywords</li>
                <li>Avoid keyword stuffing (overusing keywords), as it can hurt your SEO</li>
                <li>Use related keywords and synonyms to improve content relevance</li>
                <li>Focus on creating natural, reader-friendly content</li>
                <li>Use keywords in important positions: headings, first paragraph, etc.</li>
                <li>Consider keyword placement as well as density</li>
              </ul>
            </Card>
          </div>

          {/* Recommended Tools */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Try These Related Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link to="/tools/meta-tag-generator">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Meta Tag Generator</h3>
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

export default KeywordDensity;
