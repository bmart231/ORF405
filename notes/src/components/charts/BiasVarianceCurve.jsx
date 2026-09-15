const H_MIN = 0.05
const H_MAX = 1.0
const POINTS = 60
const N = 200
const BIAS_COEF = 0.25
const VAR_COEF = 1.2

function buildCurve() {
  const hs = Array.from({ length: POINTS }, (_, i) => H_MIN + (i * (H_MAX - H_MIN)) / (POINTS - 1))
  return hs.map((h) => {
    const bias2 = BIAS_COEF * h ** 4
    const variance = VAR_COEF / (N * h)
    return { h, bias2, variance, mse: bias2 + variance }
  })
}

export default function BiasVarianceCurve() {
  const curve = buildCurve()
  const best = curve.reduce((a, b) => (b.mse < a.mse ? b : a))

  const width = 560
  const height = 300
  const padding = { top: 16, right: 16, bottom: 36, left: 44 }
  const plotW = width - padding.left - padding.right
  const plotH = height - padding.top - padding.bottom

  const maxY = Math.max(...curve.map((d) => Math.max(d.bias2, d.variance, d.mse)))
  const x = (h) => padding.left + ((h - H_MIN) / (H_MAX - H_MIN)) * plotW
  const y = (v) => padding.top + plotH - (v / maxY) * plotH

  const line = (key) =>
    curve.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(d.h).toFixed(1)} ${y(d[key]).toFixed(1)}`).join(' ')

  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Bias-squared, variance, and MSE curves against bandwidth h">
        <line x1={padding.left} y1={padding.top + plotH} x2={padding.left + plotW} y2={padding.top + plotH} className="chart-axis" />
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + plotH} className="chart-axis" />
        <text x={padding.left + plotW / 2} y={height - 6} className="chart-label" textAnchor="middle">bandwidth h</text>
        <text x={14} y={padding.top + plotH / 2} className="chart-label" textAnchor="middle" transform={`rotate(-90 14 ${padding.top + plotH / 2})`}>error</text>
        <path d={line('bias2')} className="chart-line chart-line-bias" fill="none" />
        <path d={line('variance')} className="chart-line chart-line-variance" fill="none" />
        <path d={line('mse')} className="chart-line chart-line-mse" fill="none" />
        <circle cx={x(best.h)} cy={y(best.mse)} r={4} className="chart-point" />
        <text x={x(best.h)} y={y(best.mse) - 10} className="chart-label" textAnchor="middle">h* &asymp; {best.h.toFixed(2)}</text>
      </svg>
      <figcaption>
        <span className="legend-bias">bias&sup2;</span> &middot; <span className="legend-variance">variance</span> &middot; <span className="legend-mse">MSE</span> against bandwidth, for an illustrative $m''(x)$ and design density. The minimum near h&asymp;{best.h.toFixed(2)} is the bias&ndash;variance optimal bandwidth referenced in the text.
      </figcaption>
    </figure>
  )
}
