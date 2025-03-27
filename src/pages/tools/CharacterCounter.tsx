
import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Text } from "lucide-react";
import { motion } from "framer-motion";

const CharacterCounter = () => {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({
    withSpaces: 0,
    withoutSpaces: 0,
    paragraphs: 0,
    words: 0,
    sentences: 0,
    letters: 0,
    digits: 0,
    specialChars: 0
  });

  useEffect(() => {
    // Calculate statistics
    const withSpaces = text.length;
    const withoutSpaces = text.replace(/\s/g, "").length;
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;
    const words = text.split(/\s+/).filter(word => word.length > 0).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    const digits = (text.match(/\d/g) || []).length;
    const specialChars = withoutSpaces - letters - digits;

    setStats({
      withSpaces,
      withoutSpaces,
      paragraphs,
      words,
      sentences,
      letters,
      digits,
      specialChars
    });
  }, [text]);

  return (
    <ToolLayout
      title="Character Counter"
      description="Count characters, words, and more. Track your character usage for social media posts, essays, and more."
      icon={<Text size={24} />}
      extraPadding
    >
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Enter or paste your text</h2>
          <Textarea
            placeholder="Type or paste your text here..."
            className="min-h-[200px] text-base"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Card>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            className="bg-primary/10 rounded-lg p-4"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Characters (with spaces)</h3>
            <p className="text-3xl font-bold">{stats.withSpaces}</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-primary/10 rounded-lg p-4"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Characters (no spaces)</h3>
            <p className="text-3xl font-bold">{stats.withoutSpaces}</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-primary/10 rounded-lg p-4"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Words</h3>
            <p className="text-3xl font-bold">{stats.words}</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-primary/10 rounded-lg p-4"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Paragraphs</h3>
            <p className="text-3xl font-bold">{stats.paragraphs}</p>
          </motion.div>
        </div>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Detailed Analysis</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Character Breakdown</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Letters:</span>
                  <span className="font-medium">{stats.letters}</span>
                </li>
                <li className="flex justify-between">
                  <span>Digits:</span>
                  <span className="font-medium">{stats.digits}</span>
                </li>
                <li className="flex justify-between">
                  <span>Special chars:</span>
                  <span className="font-medium">{stats.specialChars}</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Sentences</h3>
              <p className="text-2xl font-semibold">{stats.sentences}</p>
              
              {stats.sentences > 0 && stats.words > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Average {(stats.words / stats.sentences).toFixed(1)} words per sentence
                </p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Reading Time</h3>
              <p className="text-2xl font-semibold">
                {Math.ceil(stats.words / 200)} min
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Based on average reading speed (200 words per minute)
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Social Media</h3>
              <ul className="space-y-2 text-sm">
                <li className={`flex justify-between ${stats.withSpaces > 280 ? "text-red-500" : ""}`}>
                  <span>Twitter:</span>
                  <span className="font-medium">{stats.withSpaces}/280</span>
                </li>
                <li className={`flex justify-between ${stats.withSpaces > 2200 ? "text-red-500" : ""}`}>
                  <span>Instagram:</span>
                  <span className="font-medium">{stats.withSpaces}/2200</span>
                </li>
                <li className={`flex justify-between ${stats.withSpaces > 63206 ? "text-red-500" : ""}`}>
                  <span>Facebook:</span>
                  <span className="font-medium">{stats.withSpaces}/63,206</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-muted/30">
          <h2 className="text-lg font-semibold mb-2">Tips for Character Counting</h2>
          <div className="text-sm text-muted-foreground space-y-3">
            <p>Character counting is essential for:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Social media posts with character limits (Twitter, LinkedIn)</li>
              <li>SEO optimization (meta descriptions, title tags)</li>
              <li>SMS messages and email subject lines</li>
              <li>Academic and professional writing with strict requirements</li>
            </ul>
            <p className="mt-2">Remember that different platforms count characters differently. Some may count emojis, URLs, or line breaks as multiple characters.</p>
          </div>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default CharacterCounter;
