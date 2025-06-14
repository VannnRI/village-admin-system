-- Fix letter_requests table structure and add missing columns
-- This script will add missing columns and then create proper relations

-- First, let's check the current structure of letter_requests table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'letter_requests' 
ORDER BY ordinal_position;

-- Add missing columns to letter_requests table if they don't exist
DO $$
BEGIN
    -- Add approved_by column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'letter_requests' AND column_name = 'approved_by'
    ) THEN
        ALTER TABLE letter_requests ADD COLUMN approved_by INTEGER;
    END IF;

    -- Add approved_date column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'letter_requests' AND column_name = 'approved_date'
    ) THEN
        ALTER TABLE letter_requests ADD COLUMN approved_date TIMESTAMP;
    END IF;

    -- Add rejection_reason column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'letter_requests' AND column_name = 'rejection_reason'
    ) THEN
        ALTER TABLE letter_requests ADD COLUMN rejection_reason TEXT;
    END IF;

    -- Add no_surat column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'letter_requests' AND column_name = 'no_surat'
    ) THEN
        ALTER TABLE letter_requests ADD COLUMN no_surat VARCHAR(50);
    END IF;

    -- Add jenis_surat column if it doesn't exist (for compatibility)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'letter_requests' AND column_name = 'jenis_surat'
    ) THEN
        ALTER TABLE letter_requests ADD COLUMN jenis_surat VARCHAR(100);
    END IF;

    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'letter_requests' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE letter_requests ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;

    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'letter_requests' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE letter_requests ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Now add the foreign key constraints
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

-- Update existing data to have proper jenis_surat values
UPDATE letter_requests 
SET jenis_surat = letter_type 
WHERE jenis_surat IS NULL AND letter_type IS NOT NULL;

-- Clear existing sample data to avoid duplicates
DELETE FROM letter_requests WHERE id IN (1, 2);

-- Insert sample letter requests with all required fields
INSERT INTO letter_requests (
    id,
    citizen_id,
    village_id,
    letter_type,
    jenis_surat,
    purpose,
    status,
    request_date,
    created_at,
    notes
) VALUES 
(
    1,
    1, -- Budi Santoso
    1, -- Village Sukamaju
    'SKTM',
    'Surat Keterangan Tidak Mampu',
    'Untuk keperluan beasiswa pendidikan',
    'pending',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'Permohonan surat keterangan tidak mampu untuk anak yang akan melanjutkan kuliah'
),
(
    2,
    2, -- Siti Aminah
    1, -- Village Sukamaju
    'Domisili',
    'Surat Keterangan Domisili',
    'Untuk keperluan pembuatan KTP',
    'pending',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'Permohonan surat keterangan domisili karena pindah alamat'
);

-- Show the updated table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'letter_requests' 
ORDER BY ordinal_position;

-- Verify the data was inserted correctly
SELECT 
    lr.id,
    lr.letter_type,
    lr.jenis_surat,
    lr.purpose,
    lr.status,
    c.nama as citizen_name,
    c.nik as citizen_nik,
    v.name as village_name
FROM letter_requests lr
JOIN citizens c ON lr.citizen_id = c.id
JOIN villages v ON lr.village_id = v.id
ORDER BY lr.id;

-- Show foreign key constraints
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

-- Final success message
SELECT 'Letter requests table structure has been fixed successfully!' as status;
