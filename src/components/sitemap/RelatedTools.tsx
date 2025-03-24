
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const RelatedTools: React.FC = () => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Try These Related Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Link to="/tools/keyword-density">
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Keyword Density Checker</h3>
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
          </Card>
        </Link>
        <Link to="/tools/meta-tag-generator">
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Meta Tag Generator</h3>
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
          </Card>
        </Link>
        <Link to="/tools/dev-formatting">
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Formatter</h3>
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default RelatedTools;
