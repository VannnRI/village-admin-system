-- Create website content tables per village
CREATE TABLE IF NOT EXISTS website_content (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    section_name VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS village_news (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    published_date DATE DEFAULT CURRENT_DATE,
    author VARCHAR(100) DEFAULT 'Admin Desa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS village_services (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    service_name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    procedure TEXT NOT NULL,
    duration VARCHAR(50) DEFAULT '1-3 hari',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS website_settings (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE UNIQUE,
    village_name VARCHAR(200) NOT NULL,
    village_tagline VARCHAR(200),
    village_description TEXT,
    village_address TEXT,
    village_phone VARCHAR(20),
    village_email VARCHAR(100),
    social_facebook VARCHAR(200),
    social_twitter VARCHAR(200),
    social_instagram VARCHAR(200),
    logo_url TEXT DEFAULT '/placeholder.svg?height=100&width=100',
    theme_color VARCHAR(7) DEFAULT '#4CAF50',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for existing villages
INSERT INTO website_settings (village_id, village_name, village_tagline, village_description, village_address, village_phone, village_email)
SELECT 
    id,
    nama,
    'Desa yang Maju dan Sejahtera',
    'Desa ' || nama || ' adalah desa yang terletak di ' || kecamatan || ', ' || kabupaten || ', ' || provinsi || '. Desa ini memiliki potensi yang sangat baik untuk berkembang.',
    'Jl. Raya ' || nama || ' No. 123, ' || kecamatan || ', ' || kabupaten || ', ' || provinsi,
    '0812-3456-7890',
    'info@desa' || LOWER(REPLACE(nama, ' ', '')) || '.desa.id'
FROM villages 
WHERE NOT EXISTS (SELECT 1 FROM website_settings WHERE village_id = villages.id);

-- Insert sample content for each village
INSERT INTO website_content (village_id, section_name, title, content)
SELECT 
    v.id,
    'hero',
    'Selamat Datang di ' || v.nama,
    'Desa ' || v.nama || ' adalah desa yang indah dan makmur dengan masyarakat yang ramah dan gotong royong.'
FROM villages v
WHERE NOT EXISTS (SELECT 1 FROM website_content WHERE village_id = v.id AND section_name = 'hero');

INSERT INTO website_content (village_id, section_name, title, content)
SELECT 
    v.id,
    'about',
    'Tentang ' || v.nama,
    'Desa ' || v.nama || ' terletak di ' || v.kecamatan || ', ' || v.kabupaten || ', ' || v.provinsi || '. Desa ini memiliki luas wilayah yang cukup dengan jumlah penduduk yang terus berkembang.'
FROM villages v
WHERE NOT EXISTS (SELECT 1 FROM website_content WHERE village_id = v.id AND section_name = 'about');

-- Insert sample news for each village
INSERT INTO village_news (village_id, title, content, status, published_date)
SELECT 
    v.id,
    'Pembangunan Infrastruktur ' || v.nama || ' Tahun 2024',
    'Pemerintah Desa ' || v.nama || ' telah memulai program pembangunan infrastruktur untuk meningkatkan kesejahteraan masyarakat. Program ini meliputi perbaikan jalan, pembangunan fasilitas umum, dan peningkatan layanan publik.',
    'published',
    CURRENT_DATE - INTERVAL '5 days'
FROM villages v
WHERE NOT EXISTS (SELECT 1 FROM village_news WHERE village_id = v.id);

-- Insert sample services for each village
INSERT INTO village_services (village_id, service_name, description, requirements, procedure)
SELECT 
    v.id,
    'Pembuatan KTP',
    'Layanan pembuatan Kartu Tanda Penduduk (KTP) untuk warga desa.',
    '1. Fotokopi Kartu Keluarga\n2. Surat Pengantar RT/RW\n3. Pas foto 3x4 (2 lembar)',
    '1. Mengajukan permohonan ke RT/RW\n2. Mengisi formulir di kantor desa\n3. Melampirkan persyaratan\n4. Menunggu proses pembuatan\n5. Pengambilan KTP'
FROM villages v
WHERE NOT EXISTS (SELECT 1 FROM village_services WHERE village_id = v.id AND service_name = 'Pembuatan KTP');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_website_content_village_id ON website_content(village_id);
CREATE INDEX IF NOT EXISTS idx_village_news_village_id ON village_news(village_id);
CREATE INDEX IF NOT EXISTS idx_village_services_village_id ON village_services(village_id);
CREATE INDEX IF NOT EXISTS idx_website_settings_village_id ON website_settings(village_id);
