import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/signup'
import  Login from './pages/login'
import Customise from './pages/Customise'
import { userDataContext } from './context/UserContext'
import Home from './pages/Home'
import Customise2 from './pages/Customise2'


const App = () => {
  const {userData, setUserData} = useContext(userDataContext);
  return (
    <Routes>
      <Route path='/' element={ userData?.assistantImage && userData?.assistantName ? <Home/> : <Navigate to={"/customise"}/>}/>
      <Route path='/signup' element={!userData? <SignUp/> :<Navigate to={"/"}/> }/>
      <Route path='/login' element={!userData? <Login/> :<Navigate to={"/"}/>}/>
      <Route path='/customise' element={userData? <Customise/> : <Navigate to={"/signup"}/>}/>
      <Route path='/customise2' element={userData? <Customise2/> : <Navigate to={"/signup"}/>}/>


    </Routes>
  )
}

export default App
