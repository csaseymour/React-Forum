import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Editor from '../components/editor'
import styled from 'styled-components/macro'
import axios from 'axios'
import * as Gs from '../components/globalStyledComponents'
import Snackbar from '../components/snackbar'

const CommentBox = styled.textarea`
    background-color: #1A1A1B;
    color: white;
    border: solid 1px white;
    border-radius: 5px;
    resize: vertical;
    width: 100%;
    padding: 1rem;
    margin-bottom: 1rem;
`

const CommentUserName = styled.h1`
    font-size: 1rem;
    color: white;
`

function ThreadPage() {
    const snackBarRef = useRef(null)
    const user = useSelector((state) => state.user.value)
    const { id } = useParams()
    const [thread, setThread] = useState()
    const [comment, setComment] = useState("")
    useEffect(() => {
        axios({
            method: "POST",
            url: `${import.meta.env.VITE_APP_API_URL}/thread/getThreadById`,
            data: { _id: id }
        }).then((data) => {
            if (data.data) {
                data.data.content = JSON.parse(data.data.content)
                data.data.comments.reverse()
                setThread(data.data)
            }
        })
    }, [])

    const handleComment = (e) => {
        setComment(e.target.value)
    }

    const reload = () =>{
        axios({
            method: "POST",
            url: `${import.meta.env.VITE_APP_API_URL}/thread/getThreadById`,
            data: { _id: id }
        }).then((data) => {
            if (data.data) {
                data.data.content = JSON.parse(data.data.content)
                data.data.comments.reverse()
                setThread(data.data)
            }
        })
    }

    const postComment = (e) => {
        let data = {
            post_id: thread._id,
            message: comment
        }
        axios({
            method: "POST",
            url: `${import.meta.env.VITE_APP_API_URL}/thread/comment`,
            data: data,
            withCredentials: true
        }).then((data) => {
            snackBarRef.current.show("comment posted!", true, 3000)
            reload()
        }).catch((error) => {
                console.log(error)
            })
    }

    const commentBoxArea = 
    <Gs.FlexContainer pad="1rem" bg="#1A1A1B" w="100%" m="1rem 0 0 0">
        <CommentBox onChange={handleComment} placeholder='comment...' value={comment} />
        <div>
            <Gs.Button onClick={postComment}>Post</Gs.Button>
        </div>
    </Gs.FlexContainer>

    return (
        <Gs.FlexContainer>
            <Snackbar ref={snackBarRef}/>
            {thread && <h1>{thread.title}</h1>}
            {thread && <Editor content={thread.content} />}
            {user && commentBoxArea}
            {(thread && thread.comments) && thread.comments.map((comment, i) => <Gs.FlexContainer pad="1rem" bg="#1A1A1B" w="100%" b="solid 1px rgba(255, 255, 255, 0.1)" key={i}><CommentUserName>{comment.postedBy.username} - {thread.createdAt}</CommentUserName>{comment.message}</Gs.FlexContainer>)}
        </Gs.FlexContainer>
    );
}

export default ThreadPage;
