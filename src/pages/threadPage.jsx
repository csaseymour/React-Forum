import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Editor from '../components/editor'
import styled from 'styled-components'
import axios from 'axios'
import { Button } from '../components/globalStyledComponents'
import Snackbar from '../components/snackbar'

const Container = styled.div`
    display: flex;
    flex-direction: column;
`
const CommentContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #1A1A1B;
    padding: 1rem;
    width: 100%;
    border: solid 1px rgba(255, 255, 255, 0.1);
`
const CommentBoxContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background-color: #1A1A1B;
    width: 100%;
    margin-top: 1rem;
`
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
    <CommentBoxContainer>
        <CommentBox onChange={handleComment} placeholder='comment...' value={comment} />
        <div>
            <Button onClick={postComment}>Post</Button>
        </div>
    </CommentBoxContainer>

    return (
        <Container>
            <Snackbar ref={snackBarRef}/>
            {thread && <h1>{thread.title}</h1>}
            {thread && <Editor content={thread.content} />}
            {user && commentBoxArea}
            {(thread && thread.comments) && thread.comments.map((comment, i) => <CommentContainer key={i}><CommentUserName>{comment.postedBy.username} - {thread.createdAt}</CommentUserName>{comment.message}</CommentContainer>)}
        </Container>
    );
}

export default ThreadPage;
