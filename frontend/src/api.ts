import { CreateExpensePayload, GetExpensesQuery, Expense, ExpensesListResponse, ApiResponse } from '../../shared/src/interfaces';
import { API_BASE_URL, MAX_RETRIES, RETRY_DELAY_MS } from './constants';
import { withRetry } from './utils';

export async function createExpense(payload: CreateExpensePayload): Promise<Expense> {
  const attemptFn = async () => {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData: ApiResponse<null> = await response.json().catch(() => ({ error: 'Unknown server error', data: null }));
      const errorMessage = errorData.error || `Server error: ${response.statusText}`;
      const err = new Error(errorMessage);
      err.name = 'ApiError';
      throw err;
    }

    const data: ApiResponse<Expense> = await response.json();
    return data.data;
  };

  return withRetry(attemptFn, MAX_RETRIES, RETRY_DELAY_MS);
}

export async function getExpenses(query: GetExpensesQuery): Promise<ExpensesListResponse> {
  const attemptFn = async () => {
    const params = new URLSearchParams();
    if (query.category) params.append('category', query.category);
    if (query.sort) params.append('sort', query.sort);

    const qs = params.toString();
    const url = `${API_BASE_URL}/expenses${qs ? `?${qs}` : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData: ApiResponse<null> = await response.json().catch(() => ({ error: 'Unknown server error', data: null }));
      const errorMessage = errorData.error || `Server error: ${response.statusText}`;
      const err = new Error(errorMessage);
      err.name = 'ApiError';
      throw err;
    }

    const data: ApiResponse<ExpensesListResponse> = await response.json();
    return data.data;
  };

  return withRetry(attemptFn, MAX_RETRIES, RETRY_DELAY_MS);
}
