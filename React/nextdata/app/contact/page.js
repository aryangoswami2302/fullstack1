import React from 'react'

function page() {
    return (
        <div>
            <h1 className='text-5xl text-center text-blue-800'>HELLO THIS IS CONTACT PAGE</h1>
            <section className="min-h-screen bg-gray-900 flex items-center justify-center px-6">
                <div className="max-w-4xl w-full bg-gray-800 p-10 rounded-2xl shadow-xl">

                    <h1 className="text-4xl font-bold text-white text-center mb-6">
                        Contact Us
                    </h1>

                    <p className="text-gray-400 text-center mb-8">
                        Feel free to reach out to us anytime. We’d love to hear from you!
                    </p>

                    <form className="grid gap-6">

                        <input
                            type="text"
                            placeholder="Your Name"
                            className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <input
                            type="email"
                            placeholder="Your Email"
                            className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <textarea
                            rows="5"
                            placeholder="Your Message"
                            className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        ></textarea>

                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 transition duration-300 text-white py-3 rounded-lg font-semibold"
                        >
                            Send Message 🚀
                        </button>

                    </form>

                </div>
            </section>
        </div>
    )
}

export default page