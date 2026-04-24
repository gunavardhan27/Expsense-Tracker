import { ExpenseRow, IExpenseRepository } from './interfaces';
import { ExpenseModel } from './models/Expense';

function toRow(doc: Record<string, unknown>): ExpenseRow {
  return {
    id: String(doc['_id']),
    idempotency_key: doc['idempotency_key'] as string,
    amount_minor: doc['amount_minor'] as number,
    category: doc['category'] as string,
    description: doc['description'] as string,
    date: doc['date'] as string,
    created_at: doc['created_at'] as string,
  };
}

export class ExpenseRepository implements IExpenseRepository {
  /**
   * Finds an expense by its idempotency key (for duplicate detection).
   */
  async findByIdempotencyKey(key: string): Promise<ExpenseRow | null> {
    const doc = await ExpenseModel.findOne({ idempotency_key: key }).lean();
    return doc ? toRow(doc as Record<string, unknown>) : null;
  }

  /**
   * Inserts a new expense and returns an ExpenseRow with the Mongo-generated _id as `id`.
   * If the idempotency_key already exists (code 11000), returns the existing row.
   */
  async insert(row: Omit<ExpenseRow, 'id'>): Promise<ExpenseRow> {
    try {
      const doc = new ExpenseModel(row);
      const saved = await doc.save();
      return { ...row, id: saved.id as string };
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as { code: number }).code === 11000
      ) {
        const existing = await this.findByIdempotencyKey(row.idempotency_key);
        if (existing) return existing;
      }
      throw err;
    }
  }

  /**
   * Retrieves expenses, optionally filtered by category and sorted by date.
   */
  async findAll(filter?: { category?: string; sortDateDesc?: boolean }): Promise<ExpenseRow[]> {
    const query: Record<string, string> = {};
    if (filter?.category) {
      query['category'] = filter.category;
    }

    const sortOrder = filter?.sortDateDesc === false ? 1 : -1;

    const docs = await ExpenseModel
      .find(query)
      .sort({ date: sortOrder, created_at: sortOrder })
      .lean();

    return (docs as Record<string, unknown>[]).map(toRow);
  }
}

export const repository = new ExpenseRepository();
