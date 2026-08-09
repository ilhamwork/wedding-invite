-- ─────────────────────────────────────────────────────────────────────────
-- Seed: guest list from Lagapaners invitation list
-- Safe to run multiple times — ON CONFLICT (slug) DO NOTHING skips dupes.
-- ─────────────────────────────────────────────────────────────────────────

INSERT INTO guests (name, slug) VALUES
  ('Bpk. Baskoro',                  'bpk-baskoro'),
  ('Ibu Retno Sri Utami',           'ibu-retno-sri-utami'),
  ('Ibu Vera Ina Susanti',          'ibu-vera-ina-susanti'),
  ('Bpk. Wisnu Cahyo',              'bpk-wisnu-cahyo'),
  ('Bpk. A. Haryono',               'bpk-a-haryono'),
  ('Ibu Sri Andrini',               'ibu-sri-andrini'),
  ('Bpk. Bima Sakti',               'bpk-bima-sakti'),
  ('Bpk. Deni F. Azil',             'bpk-deni-f-azil'),
  ('Ibu Dewi S. Karya',             'ibu-dewi-s-karya'),
  ('Bpk. Erie Prakoso',             'bpk-erie-prakoso'),
  ('Ibu Dr. Kristiantini Dewi',     'ibu-dr-kristiantini-dewi'),
  ('Bpk. Moenardi',                 'bpk-moenardi'),
  ('Ibu Myra Esfandiary',           'ibu-myra-esfandiary'),
  ('Bpk. Pranoto Setiawan',         'bpk-pranoto-setiawan'),
  ('Ibu R. Isfandiari',             'ibu-r-isfandiari'),
  ('Bpk. Renaldy Dewantoro',        'bpk-renaldy-dewantoro'),
  ('Bpk. Djonny M.S',               'bpk-djonny-ms'),
  ('Bpk. Dony M. Oekon',            'bpk-dony-m-oekon'),
  ('Ibu Elena Ardini',              'ibu-elena-ardini'),
  ('Bpk. Ervan Octaviano',          'bpk-ervan-octaviano'),
  ('Bpk. Ferry Samosir',            'bpk-ferry-samosir'),
  ('Ibu Irma',                      'ibu-irma'),
  ('Bpk. RM Ponang',                'bpk-rm-ponang'),
  ('Bpk. Teuku Syahputra',          'bpk-teuku-syahputra'),
  ('Ibu Willis Henny Prastuti',     'ibu-willis-henny-prastuti'),
  ('Bpk. Subur Yuli Winarso',       'bpk-subur-yuli-winarso'),
  ('Ibu Devi Andrini',              'ibu-devi-andrini'),
  ('Ibu Tri Wahyuwidayati',         'ibu-tri-wahyuwidayati'),
  ('Bpk. Wisnu Hidayat',            'bpk-wisnu-hidayat'),
  ('Bpk. Ade Suryadi',              'bpk-ade-suryadi'),
  ('Bpk. Pudji Hartono',            'bpk-pudji-hartono'),
  ('Ibu Nurlita Sukma',             'ibu-nurlita-sukma'),
  ('Bpk. Nanto Panjaitan',          'bpk-nanto-panjaitan')
ON CONFLICT (slug) DO NOTHING;
