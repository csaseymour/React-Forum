import React, {useState} from 'react';
import styled from 'styled-components/macro';
import * as Gs from './globalStyledComponents';
import {useDispatch} from 'react-redux'
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

function Register(props) {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    const [state, setState] = useState({
        username: "",
        password: "",
        email: ""
    });

    const handleState = (e) =>{
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }
    const RegisterRequest = (e) =>{
        e.preventDefault();
        axios({
            method: "POST",
            url: `${import.meta.env.VITE_APP_API_URL}/user/register`,
            data: {username: state.username, password: state.password, email: state.email},
            withCredentials: true
        }).then((data) => {
            if(data.data.errors){
                console.log(data.data.errors);
                setErrors(data.data.errors);
            }else{
                console.log(data.data);
            }
        });
    }
    return (
        <Container>
            <Gs.FlexContainer ai="center" jc="center" m="25vh 0 0 0" bg="#121212" pad="1rem" br="5px">
                <Gs.FlexContainer ai="center" jc="center" pad="1rem" w="100%" bg="dodgerblue" fg="white" m="0 0 1rem 0">
                    <h1>Register</h1>
                    {errors && errors.map((error, i) => <p style={{color: "black", fontWeight: "bold"}} key={i}>{error}</p>)}
                </Gs.FlexContainer>
                <InputTextEdit type="text" name="username" value={state.username} onChange={handleState} />
                <InputTextEdit type="password" name="password" value={state.password} onChange={handleState} />
                <InputTextEdit type="email" name="email" value={state.email} onChange={handleState} />
                <Gs.FlexContainer jc="space-between" dir="row" w="100%" ai="center">
                    <Gs.Button onClick={RegisterRequest} pad="1rem" bold>Register</Gs.Button>
                    <Gs.Button type="button" pad="1rem" bold bg="crimson" bgh="red" onClick={()=> props.toggle()}>CANCLE</Gs.Button>
                </Gs.FlexContainer>
            </Gs.FlexContainer>
        </Container>
    )
}

export default Register;
