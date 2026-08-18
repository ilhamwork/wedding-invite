-- New guest additions for Ilham
-- Migration date: 2026-08-18

INSERT INTO guests (name, slug, source, phone)
VALUES
  ('Sofi & Partner', 'sofi-partner', 'Ilham', '6283898759011'),
  ('Hilmi & Partner', 'hilmi-partner', 'Ilham', '6281233456986'),
  ('Pandu & Partner', 'pandu-partner', 'Ilham', '6287755836995'),
  ('Mia & Partner', 'mia-partner', 'Ilham', '6287783953242'),
  ('Rifqi Asat & Partner', 'rifqi-asat-partner', 'Ilham', '6285318515106'),
  ('Arief Wildan & Partner', 'arief-wildan-partner', 'Ilham', '6289660218270'),
  ('Faiz & Partner', 'faiz-partner', 'Ilham', '6283114388027'),
  ('Ardi & Rini', 'ardi-rini', 'Ilham', NULL),
  ('Dadik', 'dadik', 'Ilham', '628977041468'),
  ('Deliyana', 'deliyana', 'Ilham', '6287832072016'),
  ('Rahman', 'rahman', 'Ilham', '6281259514862')

ON CONFLICT (slug)
DO UPDATE SET
  name   = EXCLUDED.name,
  phone  = EXCLUDED.phone,
  source = EXCLUDED.source;
