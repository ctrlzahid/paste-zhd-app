import PasteView from '@/components/PasteView';
import { headers } from 'next/headers';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getPaste(slug: string) {
  try {
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    const res = await fetch(
      `${protocol}://${host}/api/p/${slug}?slug=${slug}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch paste');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching paste:', error);
    throw new Error('Failed to fetch paste');
  }
}

export default async function PastePage({ params }: PageProps) {
  const { slug } = await params;
  const paste = await getPaste(slug);

  if (!paste) {
    return (
      <main className='flex-1 bg-gradient-to-b from-background to-background/95'>
        <div className='container mx-auto px-4 py-12 max-w-4xl'>
          <div className='backdrop-blur-sm bg-card/50 border rounded-xl p-6 shadow-lg'>
            <PasteView notFound={true} />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className='flex-1 bg-gradient-to-b from-background to-background/95'>
      <div className='container mx-auto px-4 py-12 max-w-4xl'>
        <div className='backdrop-blur-sm bg-card/50 border rounded-xl p-6 shadow-lg'>
          <PasteView
            content={paste.content}
            syntax={paste.syntax}
            createdAt={paste.createdAt}
            expiresAt={paste.expiresAt}
            slug={slug}
          />
        </div>
      </div>
    </main>
  );
}
