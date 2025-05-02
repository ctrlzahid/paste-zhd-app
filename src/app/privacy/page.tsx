import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - paste.zhd.app',
  description: 'Privacy policy for paste.zhd.app',
};

export default function PrivacyPage() {
  return (
    <main className='flex-1 bg-gradient-to-b from-background to-background/95'>
      <div className='container max-w-4xl mx-auto px-4 py-12'>
        <article className='prose prose-invert max-w-none'>
          <h1>Privacy Policy for paste.zhd.app</h1>
          <p className='text-muted-foreground'>
            Effective Date: April 30, 2025
          </p>

          <p>
            At paste.zhd.app (&ldquo;we&rdquo;, &ldquo;our&rdquo;,
            &ldquo;us&rdquo;), we are committed to protecting your privacy and
            maintaining transparency about how we collect, use, and protect your
            information.
          </p>

          <h2>1. Information We Collect</h2>

          <h3>a. Content Data</h3>
          <p>
            When you submit a paste, we store the content, selected syntax,
            expiry time, and a generated slug to make it accessible by URL.
          </p>

          <h3>b. Technical Information</h3>
          <p>
            We collect IP addresses and user agent data to monitor abuse, detect
            malicious activity, and understand basic usage analytics. This data
            is stored securely and not shared with third parties.
          </p>

          <h3>c. Cookies and Local Storage</h3>
          <p>
            We may use localStorage to save user preferences (like auto-copy
            settings). No tracking cookies or third-party trackers are used.
          </p>

          <h2>2. How We Use Your Data</h2>
          <ul>
            <li>To provide access to your paste via a unique link</li>
            <li>
              To automatically expire and delete pastes after their set duration
            </li>
            <li>To detect abuse and maintain platform safety</li>
            <li>To improve our service performance and UX</li>
          </ul>

          <h2>3. Paste Expiry and Deletion</h2>
          <p>
            All pastes have a maximum expiry of 7 days. Expired pastes are
            permanently deleted from our servers. You cannot recover them after
            expiry.
          </p>

          <h2>4. Reporting and Abuse</h2>
          <p>
            Users may report pastes for review. Repeatedly reported pastes may
            be auto-deleted. We reserve the right to moderate content that
            violates laws or our terms.
          </p>

          <h2>5. Data Sharing</h2>
          <p>
            We do not sell, trade, or share your data with any third parties.
          </p>

          <h2>6. Security</h2>
          <p>
            We use modern security practices, database encryption, and access
            controls to safeguard your data.
          </p>

          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this policy as needed. Changes will be reflected on
            this page with an updated effective date.
          </p>

          <h2>8. Contact</h2>
          <p>
            For any privacy concerns, reach out to:{' '}
            <a href='mailto:ctrlzahid@gmail.com'>ctrlzahid@gmail.com</a>
          </p>
        </article>
      </div>
    </main>
  );
}
