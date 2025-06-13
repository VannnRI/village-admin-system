-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check users table structure and data
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Check all users
SELECT id, username, email, role, status, created_at 
FROM users 
ORDER BY id;

-- Check citizens table
SELECT id, nik, nama, tanggal_lahir, village_id 
FROM citizens 
ORDER BY id;

-- Insert test data if missing
INSERT INTO users (username, email, password_hash, role, status) 
VALUES 
  ('admin', 'admin@system.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin', 'aktif'),
  ('admin_sukamaju', 'admin@sukamaju.desa.id', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin_desa', 'aktif'),
  ('perangkat_sukamaju', 'perangkat@sukamaju.desa.id', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'perangkat_desa', 'aktif')
ON CONFLICT (username) DO UPDATE SET 
  status = 'aktif',
  updated_at = CURRENT_TIMESTAMP;

-- Insert test citizen if missing
INSERT INTO citizens (village_id, nik, no_kk, nama, tanggal_lahir, alamat, no_telepon) 
VALUES (1, '1234567890123456', '1234567890123456', 'John Doe', '1990-01-15', 'Jl. Merdeka No. 123', '081234567890')
ON CONFLICT (nik) DO NOTHING;

-- Final verification
SELECT 'Users count:' as info, COUNT(*) as count FROM users
UNION ALL
SELECT 'Citizens count:' as info, COUNT(*) as count FROM citizens;
