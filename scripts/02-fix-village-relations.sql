-- Script untuk memperbaiki relasi village dan user admin_desa

-- Pastikan village ada dan benar
UPDATE villages SET 
    nama = 'Sukamaju',
    kode_pos = '16710',
    kecamatan = 'Sukamaju',
    kabupaten = 'Bogor',
    provinsi = 'Jawa Barat',
    status = 'aktif',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Pastikan admin_desa terhubung dengan village yang benar
UPDATE users SET 
    village_id = 1,
    status = 'aktif',
    updated_at = CURRENT_TIMESTAMP
WHERE username = 'admin_sukamaju';

-- Pastikan perangkat_desa juga terhubung dengan village yang benar
UPDATE users SET 
    village_id = 1,
    status = 'aktif',
    updated_at = CURRENT_TIMESTAMP
WHERE username = 'perangkat_sukamaju';

-- Pastikan citizens terhubung dengan village yang benar
UPDATE citizens SET 
    village_id = 1,
    updated_at = CURRENT_TIMESTAMP
WHERE village_id IS NULL OR village_id != 1;

-- Verifikasi data
SELECT 'Village Data:' as info;
SELECT id, nama, kecamatan, kabupaten, provinsi, status FROM villages WHERE id = 1;

SELECT 'Admin Users:' as info;
SELECT id, username, role, village_id, status FROM users WHERE role IN ('admin_desa', 'perangkat_desa');

SELECT 'Citizens Count:' as info;
SELECT village_id, COUNT(*) as total_citizens FROM citizens GROUP BY village_id;

-- Test query yang biasa digunakan di aplikasi
SELECT 'Test Admin Village Query:' as info;
SELECT u.id as user_id, u.username, u.role, v.id as village_id, v.nama as village_name
FROM users u
LEFT JOIN villages v ON u.village_id = v.id
WHERE u.username = 'admin_sukamaju';
