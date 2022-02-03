import styled from 'styled-components'

export const ContainerCol = styled.div`
    display: flex;
    flex-direction: column;
    padding: ${props => props.coco || 0};
    background-color: black;
    color: white;
`

export const ContainerRow = styled.div`
    display: flex;
    flex-direction: row;
    background-color: black;
    color: white;
`

export const FormCol = styled.form`
    display: flex;
    flex-direction: column;
`

export const Button = styled.button`
    border: none;
    outline: none;
    font-weight: ${props => props.bold ? "bold" : "normal"};
    padding: ${props => props.pad || "0.5rem"};
    background-color: ${props => props.bg || "#4a8556"};
    color: ${props => props.fg || "white"};
    border-radius: ${props => props.br || 0};
    transition: 0.3s;
    cursor: pointer;
    &:hover{
        border: none;
        outline: none;
        background-color: ${props => props.bgh || "#93ffab"};
        transform: ${props => props.anim ? "scale(1.1)" : "none"};
    }
`

export const InputText = styled.input`
    border: none;
    outline: none;
    padding: 0.5rem;
    background-color: transparent;
    color: #343536;
    border-radius: 5px;
    border: solid #343536 2px;
    transition: 0.5s;
    &:focus{
        border-color: white;
        color: white;
    }
`

export const SubHead = styled.h2`
    font-size: 16px;
    color: white;
`

export const ToolTip = styled.p`
    font-size: 12px;
    color: #343536;
`