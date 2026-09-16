import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { topics } from '../content/topics.js'

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button className="drawer-toggle" aria-label="Toggle topic list" onClick={() => setOpen((v) => !v)}>
        &#9776; Topics
      </button>
      <nav className={`sidebar${open ? ' open' : ''}`}>
        <span className="course-tag">ORF 405</span>
        <h1 className="course-title">Regression &amp;<br />Applied Time Series</h1>
        <p className="course-sub">Notes &amp; proofs, built topic by topic</p>
        <ol className="topic-list">
          {topics.map((topic) => (
            <li key={topic.slug}>
              <NavLink
                to={`/${topic.slug}`}
                className={({ isActive }) => `topic-link${isActive ? ' active' : ''}`}
                data-state={topic.status}
                onClick={() => setOpen(false)}
              >
                {String(topic.number).padStart(2, '0')} &middot; {topic.title}
                <span className="status">{topic.status === 'ready' ? 'written' : 'not covered yet'}</span>
              </NavLink>
            </li>
          ))}
        </ol>
        <p className="sidebar-note">Homework is tracked separately &mdash; this site is for building intuition and holding the proofs.</p>
      </nav>
    </>
  )
}
