import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy & Terms - paste.zhd.app',
  description: 'Privacy policy and terms of service for paste.zhd.app',
};

export default function LegalPage() {
  return (
    <main className='flex-1 bg-gradient-to-b from-background to-background/95'>
      <div className='container max-w-3xl px-4 py-12'>
        <div className='space-y-12'>
          {/* Privacy Policy Section */}
          <section className='prose prose-invert max-w-none'>
            <h1>Privacy Policy for paste.zhd.app</h1>
            <p className='text-muted-foreground'>
              Effective Date: March 19, 2024
            </p>

            <p>
              At paste.zhd.app ("we", "our", "us"), we are committed to
              protecting your privacy and maintaining transparency about how we
              collect, use, and protect your information.
            </p>

            <h2>1. Information We Collect</h2>

            <h3>a. Content Data</h3>
            <p>
              When you submit a paste, we store the content, selected syntax,
              expiry time, and a generated slug to make it accessible by URL.
            </p>

            <h3>b. Technical Information</h3>
            <p>
              We collect IP addresses and user agent data to monitor abuse,
              detect malicious activity, and understand basic usage analytics.
              This data is stored securely and not shared with third parties.
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
                To automatically expire and delete pastes after their set
                duration
              </li>
              <li>To detect abuse and maintain platform safety</li>
              <li>To improve our service performance and UX</li>
            </ul>

            <h2>3. Paste Expiry and Deletion</h2>
            <p>
              All pastes have a maximum expiry of 7 days. Expired pastes are
              permanently deleted from our servers. You cannot recover them
              after expiry.
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
              <a href='mailto:support@zhd.app'>support@zhd.app</a>
            </p>
          </section>

          {/* Terms & Conditions Section */}
          <section className='prose prose-invert max-w-none'>
            <h1>Terms & Conditions for paste.zhd.app</h1>
            <p className='text-muted-foreground'>
              Effective Date: March 19, 2024
            </p>

            <p>Welcome to paste.zhd.app — a free, temporary pastebin tool.</p>

            <h2>1. Usage</h2>
            <p>
              You agree to use this service for lawful purposes only. Any
              content that violates laws, promotes violence, racism, hate
              speech, or illegal activity is strictly prohibited.
            </p>

            <h2>2. Temporary Storage</h2>
            <p>
              All pastes are temporary and auto-deleted after their expiry. This
              service is provided "as-is" with no guarantee of permanent storage
              or availability.
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
              We may modify these terms at any time. Continued use of the
              service implies acceptance of any changes.
            </p>

            <h2>7. Contact</h2>
            <p>
              For legal questions, email:{' '}
              <a href='mailto:legal@zhd.app'>legal@zhd.app</a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
