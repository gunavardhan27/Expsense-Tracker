import { FilterState } from '../interfaces';
import { SortOrder, Category } from '../../../shared/src/enums';
import { ALL_CATEGORIES } from '../../../shared/src/constants';

interface Props {
  filter: FilterState;
  onChange: (f: FilterState) => void;
}

export function FilterBar({ filter, onChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', padding: '15px', background: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}>
      <div>
        <label style={{ marginRight: '10px' }}>Category Filter:</label>
        <select 
          value={filter.category} 
          onChange={e => onChange({ ...filter, category: e.target.value as Category | '' })}
          style={{ padding: '5px' }}
        >
          <option value="">All categories</option>
          {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label style={{ marginRight: '10px' }}>Sort By:</label>
        <select 
          value={filter.sort} 
          onChange={e => onChange({ ...filter, sort: e.target.value as SortOrder })}
          style={{ padding: '5px' }}
        >
          <option value={SortOrder.DateDesc}>Newest first</option>
          <option value={SortOrder.DateAsc}>Oldest first</option>
        </select>
      </div>
    </div>
  );
}
