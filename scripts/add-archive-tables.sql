-- Script untuk menambahkan tabel arsip yang hilang
-- Jalankan setelah database utama sudah dibuat

-- 1. Tabel untuk Peraturan Desa
CREATE TABLE IF NOT EXISTS village_regulations (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    nomor_peraturan VARCHAR(100) NOT NULL,
    tanggal_peraturan DATE NOT NULL,
    nomor_kesepakatan VARCHAR(100) NOT NULL,
    tanggal_kesepakatan DATE NOT NULL,
    tentang TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel untuk Keputusan Desa
CREATE TABLE IF NOT EXISTS village_decisions (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    nomor_keputusan VARCHAR(100) NOT NULL,
    tanggal_keputusan DATE NOT NULL,
    nomor_diundangkan VARCHAR(100) NOT NULL,
    tanggal_diundangkan DATE NOT NULL,
    tentang TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disable RLS
ALTER TABLE village_regulations DISABLE ROW LEVEL SECURITY;
ALTER TABLE village_decisions DISABLE ROW LEVEL SECURITY;

-- Sample data untuk testing
INSERT INTO village_regulations (village_id, nomor_peraturan, tanggal_peraturan, nomor_kesepakatan, tanggal_kesepakatan, tentang, created_by) VALUES
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'PERDES/001/2024', '2024-01-15', 'KESP/001/2024', '2024-01-10', 'Peraturan Desa tentang Anggaran Pendapatan dan Belanja Desa Tahun 2024', (SELECT id FROM users WHERE username = 'admin_sukamaju')),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'PERDES/002/2024', '2024-02-20', 'KESP/002/2024', '2024-02-15', 'Peraturan Desa tentang Retribusi Pelayanan Administrasi', (SELECT id FROM users WHERE username = 'admin_sukamaju'));

INSERT INTO village_decisions (village_id, nomor_keputusan, tanggal_keputusan, nomor_diundangkan, tanggal_diundangkan, tentang, created_by) VALUES
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'KEPDES/001/2024', '2024-01-20', 'UND/001/2024', '2024-01-25', 'Keputusan Kepala Desa tentang Penetapan Perangkat Desa', (SELECT id FROM users WHERE username = 'admin_sukamaju')),
((SELECT id FROM villages WHERE nama = 'Sukamaju'), 'KEPDES/002/2024', '2024-03-10', 'UND/002/2024', '2024-03-15', 'Keputusan Kepala Desa tentang Pembentukan Tim Pelaksana Program Desa', (SELECT id FROM users WHERE username = 'admin_sukamaju'));

-- Verifikasi
SELECT 'Tabel arsip berhasil dibuat!' as status;
SELECT 'Peraturan Desa: ' || COUNT(*) as count FROM village_regulations;
SELECT 'Keputusan Desa: ' || COUNT(*) as count FROM village_decisions;
