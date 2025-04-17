import React from "react";

const MissionVision: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 tracking-tight">
            Our Commitment to Knowledge
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Empowering our community through education, discovery, and connection.
          </p>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Mission Card */}
          <div
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300"
            role="region"
            aria-labelledby="mission-heading"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3
                id="mission-heading"
                className="ml-4 text-2xl font-semibold text-gray-900"
              >
                Our Mission
              </h3>
            </div>
            <p className="text-gray-700 text-base leading-relaxed">
              We are dedicated to fostering an inclusive environment that
              provides equitable access to knowledge and resources. Our
              mission is to inspire lifelong learning, support intellectual
              curiosity, and cultivate a vibrant community of readers,
              thinkers, and creators through exceptional library services.
            </p>
          </div>

          {/* Vision Card */}
          <div
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300"
            role="region"
            aria-labelledby="vision-heading"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3 9a9 9 0 100-18 9 9 0 000 18z"
                  />
                </svg>
              </div>
              <h3
                id="vision-heading"
                className="ml-4 text-2xl font-semibold text-gray-900"
              >
                Our Vision
              </h3>
            </div>
            <p className="text-gray-700 text-base leading-relaxed">
              We aspire to be a cornerstone of learning and innovation,
              where cutting-edge technology and diverse collections empower
              exploration and discovery. Our vision is to build a future where
              the library serves as a dynamic hub, connecting people with ideas
              and fostering a culture of knowledge for generations to come.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <a
            href="#learn-more"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Learn More About Us
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MissionVision;