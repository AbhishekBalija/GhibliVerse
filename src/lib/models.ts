import { ObjectId } from 'mongodb';

export interface Story {
  _id?: ObjectId;
  story: string;
  setting: string;
  theme?: string;
  length?: 'short' | 'medium' | 'long';
  style?: string;
  createdAt: Date;
}

export interface SavedStory extends Story {
  _id: ObjectId;
}