import { useState, useEffect, useCallback } from 'react';
import { useRecords, fetchAvailableYears } from '../hooks/useRecords';
import { RecordCard } from '../components/RecordCard';
import { YearFilter } from '../components/YearFilter';
import { AddRecordModal } from '../components/AddRecordModal';
import './HomePage.css';

export function HomePage() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);

  const { records, loading, error, refetch } = useRecords(year);

  useEffect(() => {
    fetchAvailableYears().then(setAvailableYears);
  }, []);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleModalSuccess = useCallback(() => {
    setShowModal(false);
    refetch();
    fetchAvailableYears().then(setAvailableYears);
  }, [refetch]);

  const openAddModal = () => {
    setShowModal(true);
  };

  return (
    <div className="home-page">
      <div className="hero">
        <h1 className="hero-title">🌟 牛牛的成长记录 🌟</h1>
        <p className="hero-subtitle">记录每一个珍贵的成长瞬间</p>
      </div>

      <div className="toolbar">
        <button className="add-btn" onClick={openAddModal}>
          ➕ 添加记录
        </button>
      </div>

      <YearFilter
        year={year}
        availableYears={availableYears}
        onChange={setYear}
      />

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

      {showModal && (
        <AddRecordModal
          mode="add"
          initialData={null}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
