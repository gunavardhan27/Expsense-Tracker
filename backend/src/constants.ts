import 'dotenv/config';

export const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
export const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/expense-tracker';
export const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173';
export const MINOR_UNIT_MULTIPLIER = 100;
