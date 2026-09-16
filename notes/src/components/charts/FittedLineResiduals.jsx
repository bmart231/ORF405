const N = 22
const TRUE_INTERCEPT = 1
const TRUE_SLOPE = 2

function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildData() {
  const rand = mulberry32(405)
  const points = []
  for (let i = 0; i < N; i++) {
    const x = -2 + (4 * i) / (N - 1)
    const noise = (rand() - 0.5) * 2.2
    const y = TRUE_INTERCEPT + TRUE_SLOPE * x + noise
    points.push({ x, y })
  }
  const n = points.length
  const xBar = points.reduce((s, p) => s + p.x, 0) / n
  const yBar = points.reduce((s, p) => s + p.y, 0) / n
  const sxy = points.reduce((s, p) => s + (p.x - xBar) * (p.y - yBar), 0)
  const sxx = points.reduce((s, p) => s + (p.x - xBar) ** 2, 0)
  const slope = sxy / sxx
  const intercept = yBar - slope * xBar
  return { points, slope, intercept }
}

export default function FittedLineResiduals() {
  const { points, slope, intercept } = buildData()
  const width = 560
  const height = 320
  const padding = { top: 16, right: 16, bottom: 36, left: 44 }
  const plotW = width - padding.left - padding.right
  const plotH = height - padding.top - padding.bottom

  const xMin = -2.2
  const xMax = 2.2
  const yMin = Math.min(...points.map((p) => p.y)) - 1
  const yMax = Math.max(...points.map((p) => p.y)) + 1

  const x = (v) => padding.left + ((v - xMin) / (xMax - xMin)) * plotW
  const y = (v) => padding.top + plotH - ((v - yMin) / (yMax - yMin)) * plotH
  const fit = (v) => intercept + slope * v

  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Scatter of synthetic data with fitted regression line and residuals">
        <line x1={padding.left} y1={padding.top + plotH} x2={padding.left + plotW} y2={padding.top + plotH} className="chart-axis" />
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + plotH} className="chart-axis" />
        <text x={padding.left + plotW / 2} y={height - 6} className="chart-label" textAnchor="middle">x</text>
        <text x={14} y={padding.top + plotH / 2} className="chart-label" textAnchor="middle" transform={`rotate(-90 14 ${padding.top + plotH / 2})`}>y</text>
        <path
          d={`M ${x(xMin).toFixed(1)} ${y(fit(xMin)).toFixed(1)} L ${x(xMax).toFixed(1)} ${y(fit(xMax)).toFixed(1)}`}
          className="chart-fit-line"
        />
        {points.map((p, i) => (
          <line key={`r-${i}`} x1={x(p.x)} y1={y(p.y)} x2={x(p.x)} y2={y(fit(p.x))} className="chart-residual" />
        ))}
        {points.map((p, i) => (
          <circle key={`p-${i}`} cx={x(p.x)} cy={y(p.y)} r={3.5} className="chart-point-data" />
        ))}
      </svg>
      <figcaption>
        Synthetic data (n={N}) with the fitted line &ycirc; = {intercept.toFixed(2)} + {slope.toFixed(2)}x. Dashed segments are residuals, the quantities squared and summed in RSS.
      </figcaption>
    </figure>
  )
}
