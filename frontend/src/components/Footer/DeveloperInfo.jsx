import React from 'react';

const DeveloperInfo = () => {
  return (
    <div className="bg-white py-8 border-t mt-12 shadow-inner">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-xl font-semibold text-gray-800">💻 Developed by</h2>
        <p className="mt-2 text-lg font-bold text-green-700">Deepak Tyagi</p>
        <p className=" text-gray-600 text-xl">Aspiring Software Developer | MERN Stack</p>
        <a
          href="https://www.linkedin.com/in/deepak-tyagi-956523262/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-blue-600 hover:underline font-medium"
        >
          Connect on LinkedIn
        </a>
      </div>
    </div>
  );
};

export default DeveloperInfo;
