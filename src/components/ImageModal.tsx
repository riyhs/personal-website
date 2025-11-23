import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageModalProps {
  isOpen: boolean
  src: string
  alt: string
  onClose: () => void
}

export function ImageModal({ isOpen, src, alt, onClose }: ImageModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className="relative max-h-[100vh] max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={src}
                alt={alt}
                className="h-full w-full rounded-2xl object-contain"
              />
              <button
                onClick={onClose}
                className="absolute -right-12 top-0 rounded-full p-2 text-white/60 transition-colors hover:text-white lg:-right-16"
                aria-label="Close modal"
              >
                <X size={28} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
