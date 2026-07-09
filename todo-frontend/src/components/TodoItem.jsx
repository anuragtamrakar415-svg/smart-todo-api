import { motion } from 'framer-motion'
import { FiCheck, FiEdit2, FiTrash2, FiCalendar, FiTag } from 'react-icons/fi'

const priorityStyles = {
  high: 'bg-rust-light text-rust',
  medium: 'bg-ochre-light text-ochre',
  low: 'bg-moss-light text-moss',
}

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

const TodoItem = ({ todo, onToggle, onEdit, onDelete }) => {
  const isOverdue =
    todo.due_date && !todo.is_completed && new Date(todo.due_date) < new Date()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.18 }}
      className={`ruled-card pl-12 pr-4 py-4 group ${
        todo.priority === 'high' && !todo.is_completed ? 'border-l-2 border-l-rust' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(todo)}
          aria-label={todo.is_completed ? 'Mark as not done' : 'Mark as done'}
          className={`check-box mt-0.5 ${
            todo.is_completed ? 'bg-brand border-brand' : 'border-ink/25 hover:border-brand'
          }`}
        >
          {todo.is_completed && <FiCheck size={14} className="text-paper" />}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-[15px] leading-snug ${todo.is_completed ? 'line-through text-ink-faint' : 'text-ink'}`}>
            {todo.content}
          </p>
          {todo.notes && (
            <p className="text-sm text-ink-soft mt-1">{todo.notes}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`text-[11px] font-mono uppercase tracking-wide px-2 py-0.5 rounded ${priorityStyles[todo.priority] || 'bg-ink/5 text-ink-soft'}`}>
              {todo.priority}
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wide px-2 py-0.5 rounded bg-ink/5 text-ink-soft">
              {todo.category}
            </span>
            {todo.due_date && (
              <span className={`text-[11px] font-mono flex items-center gap-1 ${isOverdue ? 'text-rust' : 'text-ink-faint'}`}>
                <FiCalendar size={11} /> {formatDate(todo.due_date)}
              </span>
            )}
            {todo.tags?.length > 0 && (
              <span className="text-[11px] font-mono flex items-center gap-1 text-brand">
                <FiTag size={11} /> {todo.tags.join(', ')}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(todo)}
            aria-label="Edit task"
            className="text-ink-soft hover:text-brand p-1.5 hover:bg-brand-light rounded-md transition-colors"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(todo)}
            aria-label="Delete task"
            className="text-ink-soft hover:text-rust p-1.5 hover:bg-rust-light rounded-md transition-colors"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default TodoItem
