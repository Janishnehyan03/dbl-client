import React from "react";

const ContactUsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="container mx-auto px-6 lg:px-16">
                <h1 className="text-4xl font-bold text-center text-teal-900 mb-6">
                    Get in Touch
                </h1>
                <p className="text-center text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
                    We'd love to hear from you! Whether you have a question about our services,
                    need assistance, or just want to provide feedback.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                            Send us a Message
                        </h2>
                        <form className="space-y-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Your Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Your Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Your Message</label>
                                <textarea
                                    rows={5}
                                    placeholder="Write your message here..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-all"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div className="bg-white shadow-lg rounded-lg p-8 flex items-start">
                            <div className="text-teal-600 text-3xl mr-4">📍</div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Address</h3>
                                <p className="text-gray-600">Darul Huda Islamic University
                                    Hidaya Nagar, Chemmad
                                    Tirurangadi PO
                                    Malappuram Dist.
                                    Pin: 676306
                                    Kerala, India</p>
                            </div>
                        </div>

                        <div className="bg-white shadow-lg rounded-lg p-8 flex items-start">
                            <div className="text-teal-600 text-3xl mr-4">📞</div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
                                <p className="text-gray-600">+91 494 246 3155</p>
                                <p className="text-gray-600">+91 494 246 3155</p>
                                <p className="text-gray-600">+91 494 246 3155</p>
                            </div>
                        </div>

                        <div className="bg-white shadow-lg rounded-lg p-8 flex items-start">
                            <div className="text-teal-600 text-3xl mr-4">✉️</div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h3>
                                <p className="text-gray-600">
                                librarian@dhiu.in</p>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default ContactUsPage;
