import { useState } from 'react'
import reactLogo from './assets/react.svg'
import ComponentsLesson from './examples/01-Components'
import PropsLesson from './examples/02-Props'
import StateLesson from './examples/03-State'
import EffectsLesson from './examples/04-Effects'
import ListsLesson from './examples/05-Lists'
import ContextLesson from './examples/06-Context'
import './App.css'

const LESSONS = [
  { id: 1, label: 'Components', component: ComponentsLesson },
  { id: 2, label: 'Props', component: PropsLesson },
  { id: 3, label: 'useState', component: StateLesson },
  { id: 4, label: 'useEffect', component: EffectsLesson },
  { id: 5, label: 'Lists & Keys', component: ListsLesson },
  { id: 6, label: 'useContext', component: ContextLesson },
]

function App() {
  const [activeId, setActiveId] = useState(1)
  const ActiveLesson = LESSONS.find((l) => l.id === activeId).component

  return (
    <>
      <header id="app-header">
        <div id="logo-row">
          <img src={reactLogo} height="36" alt="React logo" />
          <h1>React Learn</h1>
        </div>
        <p className="subtitle">
          Interactive examples for the core React concepts
        </p>
      </header>

      <nav id="lesson-nav">
        {LESSONS.map((lesson) => (
          <button
            key={lesson.id}
            className={`nav-btn${activeId === lesson.id ? ' active' : ''}`}
            onClick={() => setActiveId(lesson.id)}
          >
            {lesson.label}
          </button>
        ))}
      </nav>

      <main id="lesson-main">
        <ActiveLesson />
      </main>

      <footer id="app-footer">
        <a href="https://react.dev/" target="_blank" rel="noreferrer">
          React Docs
        </a>
        {' · '}
        <a
          href="https://github.com/wangtianwen07/ReactLearn"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </footer>
    </>
  )
}

export default App
