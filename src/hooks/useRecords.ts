import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { GrowthRecord, RecordFormData } from '../types';
import { compressImage } from '../utils/compressImage';

export function useRecords(year: number) {
  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;

      const { data, error: err } = await supabase
        .from('records')
        .select('*')
        .gte('record_date', startDate)
        .lte('record_date', endDate)
        .order('record_date', { ascending: false });

      if (err) {
        setError(err.message);
      } else {
        setRecords(data || []);
        setError(null);
      }
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [year]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return { records, loading, error, refetch: fetchRecords };
}

async function uploadImages(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const compressed = await compressImage(file);
    const fileName = `${Date.now()}_${crypto.randomUUID()}.jpg`;
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, compressed);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);
    urls.push(publicUrl);
  }
  return urls;
}

export async function addRecord(data: RecordFormData): Promise<void> {
  const imageUrls = await uploadImages(data.images);
  const { error } = await supabase
    .from('records')
    .insert({
      title: data.title,
      description: data.description,
      images: imageUrls,
      record_date: data.record_date,
      author: data.author,
    });
  if (error) throw error;
}

export async function updateRecord(id: string, data: RecordFormData): Promise<void> {
  const newUrls = await uploadImages(data.images);
  const allImages = [...data.existingImages, ...newUrls];
  const { error } = await supabase
    .from('records')
    .update({
      title: data.title,
      description: data.description,
      images: allImages,
      record_date: data.record_date,
      author: data.author,
    })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteRecord(id: string): Promise<void> {
  const { error } = await supabase
    .from('records')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function fetchAvailableYears(): Promise<number[]> {
  const { data, error } = await supabase
    .from('records')
    .select('record_date');
  if (error || !data) return [];
  const years = new Set<number>();
  data.forEach((r: any) => {
    const y = new Date(r.record_date).getFullYear();
    years.add(y);
  });
  return Array.from(years).sort((a, b) => b - a);
}
