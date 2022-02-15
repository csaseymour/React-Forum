import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components/macro'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/user'
import { useNavigate } from 'react-router-dom'
import { Button } from './globalStyledComponents'
import { BsPersonSquare, BsArrowRightSquare } from 'react-icons/bs'
import Login from './login'
import Register from './register'
import axios from 'axios'

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${props => props.theme.forground};
    width: 100%;
    height: 50px;
    position: -webkit-sticky;
    position: sticky;
    top:0;
    z-index: 2;
`
const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: ${props => props.theme.forground};
    color: white;
    width: 50%;
    height: 50px;
    transition: 0.5s;
    @media only screen and (max-width: 900px){
        width: 90%;
    }
`

const LogoContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

const Logo = styled.h1`
    font-size: 1.5rem;
    color: white;
    font-weight: 700;
    cursor: pointer;
    transition: 0.3s;
    &:hover{
        color: #fc4054;
    }
`

const Username = styled.p`
    cursor: pointer;
    padding: 0.5rem;
    transition: 0.3s;
`

const DropDownContent = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #1A1A1B;
    position: absolute;
    border: 1px solid white;
    border-radius: 5px;
    top: 55px;
    z-index: 2;
`

const DropDownItem = styled.div`
    display: flex;
    flex-direction: row;
    padding: 1rem;
    align-items: center;
    border-radius: 5px;
    cursor: pointer;
    &:hover{
        background-color: rgba(0,0,0, 0.5);
    }
`

const iconStyle = { color: "white", fontSize: "1.5rem", marginRight: "1rem" }

const ProfilePicture = styled.img`
    width: 25px;
    height: 25px;
`

const DropDown = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: #1A1A1B;
    height: 100%;
    padding: 0 1rem 0 1rem;
    border-radius: 5px;
    border: solid 1px rgba(255,255,255,0.1);
    transition: 1s;
    cursor: pointer;
    &:hover{
        border-color: white;
    }
`
function useOutsideAlerter(ref, toggle) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                toggle();
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

function UserMenu(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const wrapperRef = useRef(null)
    useOutsideAlerter(wrapperRef, props.toggle)

    const logoutUser = () => {
        axios({
            method: "GET",
            url: `${import.meta.env.VITE_APP_API_URL}/user/logout`,
            withCredentials: true
        }).then((data) => {
            if (data.data) {
                localStorage.clear();
                dispatch(logout());
            }
        }).catch((error) => {
            if (error.request) {
                //server is down
                console.log("server is down");
            }
        })
    }

    return (
        <DropDownContent ref={wrapperRef}>
            <DropDownItem onClick={() => navigate("/profile")}>
                <BsPersonSquare style={iconStyle} />
                <p>Profile</p>
            </DropDownItem>
            <hr />
            <DropDownItem onClick={logoutUser}>
                <BsArrowRightSquare style={iconStyle} />
                <p>Logout</p>
            </DropDownItem>
        </DropDownContent>
    )
}

function truncate(str, n) {
    return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
};

function NavBar() {
    const user = useSelector((state) => state.user.value);
    const [loginPanel, setLoginPanel] = useState(false)
    const [registerPanel, setRegisterPanel] = useState(false)
    const [userMenuToggle, setUserMenuToggle] = useState(false)
    let navigate = useNavigate();

    const toggleLoginPanel = () => {
        setLoginPanel(!loginPanel)
    }

    const toggleRegisterPanel = () => {
        setRegisterPanel(!registerPanel)
    }

    const closeMenu = () => {
        setUserMenuToggle(false);
    }

    if (user) {
        return (
            <Wrapper>
                <Container>
                    <LogoContainer onClick={() => navigate("/")}>
                        <Logo>{import.meta.env.VITE_APP_NAME}</Logo>
                    </LogoContainer>
                    <DropDown onClick={() => setUserMenuToggle(!userMenuToggle)}>
                        {user.avata ? <ProfilePicture src={`${import.meta.env.VITE_APP_API_URL}/avata/${user._id}.png`} /> : <BsPersonSquare style={iconStyle} />}
                        <Username>{truncate(user.username, 10)}</Username>
                        {userMenuToggle && <UserMenu toggle={closeMenu} />}
                    </DropDown>
                </Container>
            </Wrapper>
        )
    } else {
        return (
            <Wrapper>
                {loginPanel && <Login toggle={toggleLoginPanel} />}
                {registerPanel && <Register toggle={toggleRegisterPanel} />}
                <Container>
                    <LogoContainer onClick={() => navigate("/")}>
                        <Logo>{import.meta.env.VITE_APP_NAME}</Logo>
                    </LogoContainer>
                    <div>
                        <Button onClick={() => toggleLoginPanel()} pad="1rem" bold>Login</Button>
                        <Button onClick={() => toggleRegisterPanel()} pad="1rem" bold>Register</Button>
                    </div>
                </Container>
            </Wrapper>
        )
    }

}

export default NavBar
