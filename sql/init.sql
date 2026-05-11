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

-- 4. RLS 策略：只有认证用户可以添加
CREATE POLICY "Authenticated users can insert records" ON records
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 5. RLS 策略：只有认证用户可以更新
CREATE POLICY "Authenticated users can update records" ON records
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 6. RLS 策略：只有认证用户可以删除
CREATE POLICY "Authenticated users can delete records" ON records
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================================
-- 7. 创建 Storage Bucket (在 Supabase Dashboard: Storage > New Bucket)
--    名称: images, 勾选 "Public bucket"
--    或者用 SQL:
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Storage RLS 策略：任何人都可以查看图片
CREATE POLICY "Anyone can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- 9. Storage RLS 策略：认证用户可以上传
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- 10. Storage RLS 策略：认证用户可以删除
CREATE POLICY "Authenticated users can delete images" ON storage.objects
  FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
