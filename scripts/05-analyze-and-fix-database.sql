-- STEP 1: Analyze current database structure
-- Let's see what tables we actually have
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- STEP 2: Check letter_requests table structure (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'letter_requests') THEN
        RAISE NOTICE 'letter_requests table exists. Checking structure...';
    ELSE
        RAISE NOTICE 'letter_requests table does not exist. Will create it.';
    END IF;
END $$;

-- Show current structure of letter_requests if it exists
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'letter_requests' 
ORDER BY ordinal_position;

-- STEP 3: Drop and recreate letter_requests table with correct structure
-- This ensures we have exactly what we need
DROP TABLE IF EXISTS letter_requests CASCADE;

-- Create letter_requests table with all required columns
CREATE TABLE letter_requests (
    id SERIAL PRIMARY KEY,
    citizen_id INTEGER NOT NULL,
    village_id INTEGER NOT NULL,
    jenis_surat VARCHAR(100) NOT NULL,
    keperluan TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    tanggal_pengajuan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tanggal_disetujui TIMESTAMP,
    disetujui_oleh INTEGER,
    nomor_surat VARCHAR(50),
    alasan_penolakan TEXT,
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraints
ALTER TABLE letter_requests 
ADD CONSTRAINT letter_requests_citizen_id_fkey 
FOREIGN KEY (citizen_id) REFERENCES citizens(id);

ALTER TABLE letter_requests 
ADD CONSTRAINT letter_requests_village_id_fkey 
FOREIGN KEY (village_id) REFERENCES villages(id);

ALTER TABLE letter_requests 
ADD CONSTRAINT letter_requests_disetujui_oleh_fkey 
FOREIGN KEY (disetujui_oleh) REFERENCES users(id);

-- STEP 4: Insert sample data with correct column names
INSERT INTO letter_requests (
    citizen_id,
    village_id,
    jenis_surat,
    keperluan,
    status,
    tanggal_pengajuan,
    catatan
) VALUES 
(
    1, -- Budi Santoso
    1, -- Village Sukamaju
    'Surat Keterangan Tidak Mampu',
    'Untuk keperluan beasiswa pendidikan anak',
    'pending',
    CURRENT_TIMESTAMP,
    'Permohonan surat keterangan tidak mampu untuk anak yang akan melanjutkan kuliah'
),
(
    2, -- Siti Aminah
    1, -- Village Sukamaju
    'Surat Keterangan Domisili',
    'Untuk keperluan pembuatan KTP baru',
    'pending',
    CURRENT_TIMESTAMP,
    'Permohonan surat keterangan domisili karena pindah alamat'
),
(
    3, -- Ahmad Rahman
    1, -- Village Sukamaju
    'Surat Keterangan Usaha',
    'Untuk keperluan pengajuan kredit usaha',
    'approved',
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    'Permohonan surat keterangan usaha untuk modal dagang'
);

-- Update the approved letter with approval details
UPDATE letter_requests 
SET 
    tanggal_disetujui = CURRENT_TIMESTAMP - INTERVAL '1 day',
    disetujui_oleh = 2, -- admin_sukamaju
    nomor_surat = 'SKU/001/12/2024'
WHERE id = 3;

-- STEP 5: Verify the final structure and data
SELECT 'Final table structure:' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'letter_requests' 
ORDER BY ordinal_position;

-- Show foreign key constraints
SELECT 'Foreign key constraints:' as info;
SELECT 
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'letter_requests';

-- Verify sample data with joins
SELECT 'Sample data verification:' as info;
SELECT 
    lr.id,
    lr.jenis_surat,
    lr.keperluan,
    lr.status,
    lr.tanggal_pengajuan,
    c.nama as nama_pemohon,
    c.nik as nik_pemohon,
    v.name as nama_desa,
    CASE 
        WHEN lr.disetujui_oleh IS NOT NULL THEN u.username 
        ELSE NULL 
    END as disetujui_oleh_user
FROM letter_requests lr
JOIN citizens c ON lr.citizen_id = c.id
JOIN villages v ON lr.village_id = v.id
LEFT JOIN users u ON lr.disetujui_oleh = u.id
ORDER BY lr.id;

-- Final success message
SELECT 'Database analysis and fix completed successfully!' as status,
       'letter_requests table has been recreated with proper structure' as details;
