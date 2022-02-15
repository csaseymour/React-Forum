import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout } from './features/user'
import axios from 'axios'
import Navbar from './components/navbar'
import HomePage from './pages/homepage'
import ErrorPage from './pages/errorPage'
import ThreadPage from './pages/threadPage'
import ProfilePage from './pages/profilePage'
import UserPage from './pages/userPage'
import styled from 'styled-components/macro'
import { ThemeProvider } from 'styled-components/macro'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: ${props => props.theme.background};
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.background};
  width: 50%;
  margin: 1rem auto 0 auto;
  transition: 0.5s;
  @media only screen and (max-width: 900px) {
    width: 100%;
  }
`

function App() {
  const theme = useSelector((state) => state.theme.value)
  console.log(theme);
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
      if (error.request) {
        //server is down
        //logout user
        setServerStatus(false);
        dispatch(logout());
        localStorage.clear();
      }
    })
    //memes

  }, [])

  return (
    <ThemeProvider theme={theme}>
    <Router>
      <Navbar />
      {/* <CanvasBlur />
      <Canvas /> */}
      <Wrapper>
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/thread/:id" element={<ThreadPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/user/:id" element={<UserPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Container>
      </Wrapper>
    </Router>
    </ThemeProvider>
  )
}

export default App
