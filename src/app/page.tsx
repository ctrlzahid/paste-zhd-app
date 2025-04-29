import PasteForm from '@/components/PasteForm';

export const metadata = {
  title: 'paste.zhd.app - Share code in a snap',
  description:
    'Instantly share your code snippets with paste.zhd.app. Fast, simple, and reliable code sharing platform.',
};

export default function Home() {
  return (
    <main className='flex-1 bg-gradient-to-b from-background to-background/95'>
      <div className='container mx-auto px-4 py-12 max-w-4xl'>
        <div className='backdrop-blur-sm bg-card/50 border rounded-xl p-6 shadow-lg'>
          <PasteForm />
        </div>
      </div>
    </main>
  );
}
