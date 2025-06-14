-- Simple table structure check without complex logic

-- Check what tables exist
SELECT 'Available tables:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check letter_requests table structure if it exists
SELECT 'letter_requests table structure:' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'letter_requests' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if letter_requests table has any data
SELECT 'letter_requests data count:' as info;
SELECT COUNT(*) as total_records 
FROM letter_requests;

-- Show sample data if exists
SELECT 'Sample letter_requests data:' as info;
SELECT * FROM letter_requests LIMIT 3;

-- Check citizens table structure
SELECT 'citizens table structure:' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'citizens' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check villages table structure  
SELECT 'villages table structure:' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'villages' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check users table structure
SELECT 'users table structure:' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
    AND table_schema = 'public'
ORDER BY ordinal_position;
