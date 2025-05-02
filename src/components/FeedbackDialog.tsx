'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function FeedbackDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      toast.success('Thank you for your feedback!');
      setMessage('');
      setEmail('');
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant='ghost'
        className='text-sm text-muted-foreground hover:text-foreground transition-colors'
        onClick={() => setIsOpen(true)}
      >
        Feedback
      </Button>
    );
  }

  return (
    <Card className='fixed bottom-20 right-4 w-96 z-50 animate-in slide-in-from-bottom-5'>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Send Feedback</CardTitle>
          <CardDescription>
            Help us improve paste.zhd.app with your feedback
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='message'>Your feedback</Label>
            <Textarea
              id='message'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What's on your mind?"
              required
              className='min-h-[100px]'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email (optional)</Label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='your@email.com'
            />
          </div>
        </CardContent>
        <CardFooter className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='ghost'
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Feedback'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
