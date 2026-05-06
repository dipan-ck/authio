'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CopyButton({ text }: { text: string }) {
   const [copied, setCopied] = useState(false);

   async function handleCopy() {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
   }

   return (
      <button
         onClick={handleCopy}
         aria-label="Copy code"
         className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background/95 text-muted-foreground opacity-70 transition-all hover:text-foreground hover:opacity-100"
      >
         {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
         ) : (
            <Copy className="h-3.5 w-3.5" />
         )}
      </button>
   );
}
