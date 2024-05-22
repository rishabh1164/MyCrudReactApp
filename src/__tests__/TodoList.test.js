import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../app/store';
import { addTodo } from '../features/todo/todoSlice';
import TodoList from '../TodoList';



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