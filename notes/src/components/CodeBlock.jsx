export default function CodeBlock({ lang, children }) {
  return (
    <div>
      <p className="code-lang">{lang}</p>
      <div className="code-block">
        <pre>{children}</pre>
      </div>
    </div>
  )
}
