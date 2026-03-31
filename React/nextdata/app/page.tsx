import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-gray-900 text-white">

      {/* 🔷 Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Build Modern Websites 🚀
        </h1>

        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
          We create fast, responsive and scalable web applications using Next.js and Tailwind CSS.
        </p>

        <div className="flex gap-4">
          <Link href="/services">
            <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
              Our Services
            </button>
          </Link>

          <Link href="/contact">
            <button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-black transition">
              Contact Us
            </button>
          </Link>
        </div>

      </section>

      {/* 🔷 Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-10">Why Choose Us?</h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-gray-800 p-6 rounded-xl hover:scale-105 transition">
              <h3 className="text-xl font-semibold mb-2">⚡ Fast</h3>
              <p className="text-gray-400">
                Lightning fast performance with optimized code.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl hover:scale-105 transition">
              <h3 className="text-xl font-semibold mb-2">📱 Responsive</h3>
              <p className="text-gray-400">
                Fully responsive design for all devices.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl hover:scale-105 transition">
              <h3 className="text-xl font-semibold mb-2">🔒 Secure</h3>
              <p className="text-gray-400">
                Security-first approach for safe applications.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 🔷 CTA Section */}
      <section className="py-16 px-6 bg-indigo-600 text-center">
        
        <h2 className="text-3xl font-bold mb-4">
          Ready to Start Your Project?
        </h2>

        <p className="mb-6 text-gray-200">
          Let’s build something amazing together 💡
        </p>

        <Link href="/contact">
          <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
            Get in Touch
          </button>
        </Link>

      </section>

    </main>
  );
}