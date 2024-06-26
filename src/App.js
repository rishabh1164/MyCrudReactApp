import AddTodoForm from './AddTodoForm';
import TodoList from './TodoList';
import TodoChart from './TodoChart';
import './styles.css';
const App = () => {
  return (
    <div className='app-container'>
  <h1>Todo App</h1>
      <AddTodoForm />
      <TodoList />
      <TodoChart />
    </div>
  );
}

export default App;
