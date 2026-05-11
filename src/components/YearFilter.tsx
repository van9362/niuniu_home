import './YearFilter.css';

interface YearFilterProps {
  year: number;
  availableYears: number[];
  onChange: (year: number) => void;
}

export function YearFilter({ year, availableYears, onChange }: YearFilterProps) {
  return (
    <div className="year-filter">
      <button
        className="year-arrow"
        onClick={() => onChange(year - 1)}
        title="上一年"
      >
        ◀
      </button>
      <span className="year-label">{year}年</span>
      <button
        className="year-arrow"
        onClick={() => onChange(year + 1)}
        title="下一年"
      >
        ▶
      </button>
      {availableYears.length > 0 && (
        <select
          className="year-select"
          value={year}
          onChange={(e) => onChange(Number(e.target.value))}
        >
          {availableYears.map((y) => (
            <option key={y} value={y}>{y}年</option>
          ))}
        </select>
      )}
    </div>
  );
}
