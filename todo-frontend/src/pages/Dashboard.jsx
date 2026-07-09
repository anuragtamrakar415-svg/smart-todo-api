import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { AnimatePresence, motion } from 'framer-motion'
import { FiPlus, FiSearch, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import TodoList from '../components/TodoList'
import TodoForm from '../components/TodoForm'

const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Done' },
  { key: 'high', label: 'High priority' },
  { key: 'overdue', label: 'Overdue' },
]

const Dashboard = () => {
  const { user } = useAuth()
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await api.get('/todo/')
      setTodos(response.data.todo || [])
    } catch {
      toast.error('Could not load your tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (payload) => {
    try {
      const response = await api.post('/todo/', payload)
      setTodos((prev) => [response.data.todo, ...prev])
      setModalOpen(false)
      toast.success('Task added')
    } catch {
      toast.error('Could not create task')
    }
  }

  const handleUpdate = async (id, payload) => {
    try {
      const response = await api.put(`/todo/${id}`, payload)
      setTodos((prev) => prev.map((t) => (t.id === id ? response.data.todo : t)))
      setEditingTodo(null)
      toast.success('Task updated')
    } catch {
      toast.error('Could not update task')
    }
  }

  const handleToggle = async (todo) => {
    try {
      const response = await api.put(`/todo/${todo.id}`, { is_completed: !todo.is_completed })
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? response.data.todo : t)))
    } catch {
      toast.error('Could not update task')
    }
  }

  const handleDelete = async (todo) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await api.delete(`/todo/${todo.id}`)
      setTodos((prev) => prev.filter((t) => t.id !== todo.id))
      toast.success('Task deleted')
    } catch {
      toast.error('Could not delete task')
    }
  }

  const stats = useMemo(() => {
    const completed = todos.filter((t) => t.is_completed).length
    const highPriority = todos.filter((t) => t.priority === 'high' && !t.is_completed).length
    const overdue = todos.filter(
      (t) => t.due_date && new Date(t.due_date) < new Date() && !t.is_completed
    ).length
    return {
      total: todos.length,
      completed,
      active: todos.length - completed,
      highPriority,
      overdue,
      progress: todos.length ? Math.round((completed / todos.length) * 100) : 0,
    }
  }, [todos])

  const visibleTodos = useMemo(() => {
    let list = [...todos]

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (t) => t.content.toLowerCase().includes(q) || t.tags?.some((tag) => tag.toLowerCase().includes(q))
      )
    }

    if (statusFilter === 'active') list = list.filter((t) => !t.is_completed)
    else if (statusFilter === 'completed') list = list.filter((t) => t.is_completed)
    else if (statusFilter === 'high') list = list.filter((t) => t.priority === 'high' && !t.is_completed)
    else if (statusFilter === 'overdue')
      list = list.filter((t) => t.due_date && new Date(t.due_date) < new Date() && !t.is_completed)

    if (sortBy === 'created') {
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } else if (sortBy === 'due') {
      list.sort((a, b) => {
        if (!a.due_date) return 1
        if (!b.due_date) return -1
        return new Date(a.due_date) - new Date(b.due_date)
      })
    } else if (sortBy === 'priority') {
      const order = { high: 0, medium: 1, low: 2 }
      list.sort((a, b) => order[a.priority] - order[b.priority])
    }

    return list
  }, [todos, search, statusFilter, sortBy])

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="eyebrow">Loading your list…</span>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <div className="mb-8">
        <span className="eyebrow">{user?.username}'s list</span>
        <h1 className="font-display text-3xl font-semibold mt-1">Today</h1>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {[
          { label: 'Total', value: stats.total },
          { label: 'Active', value: stats.active },
          { label: 'Done', value: stats.completed },
          { label: 'High priority', value: stats.highPriority, accent: 'text-rust' },
          { label: 'Overdue', value: stats.overdue, accent: 'text-ochre' },
        ].map((s) => (
          <div key={s.label} className="ruled-card pl-6 pr-3 py-3">
            <p className="eyebrow mb-1">{s.label}</p>
            <p className={`font-display text-2xl font-semibold ${s.accent || 'text-ink'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="ruled-card pl-12 pr-5 py-4 mb-8">
        <div className="flex justify-between text-sm text-ink-soft mb-2">
          <span>Overall progress</span>
          <span className="font-mono">{stats.progress}%</span>
        </div>
        <div className="w-full bg-ink/8 rounded-full h-1.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-brand rounded-full"
          />
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 min-w-[200px] relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks or tags…"
            className="field-input pl-10"
          />
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="field-input w-auto">
          <option value="created">Newest first</option>
          <option value="due">By due date</option>
          <option value="priority">By priority</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`px-3.5 py-1.5 rounded-md text-sm font-medium border transition-colors ${
              statusFilter === f.key
                ? 'bg-ink text-paper border-ink'
                : 'bg-paper-card text-ink-soft border-ink/10 hover:border-ink/25'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => setModalOpen(true)}
        className="btn-primary w-full mb-8 py-3"
      >
        <FiPlus size={17} /> Add a task
      </button>

      <TodoList
        todos={visibleTodos}
        onToggle={handleToggle}
        onEdit={(todo) => setEditingTodo(todo)}
        onDelete={handleDelete}
        emptyLabel={search || statusFilter !== 'all' ? 'Nothing matches' : 'Your list is empty'}
      />

      {/* Create modal */}
      <AnimatePresence>
        {modalOpen && (
          <Modal onClose={() => setModalOpen(false)} title="Add a task">
            <TodoForm onSubmit={handleCreate} onCancel={() => setModalOpen(false)} />
          </Modal>
        )}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {editingTodo && (
          <Modal onClose={() => setEditingTodo(null)} title="Edit task">
            <TodoForm
              initialData={editingTodo}
              onSubmit={(payload) => handleUpdate(editingTodo.id, payload)}
              onCancel={() => setEditingTodo(null)}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

const Modal = ({ onClose, title, children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ duration: 0.18 }}
      className="ruled-card pl-12 pr-6 py-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-xl font-semibold">{title}</h3>
        <button onClick={onClose} className="text-ink-faint hover:text-ink transition-colors" aria-label="Close">
          <FiX size={18} />
        </button>
      </div>
      {children}
    </motion.div>
  </motion.div>
)

export default Dashboard
