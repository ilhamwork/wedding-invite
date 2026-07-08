import { useTranslation } from 'react-i18next'

export default function LanguageToggle({ className = '' }) {
  const { i18n } = useTranslation()
  const isID = i18n.language?.startsWith('id')

  function toggle() {
    i18n.changeLanguage(isID ? 'en' : 'id')
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`font-body text-[11px] tracking-[0.25em] uppercase px-3 py-1.5 rounded-full border hairline text-ink/80 hover:bg-sea-mid hover:text-cream hover:border-sea-mid transition-colors ${className}`}
      aria-label="Toggle language"
    >
      {isID ? 'ID' : 'EN'} <span className="opacity-40 mx-0.5">/</span> {isID ? 'EN' : 'ID'}
    </button>
  )
}
