import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { content } from '../config/content.config'
import Section, { Reveal } from './ui/Section'

// Bank logo registry
const BANK_LOGOS = {
  bca: <img src="/assets/bca.webp" alt="BCA" className="h-6 w-auto object-contain" />,
}

function getBankLogo(gift) {
  if (gift.logoKey) return BANK_LOGOS[gift.logoKey.toLowerCase()] ?? null
  const name = gift.bankName?.toLowerCase() ?? ''
  if (name.includes('bca')) return BANK_LOGOS.bca
  return null
}

function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function GiftModal({ onClose }) {
  const { t } = useTranslation()
  const [copiedIndex, setCopiedIndex] = useState(null)
  const addr = content.giftAddress

  async function handleCopy(text, index) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      toast.success(t('gift.copied'))
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch {
      toast.error(t('common.error'))
    }
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
        style={{ backgroundColor: 'rgba(28,25,23,0.65)', backdropFilter: 'blur(4px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full sm:max-w-md bg-cream rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
          style={{ maxHeight: '90svh', overflowY: 'auto' }}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-ink/20" />
          </div>

          <div className="px-6 pb-8 pt-3">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl text-ink">{t('gift.title')}</h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="w-8 h-8 flex items-center justify-center rounded-full border hairline text-ink-soft hover:bg-pebble transition-colors text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <p className="text-sm text-ink-soft/75 leading-relaxed mb-6">
              {t('gift.description')}
            </p>

            {/* Bank transfers */}
            <p className="text-xs uppercase tracking-widest text-ink-soft/60 mb-3">{t('gift.bankTransfer')}</p>
            <div className="space-y-3 mb-6">
              {content.gifts.map((gift, i) => {
                const logo = getBankLogo(gift)
                return (
                  <div key={i} className="rounded-2xl border hairline bg-pebble/40 p-4">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <p className="font-display text-xl text-ink tracking-wider whitespace-nowrap">{gift.accountNumber}</p>
                        <p className="text-xs text-ink-soft/70 mt-0.5">{gift.accountHolder}</p>
                      </div>
                      {logo
                        ? <div className="shrink-0 flex items-center self-center">{logo}</div>
                        : <p className="text-xs uppercase tracking-widest text-sea-light self-center">{gift.bankName}</p>
                      }
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(gift.accountNumber, i)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border hairline text-xs tracking-widest uppercase hover:bg-accent hover:text-ink transition-colors font-medium"
                    >
                      <CopyIcon />
                      {copiedIndex === i ? t('gift.copied') : t('gift.copy')}
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Shipping address */}
            {addr && (
              <>
                <p className="text-xs uppercase tracking-widest text-ink-soft/60 mb-3">{t('gift.shippingAddress')}</p>
                <div className="rounded-2xl border hairline bg-pebble/40 p-4 space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-1 text-ink-soft/55">{t('gift.recipient')}</p>
                    <p className="text-sm text-ink font-medium">{addr.recipient}</p>
                  </div>
                  {addr.phone && (
                    <div>
                      <p className="text-xs uppercase tracking-widest mb-1 text-ink-soft/55">{t('gift.phone')}</p>
                      <p className="text-sm text-ink">{addr.phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-1 text-ink-soft/55">{t('gift.address')}</p>
                    <p className="text-sm text-ink leading-relaxed">{addr.address}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${addr.recipient}\n${addr.phone ?? ''}\n${addr.address}`, 'addr')}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border hairline text-xs tracking-widest uppercase hover:bg-accent hover:text-ink transition-colors font-medium"
                  >
                    <CopyIcon />
                    {copiedIndex === 'addr' ? t('gift.copied') : t('gift.copy')}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}

export default function GiftEnvelope() {
  const { t } = useTranslation()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <Section id="gift" bg="texture" flip={false} fadeTop="#F7F4ED" fadeBottom="#F7F4ED">
      <Reveal variant="scaleUp" className="text-center">
        <h2 className="font-display text-2xl text-ink mb-3">{t('gift.title')}</h2>
        <p className="text-sm text-ink-soft/75 leading-relaxed max-w-xs mx-auto mb-8">
          {t('gift.description')}
        </p>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-accent text-ink text-xs tracking-[0.22em] uppercase hover:bg-accent-mid transition-colors font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="10" width="18" height="11" rx="1" />
            <path d="M3 10V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
            <path d="M12 6V21" />
            <path d="M12 6C12 6 9 3 7 4s-1 4 5 2" />
            <path d="M12 6C12 6 15 3 17 4s1 4-5 2" />
          </svg>
          {t('gift.open') ?? 'Lihat Detail'}
        </button>
      </Reveal>

      {modalOpen && <GiftModal onClose={() => setModalOpen(false)} />}
    </Section>
  )
}
