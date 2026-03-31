import React from 'react'

function page() {

    const services = [
        {
            title: "Web Development",
            desc: "We create fast, responsive and modern websites using Next.js and latest technologies.",
            icon: "💻",
        },
        {
            title: "UI/UX Design",
            desc: "Beautiful and user-friendly designs that enhance user experience.",
            icon: "🎨",
        },
        {
            title: "App Development",
            desc: "High-performance mobile and web applications tailored to your needs.",
            icon: "📱",
        },
        {
            title: "SEO Optimization",
            desc: "Improve your website ranking and visibility on search engines.",
            icon: "📈",
        },
        {
            title: "API Integration",
            desc: "Seamless integration of third-party APIs into your applications.",
            icon: "🔗",
        },
        {
            title: "Cloud Services",
            desc: "Deploy and manage scalable apps on cloud platforms.",
            icon: "☁️",
        },
    ];
    return (
        <div>
            <h1 className='text-5xl text-center text-blue-800'>HELLO THIS IS SERVICES PAGE</h1>
            <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-16">

                <div className="max-w-6xl mx-auto">

                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
                        Our Services
                    </h1>

                    <p className="text-gray-400 text-center mb-12">
                        We provide high-quality digital solutions to grow your business 🚀
                    </p>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">

                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 hover:bg-gray-700 transition duration-300 border border-gray-700"
                            >
                                <div className="text-4xl mb-4">{service.icon}</div>

                                <h2 className="text-xl font-semibold mb-2">
                                    {service.title}
                                </h2>

                                <p className="text-gray-400">
                                    {service.desc}
                                </p>
                            </div>
                        ))}

                    </div>

                </div>

            </section>
        </div>
    )
}

export default page