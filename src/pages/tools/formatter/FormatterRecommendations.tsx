
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface Formatter {
  id: string;
  name: string;
  path: string;
}

interface FormatterRecommendationsProps {
  fileType: string;
}

export const FormatterRecommendations: React.FC<FormatterRecommendationsProps> = ({ fileType }) => {
  const relatedFormatters: Formatter[] = [
    { id: 'html-minifier', name: 'HTML Minifier', path: '/tools/html-minifier' },
    { id: 'css-minifier', name: 'CSS Minifier', path: '/tools/css-minifier' },
    { id: 'js-minifier', name: 'JavaScript Minifier', path: '/tools/js-minifier' },
    { id: 'sql-formatter', name: 'SQL Formatter', path: '/tools/sql-formatter' },
    { id: 'markdown-to-html', name: 'Markdown to HTML', path: '/tools/markdown-to-html' },
  ];

  const recommendedFormatters = relatedFormatters.filter(formatter => {
    if (fileType === 'html' && formatter.id === 'html-minifier') return false;
    if (fileType === 'css' && formatter.id === 'css-minifier') return false;
    if (fileType === 'javascript' && formatter.id === 'js-minifier') return false;
    if (fileType === 'sql' && formatter.id === 'sql-formatter') return false;
    if (fileType === 'markdown' && formatter.id === 'markdown-to-html') return false;
    return true;
  }).slice(0, 3);

  if (recommendedFormatters.length === 0) return null;

  return (
    <div className="mt-8 mb-6">
      <h2 className="text-xl font-semibold mb-4">Recommended Formatters</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recommendedFormatters.map((formatter) => (
          <Link key={formatter.id} to={formatter.path}>
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{formatter.name}</h3>
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FormatterRecommendations;
