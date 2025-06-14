-- Script untuk memperbaiki relasi letter_requests dengan aman
-- Jalankan satu bagian per satu jika ada error

-- 1. Cek struktur tabel yang ada
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('letter_requests', 'citizens', 'users')
ORDER BY table_name, ordinal_position;

-- 2. Tambahkan kolom yang mungkin hilang (jika belum ada)
DO $$ 
BEGIN
    -- Tambah kolom no_surat jika belum ada
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'letter_requests' AND column_name = 'no_surat'
    ) THEN
        ALTER TABLE letter_requests ADD COLUMN no_surat VARCHAR(50);
    END IF;
    
    -- Tambah kolom approved_by jika belum ada
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'letter_requests' AND column_name = 'approved_by'
    ) THEN
        ALTER TABLE letter_requests ADD COLUMN approved_by INTEGER;
    END IF;
    
    -- Tambah kolom approved_at jika belum ada
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'letter_requests' AND column_name = 'approved_at'
    ) THEN
        ALTER TABLE letter_requests ADD COLUMN approved_at TIMESTAMP;
    END IF;
    
    -- Tambah kolom rejection_reason jika belum ada
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'letter_requests' AND column_name = 'rejection_reason'
    ) THEN
        ALTER TABLE letter_requests ADD COLUMN rejection_reason TEXT;
    END IF;
END $$;

-- 3. Tambahkan foreign key constraints dengan aman
DO $$
BEGIN
    -- Foreign key ke citizens
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_letter_requests_citizen_id'
    ) THEN
        ALTER TABLE letter_requests 
        ADD CONSTRAINT fk_letter_requests_citizen_id 
        FOREIGN KEY (citizen_id) REFERENCES citizens(id);
    END IF;
    
    -- Foreign key ke users untuk approved_by
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_letter_requests_approved_by'
    ) THEN
        ALTER TABLE letter_requests 
        ADD CONSTRAINT fk_letter_requests_approved_by 
        FOREIGN KEY (approved_by) REFERENCES users(id);
    END IF;
    
    -- Foreign key ke villages
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_letter_requests_village_id'
    ) THEN
        ALTER TABLE letter_requests 
        ADD CONSTRAINT fk_letter_requests_village_id 
        FOREIGN KEY (village_id) REFERENCES villages(id);
    END IF;
END $$;

-- 4. Insert sample data dengan aman
INSERT INTO letter_requests (
    village_id, 
    citizen_id, 
    jenis_surat, 
    tujuan_permohonan, 
    status,
    created_at,
    updated_at
) VALUES 
(1, 1, 'Surat Keterangan Tidak Mampu', 'Untuk bantuan sosial', 'pending', NOW(), NOW()),
(1, 2, 'Surat Keterangan Domisili', 'Untuk keperluan administrasi', 'pending', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 5. Verifikasi data
SELECT 
    lr.id,
    lr.jenis_surat,
    lr.status,
    c.nama as nama_pemohon,
    c.nik,
    v.nama as nama_desa
FROM letter_requests lr
JOIN citizens c ON lr.citizen_id = c.id
JOIN villages v ON lr.village_id = v.id
ORDER BY lr.created_at DESC;

-- 6. Cek foreign key constraints
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'letter_requests';
