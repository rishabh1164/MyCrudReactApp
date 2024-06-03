import React, { useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from './features/todo/todoSlice';
import './styles.css';
 
const initialFormState = {
    text: ''
};
 
const formReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TEXT':
            return { ...state, text: action.payload };
        case 'RESET':
            return initialFormState;
        default:
            return state;
    }
}
const AddTodoForm = () => {
    const [state, dispatch] = useReducer(formReducer, initialFormState);
    const [todosCount, setTodosCount] = useState(15);
    const reduxDispatch = useDispatch();
 
    const handleSubmit = (e) => {
        e.preventDefault();
        if (state.text.trim() === '') return;
        reduxDispatch(addTodo({ id: todosCount + 1, title: state.text, completed: false }));
        setTodosCount(todosCount + 1);
        dispatch({ type: 'RESET' });
    }
 
    return (
        <form onSubmit={handleSubmit}>
            <input type='text' value={state.text} onChange={e => dispatch({ type: 'SET_TEXT', payload: e.target.value})} placeholder='Enter a todo' />
            <button type='submit'>Add Todo</button>
        </form>
    );
};
 
export default AddTodoForm;