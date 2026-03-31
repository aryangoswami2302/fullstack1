import React from 'react'

function page() {
  return (
    <div>
        <h1 className='text-5xl text-center text-blue-800'>HELLO ARYAN</h1>
         <section className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center px-6">
      <div className="max-w-5xl w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-10">
        
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
          About Us
        </h1>

        <p className="text-lg text-center text-gray-200 mb-10">
          We build modern, scalable and beautiful web applications using the latest technologies like Next.js and Tailwind CSS.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          
          <div className="bg-white/20 p-6 rounded-xl hover:scale-105 transition duration-300">
            <h2 className="text-xl font-semibold mb-2">🚀 Our Mission</h2>
            <p className="text-gray-200">
              Deliver high-quality web solutions that solve real-world problems.
            </p>
          </div>

          <div className="bg-white/20 p-6 rounded-xl hover:scale-105 transition duration-300">
            <h2 className="text-xl font-semibold mb-2">💡 Innovation</h2>
            <p className="text-gray-200">
              We focus on creativity and modern UI/UX for better user experience.
            </p>
          </div>

          <div className="bg-white/20 p-6 rounded-xl hover:scale-105 transition duration-300">
            <h2 className="text-xl font-semibold mb-2">🌍 Global Reach</h2>
            <p className="text-gray-200">
              Our applications are designed for users all around the world.
            </p>
          </div>

        </div>

      </div>
    </section>
    </div>
  )
}

export default page