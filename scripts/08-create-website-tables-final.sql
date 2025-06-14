-- Drop existing tables if they exist to recreate with correct structure
DROP TABLE IF EXISTS website_content CASCADE;
DROP TABLE IF EXISTS village_news CASCADE;
DROP TABLE IF EXISTS village_services CASCADE;
DROP TABLE IF EXISTS website_settings CASCADE;

-- Create website content tables per village
CREATE TABLE website_content (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    section_name VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE village_news (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT DEFAULT '/placeholder.svg?height=200&width=300',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
    published_date DATE DEFAULT CURRENT_DATE,
    author VARCHAR(100) DEFAULT 'Admin Desa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE village_services (
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

CREATE TABLE website_settings (
    id SERIAL PRIMARY KEY,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(village_id)
);

-- Create indexes for better performance
CREATE INDEX idx_website_content_village_id ON website_content(village_id);
CREATE INDEX idx_website_content_section ON website_content(village_id, section_name);
CREATE INDEX idx_village_news_village_id ON village_news(village_id);
CREATE INDEX idx_village_news_status ON village_news(village_id, status);
CREATE INDEX idx_village_services_village_id ON village_services(village_id);
CREATE INDEX idx_village_services_active ON village_services(village_id, is_active);
CREATE INDEX idx_website_settings_village_id ON website_settings(village_id);

-- Insert sample website settings for existing villages
INSERT INTO website_settings (
    village_id, 
    village_name, 
    village_tagline, 
    village_description, 
    village_address, 
    village_phone, 
    village_email,
    social_facebook,
    social_twitter,
    social_instagram
)
SELECT 
    v.id,
    v.nama,
    'Desa yang Maju dan Sejahtera',
    'Desa ' || v.nama || ' adalah desa yang terletak di ' || v.kecamatan || ', ' || v.kabupaten || ', ' || v.provinsi || '. Desa ini memiliki potensi yang sangat baik untuk berkembang dengan masyarakat yang gotong royong dan peduli lingkungan.',
    'Jl. Raya ' || v.nama || ' No. 123, ' || v.kecamatan || ', ' || v.kabupaten || ', ' || v.provinsi,
    '0812-3456-7890',
    'info@desa' || LOWER(REPLACE(v.nama, ' ', '')) || '.desa.id',
    'https://facebook.com/desa' || LOWER(REPLACE(v.nama, ' ', '')),
    'https://twitter.com/desa' || LOWER(REPLACE(v.nama, ' ', '')),
    'https://instagram.com/desa' || LOWER(REPLACE(v.nama, ' ', ''))
FROM villages v;

-- Insert sample hero content for each village
INSERT INTO website_content (village_id, section_name, title, content, is_active)
SELECT 
    v.id,
    'hero',
    'Selamat Datang di ' || v.nama,
    'Desa ' || v.nama || ' adalah desa yang indah dan makmur dengan masyarakat yang ramah dan gotong royong. Kami berkomitmen untuk terus berkembang dan memberikan pelayanan terbaik bagi seluruh warga.',
    true
FROM villages v;

-- Insert sample about content for each village
INSERT INTO website_content (village_id, section_name, title, content, is_active)
SELECT 
    v.id,
    'about',
    'Tentang ' || v.nama,
    'Desa ' || v.nama || ' terletak di ' || v.kecamatan || ', ' || v.kabupaten || ', ' || v.provinsi || '. Desa ini memiliki luas wilayah yang cukup dengan jumlah penduduk yang terus berkembang. Kami memiliki potensi pertanian, peternakan, dan pariwisata yang sangat baik.',
    true
FROM villages v;

-- Insert sample vision content for each village
INSERT INTO website_content (village_id, section_name, title, content, is_active)
SELECT 
    v.id,
    'vision',
    'Visi & Misi ' || v.nama,
    'VISI:
Mewujudkan ' || v.nama || ' yang mandiri, sejahtera, dan berkeadilan.

MISI:
1. Meningkatkan kualitas sumber daya manusia melalui pendidikan dan pelatihan
2. Mengembangkan ekonomi lokal berbasis potensi desa
3. Meningkatkan infrastruktur dan fasilitas umum desa
4. Melestarikan lingkungan hidup dan kearifan lokal
5. Meningkatkan tata kelola pemerintahan yang transparan dan akuntabel',
    true
FROM villages v;

-- Insert sample contact content for each village
INSERT INTO website_content (village_id, section_name, title, content, is_active)
SELECT 
    v.id,
    'contact',
    'Hubungi Kami',
    'Kantor Desa ' || v.nama || '
Jl. Raya ' || v.nama || ' No. 123
' || v.kecamatan || ', ' || v.kabupaten || ', ' || v.provinsi || '

Telepon: 0812-3456-7890
Email: info@desa' || LOWER(REPLACE(v.nama, ' ', '')) || '.desa.id

Jam Pelayanan:
Senin - Jumat: 08.00 - 16.00 WIB
Sabtu: 08.00 - 12.00 WIB
Minggu: Tutup',
    true
FROM villages v;

-- Insert sample news for each village (First News)
INSERT INTO village_news (village_id, title, content, status, published_date, author, image_url)
SELECT 
    v.id,
    'Pembangunan Infrastruktur ' || v.nama || ' Tahun 2024',
    'Pemerintah Desa ' || v.nama || ' telah memulai program pembangunan infrastruktur untuk meningkatkan kesejahteraan masyarakat. Program ini meliputi perbaikan jalan desa, pembangunan fasilitas umum, dan peningkatan layanan publik.

Program pembangunan ini didanai dari Dana Desa dan ADD (Alokasi Dana Desa) tahun 2024. Diharapkan dengan adanya pembangunan ini, akses masyarakat ke berbagai fasilitas akan semakin mudah dan perekonomian desa akan semakin berkembang.

Kepala Desa mengajak seluruh masyarakat untuk mendukung program pembangunan ini dengan menjaga fasilitas yang telah dibangun dan berpartisipasi aktif dalam kegiatan gotong royong.',
    'published',
    CURRENT_DATE - INTERVAL '5 days',
    'Admin Desa',
    '/placeholder.svg?height=200&width=300'
FROM villages v;

-- Insert second news for each village
INSERT INTO village_news (village_id, title, content, status, published_date, author, image_url)
SELECT 
    v.id,
    'Pelatihan Keterampilan untuk Pemuda ' || v.nama,
    'Pemerintah Desa ' || v.nama || ' mengadakan pelatihan keterampilan untuk pemuda desa dalam rangka meningkatkan kapasitas dan daya saing di dunia kerja. Pelatihan ini meliputi keterampilan digital, wirausaha, dan keterampilan teknis lainnya.

Kegiatan ini diselenggarakan selama 3 hari dengan menghadirkan narasumber yang berpengalaman di bidangnya. Peserta pelatihan adalah pemuda desa usia 18-35 tahun yang berminat mengembangkan keterampilan.

Diharapkan setelah mengikuti pelatihan ini, para pemuda dapat membuka usaha sendiri atau mendapatkan pekerjaan yang lebih baik.',
    'published',
    CURRENT_DATE - INTERVAL '10 days',
    'Admin Desa',
    '/placeholder.svg?height=200&width=300'
FROM villages v;

-- Insert draft news for each village
INSERT INTO village_news (village_id, title, content, status, published_date, author, image_url)
SELECT 
    v.id,
    'Rencana Pembangunan ' || v.nama || ' Tahun 2025',
    'Pemerintah Desa ' || v.nama || ' sedang menyusun rencana pembangunan untuk tahun 2025. Rencana ini meliputi berbagai program pembangunan fisik dan non-fisik yang akan dilaksanakan tahun depan.

Beberapa program yang direncanakan antara lain:
1. Pembangunan balai desa baru
2. Perbaikan sistem drainase
3. Program pemberdayaan ekonomi masyarakat
4. Peningkatan kualitas pendidikan
5. Program kesehatan masyarakat

Masyarakat diundang untuk memberikan masukan dan saran terkait rencana pembangunan ini melalui musyawarah desa yang akan diselenggarakan bulan depan.',
    'draft',
    CURRENT_DATE + INTERVAL '5 days',
    'Kepala Desa',
    '/placeholder.svg?height=200&width=300'
FROM villages v;

-- Insert KTP service for each village
INSERT INTO village_services (village_id, service_name, description, requirements, procedure, duration, is_active)
SELECT 
    v.id,
    'Pembuatan KTP',
    'Layanan pembuatan Kartu Tanda Penduduk (KTP) untuk warga desa yang baru berusia 17 tahun atau yang kehilangan KTP.',
    '1. Fotokopi Kartu Keluarga (KK)
2. Surat Pengantar dari RT/RW
3. Pas foto 3x4 sebanyak 2 lembar (latar belakang merah)
4. Fotokopi akta kelahiran (untuk pembuatan KTP pertama kali)
5. Surat keterangan hilang dari kepolisian (untuk penggantian KTP hilang)',
    '1. Mengajukan permohonan ke RT/RW setempat
2. Datang ke kantor desa dengan membawa persyaratan lengkap
3. Mengisi formulir permohonan KTP
4. Melakukan verifikasi data dan foto
5. Menunggu proses pembuatan di Disdukcapil
6. Pengambilan KTP setelah jadi (akan dihubungi)',
    '7-14 hari kerja',
    true
FROM villages v;

-- Insert KK service for each village
INSERT INTO village_services (village_id, service_name, description, requirements, procedure, duration, is_active)
SELECT 
    v.id,
    'Pembuatan Kartu Keluarga (KK)',
    'Layanan pembuatan Kartu Keluarga baru untuk keluarga baru atau penggantian KK yang rusak/hilang.',
    '1. Surat Pengantar dari RT/RW
2. Fotokopi KTP kepala keluarga dan anggota keluarga
3. Fotokopi akta nikah (untuk keluarga baru)
4. Fotokopi akta kelahiran anak-anak
5. Surat keterangan hilang dari kepolisian (untuk penggantian KK hilang)
6. Pas foto kepala keluarga 3x4 sebanyak 2 lembar',
    '1. Mengajukan permohonan ke RT/RW setempat
2. Datang ke kantor desa dengan persyaratan lengkap
3. Mengisi formulir permohonan KK
4. Verifikasi data keluarga
5. Proses pembuatan di Disdukcapil
6. Pengambilan KK setelah selesai',
    '7-14 hari kerja',
    true
FROM villages v;

-- Insert birth certificate service for each village
INSERT INTO village_services (village_id, service_name, description, requirements, procedure, duration, is_active)
SELECT 
    v.id,
    'Pembuatan Akta Kelahiran',
    'Layanan pembuatan Akta Kelahiran untuk bayi yang baru lahir atau anak yang belum memiliki akta kelahiran.',
    '1. Surat Keterangan Lahir dari Bidan/Dokter/Rumah Sakit
2. Fotokopi KTP kedua orang tua
3. Fotokopi Kartu Keluarga (KK)
4. Fotokopi Buku Nikah/Akta Perkawinan orang tua
5. Surat Pengantar dari RT/RW
6. Pas foto bayi 2x3 sebanyak 2 lembar (untuk anak di atas 5 tahun)',
    '1. Mengajukan permohonan ke RT/RW setempat
2. Datang ke kantor desa dengan persyaratan lengkap
3. Mengisi formulir permohonan akta kelahiran
4. Verifikasi data dan dokumen
5. Proses pembuatan di Disdukcapil
6. Pengambilan akta kelahiran setelah selesai',
    '7-14 hari kerja',
    true
FROM villages v;

-- Insert SKTM service for each village
INSERT INTO village_services (village_id, service_name, description, requirements, procedure, duration, is_active)
SELECT 
    v.id,
    'Surat Keterangan Tidak Mampu (SKTM)',
    'Layanan pembuatan Surat Keterangan Tidak Mampu untuk keperluan beasiswa, bantuan sosial, atau keringanan biaya.',
    '1. Fotokopi KTP pemohon
2. Fotokopi Kartu Keluarga (KK)
3. Surat Pengantar dari RT/RW
4. Surat pernyataan tidak mampu bermaterai
5. Fotokopi rekening listrik (jika ada)
6. Dokumen pendukung lainnya (jika diperlukan)',
    '1. Mengajukan permohonan ke RT/RW setempat
2. Datang ke kantor desa dengan persyaratan lengkap
3. Mengisi formulir permohonan SKTM
4. Verifikasi kondisi ekonomi keluarga
5. Penandatanganan surat oleh Kepala Desa
6. Pengambilan SKTM',
    '1-3 hari kerja',
    true
FROM villages v;

-- Insert business permit service for each village
INSERT INTO village_services (village_id, service_name, description, requirements, procedure, duration, is_active)
SELECT 
    v.id,
    'Surat Izin Usaha Mikro',
    'Layanan pembuatan surat izin untuk usaha mikro dan kecil di tingkat desa.',
    '1. Fotokopi KTP pemilik usaha
2. Fotokopi Kartu Keluarga (KK)
3. Surat Pengantar dari RT/RW
4. Denah lokasi usaha
5. Pas foto 3x4 sebanyak 2 lembar
6. Surat pernyataan tidak mengganggu lingkungan',
    '1. Mengajukan permohonan ke RT/RW setempat
2. Datang ke kantor desa dengan persyaratan lengkap
3. Mengisi formulir permohonan izin usaha
4. Survey lokasi usaha (jika diperlukan)
5. Verifikasi dokumen dan persyaratan
6. Penandatanganan surat izin
7. Pengambilan surat izin usaha',
    '3-7 hari kerja',
    true
FROM villages v;

-- Insert domicile certificate service for each village
INSERT INTO village_services (village_id, service_name, description, requirements, procedure, duration, is_active)
SELECT 
    v.id,
    'Surat Keterangan Domisili',
    'Layanan pembuatan surat keterangan domisili untuk keperluan administrasi seperti pendaftaran sekolah, pekerjaan, atau lainnya.',
    '1. Fotokopi KTP pemohon
2. Fotokopi Kartu Keluarga (KK)
3. Surat Pengantar dari RT/RW
4. Pas foto 3x4 sebanyak 2 lembar
5. Surat kontrak sewa (jika status mengontrak)
6. Surat keterangan dari pemilik rumah (jika menumpang)',
    '1. Mengajukan permohonan ke RT/RW setempat
2. Datang ke kantor desa dengan persyaratan lengkap
3. Mengisi formulir permohonan surat domisili
4. Verifikasi alamat tempat tinggal
5. Penandatanganan surat oleh Kepala Desa
6. Pengambilan surat keterangan domisili',
    '1-3 hari kerja',
    true
FROM villages v;

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_website_content_updated_at 
    BEFORE UPDATE ON website_content 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_village_news_updated_at 
    BEFORE UPDATE ON village_news 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_village_services_updated_at 
    BEFORE UPDATE ON village_services 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_website_settings_updated_at 
    BEFORE UPDATE ON website_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify the data was inserted correctly
SELECT 'Website Settings' as table_name, COUNT(*) as record_count FROM website_settings
UNION ALL
SELECT 'Website Content' as table_name, COUNT(*) as record_count FROM website_content
UNION ALL
SELECT 'Village News' as table_name, COUNT(*) as record_count FROM village_news
UNION ALL
SELECT 'Village Services' as table_name, COUNT(*) as record_count FROM village_services
ORDER BY table_name;

-- Show sample data for verification
SELECT 
    ws.village_name,
    COUNT(DISTINCT wc.id) as content_count,
    COUNT(DISTINCT vn.id) as news_count,
    COUNT(DISTINCT vs.id) as services_count
FROM website_settings ws
LEFT JOIN website_content wc ON ws.village_id = wc.village_id
LEFT JOIN village_news vn ON ws.village_id = vn.village_id
LEFT JOIN village_services vs ON ws.village_id = vs.village_id
GROUP BY ws.village_id, ws.village_name
ORDER BY ws.village_name;

-- Show villages that have been set up
SELECT 
    v.nama as village_name,
    CASE WHEN ws.id IS NOT NULL THEN 'Yes' ELSE 'No' END as has_website_settings,
    COALESCE(content_counts.count, 0) as content_sections,
    COALESCE(news_counts.count, 0) as news_articles,
    COALESCE(service_counts.count, 0) as services
FROM villages v
LEFT JOIN website_settings ws ON v.id = ws.village_id
LEFT JOIN (
    SELECT village_id, COUNT(*) as count 
    FROM website_content 
    GROUP BY village_id
) content_counts ON v.id = content_counts.village_id
LEFT JOIN (
    SELECT village_id, COUNT(*) as count 
    FROM village_news 
    GROUP BY village_id
) news_counts ON v.id = news_counts.village_id
LEFT JOIN (
    SELECT village_id, COUNT(*) as count 
    FROM village_services 
    GROUP BY village_id
) service_counts ON v.id = service_counts.village_id
ORDER BY v.nama;
