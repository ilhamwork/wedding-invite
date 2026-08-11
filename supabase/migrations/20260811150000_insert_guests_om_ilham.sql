INSERT INTO guests (name, slug, source, phone)
SELECT name, slug, source, phone FROM (
    VALUES
    ('Bpk. Baskoro', 'bpk-baskoro', 'Om Ilham', NULL),
    ('Ibu Retno Sri Utami', 'ibu-retno-sri-utami', 'Om Ilham', NULL),
    ('Ibu Vera Ina Susanti', 'ibu-vera-ina-susanti', 'Om Ilham', NULL),
    ('Bpk. Wisnu Cahyo', 'bpk-wisnu-cahyo', 'Om Ilham', NULL),
    ('Bpk. A. Haryono', 'bpk-a-haryono', 'Om Ilham', NULL),
    ('Ibu Sri Andrini', 'ibu-sri-andrini', 'Om Ilham', NULL),
    ('Bpk. Bima Sakti', 'bpk-bima-sakti', 'Om Ilham', NULL),
    ('Bpk. Deni F. Azil', 'bpk-deni-f-azil', 'Om Ilham', NULL),
    ('Ibu Dewi S. Karya', 'ibu-dewi-s-karya', 'Om Ilham', NULL),
    ('Bpk. Erie Prakoso', 'bpk-erie-prakoso', 'Om Ilham', NULL),
    ('Ibu Dr. Kristiantini Dewi', 'ibu-dr-kristiantini-dewi', 'Om Ilham', NULL),
    ('Bpk. Moenardi', 'bpk-moenardi', 'Om Ilham', NULL),
    ('Ibu Myra Esfandiary', 'ibu-myra-esfandiary', 'Om Ilham', NULL),
    ('Bpk. Pranoto Setiawan', 'bpk-pranoto-setiawan', 'Om Ilham', NULL),
    ('Ibu R. Isfandiari', 'ibu-r-isfandiari', 'Om Ilham', NULL),
    ('Bpk. Renaldy Dewantoro', 'bpk-renaldy-dewantoro', 'Om Ilham', NULL),
    ('Bpk. Djonny M.S', 'bpk-djonny-ms', 'Om Ilham', NULL),
    ('Bpk. Dony M. Oekon', 'bpk-dony-m-oekon', 'Om Ilham', NULL),
    ('Ibu Elena Ardini', 'ibu-elena-ardini', 'Om Ilham', NULL),
    ('Bpk. Ervan Octaviano', 'bpk-ervan-octaviano', 'Om Ilham', NULL),
    ('Bpk. Ferry Samosir', 'bpk-ferry-samosir', 'Om Ilham', NULL),
    ('Ibu Irma', 'ibu-irma', 'Om Ilham', NULL),
    ('Bpk. RM Ponang', 'bpk-rm-ponang', 'Om Ilham', NULL),
    ('Bpk.Teuku Syahputra', 'bpkteuku-syahputra', 'Om Ilham', NULL),
    ('Ibu Willis Henny Prastuti', 'ibu-willis-henny-prastuti', 'Om Ilham', NULL),
    ('Bpk. Subur Yuli Winarso', 'bpk-subur-yuli-winarso', 'Om Ilham', NULL),
    ('Ibu Devi Andrini', 'ibu-devi-andrini', 'Om Ilham', NULL),
    ('Ibu Tri Wahyuwidayati', 'ibu-tri-wahyuwidayati', 'Om Ilham', NULL),
    ('Bpk. Wisnu Hidayat', 'bpk-wisnu-hidayat', 'Om Ilham', NULL),
    ('Bpk. Ade Suryadi', 'bpk-ade-suryadi', 'Om Ilham', NULL),
    ('Bpk. Pudji Hartono', 'bpk-pudji-hartono', 'Om Ilham', NULL),
    ('Ibu Nurlita Sukma', 'ibu-nurlita-sukma', 'Om Ilham', NULL),
    ('Bpk. Nanto Panjaitan', 'bpk-nanto-panjaitan', 'Om Ilham', NULL)
) AS v(name, slug, source, phone)
WHERE NOT EXISTS (
    SELECT 1 FROM guests g WHERE g.slug = v.slug
);
