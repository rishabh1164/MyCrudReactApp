import logo from './logo.svg';
import './App.css';
import AddTodoForm from './AddTodoForm';
import TodoList from './TodoList';
import './styles.css';
const App = () => {
  return (
    <div className='container'>
      <h1>Todo App</h1>
      <AddTodoForm />
      <TodoList />
    </div>
  );
}

export default App;
