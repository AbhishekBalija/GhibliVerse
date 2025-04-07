'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/ui/button';
import { ScrollArea } from '@/ui/scroll-area';
import { Card, CardContent } from '@/ui/card';

import { Story } from '@/lib/models';
import { toast } from 'sonner';

interface StoryCardProps {
  story: string;
  isVisible: boolean;
  onNewStory: () => void;
  className?: string;
  setting: string;
  theme?: string;
  length?: 'short' | 'medium' | 'long';
  style?: string;
}

/**
 * StoryCard component displays the generated story with animation effects
 * Includes a scroll area for longer stories and a button to generate a new story
 */
export function StoryCard({ story, isVisible, onNewStory, className, setting, theme, length, style }: StoryCardProps) {
  const [displayedStory, setDisplayedStory] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Animate the story text with a typewriter effect
  useEffect(() => {
    if (!story || !isVisible) {
      setDisplayedStory('');
      return;
    }
    
    setIsTyping(true);
    let index = 0;
    const storyText = story;
    setDisplayedStory('');
    
    const typingInterval = setInterval(() => {
      if (index < storyText.length) {
        setDisplayedStory(prev => prev + storyText.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 20); // Speed of typing animation
    
    return () => clearInterval(typingInterval);
  }, [story, isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <Card className={cn(
      "w-full max-w-4xl mx-auto bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-500 mb-8",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
      className
    )}>
      <CardContent className="p-6">
        <ScrollArea className="h-[400px] rounded-md">
          <div className="p-4 font-serif text-lg leading-relaxed">
            {displayedStory}
            {isTyping && <span className="animate-pulse">|</span>}
          </div>
        </ScrollArea>
        
        <div className="mt-4 flex justify-center gap-4">
          <Button 
            onClick={onNewStory}
            disabled={isTyping}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium transition-all duration-300 disabled:opacity-50"
          >
            ✨ Tell me another story
          </Button>
          <Button
            onClick={async () => {
              try {
                const storyData: Story = {
                  story,
                  setting,
                  theme,
                  length,
                  style,
                  createdAt: new Date()
                };
                
                const response = await fetch('/api/stories', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(storyData)
                });
                
                if (!response.ok) throw new Error('Failed to save story');
                
                toast.success('Story saved to favorites!');
                console.log('Story saved to favorites:', storyData);
              } catch (error) {
                console.error('Error saving story:', error);
                toast.error('Failed to save story. Please try again.');
              }
            }}
            disabled={isTyping}
            variant="outline"
            className="px-6 py-2 rounded-full border-white/50 hover:bg-white/20 hover:border-white text-black transition-all duration-300 shadow-sm hover:shadow-md"
          >
            ⭐ Save to Favorites
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}