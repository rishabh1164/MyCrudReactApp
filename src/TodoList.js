import React, { useMemo, useCallback, useEffect, useReducer } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { removeTodo, editTodo, setTodos } from "./features/todo/todoSlice";
import './styles.css';
 
const initialEditStatus = {
editId: null,
editText: '',
};
 
const editReducer = (state, action) => {
   switch(action.type) {
    case 'SET_EDIT_ID':
      return {...state, editId: action.payload};
    case 'SET_EDIT_TEXT' :
      return {...state, editText: action.payload};
    case 'RESET':
      return initialEditStatus;  
    default:
      return state ;
   }
}
const TodoList = () => {
  const todoslist = useSelector(state => state.todos.list);
  const reduxDispatch = useDispatch();
  const[state,dispatch] = useReducer(editReducer, initialEditStatus)
 
useEffect(() => {
const fetchTodos = async () => {
try {
const response = await fetch('https://jsonplaceholder.typicode.com/todos');
const data = await response.json();
reduxDispatch(setTodos(data.slice(0,10)));
 
} catch(error) {
  console.error('Failed to fetch Todos:',error);
}
} ;
 
fetchTodos();
},[reduxDispatch]);
 
const filteredTodos = useMemo(() => {
return todoslist.filter(todo=>todo);
},[todoslist]);
 
  const handleEdit = useCallback((id, text) => {
   dispatch({ type: 'SET_EDIT_ID', payload: id });
   dispatch({ type: 'SET_EDIT_TEXT', payload: text });
   
  },[]);
 
  const handleSave = useCallback((id) => {
    reduxDispatch(editTodo({
      id,
      text: state.editText
    }));
    
    dispatch({ type: 'RESET' });
  },[reduxDispatch, state.editText]);
 
    return (
      <div>
      <h2>Todo List</h2>
      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            {state.editId === todo.id ? (
              <>
                <input
                  type="text"
                  value={state.editText}
                  onChange={(e) => dispatch({ type : 'SET_EDIT_TEXT', payload: e.target.value })}
                />
                <button onClick={() => handleSave(todo.id)} data-testid={`save-button-${todo.id}`}>Save</button>
              </>
            ) : (
              <>
                {todo?.text || todo?.title}
                <button onClick={() => handleEdit(todo.id, todo?.text || todo?.title)} data-testid={`edit-button-${todo.id}`}>Edit</button>
                <button onClick={() => reduxDispatch(removeTodo(todo.id))} data-testid={`remove-button-${todo.id}`}>Remove</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
    )
}
 
 
export default TodoList;