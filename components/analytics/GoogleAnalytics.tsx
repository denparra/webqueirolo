'use client'

import Script from 'next/script'

// Google Analytics 4 Measurement ID
// Replace with your actual GA4 measurement ID when available
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export function GoogleAnalytics() {
  // Only render if GA ID is configured
  if (!GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}

// Event tracking helper functions
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && (window as unknown as { gtag?: typeof gtag }).gtag) {
    const gtagFn = (window as unknown as { gtag: typeof gtag }).gtag
    gtagFn('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Type declaration for gtag
declare function gtag(
  command: 'event',
  action: string,
  params?: {
    event_category?: string
    event_label?: string
    value?: number
    page_path?: string
  }
): void

// Predefined event trackers
export const trackVehicleView = (vehicleName: string, vehicleId: string) => {
  trackEvent('view_item', 'vehicle', vehicleName, undefined)
}

export const trackWhatsAppClick = (source: string) => {
  trackEvent('whatsapp_click', 'contact', source)
}

export const trackFormSubmission = (formType: string) => {
  trackEvent('form_submit', 'lead', formType)
}

export const trackCalculatorUse = (vehiclePrice: number) => {
  trackEvent('calculator_use', 'engagement', 'loan_calculator', vehiclePrice)
}

export const trackCompareVehicles = (vehicleCount: number) => {
  trackEvent('compare_vehicles', 'engagement', `${vehicleCount}_vehicles`)
}

export const trackFavoriteToggle = (action: 'add' | 'remove', vehicleName: string) => {
  trackEvent(`favorite_${action}`, 'engagement', vehicleName)
}

export const trackFilterUse = (filterType: string, filterValue: string) => {
  trackEvent('filter_use', 'search', `${filterType}:${filterValue}`)
}
