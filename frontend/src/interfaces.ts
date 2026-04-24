import { Category, SortOrder } from '../../shared/src/enums';

export interface ExpenseFormState {
  amount: string;
  category: Category;
  description: string;
  date: string;
}

export interface FilterState {
  category: Category | '';
  sort: SortOrder;
}

export interface UIExpense {
  id: string;
  amount: string;
  amountFormatted: string;
  category: Category;
  description: string;
  date: string;
  dateFormatted: string;
  created_at: string;
}
