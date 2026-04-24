import { formatINR } from '../utils';

interface Props {
  total: string;
}

export function TotalBar({ total }: Props) {
  return (
    <div style={{ padding: '15px', background: '#e9ecef', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px', textAlign: 'right' }}>
      Total: {formatINR(total)}
    </div>
  );
}
