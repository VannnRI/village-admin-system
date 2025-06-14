-- Membuat user super_admin
INSERT INTO
  users (
    username,
    email,
    password_hash, -- Menggunakan password_hash
    role,
    status
  )
VALUES
  (
    'super_admin',
    'super_admin@example.com',
    '$2a$12$vEw82a0H9ok1GjNgWjKjEuJzCH.LBwRIlJxtjBfKkTJwrJ8WtK.Oy',
    'super_admin',
    'active'
  ) ON CONFLICT (username) DO NOTHING;

-- Membuat user admin_sukamaju
INSERT INTO
  users (
    username,
    email,
    password_hash, -- Menggunakan password_hash
    role,
    status,
    village_id
  )
VALUES
  (
    'admin_sukamaju',
    'admin_sukamaju@example.com',
    '$2a$12$vEw82a0H9ok1GjNgWjKjEuJzCH.LBwRIlJxtjBfKkTJwrJ8WtK.Oy',
    'admin',
    'active',
    (
      SELECT
        id
      FROM
        villages
      WHERE
        name = 'Sukamaju'
      LIMIT
        1
    )
  ) ON CONFLICT (username) DO NOTHING;

-- Membuat user perangkat_sukamaju
INSERT INTO
  users (
    username,
    email,
    password_hash, -- Menggunakan password_hash
    role,
    status,
    village_id
  )
VALUES
  (
    'perangkat_sukamaju',
    'perangkat_sukamaju@example.com',
    '$2a$12$vEw82a0H9ok1GjNgWjKjEuJzCH.LBwRIlJxtjBfKkTJwrJ8WtK.Oy',
    'perangkat',
    'active',
    (
      SELECT
        id
      FROM
        villages
      WHERE
        name = 'Sukamaju'
      LIMIT
        1
    )
  ) ON CONFLICT (username) DO NOTHING;
