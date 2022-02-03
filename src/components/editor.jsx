import React, { useCallback, useRef, useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { InputText, Button } from './globalStyledComponents'
import Quill from 'quill'
import ImageResize from 'quill-image-resize-module-plus'
Quill.register('modules/imageResize', ImageResize);
var icons = Quill.import('ui/icons');
icons['imageurl'] = '<svg stroke="#444" fill="#444" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M18 13v7H4V6h5.02c.05-.71.22-1.38.48-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5l-2-2zm-1.5 5h-11l2.75-3.53 1.96 2.36 2.75-3.54zm2.8-9.11c.44-.7.7-1.51.7-2.39C20 4.01 17.99 2 15.5 2S11 4.01 11 6.5s2.01 4.5 4.49 4.5c.88 0 1.7-.26 2.39-.7L21 13.42 22.42 12 19.3 8.89zM15.5 9a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"></path></svg>'
import 'quill/dist/quill.snow.css';
import '../editor.css'

function Editor(props) {
  const navigate = useNavigate()
  const [quill, setQuill] = useState()
  const [state, setState] = useState({
    title: "",
    tag: ""
  })

  const handleState = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  const toolbarOptions = [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    ['link', 'imageurl', 'image', 'video'],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
  ];

  const viewCfg = {
    modules: {
      toolbar: false,
    },
    theme: "snow",
    readOnly: true
  }

  const WrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return

    wrapper.innerHTML = ""
    const editor = document.createElement("div")
    wrapper.append(editor)
    if(props.content){
      const q = new Quill(editor, viewCfg)
      q.setContents(props.content)
      q.enable(false);
      setQuill(q)
    }else{
      const q = new Quill(editor, {
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              imageurl: imageHandler
            }
          },
          imageResize: {
  
          }
        },
        theme: "snow"
      })
      setQuill(q)
    }
  }, [])

  function imageHandler() {
    var range = this.quill.getSelection();
    var value = prompt('please copy paste the image url here.');
    if (value) {
      this.quill.insertEmbed(range.index, 'image', value, Quill.sources.USER);
    }
  }

  const createPost = () => {
    const post = {
      title: state.title,
      tag: state.tag,
      content: JSON.stringify(quill.getContents())
    }
    axios({
      method: "POST",
      url: `${import.meta.env.VITE_APP_API_URL}/thread/newThread`,
      data: post,
      withCredentials: true,
    }).then((data) => navigate(`/thread/${data.data._id}`))
  }

  return (
    <div>
      {props.content ? <div id='container' ref={WrapperRef} /> : <div><InputText type="text" name="title" value={state.title} onChange={handleState} placeholder='title'></InputText><InputText type="text" name="tag" value={state.tag} onChange={handleState} placeholder='tag'></InputText><div id='container' ref={WrapperRef} /><Button pad="1rem" bg="#272729" bgh="#212129" type='button' onClick={(createPost)}>post</Button></div>}
    </div>
  );
}

export default Editor;
