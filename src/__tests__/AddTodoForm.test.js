import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../app/store';
import AddTodoForm from '../AddTodoForm';


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