import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from './features/todo/todoSlice';
import './styles.css';

const AddTodoForm = () => {
    const [text, setText] = useState('');

    const dispatch = useDispatch();
    const handleSubmit = (e) => {
        e.preventDefault();
         if (text.trim() === '' ) return ;
        dispatch(addTodo({ id: Date.now(), text }));
        setText('');
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type='text' value={text} onChange={e => setText(e.target.value)} placeholder='Enter a todo'/>
            <button type='submit'>Add Todo</button>
        </form>
    );
};

export default AddTodoForm;
