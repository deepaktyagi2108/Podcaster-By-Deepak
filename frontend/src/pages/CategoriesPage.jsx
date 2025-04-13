import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PodcastCard from '../components/PodcastCard/PodcastCard';
const CategoriesPage = () => {
    const  {cat}=useParams();
    const [Podcasts, setPodcasts] = useState();
  
    useEffect(() => {
      const fetch = async () => {
       
          const res = await axios.get(`http://localhost:1000/api/v1/podcast/category/${cat}`,
            {withCredentials:true});
          setPodcasts(res.data.data);
  };
     
   
  
      fetch();
    }, []);


  return(
   <div className='px-4 py-4 lg:px-12 '>
<h1 className='text-xl font-semibold'>{cat}</h1>
<div className="w-full lg:px-12 py-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {Podcasts&&
      Podcasts.map((items, i) => (
        <div key={i}>
          <PodcastCard items={items}/>{" "}
        </div>
      ))}
      {Podcasts && Podcasts.length===0&& <div className="text-3xl font-bold h-screen flex items-center justify-center  w-[100%] text-zinc-700">{""}
        
        <h1 className="text-3xl font-bold text-zinc-700 whitespace-nowrap">No Podcasts Right Now{""}</h1>
        </div>}
      </div>
  </div>
  )
  
}

export default CategoriesPage