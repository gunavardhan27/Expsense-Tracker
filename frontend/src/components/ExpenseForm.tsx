import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateExpense } from '../hooks/useCreateExpense';
import { ExpenseFormState } from '../interfaces';
import { Category } from '../../../shared/src/enums';
import { ALL_CATEGORIES, MAX_DESCRIPTION_LENGTH } from '../../../shared/src/constants';
import { validateAmount, validateDate } from '../../../shared/src/utils';
import { SubmitState } from '../enums';
import { Expense } from '../../../shared/src/interfaces';

interface Props {
  onSuccess: (newExpense: Expense) => void;
}

export function ExpenseForm({ onSuccess }: Props) {
  const { submit, submitState, error: serverError } = useCreateExpense();
  const [showToast, setShowToast] = useState(false);

  const todayStr: string = new Date().toISOString().split('T')[0] ?? '';

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ExpenseFormState>({
    mode: 'onTouched', // Validation triggers on blur initially, then on change after first touch
    defaultValues: {
      amount: '',
      category: Category.Food,
      description: '',
      date: todayStr
    } satisfies ExpenseFormState
  });

  useEffect(() => {
    let timer: number;
    if (showToast) {
      timer = window.setTimeout(() => setShowToast(false), 2000);
    }
    return () => clearTimeout(timer);
  }, [showToast]);

  const onSubmit = async (data: ExpenseFormState) => {
    const res = await submit(data);
    if (res) {
      reset();
      setShowToast(true);
      onSuccess(res);
    }
  };

  const isSubmitting = submitState === SubmitState.Submitting;
  
  // Disable if form is submitting, or if any fields are touched/dirty and the form is invalid
  const hasErrors = Object.keys(errors).length > 0;
  const isInvalid = isDirty && hasErrors;

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px', background: '#fff' }}>
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Amount</label>
          <input 
            type="text" 
            disabled={isSubmitting}
            placeholder="e.g. 10.50"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            {...register('amount', {
              validate: (val) => {
                const amountVal = validateAmount(val);
                return amountVal.valid || amountVal.reason;
              }
            })}
          />
          {errors.amount && <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.amount.message}</div>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Category</label>
          <select 
            disabled={isSubmitting}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            {...register('category', { required: 'Category is required' })}
          >
            {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
          <input 
            type="text" 
            disabled={isSubmitting}
            maxLength={MAX_DESCRIPTION_LENGTH}
            placeholder="Description..."
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            {...register('description', {
              required: 'Description is required',
              maxLength: { value: MAX_DESCRIPTION_LENGTH, message: `Must be ≤ ${MAX_DESCRIPTION_LENGTH} characters` },
              validate: (val) => val.trim().length > 0 || 'Description is required'
            })}
          />
          {errors.description && <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.description.message}</div>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Date</label>
          <input 
            type="date" 
            disabled={isSubmitting}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            {...register('date', {
              required: 'Date is required',
              validate: (val) => {
                const dateVal = validateDate(val);
                if (!dateVal.valid) return dateVal.reason;
                const selected = new Date(val);
                const now = new Date();
                now.setFullYear(now.getFullYear() + 1);
                if (selected > now) return 'Date cannot be more than 1 year in the future';
                return true;
              }
            })}
          />
          {errors.date && <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.date.message}</div>}
        </div>

        {serverError && <div style={{ color: 'red', marginTop: '5px' }}>Server Error: {serverError}</div>}
        
        <button 
          type="submit" 
          disabled={isSubmitting || isInvalid}
          style={{ 
            padding: '10px', 
            background: isSubmitting || isInvalid ? '#a0c4ff' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: isSubmitting || isInvalid ? 'not-allowed' : 'pointer' 
          }}
        >
          {isSubmitting ? 'Saving...' : 'Add Expense'}
        </button>
      </form>
      {showToast && <div style={{ marginTop: '10px', color: 'green', fontWeight: 'bold' }}>Expense created successfully!</div>}
    </div>
  );
}
