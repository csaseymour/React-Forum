import React, {useState} from 'react';
import styled from 'styled-components/macro';
import * as Gs from './globalStyledComponents';
import {useDispatch} from 'react-redux'
import {login} from '../features/user'
import axios from 'axios'

const Container = styled.div`
    display:flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(6px);
    height: 100vh;
    width: 100vw;
    z-index: 10;
`

const InputTextEdit = styled(Gs.InputText)`
    margin-bottom: 1rem;
`

function Login(props) {
    const dispatch = useDispatch();
    const [error, setError] = useState(false);
    const [state, setState] = useState({
        username: "",
        password: ""
    });

    const handleState = (e) =>{
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const LoginRequest = (e) =>{
        e.preventDefault();
        setError(false);
        axios({
            method: "POST",
            url: `${import.meta.env.VITE_APP_API_URL}/user/login`,
            data: {username: state.username, password: state.password},
            withCredentials: true
        }).then((data) => {
            if(data.data){
                dispatch(login(data.data));
                localStorage.setItem("user", JSON.stringify(data.data));
                props.toggle();
            }else{
                setError(true);
            }
        });
    }
    
    return (
        <Container>
            <Gs.FlexContainer ai="center" jc="center" m="25vh 0 0 0" bg="#121212" pad="1rem" br="5px">
                <Gs.FlexContainer ai="center" jc="center" pad="1rem" w="100%" bg="dodgerblue" fg="white" m="0 0 1rem 0">
                    <h1>Login</h1>
                    {error && <p>Incorrect Credentials</p>}
                </Gs.FlexContainer>
                <InputTextEdit type="text" name="username" value={state.username} onChange={handleState} />
                <InputTextEdit type="password" name="password" value={state.password} onChange={handleState} />
                <Gs.FlexContainer jc="space-between" dir="row" w="100%" ai="center">
                    <Gs.Button onClick={LoginRequest} pad="1rem" bold>Login</Gs.Button>
                    <Gs.Button type="button" pad="1rem" bold bg="crimson" bgh="red" onClick={()=> props.toggle()}>Cancel</Gs.Button>
                </Gs.FlexContainer>
            </Gs.FlexContainer>
        </Container>
    )
}

export default Login;
