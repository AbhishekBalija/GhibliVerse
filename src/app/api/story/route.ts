import { NextResponse } from 'next/server';
import { fetchStoryFromMCP, StoryOptions } from '../../../utils/mcpClient';

/**
 * API Route for Story Generation
 * Handles requests to generate a new story using the MCP client
 */
export async function GET(request: Request) {
  try {
    // Get query parameters from the request URL
    const url = new URL(request.url);
    const theme = url.searchParams.get('theme') || undefined;
    const length = url.searchParams.get('length') as 'short' | 'medium' | 'long' | undefined;
    const style = url.searchParams.get('style') || undefined;
    
    // Create options object for story generation
    const options: StoryOptions = {};
    if (theme) options.theme = theme;
    if (length) options.length = length;
    if (style) options.style = style;
    
    // Fetch a new story from the MCP client with the provided options
    const storyData = await fetchStoryFromMCP(options);
    
    // Return the story data as JSON
    return NextResponse.json(storyData);
  } catch (error) {
    console.error('Error generating story:', error);
    
    // Return an error response
    return NextResponse.json(
      { 
        error: 'Failed to generate story', 
        story: 'Once upon a time, the storyteller lost their voice. While we wait for it to return, perhaps you could imagine your own tale?',
        setting: 'default'
      },
      { status: 500 }
    );
  }
}