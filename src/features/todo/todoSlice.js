import { createSlice } from '@reduxjs/toolkit';
import { time } from 'highcharts';

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
            const { id, title } = action.payload;
            const todo = state.list.find(todo => todo.id === id);
            if (todo) {
                todo.title = title;
            }
        },
        setTodos: (state, action) => {
            state.list = action.payload;
        } 
    },
});

export const { addTodo, removeTodo, editTodo, setTodos } = todoSlice.actions;

export default todoSlice.reducer;
