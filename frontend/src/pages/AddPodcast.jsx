import React from 'react'
import { useSelector } from 'react-redux'
import ErrorPage from './ErrorPage';
import InputPodcast from '../components/AddPodcast/InputPodcast';

const AddPodcast = () => {
    const isLoggedIn=useSelector((state)=>state.auth.isLoggedIn);
  return <div>
    {isLoggedIn? <InputPodcast />:<ErrorPage />}</div>
}

export default AddPodcast