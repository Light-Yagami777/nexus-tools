
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { searchTools, Tool } from "@/utils/toolsData";

interface SearchBarProps {
  className?: string;
  onSearch?: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ className = "", onSearch }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Tool[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length >= 1) {
      const searchResults = searchTools(query);
      setResults(searchResults);
      if (onSearch) {
        onSearch(query);
      }
    } else {
      setResults([]);
      if (onSearch) {
        onSearch("");
      }
    }
  }, [query, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    if (onSearch) {
      onSearch("");
    }
  };

  const handleToolClick = (path: string) => {
    navigate(path);
    setIsSearchFocused(false);
    setQuery("");
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div
        className={`flex items-center relative transition-all duration-300 overflow-hidden ${
          isSearchFocused
            ? "bg-background border border-primary/50 shadow-sm dark:bg-[#1a1b25] dark:border-primary/30"
            : "glass dark:bg-[#2a2b35] dark:border dark:border-[#3a3b45]"
        } rounded-full px-3 py-2`}
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          placeholder="Search for tools..."
          className="bg-transparent border-none outline-none w-full px-3 text-sm placeholder:text-muted-foreground focus:ring-0"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="focus:outline-none"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isSearchFocused && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: 10, scaleY: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{ transformOrigin: "top" }}
            className="absolute z-50 left-0 right-0 mt-2 glass shadow-lg rounded-lg max-h-96 overflow-y-auto dark:bg-[#1a1b25] dark:border dark:border-[#2a2b35]"
          >
            <ul className="py-2">
              {results.map((tool, index) => (
                <motion.li
                  key={tool.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleToolClick(tool.path)}
                  className="px-4 py-2 hover:bg-primary/5 dark:hover:bg-[#2a2b35] cursor-pointer transition-colors"
                >
                  <div className="flex items-center">
                    <span className="font-medium">{tool.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {tool.category}
                  </p>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
