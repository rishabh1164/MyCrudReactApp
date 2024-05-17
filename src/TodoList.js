import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { removeTodo, editTodo } from "./features/todo/todoSlice";
import './styles.css';

const TodoList = () => {
  const todoslist = useSelector(state => state.todos.list);
  const dispatch = useDispatch();
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  const handleSave = (id) => {
    dispatch(editTodo({
      id,
      text: editText
    }));
    setEditId(null);
    setEditText('');
  };

    return (
      <div>
      <h2>Todo List</h2>
      <ul>
        {todoslist.map(todo => (
          <li key={todo.id}>
            {editId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => handleSave(todo.id)} data-testid={`save-button-${todo.id}`}>Save</button>
              </>
            ) : (
              <>
                {todo.text}
                <button onClick={() => handleEdit(todo.id, todo.text)} data-testid={`edit-button-${todo.id}`}>Edit</button>
                <button onClick={() => dispatch(removeTodo(todo.id))} data-testid={`remove-button-${todo.id}`}>Remove</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
    )
}


export default TodoList;
