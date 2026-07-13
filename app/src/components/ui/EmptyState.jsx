export default function EmptyState({ icon, title, children, action, className = '' }) {
  return (
    <section className={`empty-state ui-empty-state ${className}`.trim()}>
      {icon && <span className="ui-empty-state-icon">{icon}</span>}
      {title && <h2>{title}</h2>}
      {children}
      {action && <div className="ui-empty-state-action">{action}</div>}
    </section>
  )
}
