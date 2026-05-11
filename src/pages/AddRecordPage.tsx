import { useNavigate } from 'react-router-dom';
import { RecordForm } from '../components/RecordForm';
import './AddRecordPage.css';

export function AddRecordPage() {
  const navigate = useNavigate();

  return (
    <div className="add-record-page">
      <h2 className="page-title">✨ 添加成长记录</h2>
      <RecordForm onSuccess={() => navigate('/')} />
    </div>
  );
}
