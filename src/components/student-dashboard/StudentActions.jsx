import { FileText, Send, CreditCard, GraduationCap } from 'lucide-react'
import { useRef } from 'react'
import './StudentActions.css'

function useRipple() {
  const ref = useRef(null)

  function trigger(e) {
    const card = ref.current
    if (!card) return

    const existing = card.querySelector('.sa-ripple')
    if (existing) existing.remove()

    const rect = card.getBoundingClientRect()
    const x = (e.clientX ?? rect.left + rect.width / 2) - rect.left
    const y = (e.clientY ?? rect.top + rect.height / 2) - rect.top
    const size = Math.max(rect.width, rect.height)

    const dot = document.createElement('span')
    dot.className = 'sa-ripple'
    dot.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x - size / 2}px;
      top: ${y - size / 2}px;
    `
    card.appendChild(dot)
    dot.addEventListener('animationend', () => dot.remove())
  }

  return { ref, trigger }
}

function ActionCard({ icon: Icon, label, modifier, onClick }) {
  const { ref, trigger } = useRipple()

  function handleClick(e) {
    trigger(e)
    onClick?.(e)
  }

  return (
    <button
      ref={ref}
      className={`sa-card ${modifier}`}
      onClick={handleClick}
      type="button"
    >
      <div className="sa-inner">
        <div className="sa-glow-blob" aria-hidden="true" />

        <div className="sa-corner" aria-hidden="true" />

        <div className="sa-icon-wrap">
          <Icon className="sa-icon" />
        </div>

        <span className="sa-label">{label}</span>
      </div>
    </button>
  )
}

export function StudentActions() {
  return (
    <div className="sa-grid">
      <ActionCard icon={FileText} label="Apply Leave" modifier="sa-card--leave" />
      <ActionCard icon={Send} label="Raise Request" modifier="sa-card--request" />
      <ActionCard icon={CreditCard} label="Pay Fees" modifier="sa-card--fees" />
      <ActionCard icon={GraduationCap} label="Exam Result" modifier="sa-card--exam" />
    </div>
  )
}
