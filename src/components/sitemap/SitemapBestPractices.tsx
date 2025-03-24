
import React from 'react';
import { Card } from '@/components/ui/card';

const SitemapBestPractices: React.FC = () => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Sitemap Best Practices</h2>
      <Card className="p-6">
        <ul className="list-disc list-inside space-y-2">
          <li>Keep your sitemap under 50MB and 50,000 URLs</li>
          <li>Use proper priorities - your most important pages should have higher priority</li>
          <li>Don't include URLs that return error codes (4xx or 5xx)</li>
          <li>Include canonical URLs to avoid duplicate content issues</li>
          <li>Update your sitemap when you add new pages to your website</li>
          <li>Use the <code>lastmod</code> tag to indicate when pages were last updated</li>
          <li>Submit your sitemap to Google Search Console and Bing Webmaster Tools</li>
        </ul>
      </Card>
    </div>
  );
};

export default SitemapBestPractices;
