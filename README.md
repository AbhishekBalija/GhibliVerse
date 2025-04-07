# AI-Powered Story Generator in Ghibli style theme

A Next.js web application that generates immersive, customizable stories with dynamic backgrounds and interactive animations, inspired by Studio Ghibli's magical storytelling.

This application combines the power of AI-generated storytelling with a polished, responsive user interface to create an engaging story generation experience. Users can customize their stories by theme, length, and style, save their favorite tales, and enjoy them with beautiful dynamic backgrounds that match the story's setting. The application features smooth animations, typewriter effects, and a carefully crafted UI that makes story generation both magical and intuitive.

## Repository Structure
```
.
├── src/                          # Source code directory
│   ├── app/                      # Next.js app directory containing pages and API routes
│   │   ├── api/                  # API endpoints for story generation and management
│   │   ├── favorites/            # Saved stories view
│   │   └── page.tsx             # Main story generator page
│   ├── components/               # React components
│   │   ├── Background.tsx       # Dynamic background handler
│   │   ├── StoryCard.tsx        # Story display component with animations
│   │   └── ui/                  # Reusable UI components (buttons, forms, etc.)
│   ├── lib/                     # Core utilities and database configuration
│   │   ├── db.ts               # MongoDB connection setup
│   │   ├── models.ts           # TypeScript interfaces for data models
│   │   └── utils.ts            # Utility functions
│   └── utils/                   # Additional utility functions
├── components.json              # UI component configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

## Usage Instructions
### Prerequisites
- Node.js 16.x or later
- MongoDB database
- Environment variables:
  - `MONGODB_URI`: Your MongoDB connection string
  - `GEMINI_API_KEY`: Your Gemini API key

### Installation
1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your MongoDB connection string
```

4. Start the development server:
```bash
npm run dev
```

### Quick Start
1. Visit `http://localhost:3000` in your browser
2. Click "Tell me a story" to generate your first story
3. Use the "Customize your story" button to set preferences:
   - Theme (e.g., dragons, friendship)
   - Length (short, medium, long)
   - Style (e.g., whimsical, mysterious)
4. Save favorite stories using the "Save to Favorites" button
5. View saved stories in the Favorites page

### More Detailed Examples
1. Customizing Story Generation:
```typescript
// Example story preferences
const preferences = {
  theme: "magical forest",
  length: "medium",
  style: "whimsical"
};

// Generate story with preferences
await fetch('/api/story?' + new URLSearchParams(preferences));
```

2. Saving Stories:
```typescript
// Save a story to favorites
await fetch('/api/stories', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    story: "Once upon a time...",
    setting: "forest",
    theme: "adventure",
    length: "medium",
    style: "mysterious",
    createdAt: new Date()
  })
});
```

### Troubleshooting
1. MongoDB Connection Issues
   - Error: "Please add your MongoDB URI to .env.local"
   - Solution: Ensure your MongoDB URI is properly set in .env.local
   - Check MongoDB server status and network connectivity
   - Verify IP whitelist settings in MongoDB Atlas

2. Story Generation Errors
   - If story generation fails, the application will display a fallback story
   - Check browser console for detailed error messages
   - Verify API endpoint connectivity at /api/story

3. Performance Optimization
   - Monitor story generation response times
   - Use the Network tab in browser DevTools to check API latency
   - Consider implementing caching for frequently accessed stories

## Data Flow
The application follows a streamlined data flow for story generation and management, with the main pathway being user input → API processing → story display.

```ascii
User Input → [Next.js API Routes] → Story Generation
     ↓                                    ↓
MongoDB ← → Story Management  ← →  Story Display
     ↑                                    ↑
Favorites ← → [API Endpoints] → Background Selection
```

Component interactions:
1. User inputs story preferences through the main page interface
2. API routes handle story generation and storage requests
3. StoryCard component manages story display and animations
4. Background component dynamically updates based on story setting
5. MongoDB handles persistent storage of saved stories
6. API endpoints manage CRUD operations for saved stories
7. UI components provide real-time feedback and interactions
8. Toast notifications inform users of successful actions