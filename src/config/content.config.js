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
      // TODO: replace with real Instagram handle or remove this field
      instagram: '@ilham.firdaus',
      // TODO: replace with real photo path in /src/assets
      photo: '/assets/groom-placeholder.jpg',
    },
    bride: {
      fullName: 'Prita Sekar Primadiani',
      nickname: 'Prita',
      // TODO: replace with real Instagram handle or remove this field
      instagram: '@prita.sekar',
      // TODO: replace with real photo path in /src/assets
      photo: '/assets/bride-placeholder.jpg',
    },
    // No parents' names shown, per couple's request.
  },

  hero: {
    // TODO: verify wording of the opening quote before production use.
    // This is placeholder devotional/neutral copy, not confirmed final text.
    quote: {
      id: '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya."',
      en: '"And among His signs is that He created for you spouses from among yourselves, so that you may find tranquility in them."',
      source: 'QS. Ar-Rum: 21 — TODO: verify citation',
    },
  },

  event: {
    // ISO datetime strings, WIB = UTC+7
    akad: {
      dateISO: '2026-09-05T15:30:00+07:00',
      label: { id: 'Akad Nikah', en: 'Solemnization' },
      venueName: 'Gedung BKKBN',
      // TODO: replace with exact full address before going live
      address: 'Gedung BKKBN, Jl. Permata No. 1, Halim, Jakarta Timur — TODO: exact address',
    },
    resepsi: {
      dateISO: '2026-09-05T18:30:00+07:00',
      label: { id: 'Resepsi', en: 'Reception' },
      venueName: 'Gedung BKKBN',
      address: 'Gedung BKKBN, Jl. Permata No. 1, Halim, Jakarta Timur — TODO: exact address',
    },
    // TODO: replace with exact coordinates for Gedung BKKBN, Jakarta Timur.
    // Approximate placeholder centered on Halim, Jakarta Timur area.
    map: {
      lat: -6.2655,
      lng: 106.8917,
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Gedung+BKKBN+Jakarta+Timur',
    },
  },

  story: [
    // TODO: replace placeholder story with the couple's real story & photos
    {
      year: '2019',
      title: { id: 'Pertama Bertemu', en: 'First Meeting' },
      text: {
        id: 'Placeholder — ceritakan bagaimana kalian pertama kali bertemu.',
        en: 'Placeholder — tell how you first met.',
      },
    },
    {
      year: '2022',
      title: { id: 'Menjadi Dekat', en: 'Growing Close' },
      text: {
        id: 'Placeholder — ceritakan momen yang membuat kalian semakin dekat.',
        en: 'Placeholder — describe the moment that brought you closer.',
      },
    },
    {
      year: '2025',
      title: { id: 'Lamaran', en: 'The Proposal' },
      text: {
        id: 'Placeholder — ceritakan momen lamaran kalian.',
        en: 'Placeholder — describe your proposal moment.',
      },
    },
  ],

  gallery: [
    // TODO: replace with real photos
    { src: '/assets/gallery-1.jpg', alt: 'TODO: replace with real photo' },
    { src: '/assets/gallery-2.jpg', alt: 'TODO: replace with real photo' },
    { src: '/assets/gallery-3.jpg', alt: 'TODO: replace with real photo' },
    { src: '/assets/gallery-4.jpg', alt: 'TODO: replace with real photo' },
    { src: '/assets/gallery-5.jpg', alt: 'TODO: replace with real photo' },
    { src: '/assets/gallery-6.jpg', alt: 'TODO: replace with real photo' },
  ],

  gifts: [
    // TODO: replace with real bank/e-wallet details before going live
    {
      type: 'bank',
      bankName: 'Bank Placeholder',
      accountNumber: '0000000000',
      accountHolder: 'Mohamad Ilham Firdaus',
    },
    {
      type: 'ewallet',
      bankName: 'E-Wallet Placeholder',
      accountNumber: '0000000000',
      accountHolder: 'Prita Sekar Primadiani',
    },
  ],

  music: {
    // TODO: replace with a real, licensed audio file in /public/audio
    src: '/audio/background-music.mp3',
    title: 'Placeholder Track',
  },

  admin: {
    // Simple client-side gate for the demo. For production, replace with
    // Supabase Auth (see README) rather than a hardcoded password.
    // TODO: move to a real auth flow before going live.
    passwordEnvVar: 'VITE_ADMIN_PASSWORD',
  },
}

export default content
