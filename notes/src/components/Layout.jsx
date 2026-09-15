import Sidebar from './Sidebar.jsx'

export default function Layout({ children }) {
  return (
    <div className="app">
      <Sidebar />
      <main id="main">
        <div className="topic">{children}</div>
      </main>
    </div>
  )
}
