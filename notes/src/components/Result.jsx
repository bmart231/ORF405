export default function Result({ label, children }) {
  return (
    <div className="result">
      {label && <p className="result-label">{label}</p>}
      {children}
    </div>
  )
}
