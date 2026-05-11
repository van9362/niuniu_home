import { Link } from 'react-router-dom';
import type { GrowthRecord } from '../types';
import './RecordCard.css';

interface RecordCardProps {
  record: GrowthRecord;
}

const authorInfo: Record<string, { emoji: string; label: string }> = {
  dad: { emoji: '👨', label: '爸爸' },
  mom: { emoji: '👩', label: '妈妈' },
  niuniu: { emoji: '👶', label: '牛牛' },
};

export function RecordCard({ record }: RecordCardProps) {
  const author = authorInfo[record.author];
  const displayDate = new Date(record.record_date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link to={`/record/${record.id}`} className="record-card">
      {record.images.length > 0 && (
        <div className="card-image">
          <img src={record.images[0]} alt={record.title} loading="lazy" />
          {record.images.length > 1 && (
            <span className="image-count">+{record.images.length - 1}</span>
          )}
        </div>
      )}
      <div className="card-body">
        <h3 className="card-title">{record.title}</h3>
        <p className="card-desc">{record.description}</p>
        <div className="card-meta">
          <span className="card-date">📅 {displayDate}</span>
          <span className="card-author">{author.emoji} {author.label}</span>
        </div>
      </div>
    </Link>
  );
}
