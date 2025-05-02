import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions - paste.zhd.app',
  description: 'Terms and conditions for paste.zhd.app',
};

export default function TermsPage() {
  return (
    <main className='flex-1 bg-gradient-to-b from-background to-background/95'>
      <div className='container max-w-4xl mx-auto px-4 py-12'>
        <article className='prose prose-invert max-w-none'>
          <h1>Terms & Conditions for paste.zhd.app</h1>
          <p className='text-muted-foreground'>
            Effective Date: April 30, 2025
          </p>

          <p>
            Welcome to paste.zhd.app — a free, temporary, and anonymous pastebin
            tool.
          </p>

          <h2>1. Usage</h2>
          <p>
            You agree to use this service for lawful purposes only. Any content
            that violates laws, promotes violence, racism, hate speech, or
            illegal activity is strictly prohibited.
          </p>

          <h2>2. Temporary Storage</h2>
          <p>
            All pastes are temporary and auto-deleted after their expiry. This
            service is provided &ldquo;as-is&rdquo; with no guarantee of
            permanent storage or availability.
          </p>

          <h2>3. Intellectual Property</h2>
          <p>
            You are responsible for the content you submit. Do not paste
            copyrighted material unless you have the right to share it. We do
            not claim ownership over user-submitted content.
          </p>

          <h2>4. Abuse Prevention</h2>
          <p>
            We reserve the right to delete or block access to pastes that are
            reported or deemed abusive, illegal, or harmful.
          </p>

          <h2>5. Limitations</h2>
          <p>
            We are not liable for data loss, service downtime, or unauthorized
            access. Use this tool at your own risk for temporary data sharing
            only.
          </p>

          <h2>6. Modifications</h2>
          <p>
            We may modify these terms at any time. Continued use of the service
            implies acceptance of any changes.
          </p>

          <h2>7. Contact</h2>
          <p>
            For legal questions, email:{' '}
            <a href='mailto:ctrlzahid@gmail.com'>ctrlzahid@gmail.com</a>
          </p>
        </article>
      </div>
    </main>
  );
}
