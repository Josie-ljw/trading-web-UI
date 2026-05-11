import { useTranslation } from 'react-i18next'

export function SiteFooter() {
  const { t } = useTranslation()
  return (
    <footer className="site-footer" role="contentinfo">
      <h2 className="site-footer-title">{t('footer.title')}</h2>
      <p className="site-footer-p">{t('footer.p1')}</p>
      <p className="site-footer-p">{t('footer.p2')}</p>
      <p className="site-footer-p">{t('footer.p3')}</p>
    </footer>
  )
}
