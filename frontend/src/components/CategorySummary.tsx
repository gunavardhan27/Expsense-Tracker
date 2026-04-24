import { UIExpense } from '../interfaces';
import { sumDecimalStrings } from '../../../shared/src/utils';
import { formatINR } from '../utils';

interface Props {
  expenses: UIExpense[];
}

export function CategorySummary({ expenses }: Props) {
  if (expenses.length === 0) return null;

  const grouped = expenses.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category]!.push(curr.amount);
    return acc;
  }, {} as Record<string, string[]>);

  const summary = Object.entries(grouped).map(([category, amounts]) => {
    // calculate total string
    const total = sumDecimalStrings(amounts);
    return { category, total };
  }).sort((a, b) => {
    // Sort by numerical value desc
    const numA = parseFloat(a.total);
    const numB = parseFloat(b.total);
    return numB - numA;
  });

  return (
    <div style={{ marginTop: '20px', padding: '15px', background: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0 }}>Category Summary</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {summary.map(item => (
          <li key={item.category} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <span>{item.category}</span>
            <span style={{ fontWeight: 'bold' }}>{formatINR(item.total)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
