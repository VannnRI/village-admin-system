-- Pastikan pengguna super_admin ada dan aktif
INSERT INTO
  users (
    username,
    email,
    password,
    role,
    status,
    created_by
  )
VALUES
  (
    'super_admin',
    'super@admin.com',
    'admin', -- Pastikan password ini sesuai dengan yang Anda gunakan untuk login
    'super_admin',
    'aktif',
    NULL
  ) ON CONFLICT (username) DO
UPDATE
SET
  email = EXCLUDED.email,
  password = EXCLUDED.password, -- Update password jika berbeda
  role = EXCLUDED.role,
  status = 'aktif'; -- Pastikan statusnya aktif

-- Pastikan contoh admin_desa ada, aktif, dan terkait dengan village_id = 1 (asumsi desa dengan id 1 ada)
-- Buat desa contoh jika belum ada
INSERT INTO villages (id, nama, kode_pos, kecamatan, kabupaten, provinsi, status)
VALUES (1, 'Desa Sukamaju', '12345', 'Kec. Maju', 'Kab. Jaya', 'Prov. Sejahtera', 'aktif')
ON CONFLICT (id) DO NOTHING;

INSERT INTO
  users (
    username,
    email,
    password,
    role,
    status,
    village_id, -- Tambahkan village_id
    created_by
  )
VALUES
  (
    'admin_sukamaju', -- Contoh username admin desa
    'admin@sukamaju.com',
    'admin', -- Pastikan password ini sesuai
    'admin_desa',
    'aktif',
    1, -- Terkait dengan Desa Sukamaju (id=1)
    (SELECT id FROM users WHERE username = 'super_admin' LIMIT 1)
  ) ON CONFLICT (username) DO
UPDATE
SET
  email = EXCLUDED.email,
  password = EXCLUDED.password, -- Update password jika berbeda
  role = EXCLUDED.role,
  status = 'aktif',
  village_id = EXCLUDED.village_id; -- Update village_id jika berbeda

-- Pastikan contoh perangkat_desa ada, aktif, dan terkait dengan village_id = 1
INSERT INTO
  users (
    username,
    email,
    password,
    role,
    status,
    village_id,
    created_by
  )
VALUES
  (
    'perangkat_sukamaju',
    'perangkat@sukamaju.com',
    'admin', -- Password default
    'perangkat_desa',
    'aktif',
    1, -- Terkait dengan Desa Sukamaju (id=1)
    (SELECT id FROM users WHERE username = 'admin_sukamaju' LIMIT 1)
  ) ON CONFLICT (username) DO
UPDATE
SET
  email = EXCLUDED.email,
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  status = 'aktif',
  village_id = EXCLUDED.village_id;


-- Verifikasi data
SELECT id, username, role, status, village_id, password FROM users WHERE role IN ('super_admin', 'admin_desa', 'perangkat_desa');
SELECT * FROM villages WHERE id = 1;
