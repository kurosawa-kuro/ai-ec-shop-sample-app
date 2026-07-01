const STEPS = ['カートを確認', 'お客様情報', '注文完了']

export default function CheckoutSteps({ current }) {
  return (
    <nav className="checkout-steps" aria-label="購入ステップ">
      {STEPS.map((label, i) => {
        const state = i + 1 === current ? 'active' : i + 1 < current ? 'done' : 'pending'
        return (
          <span key={label} className={`step step-${state}`}>
            <span className="step-num" aria-hidden="true">
              {state === 'done' ? '✓' : i + 1}
            </span>
            <span className="step-label">{label}</span>
          </span>
        )
      })}
    </nav>
  )
}
