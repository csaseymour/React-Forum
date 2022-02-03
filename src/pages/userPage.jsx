import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #121212;
    border-radius: 5px;
    border: solid 1px white;
    padding: 1rem;
    width: 50%;
    margin: 1rem auto 0 auto;
`

const ProfilePicture = styled.img`
    height: 5rem;
    width: auto;
`

function UserPage() {
    const [user, setUser] = useState();
    const {id} = useParams();
    useEffect(()=>{
        axios({
            method: "POST",
            url: `${import.meta.env.VITE_APP_API_URL}/user/getUserById`,
            data: {id: id},
        }).then((data) => {
            setUser(data.data);
        }).catch((error) => console.log(error));
    },[])
    return (
        <Container>
            {user && <h1>{user.username}</h1>}
            <div>
                {user && user.avata ? <ProfilePicture src={`${import.meta.env.VITE_APP_API_URL}/avata/${user._id}.png`} /> : <ProfilePicture src={`${import.meta.env.VITE_APP_API_URL}/avata/placeholder.png`} /> }
            </div>
        </Container>
    );
}

export default UserPage;
