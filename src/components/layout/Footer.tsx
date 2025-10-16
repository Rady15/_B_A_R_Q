'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-muted-foreground text-sm">
              {t('footer.copyright')}
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-muted-foreground hover:text-blue-500 transition-colors">
              📧
            </a>
            <a href="#" className="text-muted-foreground hover:text-blue-500 transition-colors">
              💼
            </a>
            <a href="#" className="text-muted-foreground hover:text-blue-500 transition-colors">
              🐦
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}