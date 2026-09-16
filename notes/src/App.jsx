import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Placeholder from './components/Placeholder.jsx'
import { topics } from './content/topics.js'

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to={`/${topics[0].slug}`} replace />} />
          {topics.map((topic) => (
            <Route
              key={topic.slug}
              path={`/${topic.slug}`}
              element={topic.status === 'ready' ? <topic.Component /> : <Placeholder topic={topic} />}
            />
          ))}
        </Routes>
      </Layout>
    </HashRouter>
  )
}
