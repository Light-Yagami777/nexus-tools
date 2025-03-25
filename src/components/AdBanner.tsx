
import React, { useEffect, useRef } from 'react';

// Add type definition for window.adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

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
      if (typeof window !== 'undefined' && adRef.current && window.adsbygoogle) {
        // Push the ad to the adsense script queue
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        console.log('Ad initialized');
      }
    } catch (error) {
      console.error('Error initializing ad:', error);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-app-pub-2731739499513187"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner;
