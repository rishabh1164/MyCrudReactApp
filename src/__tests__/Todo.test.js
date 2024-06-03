import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from '../App';
import { Provider } from 'react-redux';
import store from '../app/store';
import AddTodoForm from '../AddTodoForm';
import todoReducer, { addTodo } from '../features/todo/todoSlice';
import TodoList from '../TodoList';

const todos = [
    {
        id: 1 ,
    },

]


describe('Tests for App', () => {

    test('renders Todo App with AddTodoForm and TodoList', () => {

        const { getByText } = render(
            <Provider store={store}>
                <App />
            </Provider>
        );

        expect(getByText(/todo app/i)).toBeInTheDocument();
        expect(getByText(/add todo/i)).toBeInTheDocument();
        expect(getByText(/todo list/i)).toBeInTheDocument();

    })

});

describe('Tests for AddTodoForm', () => {

    test('renders AddTodoForm and adds a todo', () => {
        const { getByPlaceholderText, getByText } = render(
            <Provider store={store}>
                <AddTodoForm />
            </Provider>
        );

        const input = getByPlaceholderText(/enter a todo/i);
        const button = getByText(/add todo/i);

        fireEvent.change(input, { target: { value: 'Learn testing' } });
        expect(input.value).toBe('Learn testing');

        fireEvent.click(button);

        expect(input.value).toBe('');
    });

});

describe('Tests for TodoList', () => {
    test('renders TodoList and interacts with todos', () => {
        store.dispatch(addTodo({
            id: 1,
            text: 'Learn Redux',
        }));

        const { getByText, getByTestId, getByDisplayValue } = render(
            <Provider store={store}>
                <TodoList />
            </Provider>
        );

        const todoItem = getByText(/learn redux/i);
        expect(todoItem).toBeInTheDocument();

        const editButton = getByTestId('edit-button-1');
        fireEvent.click(editButton);

        const input = getByDisplayValue(/learn redux/i);
        expect(input).toBeInTheDocument();

        fireEvent.change(input, { target: { value: 'Learn React Testing Library' } });

        expect(input.value).toBe('Learn React Testing Library');
        const saveButton = getByTestId('save-button-1');
        fireEvent.click(saveButton);

        expect(getByText(/learn react testing library/i)).toBeInTheDocument();

        const removeButton = getByTestId('remove-button-1');
        fireEvent.click(removeButton);
        expect(todoItem).not.toBeInTheDocument();
    });
})