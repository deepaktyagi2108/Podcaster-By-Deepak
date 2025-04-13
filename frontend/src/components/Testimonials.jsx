import React from 'react';
import { FaLinkedin } from 'react-icons/fa'; 

const testimonials = [
  {
    name: "Mohd. Sami Bhat",
    role: "Developer",
    quote: "Podcaster made sharing my voice so easy. Super clean interface!",
    linkedin: "https://www.linkedin.com/in/muhammad-sami-bhat/"
  },
  {
    name: "Vikas Kumar Kaushal",
    role: "Student",
    quote: "Finally, one place to listen to everything I love!",
    linkedin: "https://www.linkedin.com/in/vikas-kumar-kaushal-80b5bb28a/"
  },
  {
    name: "Sparsh ",
    role: "Student",
    quote: "I discovered so many useful podcasts for learning!",
    linkedin: "https://www.linkedin.com/in/sparsh-kh23/"
  }
];

const Testimonials = () => {
  return (
    <div className="py-12 px-6 bg-green-50">
      <h2 className="text-3xl font-bold text-center mb-8">What People Are Saying</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow hover:bg-gray-50">
            <p className="text-gray-700 italic">“{t.quote}”</p>

            {/* 👇 Name with LinkedIn icon */}
            <p className="mt-4 font-semibold flex items-center gap-2">
              {t.name}
              <a
                href={t.linkedin}
                target="_blank"
               // rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
                title="Visit LinkedIn"
              >
                <FaLinkedin size={18} />
              </a>
            </p>

            <p className="text-sm text-zinc-500">{t.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
