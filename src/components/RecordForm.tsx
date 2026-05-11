import { useState } from 'react';
import type { RecordFormData, Author } from '../types';
import { addRecord } from '../hooks/useRecords';
import './RecordForm.css';

interface RecordFormProps {
  onSuccess: () => void;
}

const authors: { value: Author; label: string; emoji: string }[] = [
  { value: 'dad', label: '爸爸', emoji: '👨' },
  { value: 'mom', label: '妈妈', emoji: '👩' },
  { value: 'niuniu', label: '牛牛', emoji: '👶' },
];

export function RecordForm({ onSuccess }: RecordFormProps) {
  const [form, setForm] = useState<RecordFormData>({
    title: '',
    description: '',
    images: [],
    record_date: '',
    author: 'niuniu',
  });
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setForm({ ...form, images: [...form.images, ...files] });
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (index: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.record_date) return;
    setSubmitting(true);
    setError(null);
    try {
      await addRecord(form);
      onSuccess();
    } catch (err: any) {
      setError(err.message || '添加失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="record-form" onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label className="form-label">📝 标题</label>
        <input
          type="text"
          className="form-input"
          placeholder="记录这一刻..."
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">📖 描述</label>
        <textarea
          className="form-textarea"
          placeholder="详细描述一下发生了什么..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
        />
      </div>

      <div className="form-group">
        <label className="form-label">📅 成长时间</label>
        <input
          type="date"
          className="form-input"
          value={form.record_date}
          onChange={(e) => setForm({ ...form, record_date: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">👤 添加人</label>
        <div className="author-select">
          {authors.map((a) => (
            <button
              key={a.value}
              type="button"
              className={`author-option ${form.author === a.value ? 'active' : ''}`}
              onClick={() => setForm({ ...form, author: a.value })}
            >
              <span className="author-emoji">{a.emoji}</span>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">🖼️ 图片</label>
        <div className="image-upload-area">
          {previews.map((src, i) => (
            <div key={i} className="preview-item">
              <img src={src} alt={`预览 ${i + 1}`} />
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeImage(i)}
              >
                ✕
              </button>
            </div>
          ))}
          <label className="upload-btn">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              hidden
            />
            <span className="upload-placeholder">+<br />添加图片</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="submit-btn"
        disabled={submitting || !form.title.trim() || !form.record_date}
      >
        {submitting ? '添加中...' : '✨ 保存记录'}
      </button>
    </form>
  );
}
