/**
 * MCP Client for Story Generation
 * Handles communication with the AI model for generating stories
 */

export interface StoryResponse {
  story: string;
  setting: string;
}

export interface StoryOptions {
  theme?: string;
  length?: 'short' | 'medium' | 'long';
  style?: string;
}

/**
 * Fetches a story from the AI model
 * @param options - Optional parameters to customize the story
 * @returns A promise that resolves to a StoryResponse object
 */
export const fetchStoryFromMCP = async (options: StoryOptions = {}): Promise<StoryResponse> => {
  try {
    // Available settings for the story
    const settings = ['forest', 'ocean', 'mountain', 'castle'];
    
    // If we don't have an API key, use the fallback
    if (!process.env.GEMINI_API_KEY) {
      console.log('[Story Debug] Using fallback story generation - No API key or in development mode');
      return await generateFallbackStory(options, settings);
    }
    
    console.log('[Story Debug] Attempting to generate story using Gemini API with options:', options);
    
    // Prepare the prompt for the AI model
    const theme = options.theme || '';
    const length = options.length || 'short';
    const style = options.style || 'magical, whimsical, Ghibli-inspired';
    
    // Select a random setting if not specified in the theme
    let setting = '';
    if (theme.includes('forest')) setting = 'forest';
    else if (theme.includes('ocean') || theme.includes('sea')) setting = 'ocean';
    else if (theme.includes('mountain')) setting = 'mountain';
    else if (theme.includes('castle')) setting = 'castle';
    else setting = settings[Math.floor(Math.random() * settings.length)];
    
    // Construct the prompt for the AI
    const prompt = `Generate a ${length} ${style} story set in a ${setting} ${theme ? `about ${theme}` : ''}. 
    The story should be magical, whimsical, and suitable for all ages. 
    Make it feel like a Studio Ghibli film in written form.`;
    
    console.log('[Story Debug] Making Gemini API request with prompt:', prompt);
    
    // Make the API call to Google's Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });
    
    if (!response.ok) {
      console.error('[Story Debug] Gemini API request failed with status:', response.status);
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('[Story Debug] Successfully received response from Gemini API');
    
    // Extract the generated text from the response
    const storyText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    
    if (!storyText) {
      console.error('[Story Debug] Invalid response format from Gemini API:', data);
      throw new Error('Invalid response format from Gemini API');
    }
    
    return {
      story: storyText,
      setting: setting
    };
  } catch (error) {
    console.error('[Story Debug] Error fetching story from Gemini API:', error);
    console.log('[Story Debug] Falling back to static story generation');
    // Fall back to the static story generation if the API call fails
    return await generateFallbackStory({}, ['forest', 'ocean', 'mountain', 'castle']);
  }
};

/**
 * Generates a fallback story when the AI API is unavailable
 * @param options - Story options
 * @param settings - Available settings
 * @returns A promise that resolves to a StoryResponse object
 */
async function generateFallbackStory(options: StoryOptions, settings: string[]): Promise<StoryResponse> {
  // Simulated API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate a random setting for the story
  const randomSetting = settings[Math.floor(Math.random() * settings.length)];
  
  // Generate a simple story based on the setting
  let storyText = '';
  
  switch (randomSetting) {
    case 'forest':
      storyText = "In a forest where sunlight filtered through ancient trees, a young girl discovered a tiny door hidden among the roots. Behind it was a world of miniature forest spirits who had been waiting for someone brave enough to find them. They taught her the language of trees and the secrets of the woodland creatures. When she returned home, she found she could still hear the whispers of the forest, carrying messages from her tiny friends."
      break;
    case 'ocean':
      storyText = "The old fisherman told tales of a melody that could be heard only during the full moon, when the tide was at its highest. One night, a curious child sat at the shore and waited. As moonlight painted the waves silver, a haunting song rose from the depths. The ocean parted to reveal a path of glowing shells, leading to an underwater city where people with scales instead of skin welcomed the child as a long-awaited guest."
      break;
    case 'mountain':
      storyText = "High in the misty mountains lived a cloud-weaver who spun dreams into reality. Travelers who reached her cottage could trade a memory for a wish. A young boy climbed for days, carrying only his favorite book and determination. When he reached the cloud-weaver, she asked for his most precious memory. Instead, he offered her his book of stories. Delighted by this gift, she taught him how to weave clouds into whatever shapes his imagination could conjure."
      break;
    case 'castle':
      storyText = "In a castle forgotten by time, portraits whispered to each other when no one was looking. A new caretaker arrived, a woman who could hear their conversations. The portraits, surprised to be discovered, shared the castle's secrets—hidden passages, buried treasures, and the truth about the royal family who once lived there. As she restored each painting, she restored their stories to the world, bringing the castle back to life one brushstroke at a time."
      break;
    default:
      storyText = "Once upon a time, in a land where magic flowed like water and dreams took flight on the wings of paper birds, there lived a storyteller whose words could change the weather. People traveled from distant lands to hear tales that would bring rain to drought-stricken fields or sunshine to gloomy hearts. But the storyteller's greatest secret was that the magic wasn't in the words—it was in the listeners, who carried the stories home like seeds that would bloom into wonders."
  }
  
  return {
    story: storyText,
    setting: randomSetting
  };
}