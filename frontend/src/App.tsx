import { useState } from 'react';
import { FilterState } from './interfaces';
import { DEFAULT_SORT } from './constants';
import { useExpenses } from './hooks/useExpenses';
import { ExpenseForm } from './components/ExpenseForm';
import { FilterBar } from './components/FilterBar';
import { ExpenseTable } from './components/ExpenseTable';
import { TotalBar } from './components/TotalBar';
import { CategorySummary } from './components/CategorySummary';

function App() {
  const [filter, setFilter] = useState<FilterState>({
    category: '',
    sort: DEFAULT_SORT,
  });

  const { expenses, total, loadState, addExpenseLocal } = useExpenses(filter);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Expense Tracker</h1>
      
      <ExpenseForm onSuccess={addExpenseLocal} />
      
      <FilterBar filter={filter} onChange={setFilter} />
      
      <TotalBar total={total} />
      
      <ExpenseTable expenses={expenses} loadState={loadState} />
      
      <CategorySummary expenses={expenses} />
    </div>
  );
}

export default App;
