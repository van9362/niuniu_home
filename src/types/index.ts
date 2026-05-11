export type Author = 'dad' | 'mom' | 'niuniu';

export type RecordFormMode = 'add' | 'edit';

export interface GrowthRecord {
  id: string;
  title: string;
  description: string;
  images: string[];
  record_date: string;
  author: Author;
  created_at: string;
}

export interface RecordFormData {
  title: string;
  description: string;
  images: File[];
  existingImages: string[];
  record_date: string;
  author: Author;
}
