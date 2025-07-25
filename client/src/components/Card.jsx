import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

const Card = ({image}) => {

    const {serverUrl,userData, setUserData,frontendImage, setFrontendImage,
    backendImage, setBackendImage,selectedImage, setSelectedImage} = useContext(userDataContext);
  return (
    <div className={`w-[70px] h-[140px] lg:w-[130px] lg:h-[220px] bg-[#030326] border-2
    border-[#0000ff39] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-900 cursor-pointer
    hover:border-4 hover:border-white ${selectedImage === image ? 'border-4 border-white shadow-2xl shadow-blue-900' : null}`} 
    onClick={()=> {
        setSelectedImage(image);
        setFrontendImage(null);
        setBackendImage(null); // Reset backend image if a predefined image is selected
    }}
    >
        <img src={image} className='h-full object-cover'/>
      
    </div>
  )
}

export default Card
