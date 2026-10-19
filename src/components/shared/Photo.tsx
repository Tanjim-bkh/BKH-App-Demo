import { ImageOff } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PhotoProps {
  src: string
  alt?: string
  className?: string
  // - Shown instead of a broken image when the file hasn't been added to public/ yet
  fallback?: ReactNode
}

export function Photo({ src, alt = '', className, fallback }: PhotoProps) {
  const [missing, setMissing] = useState(false)
  if (missing) {
    return (
      fallback ?? (
        <div className={cn('flex w-full flex-col items-center justify-center gap-1 bg-zinc-100 p-2 text-zinc-400', className)}>
          <ImageOff className="size-5" />
          <span className="max-w-full truncate text-[10px]">{src.split('/').pop()}</span>
        </div>
      )
    )
  }
  return <img src={src} alt={alt} onError={() => setMissing(true)} className={cn('w-full bg-zinc-100 object-cover', className)} />
}
