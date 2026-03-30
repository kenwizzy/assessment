import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function TodoItem({ todo, onToggle, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li ref={setNodeRef} style={style} className={`todo-item ${todo.is_completed ? 'completed' : ''}`}>
      <div className="drag-handle" {...attributes} {...listeners}>
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <circle cx="9" cy="6" r="1.5" />
          <circle cx="15" cy="6" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="18" r="1.5" />
          <circle cx="15" cy="18" r="1.5" />
        </svg>
      </div>
      
      <label className="checkbox-container">
        <input
          type="checkbox"
          checked={todo.is_completed}
          onChange={() => onToggle(todo)}
        />
        <span className="checkmark"></span>
      </label>
      
      <span className="todo-text">{todo.title}</span>
      
      <button className="delete-button" onClick={() => onDelete(todo.id)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </li>
  );
}

export default TodoItem;
