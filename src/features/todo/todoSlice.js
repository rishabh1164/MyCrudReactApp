import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
    name: 'todos',
    initialState: {
        list: [],
    },
    reducers: {
        addTodo: (state, action) => {
            state.list.push(action.payload);
        },
        removeTodo: (state, action) => {
            state.list = state.list.filter(todo => todo.id !== action.payload);
        },
        editTodo: (state, action) => {
            const { id, text } = action.payload;
            const todo = state.list.find(todo => todo.id === id);
            if (todo) {
                todo.text = text;
            }
        },
        setTodos: (state, action) => {
            state.list = action.payload;
        } 
    },
});

export const { addTodo, removeTodo, editTodo, setTodos } = todoSlice.actions;

export default todoSlice.reducer;
