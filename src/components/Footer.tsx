export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='w-full py-6 mt-auto'>
      <div className='flex justify-center w-full px-4'>
        <div className='w-full max-w-4xl text-center text-sm text-muted-foreground'>
          © {currentYear} paste.zhd.app. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
