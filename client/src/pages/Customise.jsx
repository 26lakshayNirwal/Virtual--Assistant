import React, { useContext, useRef, useState } from 'react'
import Card from '../components/Card'
import image1 from '../assets/image1.avif'
import image2 from '../assets/images2.jpeg'
import image3 from '../assets/image3.webp'
import image4 from '../assets/image4.webp'
import image5 from '../assets/image5.webp'
import { LuImagePlus } from "react-icons/lu";
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { IoMdArrowRoundBack } from "react-icons/io";


const Customise = () => {

    const {serverUrl,userData, setUserData,frontendImage, setFrontendImage,
    backendImage, setBackendImage,selectedImage, setSelectedImage}= useContext(userDataContext);
    
    const inputImage = useRef(null);
    const navigate = useNavigate();

    const handleImage = (e) => {
        const file = e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353]
    flex justify-center items-center gap-[20px] flex-col p-[20px]'>

      <IoMdArrowRoundBack className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>navigate("/")}/>
      

        <h1 className='text-white text-[30px] text-center font-bold mb-[30px]'>Select Your <span className='text-blue-400'>Assistant Image</span></h1>

      <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[20px]'>
        <Card image={image1}/>
        <Card image={image2}/>
        <Card image={image3}/>
        <Card image={image4}/>
        <Card image={image5}/>
      <div className={`w-[70px] h-[140px] lg:w-[130px] lg:h-[220px] bg-[#030326] border-2
       border-[#0000ff39] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-900 cursor-pointer
         hover:border-4 hover:border-white flex justify-center items-center 
         ${selectedImage === "input" ? 'border-4 border-white shadow-2xl shadow-blue-900' : null}`}
         onClick={() => {
            inputImage.current.click();
            setSelectedImage("input"); 
         } }>
            {!frontendImage && <LuImagePlus className='text-white w-[25px] h-[25px]' />}
            {frontendImage && <img src={frontendImage} className='h-full object-cover'  />}
        
      </div>
      <input type='file' accept='image/*' ref={inputImage} hidden onChange={handleImage}/>
      </div>
      {selectedImage && <button className='mt-[20px] min-w-[150px] h-[50px] bg-white
       hover:bg-blue-600 hover:text-white text-black rounded-full text-[18px] 
       font-semibold transition-all duration-200 cursor-pointer'
       onClick={()=> navigate("/customise2")}
       >
        Next
        </button> }
    </div>
  )
}

export default Customise
