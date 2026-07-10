// ─────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for all wedding content.
// Edit this file to reuse the codebase for a different couple/event —
// you should never need to touch component code to change content.
// ─────────────────────────────────────────────────────────────────────────

export const content = {
  couple: {
    groom: {
      fullName: 'Mohamad Ilham Firdaus',
      nickname: 'Ilham',
      instagram: '@ilhamfirdaa',
      photo: '/assets/groom.jpg',
      parents: {
        id: 'Putra dari\nBpk. Iwan Ridwan\n&\nIbu Alm. Sopiah',
        en: 'Precious Son of\nIwan Ridwan\n&\nAlm. Sopiah',
      },
    },
    bride: {
      fullName: 'Prita Sekar Primadiani',
      nickname: 'Prita',
      instagram: '@pritaskr',
      photo: '/assets/bride.jpg',
      parents: {
        id: 'Putri dari\nBpk. Ilham Philipinaryo\n&\nIbu Dian Novianti Dwitasari',
        en: 'Lovely Daughter of\nIlham Philipinaryo\n&\nDian Novianti Dwitasari',
      },
    },
  },

  event: {
    akad: {
      dateISO: '2026-09-05T15:30:00+07:00',
      label: { id: 'Akad Nikah', en: 'Akad Nikah' },
      venueName: 'Auditorium BKKBN',
      address: 'Auditorium BKKBN, Jl. Permata No.1, RT.4/RW.5, Kb. Pala, Kec. Makasar, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta',
    },
    resepsi: {
      dateISO: '2026-09-05T18:30:00+07:00',
      label: { id: 'Resepsi', en: 'Resepsi' },
      venueName: 'Auditorium BKKBN',
      address: 'Auditorium BKKBN, Jl. Permata No.1, RT.4/RW.5, Kb. Pala, Kec. Makasar, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta',
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
      photo: '/assets/gallery/PRITA & ILHAM-4.jpg',
      title: { id: 'Pertama Bertemu', en: 'First Meeting' },
      caption: {
        id: 'Placeholder — ceritakan bagaimana kalian pertama kali bertemu.',
        en: 'Placeholder — tell how you first met.',
      },
    },
    {
      year: '2022',
      photo: '/assets/gallery/PRITA & ILHAM-37.jpg',
      title: { id: 'Menjadi Dekat', en: 'Growing Close' },
      caption: {
        id: 'Placeholder — ceritakan momen yang membuat kalian semakin dekat.',
        en: 'Placeholder — describe the moment that brought you closer.',
      },
    },
    {
      year: '2025',
      photo: '/assets/gallery/PRITA & ILHAM-96.jpg',
      title: { id: 'Lamaran', en: 'The Proposal' },
      caption: {
        id: 'Placeholder — ceritakan momen lamaran kalian.',
        en: 'Placeholder — describe your proposal moment.',
      },
    },
  ],

  gallery: [
    { src: '/assets/gallery/PRITA & ILHAM-4.jpg',  alt: 'Prita & Ilham' },
    { src: '/assets/gallery/PRITA & ILHAM-16.jpg', alt: 'Prita & Ilham' },
    { src: '/assets/gallery/PRITA & ILHAM-37.jpg', alt: 'Prita & Ilham' },
    { src: '/assets/gallery/PRITA & ILHAM-53.jpg', alt: 'Prita & Ilham' },
    { src: '/assets/gallery/PRITA & ILHAM-96.jpg', alt: 'Prita & Ilham' },
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
    phone: '0813-8977-6363',
    address: 'Jl. Hijau Daun Blok C1 No 9, RT 011/RW 010, Kelapa Gading Timur, Kelapa Gading, Jakarta Utara, DKI Jakarta',
  },

  cover: {
    // Mobile (portrait) — tall/square crop works best
    photo: '/assets/gallery/PRITA & ILHAM-96.jpg',
    // Desktop (landscape) — wide crop works best; falls back to photo if not set
    photoDesktop: '/assets/gallery/PRITA & ILHAM-53.jpg',
  },

  countdown: {
    // Background for the countdown section.
    // Supports GIF, JPG, PNG, or WebP — just drop the file in /public/assets/ and update the path.
    // For animated effect, use a .gif file.
    // Falls back to a gallery photo if not set.
    backgroundGif: '/assets/countdown-motion.gif', // ← replace with your .gif
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
