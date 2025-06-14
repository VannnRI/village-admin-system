-- Update enum type for 'role' in 'users' table
-- Drop the existing constraint if it exists
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Recreate the role ENUM or modify CHECK constraint
-- Option 1: If using ENUM type (PostgreSQL specific)
-- First, add new values to the existing ENUM type if it's already an ENUM
-- ALTER TYPE user_role_enum ADD VALUE IF NOT EXISTS 'perangkat_desa';
-- ALTER TYPE user_role_enum ADD VALUE IF NOT EXISTS 'masyarakat';
-- Then, ensure the column uses this type.

-- Option 2: If using CHECK constraint (more portable)
ALTER TABLE users
ADD CONSTRAINT users_role_check CHECK (role IN ('super_admin', 'admin_desa', 'perangkat_desa', 'masyarakat'));

-- Add status to village_news if it's missing (as per previous context, ensuring it's here)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='village_news' AND column_name='status') THEN
        ALTER TABLE village_news ADD COLUMN status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'));
    END IF;
END $$;


-- Insert a sample 'perangkat_desa' user for testing
-- Make sure village 'Sukamaju' and its admin 'admin_sukamaju' exist from previous scripts
DO $$
DECLARE
    sukamaju_village_id INT;
    admin_sukamaju_user_id INT;
BEGIN
    SELECT id INTO sukamaju_village_id FROM villages WHERE nama = 'Sukamaju' LIMIT 1;
    SELECT id INTO admin_sukamaju_user_id FROM users WHERE username = 'admin_sukamaju' LIMIT 1;

    IF sukamaju_village_id IS NOT NULL AND admin_sukamaju_user_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'perangkat_sukamaju') THEN
            INSERT INTO users (username, email, "password", role, status, village_id, created_by)
            VALUES ('perangkat_sukamaju', 'perangkat@sukamaju.desa.id', 'admin', 'perangkat_desa', 'aktif', sukamaju_village_id, admin_sukamaju_user_id);
        END IF;
    ELSE
        RAISE NOTICE 'Village Sukamaju or admin_sukamaju not found. Sample perangkat_desa user not created.';
    END IF;
END $$;

-- No changes needed for 'citizens' table for login, as NIK and tanggal_lahir already exist.

-- Verification
SELECT DISTINCT role FROM users;

SELECT 'Script 09-update-roles-and-citizen-login.sql executed successfully' AS status;
