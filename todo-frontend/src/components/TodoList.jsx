import { AnimatePresence } from 'framer-motion'
import TodoItem from './TodoItem'

const TodoList = ({ todos, onToggle, onEdit, onDelete, emptyLabel = 'No tasks here' }) => {
  if (todos.length === 0) {
    return (
      <div className="text-center py-16 ruled-card pl-12">
        <p className="font-display text-xl text-ink-soft mb-1">{emptyLabel}</p>
        <p className="text-sm text-ink-faint">Add a task above to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default TodoList
