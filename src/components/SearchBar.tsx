
import { useState, useEffect, useRef, KeyboardEvent } from "react";
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
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const resultListRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();

  // Debounce search query to prevent excessive searches
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200); // Reduced debounce time for better responsiveness

    return () => clearTimeout(timer);
  }, [query]);

  // Search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length >= 1) { // Reduced minimum length to 1 character
      const searchResults = searchTools(debouncedQuery);
      setResults(searchResults);
      setSelectedResultIndex(-1); // Reset selection when results change
      if (onSearch) {
        onSearch(debouncedQuery);
      }
    } else if (debouncedQuery.trim() === "") {
      setResults([]);
      if (onSearch) {
        onSearch("");
      }
    }
  }, [debouncedQuery, onSearch]);

  // Handle outside clicks to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedResultIndex >= 0 && resultListRef.current) {
      const selectedElement = resultListRef.current.children[selectedResultIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest'
        });
      }
    }
  }, [selectedResultIndex]);

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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Handle keyboard navigation in search results
    if (results.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedResultIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedResultIndex(prev => prev > 0 ? prev - 1 : 0);
          break;
        case "Enter":
          e.preventDefault();
          if (selectedResultIndex >= 0) {
            handleToolClick(results[selectedResultIndex].path);
          } else if (query.trim().length >= 1) {
            // If no result is selected but query exists, search
            if (onSearch) {
              onSearch(query);
            }
          }
          break;
        case "Escape":
          setIsSearchFocused(false);
          break;
      }
    } else if (e.key === "Enter" && query.trim().length >= 1) {
      // If Enter is pressed with no results but query exists
      if (onSearch) {
        onSearch(query);
      }
    }
  };

  // Highlight matching text in search results
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? 
        <span key={i} className="bg-primary/20 font-medium">{part}</span> : 
        <span key={i}>{part}</span>
    );
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
          onKeyDown={handleKeyDown}
          placeholder="Search for tools..."
          aria-label="Search for tools"
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
            className="absolute z-50 left-0 right-0 mt-2 glass shadow-lg rounded-lg max-h-96 overflow-y-auto dark:bg-[#1a1b25] dark:border dark:border-[#3a3b45]"
          >
            <ul ref={resultListRef} className="py-2">
              {results.map((tool, index) => (
                <motion.li
                  key={tool.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleToolClick(tool.path)}
                  className={`px-4 py-2 hover:bg-primary/10 dark:hover:bg-[#2a2b35] cursor-pointer transition-colors ${
                    selectedResultIndex === index ? "bg-primary/10 dark:bg-[#2a2b35]" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <span className="font-medium">{highlightMatch(tool.name, query)}</span>
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
