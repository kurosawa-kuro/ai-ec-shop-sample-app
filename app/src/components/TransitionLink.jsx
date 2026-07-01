import { Link, useNavigate } from 'react-router-dom'
import { startViewTransition } from '../lib/viewTransition'

export default function TransitionLink({ to, onClick, target, children, ...props }) {
  const navigate = useNavigate()

  const handleClick = (event) => {
    onClick?.(event)
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      target ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return
    }

    event.preventDefault()
    startViewTransition(() => navigate(to))
  }

  return (
    <Link to={to} target={target} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}
