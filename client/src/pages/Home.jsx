import React, { useContext, useRef, useState, useEffect } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import aiImg from '../assets/AI.gif';
import userImg from '../assets/user.gif';
import axios from 'axios';
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";


const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse, deleteHistoryPoint } = useContext(userDataContext);
  const navigate = useNavigate();

  const [isListening, setIsListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [ham,setHam] = useState(false);

  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  //const isRecognizingRef = useRef(false);
  
  const synthesis = window.speechSynthesis;

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate("/signup");
    } catch (error) {
      console.log(error);
      setUserData(null);
    }
  };

  


  const startRecognition = () =>{
     try {
         recognitionRef.current?.start();
         setIsListening(true);
     } catch (error) {
        if(!error.message.includes("start")) {
          console.error("Error starting recognition:", error);
        }
     }
  }

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    } 
    
    isSpeakingRef.current = true;
    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setTimeout(()=>{
        startRecognition();
      },800);
      
    };
    synthesis.cancel();
    
    synthesis.speak(utterance);
  };

  const handleCommand = (data) => {
  const { type, userInput, response } = data;
  speak(response);

  if (type === 'google_search') {
    const query = encodeURIComponent(userInput);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  }

  if (type === 'calculator_open') {
    window.open('https://www.google.com/search?q=calculator', '_blank');
  }

  if (type === 'instagram_open') {
    window.open('https://www.instagram.com/', '_blank');
  }

  if (type === 'facebook_open') {
    window.open('https://www.facebook.com/', '_blank');
  }

  if (type === 'weather_show') {
    const query = encodeURIComponent(userInput || "weather");
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  }

  if (type === 'youtube_search' || type === 'youtube_play') {
    const query = encodeURIComponent(userInput);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  }

};



  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;
    const isRecognizingRef = { current: false };
    recognitionRef.current = recognition;

    let isMounted = true;

    const startTimeout = setTimeout(()=>{
      if(isMounted && !isSpeakingRef.current && !isRecognizingRef.current){
        try {
          recognition.start();
         // console.log("Recognition started");
        } catch (error) {
          if (error.name !== 'InvalidStateError') {
            console.error("Error starting recognition:", error);
          }
        }
      }
    },1000);
    

    // const safeRecognition = () => {
    //   if (!isSpeakingRef.current && !isRecognizingRef.current) {
    //     try {
    //       recognitionRef.current?.start();
    //      // console.log("Recognition started");
    //     } catch (error) {
    //       if (error.name !== 'InvalidStateError') {
    //         console.error("Error starting recognition:", error);
    //       }
    //     }
    //   }
    // };

    recognition.onstart = () => {
      isRecognizingRef.current = true;
     // console.log("Recognition started");
      setIsListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      //console.log("Recognition ended");
      setIsListening(false);

      if (isMounted && !isSpeakingRef.current) {
        setTimeout(()=>{
          if(isMounted){
            try {
              recognition.start();
             // console.log("recognition start")
            }  catch (error) {
          if (error.name !== 'InvalidStateError') {
            console.error("Error starting recognition:", error);
          }
        }
          }
        },1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setIsListening(false);
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(()=>{
          if(isMounted){
            try {
              recognition.start();
             // console.log("recognition start after error")
            }  catch (error) {
          if (error.name !== 'InvalidStateError') {
            console.error("Error starting recognition:", error);
          }
        }
          }
        },1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("Heard:", transcript);

      if (transcript.toLowerCase().includes(userData?.assistantName?.toLowerCase())) {
        setAiText("");
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setIsListening(false);

        const data = await getGeminiResponse(transcript);
        handleCommand(data);
        setAiText(data.response);
        setUserText("");
      }
    };

    const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
        greeting.lang = 'hi-IN';
        window.speechSynthesis.speak(greeting);

    // const fallbackRecognition = setInterval(() => {
    //   if (!isSpeakingRef.current && !isRecognizingRef.current) {
    //     safeRecognition();
    //   }
    // }, 10000);

    // safeRecognition();

    return () => {
      isMounted = false;
      clearTimeout(startTimeout)
      recognition.stop();
      setIsListening(false);
      isRecognizingRef.current = false;
     // clearInterval(fallbackRecognition);
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#030353] flex flex-col items-center justify-center gap-6 px-4 py-6 sm:px-6 relative overflow-hidden">

  {/* Hamburger Icon */}
  <GiHamburgerMenu
    className="text-white absolute top-5 right-5 w-6 h-6 cursor-pointer"
    onClick={() => setHam(true)}
  />

  {/* Side Menu */}
  <div
    className={`fixed top-0 right-0 h-full w-[90%] sm:w-[400px] bg-[#0000002f] backdrop-blur-lg p-5 flex flex-col gap-5 transition-transform z-50
      ${ham ? 'translate-x-0' : 'translate-x-full'}`}
  >
    <RxCross2
      className="text-white absolute top-5 right-5 w-6 h-6 cursor-pointer"
      onClick={() => setHam(false)}
    />

    <button
  className='min-w-[150px] h-[50px] bg-blue-500 hover:bg-blue-600 text-white rounded-full text-lg font-semibold transition-all duration-200 cursor-pointer self-center'
  onClick={handleLogout}
>
  Log Out
</button>

<button
  className='min-w-[150px] h-[50px] bg-blue-500 hover:bg-blue-600 text-white rounded-full text-lg font-semibold transition-all duration-200 cursor-pointer self-center'
  onClick={() => navigate("/customise")}
>
  Customise
</button>


    <div className="w-full h-px bg-gray-400"></div>

    <h1 className='text-white font-semibold text-lg'>History</h1>

<div className='w-full flex-1 overflow-auto flex flex-col gap-4 pr-2'>
  {userData.history && userData.history.length > 0 ? (
    userData.history.map((his, index) => (
      <div key={index} className='w-full flex items-center'>
        <button
          onClick={() => deleteHistoryPoint(index)}
          className='text-red-500 hover:text-red-700 text-sm font-bold cursor-pointer mr-2'
        >
          ✕
        </button>
        <p className='text-white text-base truncate w-full'>{his}</p>
      </div>
    ))
  ) : (
    <p className='text-white text-sm italic'>No history</p>
  )}
</div>

  </div>

  {/* Main Content */}
  <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl flex flex-col items-center gap-6">
    
    <div className="w-full h-[300px] sm:h-[400px] max-w-[300px] flex justify-center items-center overflow-hidden rounded-3xl shadow-lg">
      <img
        src={userData?.assistantImage}
        alt="Assistant"
        className="w-full h-full object-cover rounded shadow-lg"
      />
    </div>

    <h1 className="text-white text-2xl sm:text-3xl text-center font-bold">
      I'm <span className="text-blue-400">{userData?.assistantName}</span>
    </h1>

    <div className="w-[200px] flex justify-center">
      {!aiText && <img src={userImg} alt="User" className="w-full object-contain" />}
      {aiText && <img src={aiImg} alt="AI" className="w-full object-contain" />}
    </div>

    <h1 className="text-white text-center text-base sm:text-lg font-bold break-words max-w-full px-2">
      {userText || aiText || null}
    </h1>
  </div>
</div>

  );
};

export default Home;
