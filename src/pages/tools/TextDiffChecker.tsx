
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { GitBranch, ArrowLeftRight, Copy, DownloadIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { showRewardedAd } from "@/utils/adUtils";

interface Difference {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
}

const TextDiffChecker = () => {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [differences, setDifferences] = useState<Difference[]>([]);
  const [showWhitespace, setShowWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [diffStats, setDiffStats] = useState<{ added: number; removed: number; unchanged: number } | null>(null);
  const { toast } = useToast();

  const computeDiff = async () => {
    if (!text1.trim() || !text2.trim()) {
      toast({
        variant: "destructive",
        title: "Missing input",
        description: "Please enter text in both fields to compare.",
      });
      return;
    }

    setIsComparing(true);
    
    // Show rewarded ad before comparison
    await showRewardedAd();
    
    try {
      // Simple diff algorithm for demonstration
      // In a real app, you might use a library like 'diff' or 'jsdiff'
      const t1 = ignoreCase ? text1.toLowerCase() : text1;
      const t2 = ignoreCase ? text2.toLowerCase() : text2;
      
      const lines1 = t1.split('\n');
      const lines2 = t2.split('\n');
      const result: Difference[] = [];
      
      let added = 0;
      let removed = 0;
      let unchanged = 0;
      
      // Very basic diff algorithm (for demonstration)
      // This is not an efficient algorithm for real diff checking
      const maxLen = Math.max(lines1.length, lines2.length);
      
      for (let i = 0; i < maxLen; i++) {
        const line1 = i < lines1.length ? lines1[i] : null;
        const line2 = i < lines2.length ? lines2[i] : null;
        
        if (line1 === null) {
          result.push({ type: 'added', value: showWhitespace ? visualizeWhitespace(line2!) : line2! });
          added++;
        } else if (line2 === null) {
          result.push({ type: 'removed', value: showWhitespace ? visualizeWhitespace(line1) : line1 });
          removed++;
        } else if (line1 === line2) {
          result.push({ type: 'unchanged', value: showWhitespace ? visualizeWhitespace(line1) : line1 });
          unchanged++;
        } else {
          result.push({ type: 'removed', value: showWhitespace ? visualizeWhitespace(line1) : line1 });
          result.push({ type: 'added', value: showWhitespace ? visualizeWhitespace(line2) : line2 });
          added++;
          removed++;
        }
      }
      
      setDifferences(result);
      setDiffStats({ added, removed, unchanged });
      
      toast({
        title: "Comparison complete",
        description: `Found ${added + removed} differences.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Comparison failed",
        description: "An error occurred while comparing the texts.",
      });
    } finally {
      setIsComparing(false);
    }
  };

  const visualizeWhitespace = (text: string): string => {
    return text
      .replace(/ /g, '·') // Visualize spaces
      .replace(/\t/g, '→   ') // Visualize tabs
      .replace(/$/g, '¶'); // Visualize end of line
  };

  const swapTexts = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
  };

  const copyDiff = () => {
    const diffText = differences.map(d => {
      const prefix = d.type === 'added' ? '+ ' : d.type === 'removed' ? '- ' : '  ';
      return prefix + d.value;
    }).join('\n');
    
    navigator.clipboard.writeText(diffText);
    
    toast({
      title: "Copied to clipboard",
      description: "The difference has been copied to your clipboard.",
    });
  };

  const downloadDiff = () => {
    const diffText = differences.map(d => {
      const prefix = d.type === 'added' ? '+ ' : d.type === 'removed' ? '- ' : '  ';
      return prefix + d.value;
    }).join('\n');
    
    const blob = new Blob([diffText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text-diff.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your text diff file is being downloaded.",
    });
  };

  return (
    <ToolLayout
      title="Text Diff Checker"
      description="Compare two texts and find differences. Highlight additions, deletions, and modifications between versions."
      icon={<GitBranch size={24} />}
      extraPadding
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Original Text</h2>
            <Textarea
              placeholder="Enter or paste your original text here..."
              className="min-h-[200px] text-base font-mono"
              value={text1}
              onChange={(e) => setText1(e.target.value)}
            />
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">New Text</h2>
            <Textarea
              placeholder="Enter or paste your new text here..."
              className="min-h-[200px] text-base font-mono"
              value={text2}
              onChange={(e) => setText2(e.target.value)}
            />
          </Card>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-whitespace"
                checked={showWhitespace}
                onCheckedChange={setShowWhitespace}
              />
              <Label htmlFor="show-whitespace">Show whitespace</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="ignore-case"
                checked={ignoreCase}
                onCheckedChange={setIgnoreCase}
              />
              <Label htmlFor="ignore-case">Ignore case</Label>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={swapTexts}
              className="flex items-center gap-2"
            >
              <ArrowLeftRight className="h-4 w-4" />
              <span>Swap</span>
            </Button>
            
            <Button
              onClick={computeDiff}
              disabled={isComparing}
            >
              {isComparing ? "Comparing..." : "Compare Texts"}
            </Button>
          </div>
        </div>
        
        {differences.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Differences</h2>
                
                {diffStats && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      <span>Added: {diffStats.added}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                      <span>Removed: {diffStats.removed}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                      <span>Unchanged: {diffStats.unchanged}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-muted/30 p-4 rounded-md overflow-auto max-h-[400px] font-mono text-sm whitespace-pre">
                {differences.map((diff, index) => (
                  <div 
                    key={index}
                    className={`${
                      diff.type === 'added' ? 'bg-green-100 text-green-800' : 
                      diff.type === 'removed' ? 'bg-red-100 text-red-800' : ''
                    } py-1 pl-8 relative`}
                  >
                    <span className="absolute left-2">
                      {diff.type === 'added' ? '+' : diff.type === 'removed' ? '-' : ' '}
                    </span>
                    {diff.value}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-4 gap-3">
                <Button variant="outline" onClick={copyDiff} className="flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  <span>Copy Diff</span>
                </Button>
                
                <Button variant="outline" onClick={downloadDiff} className="flex items-center gap-2">
                  <DownloadIcon className="h-4 w-4" />
                  <span>Download Diff</span>
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
        
        <Card className="p-6 bg-muted/30">
          <h2 className="text-lg font-semibold mb-2">About Text Diff Checker</h2>
          <div className="text-sm text-muted-foreground space-y-3">
            <p>The Text Diff Checker tool helps you compare two pieces of text and identify the differences between them. This is useful for:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Comparing different versions of documents or code</li>
              <li>Identifying changes between drafts</li>
              <li>Checking for plagiarism or unauthorized modifications</li>
              <li>Reviewing edits in collaborative writing</li>
            </ul>
            <p>The tool highlights additions in green and removals in red, making it easy to spot changes at a glance.</p>
          </div>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default TextDiffChecker;
