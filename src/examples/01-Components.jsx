// Lesson 1: Components
// React apps are built from isolated pieces of UI called components.
// A component is a JavaScript function that returns JSX.

function Greeting({ name }) {
  return <p>Hello, <strong>{name}</strong>! 👋</p>
}

function Card({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {children}
    </div>
  )
}

export default function ComponentsLesson() {
  return (
    <div className="lesson">
      <h2>1. Components</h2>
      <p className="description">
        React UIs are built from <em>components</em> — reusable, self-contained pieces of UI.
        Components are plain JavaScript functions that return JSX.
      </p>

      <div className="example">
        <h3>Live Example</h3>
        <Greeting name="Alice" />
        <Greeting name="Bob" />

        <Card title="What is JSX?">
          <p>JSX lets you write HTML-like markup inside JavaScript.</p>
        </Card>
      </div>

      <pre className="code">{`function Greeting({ name }) {
  return <p>Hello, <strong>{name}</strong>! 👋</p>
}

// Usage:
<Greeting name="Alice" />
<Greeting name="Bob" />`}</pre>
    </div>
  )
}
