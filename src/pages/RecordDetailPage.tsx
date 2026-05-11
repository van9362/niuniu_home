import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { GrowthRecord } from '../types';
import './RecordDetailPage.css';

const authorInfo: Record<string, { emoji: string; label: string }> = {
  dad: { emoji: '👨', label: '爸爸' },
  mom: { emoji: '👩', label: '妈妈' },
  niuniu: { emoji: '👶', label: '牛牛' },
};

export function RecordDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<GrowthRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('records')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (!error) setRecord(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loading">加载中...</div>;
  if (!record) return <div className="error-msg">记录不存在</div>;

  const author = authorInfo[record.author];
  const displayDate = new Date(record.record_date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="detail-page">
      <Link to="/" className="back-link">← 返回首页</Link>

      <article className="detail-card">
        <h1 className="detail-title">{record.title}</h1>

        <div className="detail-meta">
          <span>📅 {displayDate}</span>
          <span>{author.emoji} {author.label} 记录</span>
        </div>

        {record.images.length > 0 && (
          <div className="detail-images">
            {record.images.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`${record.title} - ${i + 1}`}
                onClick={() => setSelectedImage(url)}
              />
            ))}
          </div>
        )}

        {record.description && (
          <p className="detail-desc">{record.description}</p>
        )}
      </article>

      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="大图" />
          <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
