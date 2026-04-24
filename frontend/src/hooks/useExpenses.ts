import { useState, useEffect, useCallback } from 'react';
import { getExpenses } from '../api';
import { FilterState, UIExpense } from '../interfaces';
import { LoadState } from '../enums';
import { formatINR, formatDate } from '../utils';
import { Category } from '../../../shared/src/enums';
import { GetExpensesQuery, Expense } from '../../../shared/src/interfaces';
import { addDecimalStrings } from '../../../shared/src/utils';

export function useExpenses(filter: FilterState) {
  const [expenses, setExpenses] = useState<UIExpense[]>([]);
  const [total, setTotal] = useState<string>('0.00');
  const [loadState, setLoadState] = useState<LoadState>(LoadState.Idle);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    setLoadState(LoadState.Loading);
    setError(null);
    try {
      const query: GetExpensesQuery = {};
      if (filter.category) query.category = filter.category as Category;
      if (filter.sort) query.sort = filter.sort;
      
      const res = await getExpenses(query);
      setExpenses(res.expenses.map(e => ({
        ...e,
        amountFormatted: formatINR(e.amount),
        dateFormatted: formatDate(e.date)
      })));
      setTotal(res.total);
      setLoadState(LoadState.Success);
    } catch (err: unknown) {
      setLoadState(LoadState.Error);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  }, [filter.category, filter.sort]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpenseLocal = useCallback((newExpense: Expense) => {
    if (filter.category && newExpense.category !== filter.category) {
      return; 
    }

    const uiExpense: UIExpense = {
      ...newExpense,
      amountFormatted: formatINR(newExpense.amount),
      dateFormatted: formatDate(newExpense.date)
    };

    setExpenses(prev => [uiExpense, ...prev]);

    setTotal(prevTotal => addDecimalStrings(prevTotal, newExpense.amount));
  }, [filter.category, filter.sort]);

  return { expenses, total, loadState, error, refetch: fetchExpenses, addExpenseLocal };
}
