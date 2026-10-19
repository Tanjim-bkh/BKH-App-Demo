import { Download, ExternalLink, FileText } from 'lucide-react'
import { Section } from '@/components/safety/Section'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/useMediaQuery'

// - Files live in public/, so the URL is the encoded path (names may contain spaces)
const pdfUrl = (path: string) => `/${encodeURI(path)}`

// - Embeds the official PDF from tablet width up. Phone browsers handle inline PDFs poorly,
//   so phones get a button that opens the PDF in the device's own viewer instead.
export function PdfViewer({ path, title }: { path: string; title: string }) {
  const url = pdfUrl(path)
  // - Only mount the iframe where it is shown, so phones don't download the PDF in the background
  const isWide = useMediaQuery('(min-width: 768px)')
  const fileName = path.split('/').pop() ?? path

  return (
    <Section
      title="Official alert document"
      icon={FileText}
      action={
        <div className="hidden gap-2 md:flex">
          <Button asChild variant="outline" size="sm">
            <a href={url} download={fileName}>
              <Download />
              Download
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink />
              Open in new tab
            </a>
          </Button>
        </div>
      }
    >
      {isWide && <iframe src={`${url}#view=FitH`} title={title} className="h-[80vh] w-full rounded-lg border bg-zinc-100" />}

      <div className="flex items-center gap-3 rounded-lg border bg-zinc-50 p-3 md:hidden">
        <FileText className="size-8 shrink-0 text-red-600" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{fileName}</p>
          <p className="text-xs text-muted-foreground">PDF document</p>
        </div>
        <Button asChild size="sm">
          <a href={url} target="_blank" rel="noopener noreferrer">
            View PDF
          </a>
        </Button>
      </div>
    </Section>
  )
}
