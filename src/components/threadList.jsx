import React, { useEffect , useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Snackbar from './snackbar';
import axios from 'axios'
import styled from 'styled-components';

const ThreadContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    background-color: #1A1A1B;
    border: 1px solid rgba(0,0,0,0.1);
    transition: 1s;
    &:hover{
        border: 1px solid rgba(255,255,255,0.25);
    }
`

const ThreadTitle = styled.h1`
    font-size: 1rem;
    color: white;
    margin: 0.25rem;
    font-weight: bold;
    cursor: pointer;
`

const Tag = styled.span`
    padding: 0.25rem;
    border-radius: 10px;
    background-color: rgba(0,0,0,0.5);
`

const ThreadList = (props) => {
    const snackbarRef = useRef(null)
    const user = useSelector((state) => state.user.value);
    const navigate = useNavigate();
    const [threads, setThreads] = useState();
    useEffect(()=>{
        axios({
            method: "POST",
            url:`${import.meta.env.VITE_APP_API_URL}/thread/getThreads`,
            withCredentials: true,
            timeout: 2500
        }).then((data) => {
            setThreads(data.data.reverse()); //reverse so newest is on top
        }).catch((error) =>{
            if(error.request){
                //server is down
                console.log(`can't retrieve thread list... server must be down`);
            }
        })
    },[])
    const deleteThread = (id) =>{
        axios({
            method: "POST",
            url: `${import.meta.env.VITE_APP_API_URL}/thread/deleteThread`,
            data: {id:id},
            withCredentials: true
        }).then((data) => {
            snackbarRef.current.show("post deleted!", true, 3000)
        });
    }
    return (
        <div>
            <Snackbar ref={snackbarRef}/>
            {threads && threads.map((thread, i) => <ThreadContainer key={i}><ThreadTitle onClick={()=> navigate(`/thread/${thread._id}`)}>{thread.title}</ThreadTitle><p><Tag>{thread.tag.name}</Tag> - posted by <a href={`/user/${thread.postedBy._id}`}>{thread.postedBy.username}</a> {(user._id == thread.postedBy._id || user.authority == 69) && <Tag onClick={()=> deleteThread(thread._id)} style={{backgroundColor: "crimson", cursor: "pointer"}}>delete</Tag>}</p></ThreadContainer>)}
        </div>
    )
};

export default ThreadList
