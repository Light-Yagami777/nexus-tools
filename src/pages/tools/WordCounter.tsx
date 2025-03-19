
import { useState, useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

const WordCounter = () => {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
  });

  useEffect(() => {
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s+/g, "").length;
    const sentences = text.trim() === "" ? 0 : (text.match(/[.!?]+/g) || []).length;
    const paragraphs = text.trim() === "" ? 0 : (text.match(/\n+/g) || []).length + 1;
    const readingTime = Math.ceil(words / 225); // Average reading speed: 225 words per minute

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
    });
  }, [text]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-32 pb-16 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mb-12 text-center"
          >
            <span className="inline-block mb-4 px-4 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
              Text Tools
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Word Counter</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Count words, characters, sentences, and paragraphs in your text. Calculate reading time and get insights about your writing.
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Stats Cards */}
            <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl text-center">
              <h3 className="text-3xl font-bold text-primary mb-1">{stats.words}</h3>
              <p className="text-sm text-muted-foreground">Words</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl text-center">
              <h3 className="text-3xl font-bold text-primary mb-1">{stats.characters}</h3>
              <p className="text-sm text-muted-foreground">Characters</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl text-center">
              <h3 className="text-3xl font-bold text-primary mb-1">{stats.readingTime}</h3>
              <p className="text-sm text-muted-foreground">Minutes to read</p>
            </motion.div>
          </motion.div>
          
          {/* Text Input */}
          <motion.div
            variants={itemVariants}
            className="mt-8 glass-card p-6 rounded-2xl"
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here..."
              className="w-full h-64 bg-background/50 p-4 rounded-lg border border-border focus:ring-2 focus:ring-primary/50 focus:outline-none resize-y"
            />
          </motion.div>
          
          {/* Detailed Stats */}
          <motion.div
            variants={itemVariants}
            className="mt-8 glass-card p-6 rounded-2xl"
          >
            <h3 className="text-lg font-semibold mb-4">Detailed Statistics</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h4 className="text-muted-foreground text-sm mb-1">Characters</h4>
                <p className="text-xl font-semibold">{stats.characters}</p>
              </div>
              
              <div className="text-center">
                <h4 className="text-muted-foreground text-sm mb-1">Characters (no spaces)</h4>
                <p className="text-xl font-semibold">{stats.charactersNoSpaces}</p>
              </div>
              
              <div className="text-center">
                <h4 className="text-muted-foreground text-sm mb-1">Words</h4>
                <p className="text-xl font-semibold">{stats.words}</p>
              </div>
              
              <div className="text-center">
                <h4 className="text-muted-foreground text-sm mb-1">Sentences</h4>
                <p className="text-xl font-semibold">{stats.sentences}</p>
              </div>
              
              <div className="text-center">
                <h4 className="text-muted-foreground text-sm mb-1">Paragraphs</h4>
                <p className="text-xl font-semibold">{stats.paragraphs}</p>
              </div>
              
              <div className="text-center">
                <h4 className="text-muted-foreground text-sm mb-1">Reading Time</h4>
                <p className="text-xl font-semibold">{stats.readingTime} min</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WordCounter;
