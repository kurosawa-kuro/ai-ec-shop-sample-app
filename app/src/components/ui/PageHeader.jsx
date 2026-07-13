export default function PageHeader({ eyebrow, icon, title, children, actions, className = '' }) {
  return (
    <header className={`page-heading page-header ${className}`.trim()}>
      {eyebrow && (
        <p className="eyebrow">
          {icon}
          {eyebrow}
        </p>
      )}
      <h1>{title}</h1>
      {children}
      {actions && <div className="page-header-actions">{actions}</div>}
    </header>
  )
}
