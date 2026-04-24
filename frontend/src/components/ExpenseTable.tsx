import { UIExpense } from '../interfaces';
import { LoadState } from '../enums';

interface Props {
  expenses: UIExpense[];
  loadState: LoadState;
}

export function ExpenseTable({ expenses, loadState }: Props) {
  if (loadState === LoadState.Loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading expenses...</div>;
  }

  if (loadState === LoadState.Error) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Failed to load expenses.</div>;
  }

  if (expenses.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center', background: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}>No expenses found.</div>;
  }

  return (
    <div style={{ overflowX: 'auto', background: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f1f1f1', borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Category</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Description</th>
            <th style={{ padding: '10px', textAlign: 'right' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(e => (
            <tr key={e.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{e.dateFormatted}</td>
              <td style={{ padding: '10px' }}>{e.category}</td>
              <td style={{ padding: '10px' }}>{e.description}</td>
              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>{e.amountFormatted}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
