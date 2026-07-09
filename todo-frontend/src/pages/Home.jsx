import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiArrowRight, FiCheck } from 'react-icons/fi'

const mockTasks = [
  { text: 'Draft the quarterly review', tag: 'work', done: true },
  { text: 'Book dentist appointment', tag: 'health', done: false },
  { text: 'Read chapter 4 before class', tag: 'study', done: false },
]

const Home = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="max-w-5xl mx-auto px-5">
      <section className="grid md:grid-cols-2 gap-14 items-center pt-16 pb-24 md:pt-24 md:pb-32">
        <div>
          <span className="eyebrow">A quieter kind of to-do list</span>
          <h1 className="font-display text-5xl md:text-[3.4rem] leading-[1.05] font-semibold tracking-tight mt-4 mb-6">
            Write it down.
            <br />
            Cross it off.
          </h1>
          <p className="text-lg text-ink-soft max-w-md mb-8 leading-relaxed">
            No boards, no noise — just a ruled page for the things you need
            to do today, tagged, prioritized, and easy to find again.
          </p>

          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary">
              Go to your list <FiArrowRight size={16} />
            </Link>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary">
                Start writing <FiArrowRight size={16} />
              </Link>
              <Link to="/login" className="btn-secondary">
                Sign in
              </Link>
            </div>
          )}
        </div>

        {/* Signature element: a mock ruled index-card of tasks */}
        <div className="relative hidden md:block">
          <div className="absolute -top-3 -left-3 w-full h-full rounded-md border border-ink/10 bg-paper-card/60 rotate-[-2deg]" />
          <div className="relative ruled-card p-6 pl-12 rotate-[1.5deg]">
            <p className="eyebrow mb-4">Today</p>
            <ul className="space-y-4">
              {mockTasks.map((task, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className={`check-box mt-0.5 ${
                      task.done ? 'bg-brand border-brand' : 'border-ink/25'
                    }`}
                  >
                    {task.done && <FiCheck size={14} className="text-paper" />}
                  </span>
                  <div>
                    <p className={`text-[15px] ${task.done ? 'line-through text-ink-faint' : 'text-ink'}`}>
                      {task.text}
                    </p>
                    <span className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">
                      {task.tag}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-6 pb-24 border-t border-ink/10 pt-14">
        <div>
          <p className="font-display text-lg font-semibold mb-1.5">Tags, not tabs</p>
          <p className="text-sm text-ink-soft leading-relaxed">
            Sort by priority, category or due date without leaving the page.
          </p>
        </div>
        <div>
          <p className="font-display text-lg font-semibold mb-1.5">Yours alone</p>
          <p className="text-sm text-ink-soft leading-relaxed">
            Every list is private to your account — nobody else sees it.
          </p>
        </div>
        <div>
          <p className="font-display text-lg font-semibold mb-1.5">Nothing to configure</p>
          <p className="text-sm text-ink-soft leading-relaxed">
            Sign up and start writing. No boards to set up first.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Home
