
import axios from 'axios';

export const fetchTodos = async () => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
    return response.data.map(todo => ({
      id: todo.id,
      text: todo.title,
      completed: false
    }));
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};
