// Lesson 5: Lists & Keys
// Use the .map() array method to render a list of components.
// Each item must have a unique "key" prop so React can track it.

import { useState } from 'react'

const INITIAL_TODOS = [
  { id: 1, text: 'Learn React components', done: true },
  { id: 2, text: 'Understand props', done: true },
  { id: 3, text: 'Master useState', done: false },
  { id: 4, text: 'Explore useEffect', done: false },
]

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 0',
        textDecoration: todo.done ? 'line-through' : 'none',
        color: todo.done ? 'var(--text)' : 'var(--text-h)',
      }}
    >
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
      />
      <span style={{ flex: 1 }}>{todo.text}</span>
      <button
        onClick={() => onDelete(todo.id)}
        style={{ fontSize: '12px', padding: '2px 6px' }}
      >
        ✕
      </button>
    </li>
  )
}

function TodoList() {
  const [todos, setTodos] = useState(INITIAL_TODOS)
  const [input, setInput] = useState('')

  const toggle = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const remove = (id) => setTodos(todos.filter((t) => t.id !== id))

  const add = () => {
    const text = input.trim()
    if (!text) return
    setTodos([...todos, { id: Date.now(), text, done: false }])
    setInput('')
  }

  return (
    <div className="card" style={{ textAlign: 'left' }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px' }}>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onToggle={toggle} onDelete={remove} />
        ))}
      </ul>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          placeholder="New todo…"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          style={{ flex: 1 }}
        />
        <button onClick={add}>Add</button>
      </div>
    </div>
  )
}

export default function ListsLesson() {
  return (
    <div className="lesson">
      <h2>5. Lists &amp; Keys</h2>
      <p className="description">
        Use <code>.map()</code> to transform an array into React elements.
        Always provide a stable, unique <code>key</code> prop — this lets React
        efficiently update the DOM when the list changes.
      </p>

      <div className="example">
        <h3>Live Example — Todo List</h3>
        <TodoList />
      </div>

      <pre className="code">{`const items = ['Apple', 'Banana', 'Cherry']

function FruitList() {
  return (
    <ul>
      {items.map(fruit => (
        <li key={fruit}>{fruit}</li>
      ))}
    </ul>
  )
}`}</pre>
    </div>
  )
}
