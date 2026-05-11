import { useState, useEffect } from 'react';
import type { RecordFormData, Author } from '../types';
import type { GrowthRecord } from '../types';
import { addRecord, updateRecord } from '../hooks/useRecords';
import { checkPassword } from '../utils/password';
import './RecordForm.css';

interface RecordFormProps {
  mode: 'add' | 'edit';
  initialData?: GrowthRecord | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const authors: { value: Author; label: string; emoji: string }[] = [
  { value: 'dad', label: '爸爸', emoji: '👨' },
  { value: 'mom', label: '妈妈', emoji: '👩' },
  { value: 'niuniu', label: '牛牛', emoji: '👶' },
];

export function RecordForm({ mode, initialData, onSuccess, onCancel }: RecordFormProps) {
  const [form, setForm] = useState<RecordFormData>({
    title: '',
    description: '',
    images: [],
    existingImages: [],
    record_date: '',
    author: 'niuniu',
  });
  const [previews, setPreviews] = useState<string[]>([]);
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setForm({
        title: initialData.title,
        description: initialData.description,
        images: [],
        existingImages: initialData.images,
        record_date: initialData.record_date,
        author: initialData.author,
      });
      setPreviews([]);
    }
  }, [mode, initialData]);

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

  const removeNewImage = (index: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setForm({
      ...form,
      existingImages: form.existingImages.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.record_date) return;

    if (!checkPassword(password)) {
      setError('密码错误');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      if (mode === 'edit' && initialData) {
        await updateRecord(initialData.id, form);
      } else {
        await addRecord(form);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || '保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="record-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{mode === 'add' ? '✨ 添加成长记录' : '✏️ 编辑成长记录'}</h3>
        <button type="button" className="form-close" onClick={onCancel}>✕</button>
      </div>

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
        <label className="form-label">👤 记录人</label>
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
          {form.existingImages.map((url, i) => (
            <div key={`existing-${i}`} className="preview-item">
              <img src={url} alt={`已有图片 ${i + 1}`} />
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeExistingImage(i)}
              >
                ✕
              </button>
            </div>
          ))}
          {previews.map((src, i) => (
            <div key={`new-${i}`} className="preview-item">
              <img src={src} alt={`预览 ${i + 1}`} />
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeNewImage(i)}
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

      <div className="form-group">
        <label className="form-label">🔒 密码</label>
        <input
          type="password"
          className="form-input"
          placeholder="请输入密码以保存"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          取消
        </button>
        <button
          type="submit"
          className="submit-btn"
          disabled={submitting || !form.title.trim() || !form.record_date || !password}
        >
          {submitting ? '保存中...' : '✨ 保存记录'}
        </button>
      </div>
    </form>
  );
}
