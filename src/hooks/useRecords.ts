import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { GrowthRecord, Author, RecordFormData } from '../types';
import { compressImage } from '../utils/compressImage';

export function useRecords(filterAuthor?: Author | 'all') {
  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('records')
        .select('*')
        .order('record_date', { ascending: false });

      if (filterAuthor && filterAuthor !== 'all') {
        query = query.eq('author', filterAuthor);
      }

      const { data, error: err } = await query;
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
  }, [filterAuthor]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return { records, loading, error, refetch: fetchRecords };
}

export async function uploadImages(files: File[]): Promise<string[]> {
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
