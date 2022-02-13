import React, { useState } from 'react'
import Editor from '../components/editor'
import ThreadList from '../components/threadList'
import * as Gs from '../components/globalStyledComponents'
import { useSelector } from 'react-redux'

function HomePage() {
    const user = useSelector((state) => state.user.value);
    const [newThread, setNewThread] = useState(false);
    const toggleEditor = (e) => {
        if (newThread) {
            e.target.innerHTML = "New Thread";
        } else {
            e.target.innerHTML = "Cancel";
        }
        setNewThread(!newThread);
    }

    return (
        <Gs.FlexContainer>
                <Gs.FlexContainer dir="row" pad="1rem 0 1rem 0" ai="center">
                    {user && <div><Gs.Button br="5px" pad="1rem" bg="#1A1A1B" bgh="#272729" bold onClick={toggleEditor}>New Thread</Gs.Button></div>}
                </Gs.FlexContainer>
                {newThread && <Gs.FlexContainer bg="#1A1A1B" pad="0.5rem" w="100%"><Editor /></Gs.FlexContainer>}
                <ThreadList />
        </Gs.FlexContainer>
    );
}

export default HomePage
