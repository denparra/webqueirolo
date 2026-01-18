import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
    dsn: SENTRY_DSN,

    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,

    // Disable Sentry in development
    enabled: process.env.NODE_ENV === 'production',

    // You can remove this option if you're not planning to use the Sentry Session Replay feature:
    replaysSessionSampleRate: 0.1,

    // If the entire session is not sampled, use the below sample rate to sample
    // sessions when an error occurs.
    replaysOnErrorSampleRate: 1.0,

    // Ignore common errors
    ignoreErrors: [
        // Browser extensions
        'top.GLOBALS',
        // Random plugins/extensions
        'originalCreateNotification',
        'canvas.contentDocument',
        'MyApp_RemoveAllHighlights',
        // Facebook borked
        'fb_xd_fragment',
        // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to reduce this. (thanks @acdha)
        // See http://stackoverflow.com/questions/4113268/how-to-stop-javascript-injection-from-vodafone-proxy
        'bmi_SafeAddOnload',
        'EBCallBackMessageReceived',
        // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
        'conduitPage',
    ],

    beforeSend(event, hint) {
        // Filter out errors from browser extensions
        if (event.exception) {
            const error = hint.originalException
            if (error && typeof error === 'object' && 'message' in error) {
                const message = String(error.message)
                if (message.includes('chrome-extension://') || message.includes('moz-extension://')) {
                    return null
                }
            }
        }
        return event
    },
})
