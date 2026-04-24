import { IExpenseService } from './interfaces';
import { Expense, CreateExpensePayload } from '../../shared/src/interfaces';
import { validateAmount, validateDate, sumDecimalStrings } from '../../shared/src/utils';
import { MAX_DESCRIPTION_LENGTH } from '../../shared/src/constants';
import { Category, SortOrder } from '../../shared/src/enums';
import { repository } from './repository';
import { amountToMinorUnits, isValidUUIDv4, minorUnitsToAmount } from './utils';

export class ExpenseService implements IExpenseService {
  private validateCreateExpensePayload(payload: CreateExpensePayload): void {
    if (!payload.idempotency_key || !isValidUUIDv4(payload.idempotency_key)) {
      throw new Error(`400:Invalid idempotency_key`);
    }

    const amountValid = validateAmount(payload.amount);
    if (!amountValid.valid) {
      throw new Error(`422:${amountValid.reason}`);
    }

    const dateValid = validateDate(payload.date);
    if (!dateValid.valid) {
      throw new Error(`422:${dateValid.reason}`);
    }

    if (!payload.description || payload.description.trim() === '') {
      throw new Error(`422:Description cannot be empty`);
    }

    if (payload.description.length > MAX_DESCRIPTION_LENGTH) {
      throw new Error(`422:Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`);
    }

    if (!Object.values(Category).includes(payload.category as Category)) {
      throw new Error(`422:Invalid category`);
    }
  }

  async createExpense(payload: CreateExpensePayload): Promise<Expense> {
    this.validateCreateExpensePayload(payload);

    // Check idempotency: if the key already exists, return the existing expense
    const existingRow = await repository.findByIdempotencyKey(payload.idempotency_key);
    if (existingRow) {
      return {
        id: existingRow.id,
        amount: minorUnitsToAmount(existingRow.amount_minor),
        category: existingRow.category as Category,
        description: existingRow.description,
        date: existingRow.date,
        created_at: existingRow.created_at,
      };
    }

    const created_at = new Date().toISOString();
    const amount_minor = amountToMinorUnits(payload.amount);

    const saved = await repository.insert({
      idempotency_key: payload.idempotency_key,
      amount_minor,
      category: payload.category,
      description: payload.description,
      date: payload.date,
      created_at,
    });

    return {
      id: saved.id,
      amount: minorUnitsToAmount(amount_minor),
      category: payload.category as Category,
      description: payload.description,
      date: payload.date,
      created_at,
    };
  }

  async listExpenses(query: { category?: string; sort?: string }): Promise<{ expenses: Expense[]; total: string }> {
    const filter: { category?: string; sortDateDesc?: boolean } = {};

    if (query.category) {
      filter.category = query.category;
    }

    if (query.sort === SortOrder.DateAsc) {
      filter.sortDateDesc = false;
    } else if (query.sort === SortOrder.DateDesc) {
      filter.sortDateDesc = true;
    } else {
      filter.sortDateDesc = true;
    }

    const rows = await repository.findAll(filter);

    const expenses = rows.map(row => ({
      id: row.id,
      amount: minorUnitsToAmount(row.amount_minor),
      category: row.category as Category,
      description: row.description,
      date: row.date,
      created_at: row.created_at,
    }));

    const total = sumDecimalStrings(expenses.map(e => e.amount));

    return { expenses, total };
  }
}

export const service = new ExpenseService();
