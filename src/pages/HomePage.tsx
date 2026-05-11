import { useState } from 'react';
import { useRecords } from '../hooks/useRecords';
import { RecordCard } from '../components/RecordCard';
import { FilterBar } from '../components/FilterBar';
import type { Author } from '../types';
import './HomePage.css';

export function HomePage() {
  const [author, setAuthor] = useState<Author | 'all'>('all');
  const { records, loading, error } = useRecords(author);

  return (
    <div className="home-page">
      <div className="hero">
        <h1 className="hero-title">🌟 牛牛的成长记录 🌟</h1>
        <p className="hero-subtitle">记录每一个珍贵的成长瞬间</p>
      </div>

      <FilterBar active={author} onChange={setAuthor} />

      {error && <div className="error-msg">加载失败: {error}</div>}

      {loading ? (
        <div className="loading">正在加载...</div>
      ) : records.length === 0 ? (
        <div className="empty-state">
          <div className="empty-emoji">📸</div>
          <p>还没有记录，快来添加第一条成长记录吧！</p>
        </div>
      ) : (
        <div className="timeline">
          {records.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>
      )}
    </div>
  );
}
