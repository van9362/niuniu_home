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

export type MealCategory = '荤菜' | '素菜' | '主食' | '汤' | '其他';

export interface MealOption {
  id: string;
  name: string;
  category: MealCategory;
  created_at: string;
}

export interface MealRecord {
  id: string;
  meal_name: string;
  meal_date: string;
  created_at: string;
}
