/* eslint-disable @typescript-eslint/no-explicit-any, react/display-name */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import '@assistant-ui/react-markdown/styles/dot.css';

import {
  type CodeHeaderProps,
  MarkdownTextPrimitive,
  unstable_memoizeMarkdownComponents as memoizeMarkdownComponents,
  useIsMarkdownCodeBlock,
} from '@assistant-ui/react-markdown';
import remarkGfm from 'remark-gfm';
import {
  type ComponentPropsWithoutRef,
  type FC,
  createElement,
  memo,
  useState,
} from 'react';
import { CheckIcon, CopyIcon } from 'lucide-react';

import { TooltipIconButton } from '@/components/assistant-ui/tooltip-icon-button';
import { cn } from '@/lib/utils';

const MarkdownTextImpl = () => {
  return (
    <MarkdownTextPrimitive
      remarkPlugins={[remarkGfm]}
      className="aui-md"
      components={defaultComponents}
    />
  );
};

export const MarkdownText = memo(MarkdownTextImpl);

const CodeHeader: FC<CodeHeaderProps> = ({ language, code }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const onCopy = () => {
    if (!code || isCopied) return;
    copyToClipboard(code);
  };

  return (
    <div className="aui-code-header-root mt-4 flex items-center justify-between gap-4 rounded-t-lg bg-muted-foreground/15 px-4 py-2 font-semibold text-foreground text-sm dark:bg-muted-foreground/20">
      <span className="aui-code-header-language lowercase [&>span]:text-xs">
        {language}
      </span>
      <TooltipIconButton tooltip="Copy" onClick={onCopy}>
        {!isCopied && <CopyIcon />}
        {isCopied && <CheckIcon />}
      </TooltipIconButton>
    </div>
  );
};

const useCopyToClipboard = ({
  copiedDuration = 3000,
}: {
  copiedDuration?: number;
} = {}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = (value: string) => {
    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), copiedDuration);
    });
  };

  return { isCopied, copyToClipboard };
};

const withMarkdownClass =
  <T extends keyof HTMLElementTagNameMap>(tag: T, baseClassName: string) =>
  ({ className, ...props }: { className?: string; [key: string]: unknown }) =>
    createElement(tag as any, {
      ...(props as Record<string, unknown>),
      className: cn(baseClassName, className),
    });

const defaultComponents = memoizeMarkdownComponents({
  h1: withMarkdownClass(
    'h1',
    'aui-md-h1 mb-8 scroll-m-20 font-extrabold text-4xl tracking-tight last:mb-0'
  ),
  h2: withMarkdownClass(
    'h2',
    'aui-md-h2 mt-8 mb-4 scroll-m-20 font-semibold text-3xl tracking-tight first:mt-0 last:mb-0'
  ),
  h3: withMarkdownClass(
    'h3',
    'aui-md-h3 mt-6 mb-4 scroll-m-20 font-semibold text-2xl tracking-tight first:mt-0 last:mb-0'
  ),
  h4: withMarkdownClass(
    'h4',
    'aui-md-h4 mt-6 mb-4 scroll-m-20 font-semibold text-xl tracking-tight first:mt-0 last:mb-0'
  ),
  h5: withMarkdownClass(
    'h5',
    'aui-md-h5 my-4 font-semibold text-lg first:mt-0 last:mb-0'
  ),
  h6: withMarkdownClass(
    'h6',
    'aui-md-h6 my-4 font-semibold first:mt-0 last:mb-0'
  ),
  p: withMarkdownClass(
    'p',
    'aui-md-p mt-5 mb-5 leading-7 first:mt-0 last:mb-0'
  ),
  a: withMarkdownClass(
    'a',
    'aui-md-a font-medium text-primary underline underline-offset-4'
  ),
  blockquote: withMarkdownClass(
    'blockquote',
    'aui-md-blockquote border-l-2 pl-6 italic'
  ),
  ul: withMarkdownClass('ul', 'aui-md-ul my-5 ml-6 list-disc [&>li]:mt-2'),
  ol: withMarkdownClass('ol', 'aui-md-ol my-5 ml-6 list-decimal [&>li]:mt-2'),
  hr: withMarkdownClass('hr', 'aui-md-hr my-5 border-b'),
  table: withMarkdownClass(
    'table',
    'aui-md-table my-5 w-full border-separate border-spacing-0 overflow-y-auto'
  ),
  th: withMarkdownClass(
    'th',
    'aui-md-th bg-muted px-4 py-2 text-left font-bold first:rounded-tl-lg last:rounded-tr-lg [[align=center]]:text-center [[align=right]]:text-right'
  ),
  td: withMarkdownClass(
    'td',
    'aui-md-td border-b border-l px-4 py-2 text-left last:border-r [[align=center]]:text-center [[align=right]]:text-right'
  ),
  tr: withMarkdownClass(
    'tr',
    'aui-md-tr m-0 border-b p-0 first:border-t [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg'
  ),
  sup: withMarkdownClass('sup', 'aui-md-sup [&>a]:text-xs [&>a]:no-underline'),
  pre: withMarkdownClass(
    'pre',
    'aui-md-pre overflow-x-auto rounded-t-none! rounded-b-lg bg-black p-4 text-white'
  ),
  code: function Code({
    className,
    ...props
  }: { className?: string } & ComponentPropsWithoutRef<'code'>) {
    const isCodeBlock = useIsMarkdownCodeBlock();
    return (
      <code
        className={cn(
          !isCodeBlock &&
            'aui-md-inline-code rounded border bg-muted font-semibold',
          className
        )}
        {...props}
      />
    );
  },
  CodeHeader,
} as any);
