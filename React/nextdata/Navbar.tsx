import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200 py-4 px-6 flex justify-between items-center">
      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Website
      </div>
      <div className="space-x-8 font-medium text-gray-700">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <Link href="/about" className="hover:text-blue-600 transition-colors">About</Link>
        <Link href="/services" className="hover:text-blue-600 transition-colors">Services</Link>
        <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
      </div>
      <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
        Get Started
      </button>
    </nav>
  );
}