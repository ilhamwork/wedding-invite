import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { content } from '../config/content.config'
import Section, { Reveal, Eyebrow } from './ui/Section'

// Bank logo registry — add more banks here as needed
const BANK_LOGOS = {
  bca: (
    <img src="/assets/bca.webp" alt="BCA" className="h-10 w-auto object-contain" />
  ),
}

/**
 * Match a gift entry to a logo key.
 * Checks gift.logoKey first, then falls back to fuzzy-matching bankName.
 */
function getBankLogo(gift) {
  if (gift.logoKey) return BANK_LOGOS[gift.logoKey.toLowerCase()] ?? null
  const name = gift.bankName?.toLowerCase() ?? ''
  if (name.includes('bca')) return BANK_LOGOS.bca
  return null
}

export default function GiftEnvelope() {
  const { t } = useTranslation()
  const [copiedIndex, setCopiedIndex] = useState(null)

  async function handleCopy(accountNumber, index) {
    try {
      await navigator.clipboard.writeText(accountNumber)
      setCopiedIndex(index)
      toast.success(t('gift.copied'))
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch {
      toast.error(t('common.error'))
    }
  }

  return (
    <Section id="gift">
      <Reveal className="text-center">
        <Eyebrow>{t('gift.eyebrow')}</Eyebrow>
        <h2 className="font-display text-2xl text-ink mb-3">{t('gift.title')}</h2>
        <p className="text-sm text-ink-soft/75 leading-relaxed max-w-xs mx-auto mb-8">
          {t('gift.description')}
        </p>

        <div className="space-y-4">
          {content.gifts.map((gift, i) => {
            const logo = getBankLogo(gift)
            return (
              <div key={i} className="rounded-2xl border hairline bg-pebble/50 p-5 text-left">
                {/* Bank header: text left, logo right */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="font-display text-xl text-ink tracking-wider">{gift.accountNumber}</p>
                    <p className="text-xs text-ink-soft/70 mt-0.5">{gift.accountHolder}</p>
                  </div>
                  {logo
                    ? <div className="shrink-0">{logo}</div>
                    : <p className="text-xs uppercase tracking-widest text-sea-light">{gift.bankName}</p>
                  }
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(gift.accountNumber, i)}
                  className="px-4 py-1.5 rounded-full border hairline text-xs tracking-widest uppercase hover:bg-sea hover:text-cream transition-colors"
                >
                  {copiedIndex === i ? t('gift.copied') : t('gift.copy')}
                </button>
              </div>
            )
          })}
        </div>
      </Reveal>
    </Section>
  )
}
