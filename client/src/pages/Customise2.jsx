import React, { useContext, useEffect, useState } from 'react'
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const Customise2 = () => {

    const {serverUrl,userData, backendImage , selectedImage , setUserData} = useContext(userDataContext);
    const [assistantName, setAssistantName] = useState(userData?.assistantName || '');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUpdateAssistant = async () => {
      setLoading(true);
      try {
        let formData = new FormData();
        formData.append('assistantName', assistantName);

        if(backendImage) {
          formData.append('assistantImage', backendImage);
        }
        else {
          formData.append('imageUrl', selectedImage); // Use the selected image URL if no file is uploaded
        }

        const result = await axios.post(`${serverUrl}/api/user/update`, formData,{withCredentials: true});
        setLoading(false);
        console.log("Update Assistant Result:", result.data);
        setUserData(result.data.user); // Update user data in context
        navigate("/"); // Redirect to home after updating
      } catch (error) {
        setLoading(false);
        console.log("Update Assistant Error:", error);
      }
      
      
    }


  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353]
    flex justify-center items-center gap-[20px] flex-col p-[20px] relative'>
       <IoMdArrowRoundBack className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>navigate("/customise")}/>
        <h1 className='text-white text-[30px] text-center font-bold mb-[30px]'>Enter Your <span className='text-blue-400'>Assistant Name</span></h1>
        
         <input
          type='text'
          placeholder='eg. Jarvis, Alexa, etc.'
          className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent 
          text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'
          required 
          onChange={(e) => setAssistantName(e.target.value)}
          value={assistantName}
        />

        {assistantName && <button className='mt-[20px] min-w-[150px] h-[50px] bg-white
       hover:bg-blue-600 hover:text-white text-black rounded-full text-[18px] 
       font-semibold transition-all duration-200 cursor-pointer'
        disabled={loading}
       onClick={()=> {
        handleUpdateAssistant();
       }}>
        {loading ? "Loading..." : "Next"}
        </button>}
        

    </div>
  )
}

export default Customise2
