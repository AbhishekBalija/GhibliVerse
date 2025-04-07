'use client';

import { useEffect, useState } from 'react';
import { getBackgroundAltText } from '../utils/backgrounds';
import { cn } from '../lib/utils';

interface BackgroundProps {
  setting: string;
  className?: string;
}

/**
 * Dynamic background component that changes based on the story setting
 * Uses a fade transition when switching between backgrounds
 */
export function Background({ setting, className }: BackgroundProps) {
  const [imagePath, setImagePath] = useState<string>(`/backgrounds/${setting || 'default'}.jpg`);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // When setting changes, update the background image with a fade effect
    setIsLoading(true);
    setImagePath(`/backgrounds/${setting || 'default'}.jpg`);
    
    // Simulate image loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [setting]);
  
  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      <div 
        className={cn(
          "absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        style={{ backgroundImage: `url(${imagePath})` }}
        aria-label={getBackgroundAltText(setting)}
        role="img"
      />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
    </div>
  );
}