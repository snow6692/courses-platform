"use client";

import { Button } from "@/components/ui/button";
import { IconPrinter } from "@tabler/icons-react";

export function PrintButton() {
  return (
    <Button onClick={() => window.print()} className="gap-2 print:hidden">
      <IconPrinter className="size-4" />
      Print Invoice
    </Button>
  );
}
