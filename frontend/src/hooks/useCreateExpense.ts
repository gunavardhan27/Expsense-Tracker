import { useState, useCallback, useRef } from 'react';
import { createExpense } from '../api';
import { ExpenseFormState } from '../interfaces';
import { SubmitState } from '../enums';
import { generateUUID } from '../utils';
import { Expense } from '../../../shared/src/interfaces';

export function useCreateExpense() {
  const [submitState, setSubmitState] = useState<SubmitState>(SubmitState.Idle);
  const [error, setError] = useState<string | null>(null);
  
  // Keep track of the idempotency key for retries on the same logical submission
  const idempotencyKeyRef = useRef<string>(generateUUID());

  const reset = useCallback(() => {
    setSubmitState(SubmitState.Idle);
    setError(null);
    idempotencyKeyRef.current = generateUUID();
  }, []);

  const submit = useCallback(async (form: ExpenseFormState): Promise<Expense | null> => {
    setSubmitState(SubmitState.Submitting);
    setError(null);
    try {
      const res = await createExpense({
        ...form,
        idempotency_key: idempotencyKeyRef.current,
      });
      setSubmitState(SubmitState.Success);
      reset(); // After success, generate a new key for the next form submission
      return res;
    } catch (err: unknown) {
      setSubmitState(SubmitState.Error);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      return null;
    }
  }, [reset]);

  return { submit, submitState, error, reset };
}
