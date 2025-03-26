
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import ToolLayout from '@/components/ToolLayout';
import SitemapForm from '@/components/sitemap/SitemapForm';
import SitemapPreview from '@/components/sitemap/SitemapPreview';
import SitemapBestPractices from '@/components/sitemap/SitemapBestPractices';
import RelatedTools from '@/components/sitemap/RelatedTools';
import { generateSitemapXML } from '@/utils/sitemapGenerator';
import { FileText } from 'lucide-react';

const SitemapGenerator = () => {
  const [baseUrl, setBaseUrl] = useState('');
  const [urls, setUrls] = useState<string[]>([]);
  const [frequency, setFrequency] = useState('weekly');
  const [priority, setPriority] = useState('0.8');
  const [includeLastmod, setIncludeLastmod] = useState(true);
  const [generatedSitemap, setGeneratedSitemap] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGenerateSitemap = () => {
    if (!baseUrl) {
      toast({
        variant: "destructive",
        title: "Base URL is required",
        description: "Please enter the base URL of your website.",
      });
      return;
    }

    if (urls.length === 0) {
      toast({
        variant: "destructive",
        title: "No URLs added",
        description: "Please add at least one URL to your sitemap.",
      });
      return;
    }

    const sitemapXML = generateSitemapXML({
      baseUrl,
      urls,
      frequency,
      priority,
      includeLastmod
    });
    
    setGeneratedSitemap(sitemapXML);
    
    toast({
      title: "Sitemap Generated",
      description: `Successfully created a sitemap with ${urls.length} URLs.`,
    });
  };

  const resetForm = () => {
    setBaseUrl('');
    setUrls([]);
    setFrequency('weekly');
    setPriority('0.8');
    setIncludeLastmod(true);
    setGeneratedSitemap('');
  };

  return (
    <ToolLayout 
      title="XML Sitemap Generator" 
      description="Create XML sitemaps to help search engines discover and index your pages"
      icon={<FileText size={24} />}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Site Configuration</h2>
              <SitemapForm
                baseUrl={baseUrl}
                setBaseUrl={setBaseUrl}
                frequency={frequency}
                setFrequency={setFrequency}
                priority={priority}
                setPriority={setPriority}
                includeLastmod={includeLastmod}
                setIncludeLastmod={setIncludeLastmod}
                urls={urls}
                setUrls={setUrls}
                generateSitemap={handleGenerateSitemap}
                resetForm={resetForm}
              />
            </Card>

            <Card className="p-6">
              <SitemapPreview generatedSitemap={generatedSitemap} />
            </Card>
          </div>

          <SitemapBestPractices />
          <RelatedTools />
        </motion.div>
      </div>
    </ToolLayout>
  );
};

export default SitemapGenerator;
