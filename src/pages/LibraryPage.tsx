import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchMealOptions, addMealOption, updateMealOption, deleteMealOption,
} from '../hooks/useMeals';
import type { MealOption } from '../types';
import './LibraryPage.css';

export function LibraryPage() {
  const [options, setOptions] = useState<MealOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<MealOption | null>(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<MealOption | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setOptions(await fetchMealOptions()); } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setEditing(null); setName(''); setPassword(''); setError(''); setShowModal(true);
  };

  const openEdit = (opt: MealOption) => {
    setEditing(opt); setName(opt.name); setPassword(''); setError(''); setShowModal(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setError('');
    try {
      if (editing) {
        await updateMealOption(editing.id, name.trim(), password);
      } else {
        await addMealOption(name.trim(), password);
      }
      setShowModal(false);
      load();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteError('');
    try {
      await deleteMealOption(deleteTarget.id, deletePassword);
      setDeleteTarget(null);
      setDeletePassword('');
      load();
    } catch (e: any) {
      setDeleteError(e.message);
    }
  };

  if (loading) return <div className="loading">加载中...</div>;

  return (
    <div className="library-page">
      <Link to="/meals" className="back-link">← 返回吃饭</Link>
      <h1 className="library-title">📚 菜品库</h1>

      <button className="add-btn" onClick={openAdd}>+ 添加菜品</button>

      {options.length === 0 ? (
        <div className="empty-state">还没有菜品，快添加吧</div>
      ) : (
        <div className="option-list">
          {options.map((opt) => (
            <div key={opt.id} className="option-row">
              <span className="option-name">{opt.name}</span>
              <div className="option-actions">
                <button className="icon-btn" onClick={() => openEdit(opt)}>✏️</button>
                <button className="icon-btn delete" onClick={() => { setDeleteTarget(opt); setDeletePassword(''); setDeleteError(''); }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <h3>{editing ? '✏️ 编辑菜品' : '➕ 添加菜品'}</h3>
              <button className="form-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            {error && <div className="form-error">{error}</div>}
            <div className="form-group">
              <label className="form-label">菜名</label>
              <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="输入菜名" autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">🔒 密码</label>
              <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="输入密码以保存" />
            </div>
            <div className="form-actions">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>取消</button>
              <button className="submit-btn" onClick={handleSave} disabled={!name.trim() || !password}>保存</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <h3>🗑️ 确认删除</h3>
              <button className="form-close" onClick={() => setDeleteTarget(null)}>✕</button>
            </div>
            <p className="confirm-text">确认删除「{deleteTarget.name}」？</p>
            <div className="form-group">
              <label className="form-label">🔒 密码</label>
              <input type="password" className="form-input" value={deletePassword} onChange={(e) => { setDeletePassword(e.target.value); setDeleteError(''); }} placeholder="输入密码确认删除" autoFocus />
            </div>
            {deleteError && <div className="form-error">{deleteError}</div>}
            <div className="form-actions">
              <button className="cancel-btn" onClick={() => setDeleteTarget(null)}>取消</button>
              <button className="delete-btn" onClick={handleDelete} disabled={!deletePassword}>确认删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
