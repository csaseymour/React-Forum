import React, { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login, logout } from './features/user'
import axios from 'axios'
import Navbar from './components/navbar'
import HomePage from './pages/homepage'
import ErrorPage from './pages/errorPage'
import ThreadPage from './pages/threadPage'
import ProfilePage from './pages/profilePage'
import UserPage from './pages/userPage'
import styled from 'styled-components/macro'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: 1rem auto 0 auto;
  transition: 0.5s;
  @media only screen and (max-width: 900px) {
    width: 100%;
  }
`

function App() {
  const [serverStatus, setServerStatus] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); //check if user is already stored in the localstorage
    if (user) {
      dispatch(login(user))
    }
    //user not found in storage, lets see if the user already has a cookie id setup for auth and load user.
    axios({
      method: "GET",
      url: `${import.meta.env.VITE_APP_API_URL}/user/getUser`,
      withCredentials: true,
      timeout: 2500
    }).then((data) => {
      if (data.data) {
        dispatch(login(data.data));
        localStorage.setItem('user', JSON.stringify(data.data));
      } else {
        localStorage.clear();
        dispatch(logout());
      }
    }).catch((error) => {
      if(error.request){
        //server is down
        //logout user
        setServerStatus(false);
        dispatch(logout());
        localStorage.clear();
      }
    })
    //memes

  }, [])
  
  if(!serverStatus){
    return <div><h1>Server is offline</h1></div>
  }

  return (
    <Router>
      <Navbar />
      {/* <CanvasBlur />
      <Canvas /> */}
      <Container>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/thread/:id" element={<ThreadPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/user/:id" element={<UserPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      </Container>
    </Router>
  )
}

export default App
