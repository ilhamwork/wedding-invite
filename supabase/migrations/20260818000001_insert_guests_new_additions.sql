-- New guest additions for Prita, Om Ilham, and Tante Dian
-- Migration date: 2026-08-18

INSERT INTO guests (name, slug, source, phone)
VALUES
  -- Prita (1 new guest)
  ('Tante Narni & Suami', 'tante-narni-suami', 'Prita', '628118244777'),

  -- Om Ilham (8 new guests)
  ('Ibu Yanny', 'ibu-yanny', 'Om Ilham', '6281299075810'),
  ('Ibu Julianti Azali', 'ibu-julianti-azali', 'Om Ilham', '62816891240'),
  ('Keluarga Bpk. Dahlan Hasyim', 'keluarga-bpk-dahlan-hasyim', 'Om Ilham', '62811191790'),
  ('Keluarga Bpk. T. Djoko Santoso', 'keluarga-bpk-t-djoko-santoso', 'Om Ilham', '6281296410529'),
  ('Keluarga Bpk. Djarot Sugiharto', 'keluarga-bpk-djarot-sugiharto', 'Om Ilham', '6285697775365'),
  ('Keluarga (Alm) Bpk. Adi Gunawan', 'keluarga-alm-bpk-adi-gunawan', 'Om Ilham', '6285885771353'),
  ('Keluarga (Alm) Bpk. Abdullah Umar', 'keluarga-alm-bpk-abdullah-umar', 'Om Ilham', '6285891826162'),
  ('Keluarga Bpk. Wahyu Siswanto', 'keluarga-bpk-wahyu-siswanto', 'Om Ilham', '62818846920'),

  -- Tante Dian (4 new guests)
  ('Keluarga Bpk. Erik Novianto T', 'keluarga-bpk-erik-novianto-t', 'Tante Dian', '628111291072'),
  ('Keluarga Bpk. Ivan Septiadi G', 'keluarga-bpk-ivan-septiadi-g', 'Tante Dian', '6281293939354'),
  ('Keluarga Bpk. Toni Hadi Suharto', 'keluarga-bpk-toni-hadi-suharto', 'Tante Dian', '1(206)9736310'),
  ('Ibu Ivon Sari Ekawati & Suami', 'ibu-ivon-sari-ekawati-suami', 'Tante Dian', '6287880796610')

ON CONFLICT (slug)
DO UPDATE SET
  name   = EXCLUDED.name,
  phone  = EXCLUDED.phone,
  source = EXCLUDED.source;
