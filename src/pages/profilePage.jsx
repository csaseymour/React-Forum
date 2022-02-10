import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Gs from '../components/globalStyledComponents';
import styled from 'styled-components/macro';
import Snackbar from '../components/snackbar';
import axios from 'axios'
import { BsPersonSquare } from 'react-icons/bs'

const ProfilePicture = styled.img`
    height: auto;
    width: 10rem;
`

const TextArea = styled.textarea`
    background-color: #1A1A1B;
    color: white;
    border: none;
    width: 100%;
    resize: vertical;
    &:focus{
        outline: none;
        border: none;
    }
`

function ProfilePage() {
    const snackbarRef = useRef(null);
    const [file, setFile] = useState();
    const [bio, setBio] = useState("");
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

    function handleBio(e){
        setBio(e.target.value);
    }
    
    function updateBio(){
        axios({
            method: "POST",
            url: `${import.meta.env.VITE_APP_API_URL}/user/updateBio`,
            data: {bio: bio},
            withCredentials: true
        }).then(() => {
            snackbarRef.current.show("bio updated!", true, 3000)
        }).catch((error) => console.log(error));
    }


    return (
        <Gs.FlexContainer w="100%" bg="#1A1A1B" br="5px" b="solid 1px white" pad="1rem" dir="row" > 
            <Snackbar ref={snackbarRef} />
            <Gs.FlexContainer>
                <h1>{user.username}</h1>
                {user.avata ? <ProfilePicture src={`${import.meta.env.VITE_APP_API_URL}/avata/${user._id}.png`} /> : <BsPersonSquare size={"5rem"} />}
                <input type="file" onChange={handleFileSelect} name="file" accept='.png, .jpg'></input>
                <div>
                    <Gs.Button bold onClick={uploadImage}>upload</Gs.Button> 
                </div>
            </Gs.FlexContainer>
            <div>
                <h1>bio</h1>
                <TextArea name="bio" value={bio} onChange={handleBio} placeholder={user.bio ? user.bio : "bio"}></TextArea>
                <Gs.Button onClick={updateBio}>update bio</Gs.Button>
            </div>
        </Gs.FlexContainer>
    );
}

export default ProfilePage;
