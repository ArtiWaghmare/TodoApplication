import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit,faCheck  } from '@fortawesome/free-solid-svg-icons';

import './TodoList.css';
import { fetchTodos } from '../services/todos';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState('');
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    fetchTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
      })
      .catch(error => {
        console.error('Error setting todos:', error);
      });
  }, []);

  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setHoverIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (index !== draggedItemIndex) {
      setHoverIndex(index);
    }
  };

  const handleDrop = () => {
    if (hoverIndex !== null) {
      const updatedTodos = [...todos];
      const draggedTodo = updatedTodos[draggedItemIndex];
      updatedTodos.splice(draggedItemIndex, 1);
      updatedTodos.splice(hoverIndex, 0, draggedTodo);
      setTodos(updatedTodos);
    }
  };

  const addTask = () => {
    if (newTaskText.trim() === '') return;
    const newId = todos.length + 1;
    const newTask = { id: newId, text: newTaskText, completed: false };
    setTodos([...todos, newTask]);
    setNewTaskText('');
  };

  const deleteTask = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleEdit = (id, text) => {
    setEditMode(id);
    setEditedTaskText(text);
  };

  const handleUpdate = (id, newText) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, text: newText };
      }
      return todo;
    });
    setTodos(updatedTodos);
    setEditMode(null);
  };

  const toggleComplete = (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };
  return (
    <div className="todo-list">
      <h1 className='text'>Todo List</h1>
      <div className="add-task">
        <input
          type="text"
          className='placeholder'
          placeholder="Enter new task"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {todos.map((todo, index) => (
          <li
            key={todo.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={handleDrop}
            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id)}
            />
              {editMode === todo.id ? (
              <input
                type="text"
                value={editedTaskText} 
                onChange={(e) => setEditedTaskText(e.target.value)}
              />
            ) : (
              <span>{todo.text}</span>
            )}
            <div>
              {editMode === todo.id ? (
                <button onClick={() => handleUpdate(todo.id, editedTaskText)} > <FontAwesomeIcon icon={faCheck} /></button>
               
              ) : (
                  <button onClick={() => handleEdit(todo.id, todo.text)} style={{ backgroundColor: 'blue', color: 'white' }}>   <FontAwesomeIcon icon={faEdit} /></button>
               

              )}
              <button onClick={() => deleteTask(todo.id)}>  <FontAwesomeIcon icon={faTrash} /></button>
            
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
