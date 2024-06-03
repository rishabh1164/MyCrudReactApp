import React from 'react';
import { render, screen, fireEvent, configure, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { addTodo, setTodos, editTodo, removeTodo } from '../features/todo/todoSlice';
import reduxStore from '../app/store';
import TodoList from '../TodoList';
import { thunk } from 'redux-thunk';
import configureStore from 'redux-mock-store';


const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const todos = [
  { id: 1, title: 'Learn React', },
  { id: 2, title: 'Learn Redux', },
  { id: 3, title: 'Learn Highcharts' },

];

describe('TodoList', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      todos: { list: [] },
    });

    store.dispatch = jest.fn();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(todos),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  test('fetches and displays todos on mount', async () => {



    render(
      <Provider store={store}>
        <TodoList />
      </Provider>
    );

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(setTodos(todos));
    });

    // console.log(store.getState().todos.list);

    // expect(screen.getByDisplayValue(/Learn React/i)).toBeInTheDocument();
    // expect(screen.getByDisplayValue(/Learn Redux/i)).toBeInTheDocument();
  });

  test('renders TodoList and checks initial elements', () => {
    render(
      <Provider store={store}>
        <TodoList />
      </Provider>
    );

    expect(screen.getByText(/Todo List/i)).toBeInTheDocument();
    expect(screen.queryByTestId('edit-button-1')).toBeNull();
  });


  test('allows a todo to be edited', async () => {
    store = mockStore({
      todos: { list: todos },
    });

    store.dispatch = jest.fn();

    render(
      <Provider store={store}>
        <TodoList />
      </Provider>
    );

    fireEvent.click(screen.getByTestId('edit-button-1'));

    fireEvent.change(screen.getByDisplayValue(/Learn React/i), {
      target: { value: 'Learn Testing' },
    });

    expect(screen.getByDisplayValue(/Learn Testing/i)).toBeInTheDocument();
  });

  test('allows a todo to be saved after editing', async () => {
    store = mockStore({
      todos: { list: todos },
    });
    store.dispatch = jest.fn();

    render(
      <Provider store={store}>
        <TodoList />
      </Provider>
    );

    fireEvent.click(screen.getByTestId('edit-button-1'));

    fireEvent.change(screen.getByDisplayValue(/Learn React/i), {
      target: { value: 'Learn Testing' },
    });

    fireEvent.click(screen.getByTestId('save-button-1'));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(editTodo({
        id: 1,
        text: 'Learn Testing',
      }));
    });

    expect(screen.queryByDisplayValue(/Learn React/i)).toBeNull();
  });

  test('allows a todo to be removed', async () => {
    store = mockStore({
      todos: { list: todos },
    });
  store.dispatch = jest.fn();
    render(
      <Provider store={store}>
        <TodoList />
      </Provider>
    );

    fireEvent.click(screen.getByTestId('remove-button-1'));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(removeTodo(1));
    });

    expect(screen.queryByDisplayValue(/Learn React/i)).toBeNull();
  });
});

describe('Tests for TodoList', () => {
    test('renders TodoList and interacts with todos', () => {
      reduxStore.dispatch(addTodo({
            id: 1,
            text: 'Learn Redux',
        }));

        const { getByText, getByTestId, getByDisplayValue } = render(
            <Provider store={reduxStore}>
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