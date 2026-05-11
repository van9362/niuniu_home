import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { deleteRecord } from '../hooks/useRecords';
import { AddRecordModal } from '../components/AddRecordModal';
import { checkPassword } from '../utils/password';
import type { GrowthRecord } from '../types';
import './RecordDetailPage.css';

const authorInfo: Record<string, { emoji: string; label: string }> = {
  dad: { emoji: '👨', label: '爸爸' },
  mom: { emoji: '👩', label: '妈妈' },
  niuniu: { emoji: '👶', label: '牛牛' },
};

export function RecordDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<GrowthRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchRecord = () => {
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
  };

  useEffect(() => {
    fetchRecord();
  }, [id]);

  const handleDelete = async () => {
    if (!checkPassword(deletePassword)) {
      setDeleteError('密码错误');
      return;
    }
    setDeleting(true);
    try {
      await deleteRecord(id!);
      navigate('/');
    } catch (err: any) {
      setDeleteError(err.message || '删除失败');
    } finally {
      setDeleting(false);
    }
  };

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

        <div className="detail-actions">
          <button className="action-btn edit" onClick={() => setShowEditModal(true)}>
            ✏️ 编辑
          </button>
          <button className="action-btn delete" onClick={() => setShowDeleteConfirm(true)}>
            🗑️ 删除
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="delete-confirm">
            <p>确认删除这条记录？</p>
            <input
              type="password"
              className="form-input"
              placeholder="请输入密码"
              value={deletePassword}
              onChange={(e) => { setDeletePassword(e.target.value); setDeleteError(''); }}
            />
            {deleteError && <span className="delete-error">{deleteError}</span>}
            <div className="delete-btns">
              <button
                className="cancel-btn"
                onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); setDeleteError(''); }}
              >
                取消
              </button>
              <button className="delete-btn" onClick={handleDelete} disabled={deleting || !deletePassword}>
                {deleting ? '删除中...' : '确认删除'}
              </button>
            </div>
          </div>
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

      {showEditModal && (
        <AddRecordModal
          mode="edit"
          initialData={record}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => { setShowEditModal(false); fetchRecord(); }}
        />
      )}
    </div>
  );
}
