import React, { useContext, useState } from 'react'
import bgimg from '../assets/bgimg.jpg'
import { IoEye, IoEyeOff } from "react-icons/io5"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { userDataContext } from '../context/UserContext'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { serverUrl,userData, setUserData } = useContext(userDataContext);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state before making the request
    setLoading(true); // Set loading state to true
     try {
       const result = await axios.post(`${serverUrl}/api/auth/login`, {
          
          email,
          password
        },
        {withCredentials: true})
        setUserData(result.data); // Set user data after successful login
        setLoading(false); // Reset loading state after request
 
     }
      catch (error) {
      console.log(error);
      setUserData(null); // Reset user data on error
      setLoading(false); // Reset loading state on error
      setError(error.response.data.message || 'Something went wrong');
      setTimeout(() => {
        setError('');
      }, 3000);
     }

  }

  return (
    <div
      className='w-full h-[100vh] flex justify-center items-center'
      style={{
        backgroundImage: `url(${bgimg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <form
        className='w-[90%] h-[600px] max-w-[500px] bg-[#0000005e] backdrop-blur shadow-lg shadow-black 
        flex flex-col justify-center items-center gap-[20px] px-[20px]'
        onSubmit={handleLogin}
      >
        <h1 className='text-white text-[30px] font-semibold mb-[30px]'>
          Login to <span className='text-blue-400'>Virtual Assistant</span>
        </h1>

        <input
          type='email'
          placeholder='Enter your Email'
          className='w-full h-[60px] outline-none border-2 border-white bg-transparent 
          text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'
          required 
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <div className='w-full h-[60px] relative border-2 border-white bg-transparent rounded-full'>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            className='w-full h-full outline-none bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'
            required 
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {showPassword ? (
            <IoEyeOff
              className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer'
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoEye
              className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer'
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>
        {error && <p className='text-red-500 text-[18px]'>{error}</p>}

        <button
          type='submit'
          className='mt-[20px] min-w-[150px] h-[50px] bg-blue-500 hover:bg-blue-600 text-white rounded-full text-[18px] font-semibold transition-all duration-200 cursor-pointer'
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className='text-[white] text-[18px] cursor-pointer' onClick={()=>navigate('/signup')}>Want to create a new account ?  <span className='text-blue-400'>sign Up</span></p>
      </form>
    </div>
  )
}

export default Login
