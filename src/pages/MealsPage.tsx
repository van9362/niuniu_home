import { useState, useEffect, useCallback } from 'react';
import {
  fetchMealOptions, addMealOption, updateMealOption, deleteMealOption,
  fetchMealRecords, addMealRecord, deleteMealRecord, pickRandom,
} from '../hooks/useMeals';
import type { MealOption, MealRecord, MealCategory } from '../types';
import './MealsPage.css';

const categories: MealCategory[] = ['荤菜', '素菜', '主食', '汤', '其他'];

export function MealsPage() {
  // --- State ---
  const [options, setOptions] = useState<MealOption[]>([]);
  const [records, setRecords] = useState<MealRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Lottery
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Add/Edit option modal
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [editingOption, setEditingOption] = useState<MealOption | null>(null);
  const [optionName, setOptionName] = useState('');
  const [optionCat, setOptionCat] = useState<MealCategory>('荤菜');
  const [optionPassword, setOptionPassword] = useState('');
  const [optionError, setOptionError] = useState('');

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'option' | 'record'; id: string } | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  // --- Fetch data ---
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [opts, recs] = await Promise.all([fetchMealOptions(), fetchMealRecords()]);
      setOptions(opts);
      setRecords(recs);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // --- Lottery ---
  const handleLottery = () => {
    if (options.length === 0) return;
    setRolling(true);
    setResult(null);
    let count = 0;
    const max = 15;
    const interval = setInterval(() => {
      const r = pickRandom(options);
      if (r) setResult(r.name);
      count++;
      if (count >= max) {
        clearInterval(interval);
        setRolling(false);
      }
    }, 80);
  };

  const handleSaveRecord = async () => {
    if (!result) return;
    const today = new Date().toISOString().slice(0, 10);
    await addMealRecord(result, today);
    setResult(null);
    loadData();
  };

  // --- Option CRUD ---
  const openAddOption = () => {
    setEditingOption(null);
    setOptionName('');
    setOptionCat('荤菜');
    setOptionPassword('');
    setOptionError('');
    setShowOptionModal(true);
  };

  const openEditOption = (opt: MealOption) => {
    setEditingOption(opt);
    setOptionName(opt.name);
    setOptionCat(opt.category);
    setOptionPassword('');
    setOptionError('');
    setShowOptionModal(true);
  };

  const handleOptionSave = async () => {
    if (!optionName.trim()) return;
    setOptionError('');
    try {
      if (editingOption) {
        await updateMealOption(editingOption.id, optionName.trim(), optionCat, optionPassword);
      } else {
        await addMealOption(optionName.trim(), optionCat, optionPassword);
      }
      setShowOptionModal(false);
      loadData();
    } catch (e: any) {
      setOptionError(e.message);
    }
  };

  // --- Delete ---
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteError('');
    try {
      if (deleteTarget.type === 'option') {
        await deleteMealOption(deleteTarget.id, deletePassword);
      } else {
        await deleteMealRecord(deleteTarget.id, deletePassword);
      }
      setDeleteTarget(null);
      setDeletePassword('');
      loadData();
    } catch (e: any) {
      setDeleteError(e.message);
    }
  };

  // --- Render ---
  if (loading) return <div className="loading">加载中...</div>;

  return (
    <div className="meals-page">
      <h1 className="meals-title">🍚 每日吃饭</h1>

      {/* ===== Lottery ===== */}
      <section className="meal-section lottery-section">
        <h2 className="section-title">🎲 今天吃什么？</h2>
        <div className={`lottery-box ${rolling ? 'rolling' : ''}`}>
          <div className="lottery-result">
            {result || '点击下方按钮开始'}
          </div>
        </div>
        <div className="lottery-actions">
          <button className="lottery-btn" onClick={handleLottery} disabled={rolling || options.length === 0}>
            🎲 随机抽一道
          </button>
          {result && !rolling && (
            <button className="save-record-btn" onClick={handleSaveRecord}>
              📋 记下来
            </button>
          )}
        </div>
      </section>

      {/* ===== Records ===== */}
      <section className="meal-section">
        <h2 className="section-title">📋 吃饭记录</h2>
        {records.length === 0 ? (
          <div className="empty-hint">还没有吃饭记录</div>
        ) : (
          <div className="records-list">
            {records.map((r) => (
              <div key={r.id} className="record-row">
                <span className="record-date">{r.meal_date}</span>
                <span className="record-name">{r.meal_name}</span>
                <button
                  className="icon-btn delete"
                  onClick={() => { setDeleteTarget({ type: 'record', id: r.id }); setDeletePassword(''); setDeleteError(''); }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== Options Library ===== */}
      <section className="meal-section">
        <h2 className="section-title">📚 菜品库</h2>
        <div className="options-grid">
          {categories.map((cat) => {
            const items = options.filter((o) => o.category === cat);
            return (
              <div key={cat} className="category-group">
                <h3 className="category-label">{cat}</h3>
                {items.length === 0 ? (
                  <p className="empty-hint">暂无</p>
                ) : (
                  items.map((opt) => (
                    <div key={opt.id} className="option-row">
                      <span>{opt.name}</span>
                      <div className="option-actions">
                        <button className="icon-btn" onClick={() => openEditOption(opt)}>✏️</button>
                        <button className="icon-btn delete" onClick={() => { setDeleteTarget({ type: 'option', id: opt.id }); setDeletePassword(''); setDeleteError(''); }}>🗑️</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
        <button className="add-option-btn" onClick={openAddOption}>+ 添加菜品</button>
      </section>

      {/* ===== Add/Edit Option Modal ===== */}
      {showOptionModal && (
        <div className="modal-overlay" onClick={() => setShowOptionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <h3>{editingOption ? '✏️ 编辑菜品' : '➕ 添加菜品'}</h3>
              <button className="form-close" onClick={() => setShowOptionModal(false)}>✕</button>
            </div>
            {optionError && <div className="form-error">{optionError}</div>}
            <div className="form-group">
              <label className="form-label">菜名</label>
              <input
                type="text" className="form-input"
                value={optionName}
                onChange={(e) => setOptionName(e.target.value)}
                placeholder="输入菜名"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">类别</label>
              <div className="author-select">
                {categories.map((c) => (
                  <button
                    key={c} type="button"
                    className={`author-option ${optionCat === c ? 'active' : ''}`}
                    onClick={() => setOptionCat(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">🔒 密码</label>
              <input
                type="password" className="form-input"
                value={optionPassword}
                onChange={(e) => setOptionPassword(e.target.value)}
                placeholder="输入密码以保存"
              />
            </div>
            <div className="form-actions">
              <button className="cancel-btn" onClick={() => setShowOptionModal(false)}>取消</button>
              <button className="submit-btn" onClick={handleOptionSave} disabled={!optionName.trim() || !optionPassword}>保存</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Delete Confirm Modal ===== */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <h3>🗑️ 确认删除</h3>
              <button className="form-close" onClick={() => setDeleteTarget(null)}>✕</button>
            </div>
            <p className="confirm-text">确认删除这条记录？</p>
            <div className="form-group">
              <label className="form-label">🔒 密码</label>
              <input
                type="password" className="form-input"
                value={deletePassword}
                onChange={(e) => { setDeletePassword(e.target.value); setDeleteError(''); }}
                placeholder="输入密码确认删除"
                autoFocus
              />
            </div>
            {deleteError && <div className="form-error">{deleteError}</div>}
            <div className="form-actions">
              <button className="cancel-btn" onClick={() => setDeleteTarget(null)}>取消</button>
              <button className="delete-btn" onClick={handleDeleteConfirm} disabled={!deletePassword}>确认删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
