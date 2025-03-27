
// AdMob rewarded ad IDs
const REWARDED_AD_UNIT_ID = "ca-app-pub-2731739499513187/1935660519";
const APP_ID = "ca-app-pub-2731739499513187~3809479964";

// Declare global Google Mobile Ads SDK types
declare global {
  interface Window {
    adsbygoogle: any[];  // Changed from 'any' to 'any[]' to match expected type
    google?: {           // Added '?' to make it optional like in vite-env.d.ts
      ima: any;
    };
  }
}

/**
 * Shows a rewarded ad and returns a promise that resolves when the ad
 * either completes or fails to load
 */
export const showRewardedAd = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      console.log("Attempting to show rewarded ad...");
      
      // Check if Google IMA is available (AdMob library)
      if (!window.google || !window.google.ima) {
        console.log("Google IMA not available, resolving without showing ad");
        resolve(false);
        return;
      }
      
      // Initialize the ad if needed
      if (!window.adsbygoogle) {
        window.adsbygoogle = [];  // Initialize as an array, not just any
      }
      
      // Try to show the rewarded ad
      try {
        // This would be replaced with actual AdMob implementation
        // For now, let's just simulate the ad process
        console.log(`Would show rewarded ad with ID ${REWARDED_AD_UNIT_ID}`);
        
        // Simulate ad success after 1 second (would be replaced with actual ad logic)
        setTimeout(() => {
          console.log("Rewarded ad completed");
          resolve(true);
        }, 100);
      } catch (err) {
        console.error("Error showing rewarded ad:", err);
        resolve(false);
      }
    } catch (error) {
      console.error("Error in showRewardedAd:", error);
      resolve(false);
    }
  });
};

/**
 * Initializes the AdMob SDK
 * This would be called once during app startup
 */
export const initializeAdMob = (): void => {
  try {
    console.log(`Initializing AdMob with app ID: ${APP_ID}`);
    
    // In a real implementation, this would initialize the AdMob SDK
    // For now, we'll just log that we would do this
    
    // Example of what would happen in a real implementation:
    // window.adsbygoogle = window.adsbygoogle || [];
    // window.adsbygoogle.push({
    //   google_ad_client: APP_ID,
    //   enable_page_level_ads: true
    // });
    
    console.log("AdMob initialized successfully");
  } catch (error) {
    console.error("Failed to initialize AdMob:", error);
  }
};
