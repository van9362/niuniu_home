import { RecordForm } from './RecordForm';
import type { GrowthRecord } from '../types';
import './AddRecordModal.css';

interface AddRecordModalProps {
  mode: 'add' | 'edit';
  initialData?: GrowthRecord | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddRecordModal({ mode, initialData, onClose, onSuccess }: AddRecordModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <RecordForm
          mode={mode}
          initialData={initialData}
          onSuccess={onSuccess}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
