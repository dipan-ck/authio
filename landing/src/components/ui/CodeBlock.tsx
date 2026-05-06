import { codeToHtml } from 'shiki';
import { CopyButton } from './CopyButton';

interface CodeBlockProps {
   code: string;
   lang?: string;
}

export async function CodeBlock({ code, lang = 'ts' }: CodeBlockProps) {
   const html = await codeToHtml(code, {
      lang,
      theme: 'github-dark',
   });

   return (
      <div className="group relative">
         <CopyButton text={code} />
         <div
            className="shiki-wrapper overflow-x-auto bg-card text-sm"
            dangerouslySetInnerHTML={{ __html: html }}
         />
      </div>
   );
}
