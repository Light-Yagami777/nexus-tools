export type ToolCategory = 
  | 'All'
  | 'Image Tools'
  | 'SEO Tools'
  | 'Text Tools'
  | 'Developer Tools'
  | 'Math & Calculators'
  | 'Unit Converters'
  | 'Security & Encryption'
  | 'Social Media Tools'
  | 'Miscellaneous';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: Exclude<ToolCategory, 'All'>;
  icon: string;
  path: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

export const tools: Tool[] = [
  // Image Tools
  {
    id: 'image-to-png',
    name: 'Image to PNG Converter',
    description: 'Convert your images to PNG format easily',
    category: 'Image Tools',
    icon: 'image',
    path: '/tools/image-to-png',
    isNew: true,
  },
  {
    id: 'image-to-jpg',
    name: 'Image to JPG Converter',
    description: 'Convert images to JPG format with custom quality',
    category: 'Image Tools',
    icon: 'image',
    path: '/tools/image-to-jpg',
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize your images to specific dimensions',
    category: 'Image Tools',
    icon: 'image',
    path: '/tools/image-resizer',
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress images without losing quality',
    category: 'Image Tools',
    icon: 'image',
    path: '/tools/image-compressor',
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    description: 'Create QR codes for URLs, text or contact information',
    category: 'Image Tools',
    icon: 'qr-code',
    path: '/tools/qr-code-generator',
    isFeatured: true,
  },
  {
    id: 'image-to-base64',
    name: 'Image to Base64',
    description: 'Convert images to Base64 encoded strings',
    category: 'Image Tools',
    icon: 'image',
    path: '/tools/image-to-base64',
  },
  {
    id: 'webp-to-png',
    name: 'WebP to PNG Converter',
    description: 'Convert WebP images to PNG format',
    category: 'Image Tools',
    icon: 'image',
    path: '/tools/webp-to-png',
  },
  {
    id: 'gif-maker',
    name: 'GIF Maker',
    description: 'Create animated GIFs from a series of images',
    category: 'Image Tools',
    icon: 'image',
    path: '/tools/gif-maker',
  },
  {
    id: 'image-cropper',
    name: 'Image Cropper',
    description: 'Crop your images to any size or aspect ratio',
    category: 'Image Tools',
    icon: 'image',
    path: '/tools/image-cropper',
  },
  {
    id: 'screenshot-to-pdf',
    name: 'Screenshot to PDF',
    description: 'Convert screenshots to PDF documents',
    category: 'Image Tools',
    icon: 'image',
    path: '/tools/screenshot-to-pdf',
  },

  // SEO Tools
  {
    id: 'meta-tag-generator',
    name: 'Meta Tag Generator',
    description: 'Generate meta tags for better SEO',
    category: 'SEO Tools',
    icon: 'code',
    path: '/tools/meta-tag-generator',
  },
  {
    id: 'keyword-density-checker',
    name: 'Keyword Density Checker',
    description: 'Analyze keyword density in your content',
    category: 'SEO Tools',
    icon: 'search',
    path: '/tools/keyword-density',
  },
  {
    id: 'sitemap-generator',
    name: 'Sitemap Generator',
    description: 'Generate XML sitemaps for your website',
    category: 'SEO Tools',
    icon: 'file-text',
    path: '/tools/sitemap-generator',
  },
  {
    id: 'robots-txt-generator',
    name: 'Robots.txt Generator',
    description: 'Create robots.txt files for crawler control',
    category: 'SEO Tools',
    icon: 'file-text',
    path: '/tools/robots-txt-generator',
  },
  {
    id: 'google-index-checker',
    name: 'Google Index Checker',
    description: 'Check if your pages are indexed by Google',
    category: 'SEO Tools',
    icon: 'search',
    path: '/tools/google-index-checker',
  },
  {
    id: 'backlink-checker',
    name: 'Backlink Checker',
    description: 'Analyze backlinks pointing to your website',
    category: 'SEO Tools',
    icon: 'link',
    path: '/tools/backlink-checker',
  },
  {
    id: 'page-speed-checker',
    name: 'Page Speed Checker',
    description: 'Test your website loading speed',
    category: 'SEO Tools',
    icon: 'zap',
    path: '/tools/page-speed-checker',
  },
  {
    id: 'xml-sitemap-validator',
    name: 'XML Sitemap Validator',
    description: 'Validate your XML sitemaps',
    category: 'SEO Tools',
    icon: 'check',
    path: '/tools/xml-sitemap-validator',
  },
  {
    id: 'mobile-friendly-test',
    name: 'Mobile-Friendly Test',
    description: 'Check if your site is mobile-friendly',
    category: 'SEO Tools',
    icon: 'smartphone',
    path: '/tools/mobile-friendly-test',
  },
  {
    id: 'seo-analyzer',
    name: 'SEO Analyzer',
    description: 'Comprehensive SEO analysis of your webpage',
    category: 'SEO Tools',
    icon: 'search',
    path: '/tools/seo-analyzer',
    isNew: true,
  },

  // Text Tools
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters and paragraphs in your text',
    category: 'Text Tools',
    icon: 'text',
    path: '/tools/word-counter',
    isFeatured: true,
  },
  {
    id: 'character-counter',
    name: 'Character Counter',
    description: 'Count characters with and without spaces',
    category: 'Text Tools',
    icon: 'text',
    path: '/tools/character-counter',
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text between different cases',
    category: 'Text Tools',
    icon: 'text',
    path: '/tools/case-converter',
  },
  {
    id: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate dummy text for your designs',
    category: 'Text Tools',
    icon: 'text',
    path: '/tools/lorem-ipsum',
  },
  {
    id: 'text-to-speech',
    name: 'Text to Speech',
    description: 'Convert text to spoken audio',
    category: 'Text Tools',
    icon: 'volume-2',
    path: '/tools/text-to-speech',
  },
  {
    id: 'url-encoder-decoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode or decode URL strings',
    category: 'Text Tools',
    icon: 'link',
    path: '/tools/url-encoder-decoder',
  },
  {
    id: 'text-diff-checker',
    name: 'Text Diff Checker',
    description: 'Compare two texts and find differences',
    category: 'Text Tools',
    icon: 'git-branch',
    path: '/tools/text-diff',
  },
  {
    id: 'text-formatter',
    name: 'Text Formatter',
    description: 'Format and beautify your text',
    category: 'Text Tools',
    icon: 'text',
    path: '/tools/text-formatter',
  },
  {
    id: 'markdown-editor',
    name: 'Markdown Editor',
    description: 'Write and preview markdown in real-time',
    category: 'Text Tools',
    icon: 'edit',
    path: '/tools/markdown-editor',
  },
  {
    id: 'string-utilities',
    name: 'String Utilities',
    description: 'Various string manipulation utilities',
    category: 'Text Tools',
    icon: 'text',
    path: '/tools/string-utilities',
  },

  // Developer Tools
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format and validate your JSON data with syntax highlighting',
    category: 'Developer Tools',
    icon: 'braces',
    path: '/tools/json-formatter',
    isFeatured: true,
  },
  {
    id: 'dev-formatting',
    name: 'Dev Formatting',
    description: 'One tool for formatting ALL types of files',
    category: 'Developer Tools',
    icon: 'code',
    path: '/tools/dev-formatting',
    isNew: true,
    isFeatured: true,
  },
  {
    id: 'color-picker',
    name: 'Color Picker',
    description: 'Select and generate color codes for your projects',
    category: 'Developer Tools',
    icon: 'palette',
    path: '/tools/color-picker',
  },
  {
    id: 'css-minifier',
    name: 'CSS Minifier',
    description: 'Minify your CSS files',
    category: 'Developer Tools',
    icon: 'code',
    path: '/tools/css-minifier',
  },
  {
    id: 'js-minifier',
    name: 'JavaScript Minifier',
    description: 'Minify your JavaScript code',
    category: 'Developer Tools',
    icon: 'code',
    path: '/tools/js-minifier',
  },
  {
    id: 'html-minifier',
    name: 'HTML Minifier',
    description: 'Minify your HTML code',
    category: 'Developer Tools',
    icon: 'code',
    path: '/tools/html-minifier',
  },
  {
    id: 'base64-encoder-decoder',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 data',
    category: 'Developer Tools',
    icon: 'code',
    path: '/tools/base64',
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test and debug regular expressions',
    category: 'Developer Tools',
    icon: 'code',
    path: '/tools/regex-tester',
  },
  {
    id: 'html-to-markdown',
    name: 'HTML to Markdown',
    description: 'Convert HTML to Markdown syntax',
    category: 'Developer Tools',
    icon: 'code',
    path: '/tools/html-to-markdown',
  },
  {
    id: 'markdown-to-html',
    name: 'Markdown to HTML',
    description: 'Convert Markdown to HTML code',
    category: 'Developer Tools',
    icon: 'code',
    path: '/tools/markdown-to-html',
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format and beautify SQL queries',
    category: 'Developer Tools',
    icon: 'database',
    path: '/tools/sql-formatter',
  },

  // Math & Calculators
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    description: 'Calculate your Body Mass Index',
    category: 'Math & Calculators',
    icon: 'calculator',
    path: '/tools/bmi-calculator',
  },
  {
    id: 'mortgage-calculator',
    name: 'Mortgage Calculator',
    description: 'Calculate mortgage payments and amortization schedules',
    category: 'Math & Calculators',
    icon: 'home',
    path: '/tools/mortgage-calculator',
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    description: 'Calculate percentages easily',
    category: 'Math & Calculators',
    icon: 'calculator',
    path: '/tools/percentage-calculator',
  },
  {
    id: 'scientific-calculator',
    name: 'Scientific Calculator',
    description: 'Perform complex mathematical calculations',
    category: 'Math & Calculators',
    icon: 'calculator',
    path: '/tools/scientific-calculator',
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    description: 'Calculate age between two dates',
    category: 'Math & Calculators',
    icon: 'calendar',
    path: '/tools/age-calculator',
  },
  {
    id: 'discount-calculator',
    name: 'Discount Calculator',
    description: 'Calculate discounts and final prices',
    category: 'Math & Calculators',
    icon: 'calculator',
    path: '/tools/discount-calculator',
  },
  {
    id: 'time-calculator',
    name: 'Time Calculator',
    description: 'Add or subtract times',
    category: 'Math & Calculators',
    icon: 'clock',
    path: '/tools/time-calculator',
  },
  {
    id: 'tip-calculator',
    name: 'Tip Calculator',
    description: 'Calculate tips for restaurants and services',
    category: 'Math & Calculators',
    icon: 'calculator',
    path: '/tools/tip-calculator',
  },
  {
    id: 'currency-converter',
    name: 'Currency Converter',
    description: 'Convert between different currencies',
    category: 'Math & Calculators',
    icon: 'dollar-sign',
    path: '/tools/currency-converter',
  },
  {
    id: 'binary-decimal-converter',
    name: 'Binary Decimal Converter',
    description: 'Convert between binary and decimal numbers',
    category: 'Math & Calculators',
    icon: 'calculator',
    path: '/tools/binary-decimal',
  },

  // Unit Converters
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between different units of measurement',
    category: 'Unit Converters',
    icon: 'ruler',
    path: '/tools/unit-converter',
    isFeatured: true,
  },
  {
    id: 'length-converter',
    name: 'Length Converter',
    description: 'Convert between different units of length',
    category: 'Unit Converters',
    icon: 'ruler',
    path: '/tools/length-converter',
  },
  {
    id: 'weight-converter',
    name: 'Weight Converter',
    description: 'Convert between different units of weight',
    category: 'Unit Converters',
    icon: 'ruler',
    path: '/tools/weight-converter',
  },
  {
    id: 'temperature-converter',
    name: 'Temperature Converter',
    description: 'Convert between different temperature units',
    category: 'Unit Converters',
    icon: 'thermometer',
    path: '/tools/temperature-converter',
  },
  {
    id: 'speed-converter',
    name: 'Speed Converter',
    description: 'Convert between different units of speed',
    category: 'Unit Converters',
    icon: 'ruler',
    path: '/tools/speed-converter',
  },
  {
    id: 'volume-converter',
    name: 'Volume Converter',
    description: 'Convert between different units of volume',
    category: 'Unit Converters',
    icon: 'ruler',
    path: '/tools/volume-converter',
  },
  {
    id: 'area-converter',
    name: 'Area Converter',
    description: 'Convert between different units of area',
    category: 'Unit Converters',
    icon: 'ruler',
    path: '/tools/area-converter',
  },
  {
    id: 'data-storage-converter',
    name: 'Data Storage Converter',
    description: 'Convert between different digital storage units',
    category: 'Unit Converters',
    icon: 'hard-drive',
    path: '/tools/data-storage-converter',
  },
  {
    id: 'pressure-converter',
    name: 'Pressure Converter',
    description: 'Convert between different pressure units',
    category: 'Unit Converters',
    icon: 'ruler',
    path: '/tools/pressure-converter',
  },
  {
    id: 'angle-converter',
    name: 'Angle Converter',
    description: 'Convert between different angle units',
    category: 'Unit Converters',
    icon: 'ruler',
    path: '/tools/angle-converter',
  },

  // Security & Encryption
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure and strong passwords',
    category: 'Security & Encryption',
    icon: 'key',
    path: '/tools/password-generator',
    isFeatured: true,
  },
  {
    id: 'md5-generator',
    name: 'MD5 Hash Generator',
    description: 'Generate MD5 hashes from text',
    category: 'Security & Encryption',
    icon: 'key',
    path: '/tools/md5-generator',
  },
  {
    id: 'sha256-generator',
    name: 'SHA256 Hash Generator',
    description: 'Generate SHA256 hashes from text',
    category: 'Security & Encryption',
    icon: 'key',
    path: '/tools/sha256-generator',
  },
  {
    id: 'hash-identifier',
    name: 'Hash Identifier',
    description: 'Identify different types of hashes',
    category: 'Security & Encryption',
    icon: 'key',
    path: '/tools/hash-identifier',
  },
  {
    id: 'encryption-decryption',
    name: 'Encryption/Decryption',
    description: 'Encrypt and decrypt text with a password',
    category: 'Security & Encryption',
    icon: 'lock',
    path: '/tools/encryption',
  },
  {
    id: 'csrf-token-generator',
    name: 'CSRF Token Generator',
    description: 'Generate CSRF tokens for web security',
    category: 'Security & Encryption',
    icon: 'shield',
    path: '/tools/csrf-token-generator',
  },
  {
    id: 'ssl-checker',
    name: 'SSL Checker',
    description: 'Check SSL certificates of websites',
    category: 'Security & Encryption',
    icon: 'shield',
    path: '/tools/ssl-checker',
  },
  {
    id: 'random-string-generator',
    name: 'Random String Generator',
    description: 'Generate random strings for various purposes',
    category: 'Security & Encryption',
    icon: 'shuffle',
    path: '/tools/random-string-generator',
  },
  {
    id: 'password-strength-checker',
    name: 'Password Strength Checker',
    description: 'Check the strength of your passwords',
    category: 'Security & Encryption',
    icon: 'shield',
    path: '/tools/password-strength',
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and verify JSON Web Tokens',
    category: 'Security & Encryption',
    icon: 'key',
    path: '/tools/jwt-decoder',
    isNew: true,
  },

  // Social Media Tools
  {
    id: 'youtube-thumbnail',
    name: 'YouTube Thumbnail Downloader',
    description: 'Download thumbnails from YouTube videos',
    category: 'Social Media Tools',
    icon: 'youtube',
    path: '/tools/youtube-thumbnail',
  },
  {
    id: 'social-media-image-resizer',
    name: 'Social Media Image Resizer',
    description: 'Resize images for different social platforms',
    category: 'Social Media Tools',
    icon: 'image',
    path: '/tools/social-media-image-resizer',
  },
  {
    id: 'hashtag-generator',
    name: 'Hashtag Generator',
    description: 'Generate relevant hashtags for your content',
    category: 'Social Media Tools',
    icon: 'hash',
    path: '/tools/hashtag-generator',
  },
  {
    id: 'twitter-card-generator',
    name: 'Twitter Card Generator',
    description: 'Create Twitter card previews',
    category: 'Social Media Tools',
    icon: 'twitter',
    path: '/tools/twitter-card-generator',
  },
  {
    id: 'instagram-font-generator',
    name: 'Instagram Font Generator',
    description: 'Create fancy text for Instagram bios',
    category: 'Social Media Tools',
    icon: 'instagram',
    path: '/tools/instagram-font-generator',
  },
  {
    id: 'og-image-generator',
    name: 'OG Image Generator',
    description: 'Create Open Graph images for social sharing',
    category: 'Social Media Tools',
    icon: 'image',
    path: '/tools/og-image-generator',
  },
  {
    id: 'social-media-color-picker',
    name: 'Social Media Color Picker',
    description: 'Get brand colors for social media platforms',
    category: 'Social Media Tools',
    icon: 'palette',
    path: '/tools/social-media-color-picker',
  },
  {
    id: 'twitter-character-counter',
    name: 'Twitter Character Counter',
    description: 'Count characters for Twitter posts',
    category: 'Social Media Tools',
    icon: 'twitter',
    path: '/tools/twitter-character-counter',
  },
  {
    id: 'social-profile-analyzer',
    name: 'Social Profile Analyzer',
    description: 'Analyze social media profiles',
    category: 'Social Media Tools',
    icon: 'users',
    path: '/tools/social-profile-analyzer',
  },
  {
    id: 'post-scheduler',
    name: 'Post Scheduler',
    description: 'Find the best times to post on social media',
    category: 'Social Media Tools',
    icon: 'clock',
    path: '/tools/post-scheduler',
  },

  // Miscellaneous
  {
    id: 'random-number-generator',
    name: 'Random Number Generator',
    description: 'Generate random numbers within a specified range',
    category: 'Miscellaneous',
    icon: 'dice',
    path: '/tools/random-number-generator',
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate UUIDs/GUIDs',
    category: 'Miscellaneous',
    icon: 'key',
    path: '/tools/uuid-generator',
  },
  {
    id: 'coin-flip',
    name: 'Coin Flip',
    description: 'Flip a virtual coin',
    category: 'Miscellaneous',
    icon: 'dollar-sign',
    path: '/tools/coin-flip',
  },
  {
    id: 'dice-roller',
    name: 'Dice Roller',
    description: 'Roll virtual dice',
    category: 'Miscellaneous',
    icon: 'dice',
    path: '/tools/dice-roller',
  },
  {
    id: 'name-generator',
    name: 'Name Generator',
    description: 'Generate random names',
    category: 'Miscellaneous',
    icon: 'user',
    path: '/tools/name-generator',
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text',
    category: 'Miscellaneous',
    icon: 'file-text',
    path: '/tools/lorem-ipsum-generator',
  },
  {
    id: 'pomodoro-timer',
    name: 'Pomodoro Timer',
    description: 'Time management with the Pomodoro technique',
    category: 'Miscellaneous',
    icon: 'clock',
    path: '/tools/pomodoro-timer',
  },
  {
    id: 'notes-app',
    name: 'Quick Notes',
    description: 'Take quick notes in your browser',
    category: 'Miscellaneous',
    icon: 'edit',
    path: '/tools/notes',
  },
  {
    id: 'screen-recorder',
    name: 'Screen Recorder',
    description: 'Record your screen directly in browser',
    category: 'Miscellaneous',
    icon: 'video',
    path: '/tools/screen-recorder',
    isNew: true,
  },
  {
    id: 'meme-generator',
    name: 'Meme Generator',
    description: 'Create custom memes with templates',
    category: 'Miscellaneous',
    icon: 'image',
    path: '/tools/meme-generator',
  },
];

export const getToolsByCategory = (category: ToolCategory): Tool[] => {
  if (category === 'All') {
    return tools;
  }
  
  return tools.filter(tool => tool.category === category);
};

export const getFeaturedTools = (): Tool[] => {
  return tools.filter(tool => tool.isFeatured);
};

export const getNewTools = (): Tool[] => {
  return tools.filter(tool => tool.isNew);
};

export const searchTools = (query: string): Tool[] => {
  if (!query || query.trim() === '') {
    return tools;
  }
  
  const searchTerms = query.toLowerCase().split(' ');
  
  return tools.filter(tool => {
    const nameMatch = tool.name.toLowerCase();
    const descMatch = tool.description.toLowerCase();
    const categoryMatch = tool.category.toLowerCase();
    
    return searchTerms.some(term => 
      nameMatch.includes(term) || 
      descMatch.includes(term) || 
      categoryMatch.includes(term)
    );
  });
};

export const categories: ToolCategory[] = [
  'All',
  'Image Tools',
  'SEO Tools',
  'Text Tools',
  'Developer Tools',
  'Math & Calculators',
  'Unit Converters',
  'Security & Encryption',
  'Social Media Tools',
  'Miscellaneous',
];

export const getToolById = (id: string): Tool | undefined => {
  return tools.find(tool => tool.id === id);
};
