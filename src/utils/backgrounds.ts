/**
 * Background Mapping Utility
 * Maps story settings to their corresponding background images
 */

/**
 * Gets the appropriate background image path based on the story setting
 * @param setting - The setting of the story (forest, ocean, mountain, castle)
 * @returns The path to the background image
 */
export const getBackgroundImage = (setting: string): string => {
  switch (setting.toLowerCase()) {
    case 'forest':
      return '/backgrounds/forest.jpg';
    case 'ocean':
      return '/backgrounds/ocean.jpg';
    case 'mountain':
      return '/backgrounds/mountain.jpg';
    case 'castle':
      return '/backgrounds/castle.jpg';
    default:
      return '/backgrounds/default.jpg';
  }
};

/**
 * Gets a descriptive alt text for the background image
 * @param setting - The setting of the story
 * @returns Descriptive alt text for accessibility
 */
export const getBackgroundAltText = (setting: string): string => {
  switch (setting.toLowerCase()) {
    case 'forest':
      return 'A mystical forest with sunlight filtering through ancient trees';
    case 'ocean':
      return 'A serene ocean view with waves gently lapping at the shore';
    case 'mountain':
      return 'Majestic mountains shrouded in mist and clouds';
    case 'castle':
      return 'An enchanted castle with towers reaching toward the sky';
    default:
      return 'A magical Ghibli-inspired landscape';
  }
};