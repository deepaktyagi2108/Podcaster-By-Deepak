import React from 'react';
import { Link } from "react-router-dom";
import WhyPodcaster from '../components/WhyPodcaster';
import Testimonials from '../components/Testimonials';
import DeveloperInfo from '../components/Footer/DeveloperInfo'; // ✅ Import here

export const Home = () => {
  return (
    <>
      <div className='bg-green-100 px-12 min-h-screen flex flex-col items-center justify-center'>
        <div className='w-full flex items-center justify-between gap-4'>
          <div className='w-full lg:w-5/6'>
            <h1 className='text-4xl md:text-6xl font-bold'>
              Create & listen to the <br />
              <span className='flex items-end'>
                p
                <img
                  src="https://cdn-icons-png.flaticon.com/128/2113/2113324.png"
                  alt="Headphones"
                  className='h-10 md:12 lg:h-20 mx-2'
                />
                dcast
              </span>
            </h1>
          </div>

          <div className='hidden lg:block w-1/6'>
            <div
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              className='py-4 border border-black text-xl font-semibold rounded-full text-center -rotate-90 cursor-pointer'
            >
              Scroll Down
            </div>
          </div>
        </div>

        <div className='mt-12 w-full flex flex-col lg:flex-row items-end justify-between'>
          <div>
            <p className='text-xl font-semibold'>
              Listen to the most popular podcasts on just one platform - <b>PODCASTER</b>
            </p>
            <br />
            <Link to="/login">
              <button className='px-6 py-4 bg-green-900 text-white font-semibold rounded-full mt-8 cursor-pointer'>
                Login to listen
              </button>
            </Link>
          </div>

          <div>
            <p className='text-zinc-600 font-bold'>
              Our app contains more than 200 podcasts for you
            </p>
          </div>
        </div>
      </div>

      <WhyPodcaster />
      <Testimonials />
      <DeveloperInfo /> 
    </>
  );
};

export default Home;


