# Pastebin

A modern pastebin application built with Next.js 15, TypeScript, Tailwind CSS, ShadCN UI, MongoDB, and Shiki.

## Features

- Create and share text/code snippets with unique URLs
- Syntax highlighting for multiple programming languages
- Dark mode support
- Auto-expiring pastes (6h, 1d, 3d, 7d)
- Copy to clipboard functionality
- Report inappropriate content
- Responsive design

## Prerequisites

- Node.js 18+ and npm
- MongoDB instance

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pastebin.git
   cd pastebin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/pastebin
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `MONGODB_URI`: MongoDB connection string

## Tech Stack

- [Next.js 15](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.com/)
- [MongoDB](https://www.mongodb.com/)
- [Shiki](https://shiki.style/)
- [Sonner](https://sonner.emilkowal.ski/)

## License

MIT
