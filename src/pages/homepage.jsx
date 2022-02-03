import React, { useState } from 'react'
import styled from 'styled-components'
import Editor from '../components/editor'
import ThreadList from '../components/threadList'
import { Button } from '../components/globalStyledComponents'
import { useSelector } from 'react-redux'


const Container = styled.div`
    display: flex;
    flex-direction: column;
`

const EditorContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #1A1A1B;
    padding: 0.5rem;
    width: 100%;
`

const TopBar = styled.div`
    display: flex;
    flex-direction: row;
    padding: 1rem 0 1rem 0;
    align-items: center;
`

function HomePage() {
    const user = useSelector((state) => state.user.value);
    const [newThread, setNewThread] = useState(false);
    const [threads, setThreads] = useState();
    const toggleEditor = (e) => {
        if (newThread) {
            e.target.innerHTML = "New Thread";
        } else {
            e.target.innerHTML = "cancel";
        }
        setNewThread(!newThread);
    }

    return (
        <Container>
                <TopBar>
                    {user && <div><Button br="10px" pad="0.5rem" bg="#1A1A1B" bgh="#272729" bold onClick={toggleEditor}>New Thread</Button></div>}
                </TopBar>
                {newThread && <EditorContainer><Editor /></EditorContainer>}
                <ThreadList threads={threads}/>
        </Container>
    );
}

export default HomePage
