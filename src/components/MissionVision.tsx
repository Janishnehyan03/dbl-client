import React from 'react';

const MissionVision: React.FC = () => {
    return (
        <div className="bg-gray-50 py-16 px-8 lg:px-32">
            <div className="max-w-5xl mx-auto text-center">
                <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Our Mission and Vision</h2>
                <p className="text-lg text-gray-600 mb-12">
                    Guiding our community toward knowledge, growth, and inspiration.
                </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-12 text-left">
                {/* Mission Section */}
                <section className="transition-transform transform hover:scale-105">
                    <h3 className="text-3xl font-semibold text-blue-700 mb-4">Mission</h3>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        Our mission is to empower our community by providing access to knowledge,
                        fostering lifelong learning, and promoting cultural and intellectual engagement.
                        We strive to create an inclusive environment where all users feel welcome, informed,
                        and inspired to pursue their educational, professional, and personal growth.
                    </p>
                </section>

                {/* Vision Section */}
                <section className="transition-transform transform hover:scale-105">
                    <h3 className="text-3xl font-semibold text-green-700 mb-4">Vision</h3>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        We envision a future where everyone has the tools and resources needed to explore, discover,
                        and create. By offering a rich collection of resources, cutting-edge technology, and expert guidance,
                        we aim to be a central hub of knowledge and innovation for the community, supporting learning,
                        research, and discovery for generations to come.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default MissionVision;
