-- Check what tables actually exist
SELECT 'Current tables in database:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check actual structure of letter_requests table
SELECT 'Actual structure of letter_requests table:' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'letter_requests' 
ORDER BY ordinal_position;

-- Show sample data to understand the current structure
SELECT 'Sample data from letter_requests:' as info;
SELECT * FROM letter_requests LIMIT 3;

-- If the table structure is different, let's standardize it
-- First, let's see what columns we actually have
DO $$
DECLARE
    col_exists boolean;
BEGIN
    -- Check if tanggal_pengajuan exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'letter_requests' AND column_name = 'tanggal_pengajuan'
    ) INTO col_exists;
    
    IF col_exists THEN
        RAISE NOTICE 'Column tanggal_pengajuan exists';
    ELSE
        RAISE NOTICE 'Column tanggal_pengajuan does NOT exist';
        
        -- Check what date columns we have
        RAISE NOTICE 'Available date columns:';
        FOR col_exists IN 
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'letter_requests' 
            AND (data_type = 'timestamp without time zone' OR data_type = 'timestamp with time zone' OR data_type = 'date')
        LOOP
            RAISE NOTICE 'Found date column: %', col_exists;
        END LOOP;
    END IF;
END $$;
