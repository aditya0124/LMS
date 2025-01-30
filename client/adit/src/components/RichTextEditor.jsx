import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({input, setInput}) => {
// take Set input fn.
    const handleChange = (content) => {
        setInput({...input, description:content});
    }
   
  return <ReactQuill theme="snow" 
  value={input.description}// Display current description in the editor
  onChange={handleChange} // Pass handleChange as the onChange event handler 
  />;
}
export default RichTextEditor

/*
In CourseTab, the input state contains the description field, along with other course data like courseTitle, subTitle, etc. 
CourseTab needs to pass this input state (with description) and the setInput function to the RichTextEditor component.

Passing State and Function as Props
Here, you are passing both input (which includes description) 
and setInput (which will be used to update the input state) as props to the RichTextEditor:
*/

// value={input.description}: This ensures that the initial content of the ReactQuill editor is populated with
// the current value of description from the input state.