const DATA = [
  { y: 0, mu: 0.05 },
  { y: 0, mu: 0.09 },
  { y: 0, mu: 0.14 },
  { y: 1, mu: 0.18 },
  { y: 0, mu: 0.27 },
  { y: 0, mu: 0.35 },
  { y: 1, mu: 0.41 },
  { y: 0, mu: 0.52 },
  { y: 1, mu: 0.63 },
  { y: 1, mu: 0.74 },
  { y: 0, mu: 0.81 },
  { y: 1, mu: 0.92 },
]

function residuals() {
  return DATA.map(({ y, mu }) => {
    const pearson = (y - mu) / Math.sqrt(mu * (1 - mu))
    const dev = -2 * (y * Math.log(mu) + (1 - y) * Math.log(1 - mu))
    const sign = y - mu === 0 ? 1 : Math.sign(y - mu)
    const deviance = sign * Math.sqrt(Math.max(dev, 0))
    return { pearson, deviance }
  })
}

export default function ResidualComparison() {
  const rows = residuals()
  const width = 560
  const height = 300
  const padding = { top: 16, right: 16, bottom: 36, left: 44 }
  const plotW = width - padding.left - padding.right
  const plotH = height - padding.top - padding.bottom

  const maxAbs = Math.max(...rows.flatMap((r) => [Math.abs(r.pearson), Math.abs(r.deviance)]))
  const x = (i) => padding.left + (i / (rows.length - 1)) * plotW
  const y = (v) => padding.top + plotH / 2 - (v / maxAbs) * (plotH / 2)

  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Pearson versus deviance residuals for a fitted logistic regression">
        <line x1={padding.left} y1={padding.top + plotH / 2} x2={padding.left + plotW} y2={padding.top + plotH / 2} className="chart-axis" />
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + plotH} className="chart-axis" />
        <text x={padding.left + plotW / 2} y={height - 6} className="chart-label" textAnchor="middle">observation i, sorted by fitted mu</text>
        <text x={14} y={padding.top + plotH / 2} className="chart-label" textAnchor="middle" transform={`rotate(-90 14 ${padding.top + plotH / 2})`}>residual</text>
        {rows.map((r, i) => (
          <circle key={`p-${i}`} cx={x(i)} cy={y(r.pearson)} r={3.5} className="chart-point-pearson" />
        ))}
        {rows.map((r, i) => (
          <circle key={`d-${i}`} cx={x(i)} cy={y(r.deviance)} r={3.5} className="chart-point-deviance" />
        ))}
      </svg>
      <figcaption>
        <span className="legend-bias">Pearson</span> vs <span className="legend-variance">deviance</span> residuals for the same 12 fitted values &mu;<sub>i</sub>. They agree near &mu;&asymp;0.5 and diverge as &mu; approaches 0 or 1, since the Pearson residual's denominator shrinks faster there than the deviance residual's log-based scaling.
      </figcaption>
    </figure>
  )
}
