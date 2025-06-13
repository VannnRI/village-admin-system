-- Drop existing tables and recreate with new structure
DROP TABLE IF EXISTS village_regulations CASCADE;
DROP TABLE IF EXISTS village_decisions CASCADE;

-- Create village_regulations table with new structure
CREATE TABLE village_regulations (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    nomor_peraturan VARCHAR(100) NOT NULL,
    tanggal_peraturan DATE NOT NULL,
    nomor_kesepakatan VARCHAR(100) NOT NULL,
    tanggal_kesepakatan DATE NOT NULL,
    tentang TEXT NOT NULL,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'aktif'
);

-- Create village_decisions table with new structure  
CREATE TABLE village_decisions (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    nomor_keputusan VARCHAR(100) NOT NULL,
    tanggal_keputusan DATE NOT NULL,
    nomor_diundangkan VARCHAR(100) NOT NULL,
    tanggal_diundangkan DATE NOT NULL,
    tentang TEXT NOT NULL,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'aktif'
);

-- Insert sample data for village_regulations
INSERT INTO village_regulations (village_id, nomor_peraturan, tanggal_peraturan, nomor_kesepakatan, tanggal_kesepakatan, tentang, created_by) VALUES
(1, 'PERDES NO. 01/2024', '2024-01-15', 'KESEP NO. 01/2024', '2024-01-10', 'Anggaran Pendapatan dan Belanja Desa Tahun 2024', 2),
(1, 'PERDES NO. 02/2024', '2024-02-20', 'KESEP NO. 02/2024', '2024-02-15', 'Pembentukan Badan Usaha Milik Desa', 2),
(1, 'PERDES NO. 03/2024', '2024-03-10', 'KESEP NO. 03/2024', '2024-03-05', 'Tata Tertib Penggunaan Balai Desa', 2);

-- Insert sample data for village_decisions
INSERT INTO village_decisions (village_id, nomor_keputusan, tanggal_keputusan, nomor_diundangkan, tanggal_diundangkan, tentang, created_by) VALUES
(1, 'KEPDES NO. 01/2024', '2024-01-20', 'LEMBARAN NO. 01/2024', '2024-01-25', 'Penetapan Pengurus Karang Taruna Periode 2024-2027', 2),
(1, 'KEPDES NO. 02/2024', '2024-02-15', 'LEMBARAN NO. 02/2024', '2024-02-20', 'Pembentukan Tim Pelaksana Kegiatan Pembangunan Jalan', 2),
(1, 'KEPDES NO. 03/2024', '2024-03-05', 'LEMBARAN NO. 03/2024', '2024-03-10', 'Penetapan Tarif Retribusi Pasar Desa', 2);

-- Create indexes for better performance
CREATE INDEX idx_village_regulations_village_id ON village_regulations(village_id);
CREATE INDEX idx_village_decisions_village_id ON village_decisions(village_id);
