'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Copy, Check } from 'lucide-react';
import flourite from 'flourite';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Map flourite languages to Shiki languages
const LANGUAGE_MAP: Record<string, string> = {
  'c++': 'cpp',
  'c#': 'csharp',
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  java: 'java',
  ruby: 'ruby',
  go: 'go',
  rust: 'rust',
  swift: 'swift',
  kotlin: 'kotlin',
  scala: 'scala',
  haskell: 'haskell',
  sql: 'sql',
  html: 'html',
  css: 'css',
  json: 'json',
  yaml: 'yaml',
  markdown: 'markdown',
  bash: 'bash',
};

export default function PasteForm() {
  const [content, setContent] = useState('');
  const [syntax, setSyntax] = useState('text');
  const [expiresIn, setExpiresIn] = useState('1h');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pasteUrl, setPasteUrl] = useState('');
  const [hasCopied, setHasCopied] = useState(false);

  // Auto-detect language when content changes
  useEffect(() => {
    if (content.trim().length > 10) {
      // Use flourite's built-in tuning options for better detection
      const detected = flourite(content, {
        shiki: true, // Use Shiki language specifications
        noUnknown: true, // Skip unknown results
        heuristic: true, // Enable pattern detection at the start of content
      }).language;
      const mappedLanguage = LANGUAGE_MAP[detected] || 'text';
      setSyntax(mappedLanguage);
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/paste', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          syntax,
          expiresIn,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create paste');
      }

      const data = await response.json();
      const url = `${window.location.origin}/p/${data.slug}`;
      setPasteUrl(url);
      toast.success('Paste created successfully!');
    } catch (error) {
      console.error('Error creating paste:', error);
      toast.error('Failed to create paste');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(pasteUrl);
      setHasCopied(true);
      toast.success('URL copied to clipboard!');
      setTimeout(() => setHasCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
      toast.error('Failed to copy URL');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {pasteUrl && (
        <div className='p-4 rounded-lg bg-muted/50 border backdrop-blur-sm animate-in fade-in-0 slide-in-from-top-4'>
          <p className='text-sm font-medium mb-2 text-muted-foreground'>
            Paste URL
          </p>
          <div className='flex items-center gap-2'>
            <input
              type='text'
              value={pasteUrl}
              readOnly
              className='flex-1 px-3 py-2 text-sm rounded-md border bg-background/50 font-mono shadow-sm'
            />
            <Button
              type='button'
              size='icon'
              variant='outline'
              onClick={handleCopyUrl}
              className='shrink-0 hover:bg-background/80'
            >
              {hasCopied ? (
                <Check className='h-4 w-4 text-green-500' />
              ) : (
                <Copy className='h-4 w-4' />
              )}
            </Button>
          </div>
        </div>
      )}

      <div className='space-y-2'>
        <Label htmlFor='content' className='text-sm font-medium'>
          Code
        </Label>
        <Textarea
          id='content'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='Paste your code here...'
          className='h-[400px] max-h-[400px] font-mono bg-background/50 backdrop-blur-sm resize-none border-muted focus-visible:ring-primary/20 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30'
          required
        />
      </div>

      <div className='grid grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <Label htmlFor='syntax' className='text-sm font-medium'>
            Syntax
          </Label>
          <Select value={syntax} onValueChange={setSyntax}>
            <SelectTrigger
              id='syntax'
              className='w-full bg-background/50 backdrop-blur-sm'
            >
              <SelectValue placeholder='Select syntax' />
            </SelectTrigger>
            <SelectContent className='max-h-[300px]'>
              <SelectItem value='text'>Plain Text</SelectItem>
              <SelectItem value='javascript'>JavaScript</SelectItem>
              <SelectItem value='typescript'>TypeScript</SelectItem>
              <SelectItem value='python'>Python</SelectItem>
              <SelectItem value='java'>Java</SelectItem>
              <SelectItem value='cpp'>C++</SelectItem>
              <SelectItem value='csharp'>C#</SelectItem>
              <SelectItem value='php'>PHP</SelectItem>
              <SelectItem value='ruby'>Ruby</SelectItem>
              <SelectItem value='go'>Go</SelectItem>
              <SelectItem value='rust'>Rust</SelectItem>
              <SelectItem value='swift'>Swift</SelectItem>
              <SelectItem value='kotlin'>Kotlin</SelectItem>
              <SelectItem value='scala'>Scala</SelectItem>
              <SelectItem value='haskell'>Haskell</SelectItem>
              <SelectItem value='sql'>SQL</SelectItem>
              <SelectItem value='html'>HTML</SelectItem>
              <SelectItem value='css'>CSS</SelectItem>
              <SelectItem value='json'>JSON</SelectItem>
              <SelectItem value='yaml'>YAML</SelectItem>
              <SelectItem value='markdown'>Markdown</SelectItem>
              <SelectItem value='bash'>Bash</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='expiresIn' className='text-sm font-medium'>
            Expires In
          </Label>
          <Select value={expiresIn} onValueChange={setExpiresIn}>
            <SelectTrigger
              id='expiresIn'
              className='w-full bg-background/50 backdrop-blur-sm'
            >
              <SelectValue placeholder='Select expiration' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='1h'>1 Hour</SelectItem>
              <SelectItem value='1d'>1 Day</SelectItem>
              <SelectItem value='1w'>1 Week</SelectItem>
              <SelectItem value='1m'>1 Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type='submit'
        disabled={isSubmitting}
        className='w-full bg-primary/90 hover:bg-primary transition-colors shadow-lg'
      >
        {isSubmitting ? (
          <span className='flex items-center gap-2'>
            <div className='size-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
            Creating...
          </span>
        ) : (
          'Create Paste'
        )}
      </Button>
    </form>
  );
}
