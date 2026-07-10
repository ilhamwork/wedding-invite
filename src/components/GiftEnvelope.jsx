import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { content } from '../config/content.config'
import Section, { Reveal } from './ui/Section'

// Bank logo registry
const BANK_LOGOS = {
  bca: <img src="/assets/bca.webp" alt="BCA" className="h-10 w-auto object-contain" />,
}

function getBankLogo(gift) {
  if (gift.logoKey) return BANK_LOGOS[gift.logoKey.toLowerCase()] ?? null
  const name = gift.bankName?.toLowerCase() ?? ''
  if (name.includes('bca')) return BANK_LOGOS.bca
  return null
}

// Chevron icon
function ChevronIcon({ open }) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </motion.svg>
  )
}

// Wallet icon
function WalletIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <circle cx="17" cy="15" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

// Gift box icon
function GiftBoxIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="10" width="18" height="11" rx="1" />
      <path d="M3 10V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
      <path d="M12 6V21" />
      <path d="M12 6C12 6 9 3 7 4s-1 4 5 2" />
      <path d="M12 6C12 6 15 3 17 4s1 4-5 2" />
    </svg>
  )
}

// Copy icon
function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

// Accordion item wrapper
function AccordionItem({ icon, label, isOpen, onToggle, children }) {
  return (
    <div className="rounded-2xl border hairline overflow-hidden bg-pebble/40">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 text-sea">
          {icon}
          <span className="font-body text-sm tracking-wide text-ink">{label}</span>
        </div>
        <span className="text-sea-light/70">
          <ChevronIcon open={isOpen} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-5 pb-5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function GiftEnvelope() {
  const { t } = useTranslation()
  const [openPanel, setOpenPanel] = useState(null) // null | 'bank' | 'address'
  const [copiedIndex, setCopiedIndex] = useState(null)

  function toggle(panel) {
    setOpenPanel((prev) => (prev === panel ? null : panel))
  }

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

  const addr = content.giftAddress

  return (
    <Section id="gift" bg="texture" flip={false} fadeTop="#EAE5D8" fadeBottom="#EAE5D8">
      <Reveal variant="scaleUp" className="text-center">
        <h2 className="font-display text-2xl text-ink mb-3">{t('gift.title')}</h2>
        <p className="text-sm text-ink-soft/75 leading-relaxed max-w-xs mx-auto mb-8">
          {t('gift.description')}
        </p>

        <div className="space-y-3 text-left">

          {/* ── Bank transfer ── */}
          <AccordionItem
            icon={<WalletIcon />}
            label={t('gift.bankTransfer') ?? 'Transfer Bank'}
            isOpen={openPanel === 'bank'}
            onToggle={() => toggle('bank')}
          >
            <div className="space-y-4 pt-1">
              {content.gifts.map((gift, i) => {
                const logo = getBankLogo(gift)
                return (
                  <div key={i} className="rounded-xl border hairline bg-white/50 p-4">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <p className="font-display text-xl text-ink tracking-wider">{gift.accountNumber}</p>
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
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border hairline text-xs tracking-widest uppercase hover:bg-sea hover:text-cream transition-colors"
                    >
                      <CopyIcon />
                      {copiedIndex === i ? t('gift.copied') : t('gift.copy')}
                    </button>
                  </div>
                )
              })}
            </div>
          </AccordionItem>

          {/* ── Shipping address ── */}
          <AccordionItem
            icon={<GiftBoxIcon />}
            label={t('gift.shippingAddress') ?? 'Kirim Hadiah'}
            isOpen={openPanel === 'address'}
            onToggle={() => toggle('address')}
          >
            {addr ? (
              <div className="rounded-xl border hairline bg-white/50 p-4 space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(17,87,95,0.55)' }}>
                    {t('gift.recipient') ?? 'Penerima'}
                  </p>
                  <p className="text-sm text-ink font-medium">{addr.recipient}</p>
                </div>
                {addr.phone && (
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(17,87,95,0.55)' }}>
                      {t('gift.phone') ?? 'No. Telepon'}
                    </p>
                    <p className="text-sm text-ink">{addr.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(17,87,95,0.55)' }}>
                    {t('gift.address') ?? 'Alamat'}
                  </p>
                  <p className="text-sm text-ink leading-relaxed">{addr.address}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(`${addr.recipient}\n${addr.phone ?? ''}\n${addr.address}`, 'addr')}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border hairline text-xs tracking-widest uppercase hover:bg-sea hover:text-cream transition-colors"
                >
                  <CopyIcon />
                  {copiedIndex === 'addr' ? t('gift.copied') : t('gift.copy')}
                </button>
              </div>
            ) : null}
          </AccordionItem>

        </div>
      </Reveal>
    </Section>
  )
}
