/**
 * Safely access localStorage with SSR support
 */
export const getLocalItem = (key: string): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.error('Error accessing localStorage:', e);
    return null;
  }
};

export const setLocalItem = (key: string, value: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error('Error setting localStorage:', e);
  }
};

export const removeLocalItem = (key: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Error removing from localStorage:', e);
  }
};