-- Fix letter_requests table relations and add sample data
-- This script ensures proper foreign key relationships

-- First, let's check if the foreign key constraints exist and add them if missing
DO $$
BEGIN
    -- Add foreign key constraint for citizen_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'letter_requests_citizen_id_fkey'
        AND table_name = 'letter_requests'
    ) THEN
        ALTER TABLE letter_requests 
        ADD CONSTRAINT letter_requests_citizen_id_fkey 
        FOREIGN KEY (citizen_id) REFERENCES citizens(id);
    END IF;

    -- Add foreign key constraint for village_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'letter_requests_village_id_fkey'
        AND table_name = 'letter_requests'
    ) THEN
        ALTER TABLE letter_requests 
        ADD CONSTRAINT letter_requests_village_id_fkey 
        FOREIGN KEY (village_id) REFERENCES villages(id);
    END IF;

    -- Add foreign key constraint for approved_by if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'letter_requests_approved_by_fkey'
        AND table_name = 'letter_requests'
    ) THEN
        ALTER TABLE letter_requests 
        ADD CONSTRAINT letter_requests_approved_by_fkey 
        FOREIGN KEY (approved_by) REFERENCES users(id);
    END IF;
END $$;

-- Clear existing sample data to avoid duplicates
DELETE FROM letter_requests WHERE id IN (1, 2);

-- Insert sample letter requests
INSERT INTO letter_requests (
    id,
    citizen_id,
    village_id,
    letter_type,
    purpose,
    status,
    request_date,
    notes
) VALUES 
(
    1,
    1, -- Budi Santoso
    1, -- Village Sukamaju
    'SKTM',
    'Untuk keperluan beasiswa pendidikan',
    'pending',
    CURRENT_TIMESTAMP,
    'Permohonan surat keterangan tidak mampu untuk anak yang akan melanjutkan kuliah'
),
(
    2,
    2, -- Siti Aminah
    1, -- Village Sukamaju
    'Surat Keterangan Domisili',
    'Untuk keperluan pembuatan KTP',
    'pending',
    CURRENT_TIMESTAMP,
    'Permohonan surat keterangan domisili karena pindah alamat'
);

-- Verify the data was inserted correctly
SELECT 
    lr.id,
    lr.letter_type,
    lr.purpose,
    lr.status,
    c.nama as citizen_name,
    c.nik as citizen_nik,
    v.name as village_name
FROM letter_requests lr
JOIN citizens c ON lr.citizen_id = c.id
JOIN villages v ON lr.village_id = v.id
ORDER BY lr.id;

-- Show table constraints to verify foreign keys
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
    AND tc.table_name = 'letter_requests'
ORDER BY tc.constraint_name;

-- Final verification message
SELECT 'Letter requests table relations have been fixed successfully!' as status;
