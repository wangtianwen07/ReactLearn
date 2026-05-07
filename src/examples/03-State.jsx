// Lesson 3: State (useState)
// State lets a component "remember" information between renders.
// Call useState to declare a state variable.

import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className="card">
      <p>Count: <strong>{count}</strong></p>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <button onClick={() => setCount(count - 1)}>−</button>
        <button onClick={() => setCount(0)}>Reset</button>
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
    </div>
  )
}

function Toggle() {
  const [isOn, setIsOn] = useState(false)

  return (
    <div className="card">
      <p>The light is <strong>{isOn ? '💡 On' : '🌑 Off'}</strong></p>
      <button onClick={() => setIsOn(!isOn)}>
        Turn {isOn ? 'Off' : 'On'}
      </button>
    </div>
  )
}

function NameInput() {
  const [name, setName] = useState('')

  return (
    <div className="card">
      <input
        type="text"
        placeholder="Type your name…"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginRight: '8px' }}
      />
      {name && <p>Hello, <strong>{name}</strong>! 👋</p>}
    </div>
  )
}

export default function StateLesson() {
  return (
    <div className="lesson">
      <h2>3. State — useState</h2>
      <p className="description">
        <em>State</em> is data that can change over time. Use{' '}
        <code>useState</code> to add state to a functional component.
        React re-renders the component whenever state changes.
      </p>

      <div className="example">
        <h3>Live Examples</h3>
        <Counter />
        <Toggle />
        <NameInput />
      </div>

      <pre className="code">{`import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}`}</pre>
    </div>
  )
}
