-- ============================================================
-- 牛牛成长记录 - 数据库初始化 SQL
-- 在 Supabase SQL Editor 中运行此脚本
-- ============================================================

-- 1. 创建 records 表
CREATE TABLE IF NOT EXISTS records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',
  record_date DATE NOT NULL,
  author TEXT NOT NULL CHECK (author IN ('dad', 'mom', 'niuniu')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 开启 Row Level Security
ALTER TABLE records ENABLE ROW LEVEL SECURITY;

-- 3. RLS 策略：任何人都可以查看
CREATE POLICY "Anyone can read records" ON records
  FOR SELECT USING (true);

-- 4. RLS 策略：任何人都可以添加（前端密码保护）
CREATE POLICY "Anyone can insert records" ON records
  FOR INSERT WITH CHECK (true);

-- 5. RLS 策略：任何人都可以更新（前端密码保护）
CREATE POLICY "Anyone can update records" ON records
  FOR UPDATE USING (true);

-- 6. RLS 策略：任何人都可以删除（前端密码保护）
CREATE POLICY "Anyone can delete records" ON records
  FOR DELETE USING (true);

-- ============================================================
-- 7. Storage Bucket
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Storage RLS 策略：任何人都可以查看图片
CREATE POLICY "Anyone can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- 9. Storage RLS 策略：任何人都可以上传
CREATE POLICY "Anyone can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images');

-- 10. Storage RLS 策略：任何人都可以删除
CREATE POLICY "Anyone can delete images" ON storage.objects
  FOR DELETE USING (bucket_id = 'images');
