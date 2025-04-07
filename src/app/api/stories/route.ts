import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { Story } from '@/lib/models';

export async function POST(request: Request) {
  try {
    const story = await request.json() as Story;
    const client = await clientPromise;
    const db = client.db('stories');
    
    // Add timestamp
    story.createdAt = new Date();
    
    const result = await db.collection('stories').insertOne(story);
    
    return NextResponse.json({ success: true, storyId: result.insertedId });
  } catch (error) {
    console.error('Error saving story:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save story' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('stories');
    
    const stories = await db.collection('stories')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}