import mongoose from 'mongoose';
import { MONGO_URI } from './constants';
import { log } from './utils';
import { LogLevel } from './enums';

export async function connectDB(): Promise<void> {
  log(LogLevel.Info, 'Connecting to MongoDB', { uri: MONGO_URI.replace(/:\/\/.*@/, '://***@') });
  await mongoose.connect(MONGO_URI);
  log(LogLevel.Info, 'MongoDB connected');
}
