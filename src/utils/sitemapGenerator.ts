
export interface SitemapConfig {
  baseUrl: string;
  urls: string[];
  frequency: string;
  priority: string;
  includeLastmod: boolean;
}

export const generateSitemapXML = (config: SitemapConfig): string => {
  const { baseUrl, urls, frequency, priority, includeLastmod } = config;
  
  if (!baseUrl || urls.length === 0) {
    return '';
  }

  const baseUrlFormatted = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const today = new Date().toISOString().split('T')[0];

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  urls.forEach(url => {
    sitemap += '  <url>\n';
    
    const fullUrl = url.startsWith('http') ? url : `${baseUrlFormatted}${url.startsWith('/') ? url : '/' + url}`;
    sitemap += `    <loc>${fullUrl}</loc>\n`;
    
    if (includeLastmod) {
      sitemap += `    <lastmod>${today}</lastmod>\n`;
    }
    
    sitemap += `    <changefreq>${frequency}</changefreq>\n`;
    sitemap += `    <priority>${priority}</priority>\n`;
    sitemap += '  </url>\n';
  });

  sitemap += '</urlset>';
  
  return sitemap;
};
