// components/lesson/PdfViewer.tsx
import { Download, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useConstructUrl } from "@/hooks/use-construct-url";

interface PdfViewerProps {
  pdfKey: string;
  title?: string;
}

export default function PdfViewer({
  pdfKey,
  title = "Lesson PDF",
}: PdfViewerProps) {
  const pdfUrl = useConstructUrl(pdfKey);

  return (
    <Card className="overflow-hidden border shadow-sm">
      <div className="bg-muted/50 flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <FileText className="text-primary size-5" />
          <span>{title}</span>
        </div>
        <Button asChild size="sm" variant="secondary">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center gap-2"
          >
            <Download className="size-4" />
            Download
          </a>
        </Button>
      </div>

      <CardContent className="p-0">
        <div className="bg-muted relative">
          <iframe
            src={pdfUrl}
            className="h-[70vh] w-full border-0 md:h-[80vh]"
            title={title}
            allowFullScreen
          />
          <div
            className="bg-background/80 absolute inset-0 flex items-center justify-center backdrop-blur-sm"
            id="fallback"
          >
            <Button asChild>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 size-5" />
                Open PDF in new tab
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
