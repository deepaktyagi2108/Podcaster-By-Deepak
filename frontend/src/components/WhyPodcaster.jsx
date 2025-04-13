
import React from 'react';
import { Headphones, UploadCloud, Smartphone, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: <Headphones size={32} />,
    title: 'Easy Listening',
    desc: 'Stream your favorite podcasts with a single click.',
  },
  {
    icon: <UploadCloud size={32} />,
    title: 'One-Click Upload',
    desc: 'Easily share your voice with the world.',
  },
  {
    icon: <Smartphone size={32} />,
    title: 'Mobile Friendly',
    desc: 'Fully responsive design for all devices.',
  },
  {
    icon: <ShieldCheck size={32} />,
    title: 'Secure User Authentication',
    desc: 'Login and signup features with protected routes ensure a personalized and secure experience.',
  },
];

const WhyPodcaster = () => {
  return (
    <div className="py-12 px-6 bg-white text-center">
      <h2 className="text-3xl font-bold mb-8">Why Podcaster?</h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        {features.map((f, i) => (
          <div key={i} className="bg-green-100 p-6 rounded-xl shadow hover:shadow-lg transition-all">
            <div className="flex justify-center mb-4 text-green-800">{f.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-sm text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyPodcaster;

