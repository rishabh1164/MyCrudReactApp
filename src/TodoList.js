import React, { useMemo, useCallback, useEffect, useReducer, useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useSelector, useDispatch } from 'react-redux';
import { removeTodo, editTodo, setTodos, addTodo } from "./features/todo/todoSlice";
import './styles.css';

const initialEditStatus = {
  editId: null,
  editText: '',
};

const editReducer = (state, action) => {
  switch (action.type) {
    case 'SET_EDIT_ID':
      return { ...state, editId: action.payload };
    case 'SET_EDIT_TEXT':
      return { ...state, editText: action.payload };
    case 'RESET':
      return initialEditStatus;
    default:
      return state;
  }
}
const TodoList = () => {
  const todoslist = useSelector(state => state.todos.list);
  const reduxDispatch = useDispatch();
  const [state, dispatch] = useReducer(editReducer, initialEditStatus);
  const editInputRefs = useRef({});

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        const data = await response.json();
        reduxDispatch(setTodos(data.slice(0, 15)));

      } catch (error) {
        console.error('Failed to fetch Todos:', error);
      }
    };

    fetchTodos();
  }, [reduxDispatch]);


  useEffect(() => {
    if (state.editId && editInputRefs.current[state.editId]) {
      editInputRefs.current[state.editId].focus();
    }
  }, [state.editId]);



  const handleEdit = useCallback((id, text) => {
    dispatch({ type: 'SET_EDIT_ID', payload: id });
    dispatch({ type: 'SET_EDIT_TEXT', payload: text });

  }, []);

  const handleSave = useCallback((id) => {
    reduxDispatch(editTodo({
      id,
      title: state.editText
    }));

    dispatch({ type: 'RESET' });
  }, [reduxDispatch, state.editText]);

  const columns = useMemo(() => [
    { headerName: 'ID', field: 'id', sortable: true, filter: true },
    {
      headerName: 'Title',
      field: 'title',
      sortable: true,
      filter: true,
      cellRenderer: (params) => {
        const isEditing = state.editId === params.data.id;
        return isEditing ? (
          <input
          ref={(el) => (editInputRefs.current[params.data.id] = el)}
            type="text"
            value={state.editText}
            onChange={(e) => dispatch({ type: 'SET_EDIT_TEXT', payload: e.target.value })}
          />
        ) : (
          params.value
        );
      }
    },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: (params) => {
        const isEditing = state.editId === params.data.id;
        return (
          <div>
            {isEditing ? (
              <button onClick={() => handleSave(params.data.id)} data-testid={`save-button-${params.data.id}`}>Save</button>
            ) : (
              <>
                <button onClick={() => handleEdit(params.data.id, params.data.title)} data-testid={`edit-button-${params.data.id}`}>Edit</button>
                <button onClick={() => reduxDispatch(removeTodo(params.data.id))} data-testid={`remove-button-${params.data.id}`}>Remove</button>
              </>
            )}
          </div>
        );
      },
    }
  ], [state.editId, state.editText, handleEdit, handleSave, reduxDispatch]);

  // const onCellEditingStopped = useCallback((event) => {
  //   if (state.editId === event.data.id) {
  //     reduxDispatch(editTodo({
  //       id: state.editId,
  //       title: state.editText,
  //     }));
  //     dispatch({ type: 'RESET' });
  //   }
  // }, [state.editId, state.editText, reduxDispatch]);


  return (
    <div>
      <h2>Todo List</h2>
  
      <div className="ag-theme-quartz" style={{ height: 400, width: 600, marginTop: '20px' }}>
        <AgGridReact
          rowData={todoslist}
          columnDefs={columns}
          pagination={true}
          paginationPageSize={10}
        />
      </div>
    </div>
  )
}


export default TodoList;