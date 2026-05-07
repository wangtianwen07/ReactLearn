// Lesson 2: Props
// Props are the way components receive data from their parent.
// They are read-only — a component must never modify its own props.

function Badge({ label, color }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '12px',
        background: color,
        color: '#fff',
        fontSize: '14px',
        marginRight: '6px',
      }}
    >
      {label}
    </span>
  )
}

function UserCard({ name, role, skills }) {
  return (
    <div className="card">
      <strong>{name}</strong> — <em>{role}</em>
      <div style={{ marginTop: '8px' }}>
        {skills.map((skill) => (
          <Badge key={skill} label={skill} color="#aa3bff" />
        ))}
      </div>
    </div>
  )
}

export default function PropsLesson() {
  return (
    <div className="lesson">
      <h2>2. Props</h2>
      <p className="description">
        <em>Props</em> (short for properties) let you pass data from a parent component to a child.
        They are read-only inside the child component.
      </p>

      <div className="example">
        <h3>Live Example</h3>
        <UserCard
          name="Alice"
          role="Frontend Developer"
          skills={['React', 'TypeScript', 'CSS']}
        />
        <UserCard
          name="Bob"
          role="Backend Developer"
          skills={['Node.js', 'PostgreSQL', 'Docker']}
        />
      </div>

      <pre className="code">{`function UserCard({ name, role, skills }) {
  return (
    <div>
      <strong>{name}</strong> — <em>{role}</em>
      {skills.map(skill => <Badge key={skill} label={skill} />)}
    </div>
  )
}

// Usage:
<UserCard
  name="Alice"
  role="Frontend Developer"
  skills={['React', 'TypeScript', 'CSS']}
/>`}</pre>
    </div>
  )
}
