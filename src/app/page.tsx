'use client';

import { useState, useEffect } from 'react';
import { Background } from '@/components/Background';
import { StoryCard } from '@/components/StoryCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import Link from 'next/link';

interface StoryData {
  story: string;
  setting: string;
}

interface StoryPreferences {
  theme?: string;
  length?: 'short' | 'medium' | 'long';
  style?: string;
}

export default function HomePage() {
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<StoryPreferences>({});
  
  // Function to fetch a new story from the API
  const fetchStory = async () => {
    try {
      setIsLoading(true);
      setShowStory(false);
      setShowPreferences(false);
      
      // Build the query string with preferences
      let url = '/api/story';
      const params = new URLSearchParams();
      
      if (preferences.theme) params.append('theme', preferences.theme);
      if (preferences.length) params.append('length', preferences.length);
      if (preferences.style) params.append('style', preferences.style);
      
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch story');
      }
      
      const data = await response.json();
      setStoryData(data);
      
      // Show the story card with a slight delay for better animation
      setTimeout(() => {
        setShowStory(true);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching story:', error);
      setIsLoading(false);
      setStoryData({
        story: 'Once upon a time, the storyteller lost their voice. While we wait for it to return, perhaps you could imagine your own tale?',
        setting: 'default'
      });
      setShowStory(true);
    }
  };
  
  // Toggle the preferences panel
  const togglePreferences = () => {
    setShowPreferences(!showPreferences);
  };
  
  // Handle preference changes
  const handlePreferenceChange = (key: keyof StoryPreferences, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic background based on story setting */}
      <Background setting={storyData?.setting || 'default'} />
      
      {/* Title with Ghibli-inspired styling */}
      <div className="text-center mb-8 relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
          Archive of Forgotten Days
        </h1>
        <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md">
          Discover magical tales from worlds beyond imagination
        </p>
      </div>
      
      {/* Main content area */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-6 relative z-10">
        {/* Story card - only shown after a story is generated */}
        {storyData && (
          <StoryCard 
            story={storyData.story} 
            setting={storyData.setting}
            theme={preferences.theme}
            length={preferences.length}
            style={preferences.style}
            isVisible={showStory} 
            onNewStory={fetchStory} 
          />
        )}
        
        {/* Initial story button - only shown before first story */}
        {!storyData && (
          <div className="flex flex-col items-center gap-4 w-full">
            <Button
              onClick={fetchStory}
              disabled={isLoading}
              className="px-8 py-6 text-xl rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating magic...
                </span>
              ) : (
                <span>✨ Tell me a story</span>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={togglePreferences} 
              className="text-black border-white/50 hover:bg-white/20 hover:border-white hover:text-white transition-colors"
            >
              {showPreferences ? 'Hide preferences' : 'Customize your story'}
            </Button>
            
            {/* Story preferences form */}
            {showPreferences && (
              <div className="mt-4 p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg w-full max-w-md transition-all duration-300">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Story Preferences</h3>
                
                <div className="space-y-4">
                  {/* Theme input */}
                  <div className="space-y-2">
                    <Label htmlFor="theme" className="text-gray-700">Theme or topic</Label>
                    <Input
                      id="theme"
                      placeholder="e.g., dragons, friendship, adventure"
                      value={preferences.theme || ''}
                      onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Length selection */}
                  <div className="space-y-2">
                    <Label htmlFor="length" className="text-gray-700">Story length</Label>
                    <Select 
                      value={preferences.length || 'short'} 
                      onValueChange={(value) => handlePreferenceChange('length', value as 'short' | 'medium' | 'long')}
                    >
                      <SelectTrigger id="length" className="w-full">
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="long">Long</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Style input */}
                  <div className="space-y-2">
                    <Label htmlFor="style" className="text-gray-700">Style</Label>
                    <Input
                      id="style"
                      placeholder="e.g., whimsical, mysterious, adventurous"
                      value={preferences.style || ''}
                      onChange={(e) => handlePreferenceChange('style', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Submit button */}
                  <Button
                    onClick={fetchStory}
                    disabled={isLoading}
                    className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? 'Creating magic...' : '✨ Generate Story with These Preferences'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 text-center z-10 bg-gradient-to-t from-black/30 to-transparent">
        <div className="flex flex-col items-center gap-2">
          <Link 
            href="/favorites"
            className="text-white/90 hover:text-white transition-colors text-sm font-medium"
          >
            View Saved Stories
          </Link>
          <p className="text-white/70 text-sm">Inspired by the magical worlds of Studio Ghibli</p>
        </div>
      </div>
    </main>
  );
}