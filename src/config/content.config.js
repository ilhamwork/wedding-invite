// ─────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for all wedding content.
// Edit this file to reuse the codebase for a different couple/event —
// you should never need to touch component code to change content.
// ─────────────────────────────────────────────────────────────────────────

export const content = {
  couple: {
    groom: {
      fullName: 'Mohamad Ilham Firdaus, S.Kom.',
      nickname: 'Ilham',
      instagram: '@ilhamfirdaa',
      photo: '/assets/groom.webp',
      parents: {
        id: 'Putra dari\nBpk. Iwan Ridwan &\nIbu Alm. Sopiah',
        en: 'Son of\nMr. Iwan Ridwan &\nMrs. Sopiah (Almh.)',
      },
    },
    bride: {
      fullName: 'Prita Sekar Primadiani, S.AB.',
      nickname: 'Prita',
      instagram: '@pritaskr',
      photo: '/assets/bride.webp',
      parents: {
        id: 'Putri dari\nBpk. Ilham Philipinaryo &\nIbu Dian Novianti Dwitasari',
        en: 'Daughter of\nMr. Ilham Philipinaryo &\nMrs. Dian Novianti Dwitasari',
      },
    },
  },

  event: {
    akad: {
      dateISO: '2026-09-05T15:30:00+07:00',
      label: { id: 'Akad Nikah', en: 'Akad Nikah' },
      venueName: 'Auditorium BKKBN Halim',
      address: 'Auditorium BKKBN Halim,\nJl. Permata No.1, RT.4/RW.5, Kb. Pala,\nKec. Makasar, Kota Jakarta Timur, DKI Jakarta',
    },
    resepsi: {
      dateISO: '2026-09-05T18:30:00+07:00',
      label: { id: 'Resepsi', en: 'Resepsi' },
      venueName: 'Auditorium BKKBN Halim',
      address: 'Auditorium BKKBN Halim,\nJl. Permata No.1, RT.4/RW.5, Kb. Pala,\nKec. Makasar, Kota Jakarta Timur, DKI Jakarta',
    },
    map: {
      lat: -6.2655,
      lng: 106.8917,
      googleMapsUrl: 'https://maps.app.goo.gl/gbX8ddCzavcxkmqY8',
    },
  },

  story: [
    {
      year: '2019',
      photo: '/assets/photos/prita-ilham-01.webp',
      title: { id: 'Pertama Bertemu', en: 'First Meeting' },
      caption: {
        id: 'Placeholder — ceritakan bagaimana kalian pertama kali bertemu.',
        en: 'Placeholder — tell how you first met.',
      },
    },
    {
      year: '2022',
      photo: '/assets/photos/prita-ilham-11.webp',
      title: { id: 'Menjadi Dekat', en: 'Growing Close' },
      caption: {
        id: 'Placeholder — ceritakan momen yang membuat kalian semakin dekat.',
        en: 'Placeholder — describe the moment that brought you closer.',
      },
    },
    {
      year: '2025',
      photo: '/assets/photos/prita-ilham-05.webp',
      title: { id: 'Lamaran', en: 'The Proposal' },
      caption: {
        id: 'Placeholder — ceritakan momen lamaran kalian.',
        en: 'Placeholder — describe your proposal moment.',
      },
    },
  ],

  gallery: [
    { src: '/assets/photos/prita-ilham-02.webp', alt: 'Prita & Ilham' },
    { src: '/assets/photos/prita-ilham-03.webp', alt: 'Prita & Ilham' },
    { src: '/assets/photos/prita-ilham-04.webp', alt: 'Prita & Ilham' },
    { src: '/assets/photos/prita-ilham-07.webp', alt: 'Prita & Ilham' },
    { src: '/assets/photos/prita-ilham-08.webp', alt: 'Prita & Ilham' },
    { src: '/assets/photos/prita-ilham-09.webp', alt: 'Prita & Ilham' },
    { src: '/assets/photos/prita-ilham-10.webp', alt: 'Prita & Ilham' },
    { src: '/assets/photos/prita-ilham-15.webp', alt: 'Prita & Ilham' },
    { src: '/assets/photos/prita-ilham-17.webp', alt: 'Prita & Ilham' },
    { src: '/assets/photos/prita-ilham-18.webp', alt: 'Prita & Ilham' },
  ],

  gifts: [
    {
      type: 'bank',
      bankName: 'BCA',
      accountNumber: '6220 5050 47',
      accountHolder: 'Prita Sekar Primadiani',
    },
    {
      type: 'bank',
      bankName: 'BCA',
      accountNumber: '5405 1730 66',
      accountHolder: 'Mohamad Ilham Firdaus',
    },
  ],

  giftAddress: {
    recipient: 'Prita Sekar Primadiani',
    phone: '0853-5317-0137',
    address: 'Jl. Hijau Daun Blok C1 No 9, RT 011/RW 010, Kelapa Gading Timur, Kelapa Gading, Jakarta Utara, DKI Jakarta',
  },

  cover: {
    // Portrait photo — fills the full-height mobile cover
    photo: '/assets/photos/prita-ilham-06.webp',
  },

  closing: {
    // Background photo shown at the bottom of the thank-you section.
    photo: '/assets/photos/prita-ilham-19.webp',
  },

  countdown: {
    // Images for the auto-play carousel background (fade-in/out, no controls).
    // Falls back to all gallery photos if not set.
    // Tip: add as many photos as you like; order matters.
    images: [
      '/assets/photos/prita-ilham-12.webp',
      '/assets/photos/prita-ilham-13.webp',
      '/assets/photos/prita-ilham-14.webp',
      '/assets/photos/prita-ilham-16.webp',
    ],
    // How long each slide is visible (milliseconds) before crossfading to the next.
    slideDuration: 3000,
  },

  music: {
    src: '/audio/coldplay_all-my-love.mp3',
    title: 'Akad',
  },

  admin: {
    // Simple client-side gate for the demo. For production, replace with
    // Supabase Auth (see README) rather than a hardcoded password.
    // TODO: move to a real auth flow before going live.
    passwordEnvVar: 'VITE_ADMIN_PASSWORD',
  },
}

export default content
