import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../features/user'
import styled from 'styled-components';
import Snackbar from '../components/snackbar';
import axios from 'axios'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: 1rem auto 0 auto;
    background-color: #1A1A1B;
    border-radius: 5px;
    border: solid 1px white;
    padding: 1rem;
`

const ProfilePicture = styled.img`
    height: 10rem;
    width: auto;
`

function ProfilePage() {
    const snackbarRef = useRef(null);
    const [file, setFile] = useState();
    const user = useSelector((state) => state.user.value)
    const dispatch = useDispatch()
    const handleFileSelect = e => {
        const fileType = e.target.files[0].type.toString()
        let error = false;
        console.log(fileType)
        if (fileType != 'image/png') {
            if (fileType != 'image/jpeg') {
                error = true
            }
        }
        if (error) {
            alert('file can only be .png or .jpeg');
        } else {
            setFile(e.target.files[0])
        }
    }

    const uploadImage = () => {
        if (!file) {
            console.log('no file selected!')
            alert("please select a file first!");
        } else {
            const formData = new FormData()
            formData.append("avata", file)

            axios({
                method: "POST",
                url: `${import.meta.env.VITE_APP_API_URL}/user/uploadAvata`,
                data: formData,
                withCredentials: true
            }).then(() => {
                snackbarRef.current.show("image uploaded!", true, 3000)
            }).catch((error) => console.log(error));
        }
    }
    return (
        <Container>
            <Snackbar ref={snackbarRef} />
            <h1>{user.username}</h1>
            <div>
                {user.avata && <ProfilePicture src={`http://77.100.108.120:8080/avata/${user._id}.png`} />}
            </div>
            <input type="file" onChange={handleFileSelect} name="file" accept='.png, .jpg'></input>
            <div>
                <button onClick={uploadImage}>upload</button>
            </div>
        </Container>
    );
}

export default ProfilePage;
