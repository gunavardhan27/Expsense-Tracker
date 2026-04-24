import mongoose, { Schema, Document } from 'mongoose';

export interface ExpenseDocument extends Document {
  // _id is inherited from Document (as ObjectId); we expose it as string via .id virtual
  idempotency_key: string;
  amount_minor: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
}

const ExpenseSchema = new Schema<ExpenseDocument>(
  {
    idempotency_key:  { type: String, required: true, unique: true },
    amount_minor:     { type: Number, required: true },
    category:         { type: String, required: true },
    description:      { type: String, required: true },
    date:             { type: String, required: true },
    created_at:       { type: String, required: true },
  },
  { versionKey: false } // keep Mongo's _id; Mongoose exposes it as .id (string) automatically
);

export const ExpenseModel = mongoose.model<ExpenseDocument>('Expense', ExpenseSchema);
