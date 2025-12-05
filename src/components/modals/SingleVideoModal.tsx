'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { X } from 'lucide-react'

interface SingleVideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl: string | null
  title?: string
}

// Fonction pour extraire l'ID YouTube ou convertir l'URL en format embed
function getEmbedUrl(url: string): string {
  if (!url) return ''
  
  // Si c'est déjà une URL embed YouTube
  if (url.includes('youtube.com/embed/')) {
    return url
  }
  
  // Extraire l'ID YouTube depuis différents formats d'URL
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(youtubeRegex)
  
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0&modestbranding=1`
  }
  
  // Pour Vimeo
  const vimeoRegex = /(?:vimeo\.com\/)(\d+)/
  const vimeoMatch = url.match(vimeoRegex)
  
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
  }
  
  // Retourner l'URL telle quelle si ce n'est pas YouTube ou Vimeo
  return url
}

export function SingleVideoModal({ isOpen, onClose, videoUrl, title = 'Vidéo' }: SingleVideoModalProps) {
  if (!videoUrl) return null

  const embedUrl = getEmbedUrl(videoUrl)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-full p-0 bg-black overflow-hidden border-0 rounded-2xl">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors shadow-lg"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Container vidéo responsive 16:9 */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Titre en bas (optionnel) */}
        {title && title !== 'Vidéo' && (
          <div className="bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="text-white font-semibold text-lg">{title}</h3>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
