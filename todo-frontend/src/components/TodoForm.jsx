import { useState } from 'react'

const toDatetimeLocal = (value) => {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const TodoForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [form, setForm] = useState({
    content: initialData.content || '',
    priority: initialData.priority || 'medium',
    category: initialData.category || 'personal',
    due_date: toDatetimeLocal(initialData.due_date),
    tags: (initialData.tags || []).join(', '),
    notes: initialData.notes || '',
  })
  const [loading, setLoading] = useState(false)
  const isEdit = Boolean(initialData.id)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.content.trim()) return

    setLoading(true)
    await onSubmit({
      content: form.content.trim(),
      priority: form.priority,
      category: form.category,
      due_date: form.due_date ? new Date(form.due_date).toISOString() : null,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      notes: form.notes.trim() || null,
    })
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="field-label">What do you need to do?</label>
        <textarea
          value={form.content}
          onChange={update('content')}
          className="field-input resize-none"
          rows={3}
          placeholder="Write your task here…"
          autoFocus
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="field-label">Priority</label>
          <select value={form.priority} onChange={update('priority')} className="field-input">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="field-label">Category</label>
          <select value={form.category} onChange={update('category')} className="field-input">
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="study">Study</option>
            <option value="health">Health</option>
            <option value="shopping">Shopping</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="field-label">Due date</label>
        <input
          type="datetime-local"
          value={form.due_date}
          onChange={update('due_date')}
          className="field-input"
        />
      </div>

      <div>
        <label className="field-label">Tags (comma separated)</label>
        <input
          type="text"
          value={form.tags}
          onChange={update('tags')}
          placeholder="urgent, client, q3"
          className="field-input"
        />
      </div>

      <div>
        <label className="field-label">Notes</label>
        <textarea
          value={form.notes}
          onChange={update('notes')}
          placeholder="Additional detail…"
          className="field-input resize-none"
          rows={2}
        />
      </div>

      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Add to list'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default TodoForm
