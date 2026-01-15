'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SlideUpProps {
    children: ReactNode
    delay?: number
    duration?: number
    className?: string
    offset?: number
}

export function SlideUp({ children, delay = 0, duration = 0.5, className = '', offset = 20 }: SlideUpProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: offset }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
