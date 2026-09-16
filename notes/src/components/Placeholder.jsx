export default function Placeholder({ topic }) {
  return (
    <>
      <p className="eyebrow">TOPIC {String(topic.number).padStart(2, '0')} OF 09</p>
      <h1>{topic.title}</h1>
      <div className="placeholder-card">
        <strong>Not covered yet.</strong> This page will be filled in once the lecture reaches this topic.
      </div>
    </>
  )
}
