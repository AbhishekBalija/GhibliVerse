import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/db';

export async function DELETE(_request: Request, context: { params: unknown }) {
  // Await the params (whether they’re provided synchronously or as a promise)
  const resolvedParams = await Promise.resolve(context.params) as { id: string };
  const id = resolvedParams.id;
  
  try {
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid story ID' },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db('stories');
    
    const result = await db.collection('stories').deleteOne({
      _id: new ObjectId(id)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Story not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting story:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete story' },
      { status: 500 }
    );
  }
}
