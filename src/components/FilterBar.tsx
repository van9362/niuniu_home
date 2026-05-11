import type { Author } from '../types';
import './FilterBar.css';

interface FilterBarProps {
  active: Author | 'all';
  onChange: (author: Author | 'all') => void;
}

const filters: { value: Author | 'all'; label: string; emoji: string }[] = [
  { value: 'all', label: '全部', emoji: '🌟' },
  { value: 'dad', label: '爸爸', emoji: '👨' },
  { value: 'mom', label: '妈妈', emoji: '👩' },
  { value: 'niuniu', label: '牛牛', emoji: '👶' },
];

export function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="filter-bar">
      {filters.map((f) => (
        <button
          key={f.value}
          className={`filter-btn ${active === f.value ? 'active' : ''}`}
          onClick={() => onChange(f.value)}
        >
          <span className="filter-emoji">{f.emoji}</span>
          {f.label}
        </button>
      ))}
    </div>
  );
}
