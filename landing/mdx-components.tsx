import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
   return {
      h1: (props) => (
         <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight" {...props} />
      ),
      h2: (props) => (
         <h2
            className="mt-12 scroll-m-20 border-b border-border pb-2 text-2xl font-semibold tracking-tight"
            {...props}
         />
      ),
      p: (props) => (
         <p
            className="leading-7 text-base text-muted-foreground [&:not(:first-child)]:mt-6"
            {...props}
         />
      ),
      pre: (props) => (
         <pre
            className="mt-6 overflow-x-auto rounded-xl border border-border bg-card p-4 text-base"
            {...props}
         />
      ),
      code: ({ children, ...props }) => (
         <code
            className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-[0.875em] font-medium text-foreground"
            {...props}
         >
            {children}
         </code>
      ),
      ...components,
   };
}
