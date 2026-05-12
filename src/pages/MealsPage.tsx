import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchMealOptions, fetchMealRecords, addMealRecord, deleteMealRecord, pickRandom,
} from '../hooks/useMeals';
import type { MealOption, MealRecord } from '../types';
import './MealsPage.css';

export function MealsPage() {
  const [options, setOptions] = useState<MealOption[]>([]);
  const [records, setRecords] = useState<MealRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<MealRecord | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [opts, recs] = await Promise.all([fetchMealOptions(), fetchMealRecords()]);
      setOptions(opts);
      setRecords(recs);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteError('');
    try {
      await deleteMealRecord(deleteTarget.id, deletePassword);
      setDeleteTarget(null);
      setDeletePassword('');
      loadData();
    } catch (e: any) {
      setDeleteError(e.message);
    }
  };

  if (loading) return <div className="loading">加载中...</div>;

  return (
    <div className="meals-page">
      <div className="title-row">
        <h1 className="meals-title">🍚 每日吃饭</h1>
        <Link to="/library" className="library-link">📚 菜品库</Link>
      </div>

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
                  onClick={() => { setDeleteTarget(r); setDeletePassword(''); setDeleteError(''); }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <h3>🗑️ 确认删除</h3>
              <button className="form-close" onClick={() => setDeleteTarget(null)}>✕</button>
            </div>
            <p className="confirm-text">确认删除「{deleteTarget.meal_name}」？</p>
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
