import Navbar from '@/Navbar';
import './globals.css';
import Footer from '@/Footer';



export const metadata = {
  title: 'My Attractive Project',
  description: 'Built with Next.js and Tailwind CSS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-white text-slate-900">
       <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}