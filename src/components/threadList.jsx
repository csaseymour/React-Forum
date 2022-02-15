import React, { useEffect , useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Snackbar from './snackbar';
import axios from 'axios'
import styled from 'styled-components/macro';
import * as Gs from './globalStyledComponents'
import {
    BsTrash, 
    BsFillFileArrowDownFill, 
    BsFillFileArrowUpFill, 
    BsFillChatLeftDotsFill
    } from 'react-icons/bs'

const ThreadContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding: 0.5rem;
    background-color: ${props => props.theme.forground};
    color: ${props => props.theme.text};
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


const ThreadList = () => {
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

    function vote(id, direction){
        axios({
            method: "POST",
            data: {thread: id, vote: direction},
            url: `${import.meta.env.VITE_APP_API_URL}/user/vote`,
            withCredentials: true
        }).then(()=>{
            snackbarRef.current.show("voted", true, 3000)
        })
    }

    function createThreads(){
        return threads.map((thread, i) => (
            <ThreadContainer key={i}>
                <Gs.FlexContainer ai="center" jc="center" style={{borderRight: "solid 1px white"}}>
                    <Gs.FlexContainer dir="row" >
                        <BsFillFileArrowDownFill onClick={()=> vote(thread._id, false)} size={"1.5rem"} />
                        <BsFillFileArrowUpFill onClick={()=> vote(thread._id, true)} size={"1.5rem"} />
                    </Gs.FlexContainer>
                    <p>{thread.points}</p>
                </Gs.FlexContainer>
                <Gs.FlexContainer w="100%">
                    <ThreadTitle onClick={()=> navigate(`/thread/${thread._id}`)}>{thread.title}</ThreadTitle>
                    <Gs.FlexContainer dir="row" ai="center" jc="space-between" w="100%" >
                        <Tag>{thread.tag.name}</Tag>
                        <p>posted by <a href={`/user/${thread.postedBy._id}`}>{thread.postedBy.username}</a></p> 
                        <p><BsFillChatLeftDotsFill /> {thread.comments.length}</p> 
                        <p>{(user._id == thread.postedBy._id || user.authority == 69) && <BsTrash size="1.5rem" color="crimson" style={{cursor: "pointer"}} onClick={()=> deleteThread(thread._id)} />}</p>
                        </Gs.FlexContainer>
                </Gs.FlexContainer>
            </ThreadContainer>
        ))
    }
    return (
        <div>
            <Snackbar ref={snackbarRef}/>
            {threads && createThreads()}
        </div>
    )
};

export default ThreadList
