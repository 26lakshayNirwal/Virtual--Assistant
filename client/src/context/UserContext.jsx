import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react'

export const userDataContext = createContext();

const UserContext = ({ children }) => {
  const serverUrl = 'http://localhost:3000';
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () =>{
    try {
        const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
        setUserData(result.data);
        console.log(result.data);
    } catch (error) {
        console.log(error);
    }
  }

  const getGeminiResponse = async (command) => {
      try {
        const result = await axios.post(`${serverUrl}/api/user/ask`, { command }, { withCredentials: true });
        return result.data;
      } catch (error) {
        console.log(error);
      }
  }

  const deleteHistoryPoint = async (index) => {
  try {
    const res = await axios.delete(`${serverUrl}/api/user/history`, {
      withCredentials: true,
      data :{index}
    });
    setUserData(prev => ({ ...prev, history: res.data.history }));
  } catch (error) {
    console.error("Failed to delete history:", error);
  }
};

  useEffect(() => {
    handleCurrentUser();        
    }, []);

  const value = {
    serverUrl,userData, setUserData,frontendImage, setFrontendImage,
    backendImage, setBackendImage,selectedImage, setSelectedImage,
    getGeminiResponse, deleteHistoryPoint
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
};




export default UserContext;
