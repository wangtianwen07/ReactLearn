// Lesson 6: Context API (useContext)
// Context lets you pass data through the component tree without
// prop-drilling at every level.

import { createContext, useContext, useState } from 'react'

// 1. Create a context
const ThemeContext = createContext('light')

// 2. Components that consume the context
function ThemedBox() {
  const theme = useContext(ThemeContext)
  const isDark = theme === 'dark'

  return (
    <div
      style={{
        padding: '16px',
        borderRadius: '8px',
        background: isDark ? '#16171d' : '#f4f3ec',
        color: isDark ? '#f3f4f6' : '#08060d',
        border: '1px solid',
        borderColor: isDark ? '#2e303a' : '#e5e4e7',
      }}
    >
      <p>
        Current theme: <strong>{theme}</strong>
      </p>
      <p>This box reads the theme from context — no prop needed!</p>
    </div>
  )
}

function DeepChild() {
  return (
    <div style={{ marginTop: '12px' }}>
      <p style={{ fontSize: '13px', marginBottom: '8px' }}>
        <em>DeepChild</em> (nested 3 levels deep, still reads context):
      </p>
      <ThemedBox />
    </div>
  )
}

function MiddleLayer() {
  return <DeepChild />
}

// 3. Provider wraps the subtree
function ThemeApp() {
  const [theme, setTheme] = useState('light')

  return (
    <ThemeContext.Provider value={theme}>
      <div className="card">
        <div style={{ marginBottom: '12px' }}>
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
          </button>
        </div>
        <ThemedBox />
        <MiddleLayer />
      </div>
    </ThemeContext.Provider>
  )
}

export default function ContextLesson() {
  return (
    <div className="lesson">
      <h2>6. Context — useContext</h2>
      <p className="description">
        Context solves <em>prop drilling</em>: instead of passing a prop
        through every intermediate component, wrap the tree with a{' '}
        <code>Provider</code> and read the value anywhere with{' '}
        <code>useContext</code>.
      </p>

      <div className="example">
        <h3>Live Example — Theme Toggle</h3>
        <ThemeApp />
      </div>

      <pre className="code">{`const ThemeContext = createContext('light')

// Provider at the top
<ThemeContext.Provider value={theme}>
  <App />
</ThemeContext.Provider>

// Anywhere inside the tree:
function ThemedBox() {
  const theme = useContext(ThemeContext)
  return <div>Theme is {theme}</div>
}`}</pre>
    </div>
  )
}
