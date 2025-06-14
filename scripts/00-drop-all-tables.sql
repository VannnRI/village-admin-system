-- Script untuk menghapus semua tabel yang ada
-- HATI-HATI: Script ini akan menghapus SEMUA data!

-- Drop semua tabel dalam urutan yang benar (menghindari foreign key constraint)
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS letter_requests CASCADE;
DROP TABLE IF EXISTS letter_archives CASCADE;
DROP TABLE IF EXISTS village_news CASCADE;
DROP TABLE IF EXISTS village_services CASCADE;
DROP TABLE IF EXISTS website_content CASCADE;
DROP TABLE IF EXISTS website_settings CASCADE;
DROP TABLE IF EXISTS village_regulations CASCADE;
DROP TABLE IF EXISTS village_decisions CASCADE;
DROP TABLE IF EXISTS public_facilities CASCADE;
DROP TABLE IF EXISTS financial_reports CASCADE;
DROP TABLE IF EXISTS population_data CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS village_staff CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS citizens CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS villages CASCADE;

-- Hapus semua sequence yang mungkin tersisa
DROP SEQUENCE IF EXISTS villages_id_seq CASCADE;
DROP SEQUENCE IF EXISTS users_id_seq CASCADE;
DROP SEQUENCE IF EXISTS citizens_id_seq CASCADE;
DROP SEQUENCE IF EXISTS letter_requests_id_seq CASCADE;
DROP SEQUENCE IF EXISTS activity_logs_id_seq CASCADE;

SELECT 'All tables dropped successfully' AS status;
