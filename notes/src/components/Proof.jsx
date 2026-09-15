export default function Proof({ label = 'Proof', children }) {
  return (
    <div className="proof">
      <p className="proof-label">{label}</p>
      {children}
      <span className="qed" aria-hidden="true">&#8718;</span>
    </div>
  )
}
