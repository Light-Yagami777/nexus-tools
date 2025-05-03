
/**
 * Validates if a string is a properly formatted URL
 * @param urlString - The URL string to validate
 * @returns boolean indicating if the URL is valid
 */
export const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    // Check if protocol is http or https and has a valid domain with TLD
    return (url.protocol === "http:" || url.protocol === "https:") && 
      url.hostname.includes(".") && 
      url.hostname.split(".").length >= 2 && 
      url.hostname.split(".").every(part => part.length > 0);
  } catch (e) {
    return false;
  }
};

/**
 * Formats a URL string by adding https:// if needed
 * @param url - The URL string to format
 * @returns formatted URL string
 */
export const formatUrl = (url: string): string => {
  if (!url) return url;
  return url.startsWith("http") ? url : `https://${url}`;
};
