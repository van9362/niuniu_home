export type Author = 'dad' | 'mom' | 'niuniu';

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
  record_date: string;
  author: Author;
}
