import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { getTodos, createTodo, updateTodo, deleteTodo, reorderTodos, clearCompleted } from './api';
import TodoItem from './components/TodoItem';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await getTodos();
      setTodos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
      toast.error('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      toast.warning('Please enter a todo');
      return;
    }

    try {
      const todo = await createTodo(newTodo.trim());
      setTodos([...todos, todo]);
      setNewTodo('');
      toast.success('Todo added successfully');
    } catch (error) {
      console.error('Failed to add todo:', error);
      toast.error('Failed to add todo');
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      const updated = await updateTodo(todo.id, { ...todo, is_completed: !todo.is_completed });
      setTodos(todos.map(t => t.id === todo.id ? updated : t));
      toast.success(updated.is_completed ? 'Todo completed' : 'Todo marked as active');
    } catch (error) {
      console.error('Failed to update todo:', error);
      toast.error('Failed to update todo');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
      toast.success('Todo deleted');
    } catch (error) {
      console.error('Failed to delete todo:', error);
      toast.error('Failed to delete todo');
    }
  };

  const handleClearCompleted = async () => {
    try {
      await clearCompleted();
      setTodos(todos.filter(t => !t.is_completed));
      toast.success('Completed todos cleared');
    } catch (error) {
      console.error('Failed to clear completed:', error);
      toast.error('Failed to clear completed todos');
    }
  };

  // const handleDragEnd = async (event) => {
  //   const { active, over } = event;

  //   if (active.id !== over?.id) {
  //     const oldIndex = todos.findIndex(t => t.id === active.id);
  //     const newIndex = todos.findIndex(t => t.id === over.id);

  //     const newTodos = arrayMove(todos, oldIndex, newIndex);
  //     const updatedTodos = newTodos.map((todo, index) => ({ ...todo, position: index }));
      
  //     setTodos(updatedTodos);

  //     try {
  //       await reorderTodos(updatedTodos.map(t => ({ id: t.id, position: t.position })));
  //        toast.success('Reorder successful');
  //     } catch (error) {
  //       console.error('Failed to reorder todos:', error);
  //       toast.error('Failed to reorder todos');
  //       fetchTodos();
  //     }
  //   }
  // };

  const handleDragEnd = async (event) => {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  const oldIndex = todos.findIndex(t => t.id === active.id);
  const newIndex = todos.findIndex(t => t.id === over.id);

  if (oldIndex === -1 || newIndex === -1) return;

  const newTodos = arrayMove(todos, oldIndex, newIndex);
  
  const updatedTodos = newTodos.map((todo, index) => ({
    ...todo,
    position: index
  }));


  // 🔥 ONLY PICK CHANGED ITEMS
  // const changedTodos = updatedTodos.filter((todo, index) => {
  //   return todo.position !== todos[index]?.position;
  // });

  // console.log('changed', changedTodos);

  const originalMap = new Map(todos.map(t => [t.id, t.position]));

const changedTodos = updatedTodos.filter(todo => {
  return originalMap.get(todo.id) !== todo.position;
});

console.log('changed', changedTodos);

  setTodos(updatedTodos);

  try {
    await reorderTodos(
      changedTodos.map(t => ({
        id: t.id,
        position: t.position
      }))
    );

    toast.success('Reorder successful');
  } catch (error) {
    console.error('Failed to reorder todos:', error);
    toast.error('Failed to reorder todos');
    fetchTodos();
  }
};

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.is_completed;
    if (filter === 'completed') return todo.is_completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.is_completed).length;
  const completedCount = todos.filter(t => t.is_completed).length;

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">todos</h1>
        
        <form className="todo-form" onSubmit={handleAddTodo}>
          <input
            type="text"
            className="todo-input"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button type="submit" className="add-button">Add</button>
        </form>

        {todos.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
          >
            <ul className="todo-list">
              <SortableContext items={filteredTodos.map(t => t.id)} strategy={verticalListSortingStrategy}>
                {filteredTodos.map((todo, index) => (
                  <TodoItem
                    key={todo.id ?? `temp-${index}`}
                    todo={todo}
                    onToggle={handleToggleComplete}
                    onDelete={handleDelete}
                  />
                ))}
              </SortableContext>
            </ul>
          </DndContext>
        )}

        {todos.length === 0 && (
          <div className="empty-state">
            <p>No todos yet. Add one above!</p>
          </div>
        )}

        {todos.length > 0 && (
          <div className="todo-footer">
            <span className="item-count">{activeCount} item{activeCount !== 1 ? 's' : ''} left</span>
            
            <div className="filter-tabs">
              <button
                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button
                className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>

            {completedCount > 0 && (
              <button className="clear-button" onClick={handleClearCompleted}>
                Clear completed
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
