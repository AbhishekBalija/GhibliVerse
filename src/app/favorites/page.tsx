'use client';

import { useEffect, useState } from 'react';
import { ObjectId } from 'mongodb';
import { Background } from '@/components/Background';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SavedStory } from '@/lib/models';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function FavoritesPage() {
  const [stories, setStories] = useState<SavedStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories');
      if (!response.ok) throw new Error('Failed to fetch stories');
      const data = await response.json();
      setStories(data);
    } catch (error) {
      console.error('Error fetching stories:', error);
      setError('Failed to load favorite stories. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (storyId: ObjectId) => {
    try {
      const response = await fetch(`/api/stories/${storyId.toString()}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete story');
      
      setStories(stories.filter(story => story._id.toString() !== storyId.toString()));
      toast({
        title: 'Success',
        description: 'Story deleted successfully',
        duration: 3000
      });
    } catch (error) {
      console.error('Error deleting story:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete story. Please try again.',
        variant: 'destructive',
        duration: 3000
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 relative overflow-hidden">
      <Background setting="default" />

      <div className="text-center mb-8 relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
          Your Favorite Tales
        </h1>
        <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md">
          A collection of stories that touched your heart
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto relative z-10">
        <Link href="/">
          <Button
            variant="outline"
            className="mb-6 text-black border-white/50 hover:bg-white/10 hover:text-white"
          >
            ← Back to Story Generator
          </Button>
        </Link>

        {isLoading ? (
          <div className="text-center text-white">
            <div className="animate-spin h-8 w-8 border-4 border-white/50 border-t-white rounded-full mx-auto mb-4"></div>
            <p>Loading your favorite stories...</p>
          </div>
        ) : error ? (
          <div className="text-center text-white bg-red-500/20 backdrop-blur-sm p-4 rounded-lg">
            {error}
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center text-white bg-white/10 backdrop-blur-sm p-8 rounded-lg">
            <p className="text-xl mb-4">You haven't saved any stories yet</p>
            <p className="text-white/70 mb-6">Return to the story generator to create and save some magical tales!</p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                Generate New Stories
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {stories.map((story) => (
              <Card key={story._id.toString()} className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6">
                  <ScrollArea className="h-[200px] rounded-md mb-4">
                    <div className="font-serif text-lg leading-relaxed">
                      {story.story}
                    </div>
                  </ScrollArea>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                      {story.theme && (
                        <span className="px-2 py-1 bg-indigo-100 rounded-full">Theme: {story.theme}</span>
                      )}
                      {story.length && (
                        <span className="px-2 py-1 bg-purple-100 rounded-full">Length: {story.length}</span>
                      )}
                      {story.style && (
                        <span className="px-2 py-1 bg-pink-100 rounded-full">Style: {story.style}</span>
                      )}
                      <span className="px-2 py-1 bg-blue-100 rounded-full">
                        Saved on: {new Date(story.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          🗑️ Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Story</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this story? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(story._id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}