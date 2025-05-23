import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getBase64FromUrl(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function extractFilename(url: string): string {
  const parts = url.split('/');
  return parts[parts.length - 1];
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  
  // Check if within the last 24 hours
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  
  if (diff < oneDay) {
    // If less than a minute
    if (diff < 60 * 1000) {
      return 'Just now';
    }
    
    // If less than an hour
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    // Within a day
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  // If yesterday
  if (diff < 2 * oneDay && d.getDate() === now.getDate() - 1) {
    return 'Yesterday';
  }
  
  // Otherwise, return a formatted date
  return d.toLocaleDateString();
}
