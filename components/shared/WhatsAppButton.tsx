'use client'

import { getWhatsAppUrl } from '@/lib/utils'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid'
import siteConfig from '@/config'

export default function WhatsAppButton() {
  const whatsappUrl = getWhatsAppUrl(siteConfig.contact.whatsapp, siteConfig.messages.whatsappDefault)

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
      aria-label="Contactar por WhatsApp"
    >
      <ChatBubbleLeftRightIcon className="h-7 w-7" />
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex h-3 w-3 rounded-full bg-white"></span>
      </span>
    </a>
  )
}
