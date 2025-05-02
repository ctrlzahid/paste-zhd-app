'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { codeToHtml } from 'shiki';
import {
  Copy,
  Check,
  FileX,
  Download,
  FileText,
  QrCode,
  File,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Mapping of syntax to file extensions
const SYNTAX_TO_EXTENSION: { [key: string]: string } = {
  typescript: 'ts',
  javascript: 'js',
  python: 'py',
  java: 'java',
  csharp: 'cs',
  cpp: 'cpp',
  c: 'c',
  ruby: 'rb',
  php: 'php',
  go: 'go',
  rust: 'rs',
  swift: 'swift',
  kotlin: 'kt',
  scala: 'scala',
  html: 'html',
  css: 'css',
  json: 'json',
  yaml: 'yml',
  markdown: 'md',
  sql: 'sql',
  shell: 'sh',
  powershell: 'ps1',
  dockerfile: 'dockerfile',
  plaintext: 'txt',
};

// Popular file extensions for manual selection
const POPULAR_EXTENSIONS = [
  'txt',
  'json',
  'ts',
  'js',
  'py',
  'cs',
  'java',
  'cpp',
  'html',
  'css',
  'md',
  'sql',
  'yml',
  'sh',
];

// Add this constant at the top with other constants
const MAX_FILENAME_LENGTH = 32;

interface PasteViewProps {
  content?: string;
  syntax?: string;
  createdAt?: string;
  expiresAt?: string;
  slug?: string;
  notFound?: boolean;
}

// Add this function with other utility functions/constants
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

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
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [selectedExtension, setSelectedExtension] = useState<string>('');
  const [fileName, setFileName] = useState(`paste-${slug}`);

  useEffect(() => {
    setCurrentUrl(window.location.href);
    // Set default extension based on syntax
    if (syntax && SYNTAX_TO_EXTENSION[syntax]) {
      setSelectedExtension(SYNTAX_TO_EXTENSION[syntax]);
    } else {
      setSelectedExtension('txt');
    }
    // Set default filename when slug changes
    setFileName(`paste-${slug}`);
  }, [syntax, slug]);

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

  const handleSaveQR = () => {
    const svg = document.querySelector('.qr-code svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `paste-${slug}-qr.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveContent = () => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.${selectedExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowSaveDialog(false);
  };

  const handleOpenRaw = () => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    // Clean up the URL after a delay to ensure the new tab has loaded
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value.slice(0, MAX_FILENAME_LENGTH);
    setFileName(newName);
  };

  // Add this function inside the component
  const getFileSize = (): number => {
    if (!content) return 0;
    // Use TextEncoder to get accurate byte size for UTF-8 text
    return new TextEncoder().encode(content).length;
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
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
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy link</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        type='button'
                        size='icon'
                        variant='ghost'
                        className='h-8 w-8 shrink-0'
                      >
                        <QrCode className='h-4 w-4' />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>QR Code for Paste</DialogTitle>
                      </DialogHeader>
                      <div className='flex flex-col items-center gap-4'>
                        <div className='qr-code bg-white p-4 rounded-lg'>
                          <QRCodeSVG value={currentUrl} size={256} />
                        </div>
                        <Button variant='outline' onClick={handleSaveQR}>
                          <Download className='h-4 w-4 mr-2' />
                          Save QR Code
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Show QR code</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
        <div className='flex justify-end gap-2 mb-2'>
          <Button variant='outline' size='sm' onClick={handleOpenRaw}>
            <FileText className='h-4 w-4 mr-2' />
            Raw
          </Button>

          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button variant='outline' size='sm'>
                <Download className='h-4 w-4 mr-2' />
                Download
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Download File</DialogTitle>
              </DialogHeader>
              <div className='space-y-6'>
                <div className='flex items-center gap-4'>
                  <div className='p-4 border rounded-lg bg-muted/50'>
                    <File className='h-8 w-8 text-muted-foreground' />
                  </div>
                  <div className='flex-1 space-y-1'>
                    <div className='flex items-center gap-2'>
                      <div className='flex-1 space-y-1'>
                        <div className='relative'>
                          <Input
                            value={fileName}
                            onChange={handleFileNameChange}
                            className='pr-16'
                            placeholder='File name'
                            maxLength={MAX_FILENAME_LENGTH}
                          />
                          <div className='absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground'>
                            {fileName.length}/{MAX_FILENAME_LENGTH}
                          </div>
                        </div>
                      </div>
                      <Select
                        value={selectedExtension}
                        onValueChange={setSelectedExtension}
                      >
                        <SelectTrigger className='w-24'>
                          <SelectValue placeholder='ext' />
                        </SelectTrigger>
                        <SelectContent>
                          {POPULAR_EXTENSIONS.map((ext) => (
                            <SelectItem key={ext} value={ext}>
                              .{ext}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      {formatFileSize(getFileSize())}
                    </p>
                  </div>
                </div>
                <div className='flex justify-end'>
                  <Button onClick={handleSaveContent} className='w-full'>
                    <Download className='h-4 w-4 mr-2' />
                    Download {fileName}.{selectedExtension}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant='outline'
            size='sm'
            onClick={handleCopy}
            className='gap-1.5'
          >
            {hasCopiedContent ? (
              <>
                <Check className='h-4 w-4' />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className='h-4 w-4' />
                <span>Copy code</span>
              </>
            )}
          </Button>
        </div>

        <div
          className='p-4 bg-[#24292e] overflow-auto min-h-[200px] max-h-[70vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#24292e] [&::-webkit-scrollbar-thumb]:bg-[#424a53] [&::-webkit-scrollbar-thumb]:rounded-lg hover:[&::-webkit-scrollbar-thumb]:bg-[#545d68] [&::-webkit-scrollbar-corner]:bg-[#24292e] pr-6'
          dangerouslySetInnerHTML={{ __html: highlightedContent }}
        />
      </div>
    </div>
  );
}
