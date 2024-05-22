import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';
import { Provider } from 'react-redux';
import store from '../app/store';

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