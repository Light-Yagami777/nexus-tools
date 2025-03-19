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
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters and paragraphs in your text',
    category: 'Text Tools',
    icon: 'text',
    path: '/tools/word-counter',
    isFeatured: true,
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format and validate your JSON data with syntax highlighting',
    category: 'Developer Tools',
    icon: 'braces',
    path: '/tools/json-formatter',
  },
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
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    description: 'Create QR codes for URLs, text or contact information',
    category: 'Image Tools',
    icon: 'qr-code',
    path: '/tools/qr-code-generator',
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    description: 'Calculate your Body Mass Index',
    category: 'Math & Calculators',
    icon: 'calculator',
    path: '/tools/bmi-calculator',
  },
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
    id: 'color-picker',
    name: 'Color Picker',
    description: 'Select and generate color codes for your projects',
    category: 'Developer Tools',
    icon: 'palette',
    path: '/tools/color-picker',
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
    id: 'random-number-generator',
    name: 'Random Number Generator',
    description: 'Generate random numbers within a specified range',
    category: 'Miscellaneous',
    icon: 'dice',
    path: '/tools/random-number-generator',
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
  const searchTerms = query.toLowerCase().split(' ');
  
  return tools.filter(tool => {
    const nameMatch = tool.name.toLowerCase();
    const descMatch = tool.description.toLowerCase();
    const categoryMatch = tool.category.toLowerCase();
    
    return searchTerms.every(term => 
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
