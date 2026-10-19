import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Photo } from '@/components/shared/Photo'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

// - Photos live in public/incidents/; paths are relative to that folder
const photoUrl = (file: string) => `/incidents/${file}`

export function PhotoGallery({ photos, title }: { photos: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null)
  if (photos.length === 0) return null

  const step = (delta: number) => setOpen((i) => (i === null ? i : (i + delta + photos.length) % photos.length))

  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {photos.map((file, i) => (
          <button
            key={file}
            type="button"
            onClick={() => setOpen(i)}
            className="overflow-hidden rounded-lg border focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            aria-label={`Open photo ${i + 1} of ${photos.length}`}
          >
            <Photo src={photoUrl(file)} className="aspect-4/3 transition-transform hover:scale-105" />
          </button>
        ))}
      </div>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="w-[95vw] max-w-4xl gap-3 p-3 sm:max-w-4xl" onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1)
          if (e.key === 'ArrowLeft') step(-1)
        }}>
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <DialogDescription className="px-1 text-xs">
            Photo {open !== null ? open + 1 : 0} of {photos.length}
          </DialogDescription>
          {open !== null && <Photo key={photos[open]} src={photoUrl(photos[open])} className="max-h-[75vh] rounded-md object-contain" />}
          {photos.length > 1 && (
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="icon" onClick={() => step(-1)} aria-label="Previous photo">
                <ChevronLeft />
              </Button>
              <Button variant="outline" size="icon" onClick={() => step(1)} aria-label="Next photo">
                <ChevronRight />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
