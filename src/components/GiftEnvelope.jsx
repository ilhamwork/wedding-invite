import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { content } from '../config/content.config'
import Section, { Reveal, Eyebrow } from './ui/Section'

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
          {content.gifts.map((gift, i) => (
            <div key={i} className="rounded-2xl border hairline bg-paper/50 p-5 text-left">
              <p className="text-xs uppercase tracking-widest text-sage-deep mb-1">{gift.bankName}</p>
              <p className="font-display text-xl text-ink tracking-wider mb-1">{gift.accountNumber}</p>
              <p className="text-xs text-ink-soft/70 mb-3">{gift.accountHolder}</p>
              <button
                type="button"
                onClick={() => handleCopy(gift.accountNumber, i)}
                className="px-4 py-1.5 rounded-full border hairline text-xs tracking-widest uppercase hover:bg-ink hover:text-cream transition-colors"
              >
                {copiedIndex === i ? t('gift.copied') : t('gift.copy')}
              </button>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
