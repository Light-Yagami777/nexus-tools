
import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  adSlot?: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

export const AdBanner = ({ 
  adSlot = "7743047622", 
  adFormat = "auto", 
  className = "" 
}: AdBannerProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    try {
      // Only add the ad if we're in the browser and the adsense script is loaded
      if (typeof window !== 'undefined' && adRef.current && (window as any).adsbygoogle) {
        // Push the ad to the adsense queue
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        console.log('Ad initialized');
      }
    } catch (error) {
      console.error('Error initializing ad:', error);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-app-pub-2731739499513187"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
        ref={adRef}
      />
    </div>
  );
};

export default AdBanner;
