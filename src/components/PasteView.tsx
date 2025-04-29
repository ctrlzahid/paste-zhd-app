'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { codeToHtml } from 'shiki';
import { Copy, Check, FileX } from 'lucide-react';

interface PasteViewProps {
  content?: string;
  syntax?: string;
  createdAt?: string;
  expiresAt?: string;
  slug?: string;
  notFound?: boolean;
}

export default function PasteView({
  content,
  syntax,
  createdAt,
  expiresAt,
  slug,
  notFound = false,
}: PasteViewProps) {
  const router = useRouter();
  const [highlightedContent, setHighlightedContent] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [hasCopiedUrl, setHasCopiedUrl] = useState(false);
  const [hasCopiedContent, setHasCopiedContent] = useState(false);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  useEffect(() => {
    if (!content) return;

    const highlightContent = async () => {
      try {
        const html = await codeToHtml(content, {
          lang: syntax || 'text', // fallback to text if no syntax provided
          theme: 'github-dark',
        });
        setHighlightedContent(html);
      } catch (error) {
        console.error('Error highlighting content:', error);
        setHighlightedContent(content);
      }
    };

    highlightContent();
  }, [content, syntax]);

  const handleCopy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setHasCopiedContent(true);
      toast.success('Content copied to clipboard!');
      setTimeout(() => setHasCopiedContent(false), 2000);
    } catch (error) {
      console.error('Failed to copy content:', error);
      toast.error('Failed to copy content');
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setHasCopiedUrl(true);
      toast.success('URL copied to clipboard!');
      setTimeout(() => setHasCopiedUrl(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
      toast.error('Failed to copy URL');
    }
  };

  const handleReport = async () => {
    if (!slug) return;
    try {
      const response = await fetch(`/api/p/${slug}?slug=${slug}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to report paste');
      }

      toast.success('Paste reported successfully');
    } catch (error) {
      console.error('Failed to report paste:', error);
      toast.error('Failed to report paste');
    }
  };

  if (notFound) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px] text-center space-y-4'>
        <div className='rounded-full bg-muted/20 p-6'>
          <FileX className='h-12 w-12 text-muted-foreground' />
        </div>
        <h2 className='text-2xl font-semibold'>Paste Not Found</h2>
        <p className='text-muted-foreground max-w-md'>
          This paste may have expired or been removed. Please check the URL and
          try again.
        </p>
        <Button onClick={() => router.push('/')} className='mt-4'>
          Create New Paste
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div className='space-y-1 w-full sm:w-auto'>
          <div className='flex items-center gap-2 w-full'>
            <div className='overflow-hidden w-full sm:w-auto'>
              <p className='text-sm sm:text-lg font-mono truncate'>
                {currentUrl}
              </p>
            </div>
            <Button
              type='button'
              size='icon'
              variant='ghost'
              onClick={handleCopyUrl}
              className='h-8 w-8 shrink-0'
            >
              {hasCopiedUrl ? (
                <Check className='h-4 w-4' />
              ) : (
                <Copy className='h-4 w-4' />
              )}
            </Button>
          </div>
          {createdAt && (
            <p className='text-sm text-muted-foreground'>
              Created: {new Date(createdAt).toLocaleString()}
            </p>
          )}
          {expiresAt && (
            <p className='text-sm text-muted-foreground'>
              Expires: {new Date(expiresAt).toLocaleString()}
            </p>
          )}
        </div>
        <div className='flex gap-2 w-full sm:w-auto'>
          <Button
            variant='outline'
            onClick={handleReport}
            className='flex-1 sm:flex-none'
          >
            Report
          </Button>
          <Button
            onClick={() => router.push('/')}
            className='flex-1 sm:flex-none'
          >
            New Paste
          </Button>
        </div>
      </div>

      <div className='relative'>
        <div
          className='p-4 bg-[#24292e] overflow-auto min-h-[200px] max-h-[70vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#24292e] [&::-webkit-scrollbar-thumb]:bg-[#424a53] [&::-webkit-scrollbar-thumb]:rounded-lg hover:[&::-webkit-scrollbar-thumb]:bg-[#545d68] [&::-webkit-scrollbar-corner]:bg-[#24292e] pr-6'
          dangerouslySetInnerHTML={{ __html: highlightedContent }}
        />
        <Button
          variant='ghost'
          size='sm'
          onClick={handleCopy}
          className='absolute top-2 right-2 sm:right-6 h-8 text-xs gap-1.5 bg-white/90 hover:bg-white text-zinc-800 hover:text-zinc-800 transition-colors rounded-md border-none shadow-sm'
        >
          {hasCopiedContent ? (
            <>
              <Check className='h-3.5 w-3.5' />
              <span className='hidden sm:inline'>Copied</span>
            </>
          ) : (
            <>
              <Copy className='h-3.5 w-3.5' />
              <span className='hidden sm:inline'>Copy code</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
