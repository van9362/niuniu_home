import { supabase } from '../lib/supabase';
import type { MealOption, MealRecord, MealCategory } from '../types';
import { checkPassword } from '../utils/password';

export async function fetchMealOptions(): Promise<MealOption[]> {
  const { data, error } = await supabase
    .from('meal_options')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addMealOption(name: string, category: MealCategory, password: string): Promise<void> {
  if (!checkPassword(password)) throw new Error('密码错误');
  const { error } = await supabase
    .from('meal_options')
    .insert({ name, category });
  if (error) throw error;
}

export async function updateMealOption(id: string, name: string, category: MealCategory, password: string): Promise<void> {
  if (!checkPassword(password)) throw new Error('密码错误');
  const { error } = await supabase
    .from('meal_options')
    .update({ name, category })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteMealOption(id: string, password: string): Promise<void> {
  if (!checkPassword(password)) throw new Error('密码错误');
  const { error } = await supabase
    .from('meal_options')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function fetchMealRecords(): Promise<MealRecord[]> {
  const { data, error } = await supabase
    .from('meal_records')
    .select('*')
    .order('meal_date', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data || [];
}

export async function addMealRecord(mealName: string, mealDate: string): Promise<void> {
  const { error } = await supabase
    .from('meal_records')
    .insert({ meal_name: mealName, meal_date: mealDate });
  if (error) throw error;
}

export async function deleteMealRecord(id: string, password: string): Promise<void> {
  if (!checkPassword(password)) throw new Error('密码错误');
  const { error } = await supabase
    .from('meal_records')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export function pickRandom(options: MealOption[]): MealOption | null {
  if (options.length === 0) return null;
  const index = Math.floor(Math.random() * options.length);
  return options[index];
}
