// Lesson 4: Effects (useEffect)
// useEffect lets you synchronize a component with an external system
// (timers, data fetching, DOM manipulation, etc.).

import { useState, useEffect } from 'react'

function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    // Clean up when the component unmounts
    return () => clearInterval(id)
  }, []) // Empty array → run once on mount

  return (
    <div className="card">
      <p>Current time:</p>
      <strong style={{ fontSize: '1.4rem' }}>
        {time.toLocaleTimeString()}
      </strong>
    </div>
  )
}

function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="card">
      <p>Window width: <strong>{width}px</strong></p>
      <small>(try resizing the window)</small>
    </div>
  )
}

function DataFetcher() {
  const [post, setPost] = useState(null)
  const [postId, setPostId] = useState(1)
  const [loadedId, setLoadedId] = useState(null)
  const loading = loadedId !== postId

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data)
        setLoadedId(postId)
      })
      .catch(() => setLoadedId(postId))
  }, [postId]) // Re-run when postId changes

  return (
    <div className="card">
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '12px' }}>
        <button onClick={() => setPostId((id) => Math.max(1, id - 1))}>← Prev</button>
        <span style={{ lineHeight: '2' }}>Post #{postId}</span>
        <button onClick={() => setPostId((id) => Math.min(100, id + 1))}>Next →</button>
      </div>
      {loading ? (
        <p>Loading…</p>
      ) : (
        post && <p style={{ textAlign: 'left' }}><strong>{post.title}</strong></p>
      )}
    </div>
  )
}

export default function EffectsLesson() {
  return (
    <div className="lesson">
      <h2>4. Effects — useEffect</h2>
      <p className="description">
        <code>useEffect</code> runs side effects after rendering. Pass a
        dependency array to control when it re-runs. Return a cleanup function
        to avoid memory leaks.
      </p>

      <div className="example">
        <h3>Live Examples</h3>
        <Clock />
        <WindowWidth />
        <DataFetcher />
      </div>

      <pre className="code">{`import { useState, useEffect } from 'react'

function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)   // cleanup
  }, [])  // run once on mount

  return <p>{time.toLocaleTimeString()}</p>
}`}</pre>
    </div>
  )
}
