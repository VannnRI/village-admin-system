-- Check existing users
SELECT id, username, email, role, status, created_at FROM users;

-- Check if admin user exists
SELECT * FROM users WHERE username = 'admin';

-- If admin doesn't exist, create it
INSERT INTO users (username, email, password_hash, role, status) 
VALUES ('admin', 'admin@system.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin', 'aktif')
ON CONFLICT (username) DO NOTHING;

-- Check if admin_sukamaju exists
SELECT * FROM users WHERE username = 'admin_sukamaju';

-- If admin_sukamaju doesn't exist, create it
INSERT INTO users (username, email, password_hash, role, status) 
VALUES ('admin_sukamaju', 'admin@sukamaju.desa.id', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin_desa', 'aktif')
ON CONFLICT (username) DO NOTHING;

-- Check citizens
SELECT * FROM citizens;

-- Make sure citizen exists for testing
INSERT INTO citizens (village_id, nik, no_kk, nama, tanggal_lahir, alamat, no_telepon) 
VALUES (1, '1234567890123456', '1234567890123456', 'John Doe', '1990-01-15', 'Jl. Merdeka No. 123', '081234567890')
ON CONFLICT (nik) DO NOTHING;

-- Update all users to be active
UPDATE users SET status = 'aktif' WHERE status != 'aktif';
