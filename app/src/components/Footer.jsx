import { Link } from 'react-router-dom'

const LINKS = [
  { label: '会社概要', href: '#company' },
  { label: '利用規約', href: '#terms' },
  { label: 'プライバシーポリシー', href: '#privacy' },
  { label: '特定商取引法に基づく表記', href: '#law' },
  { label: 'お問い合わせ', href: '#contact' },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <p className="footer-logo">Lumière Select</p>
          <p className="footer-tagline">
            贈る気持ちを、AIと一緒に。
            <br />
            美容・ギフトのセレクトショップ
          </p>
        </div>

        <nav className="footer-nav" aria-label="フッターナビゲーション">
          <p className="footer-nav-heading">サポート</p>
          {LINKS.map(({ label, href }) => (
            <a key={label} href={href} onClick={(e) => e.preventDefault()}>
              {label}
            </a>
          ))}
        </nav>

        <div className="footer-info">
          <p className="footer-nav-heading">運営会社</p>
          <address>
            株式会社ルミエール
            <br />
            〒107-0062 東京都港区南青山 3-1-1
            <br />
            TEL: 03-0000-0000（平日 10:00〜18:00）
            <br />
            <a href="mailto:support@lumiere-select.example.com">support@lumiere-select.example.com</a>
          </address>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © 2024{' '}
          <Link className="footer-admin-entry" to="/admin-demo" aria-label="店舗インサイト（管理デモ）">
            Lumière Select
          </Link>
          . All rights reserved.
        </p>
        <p className="footer-note">本サイトは営業デモ用です。実在の企業・商品とは関係ありません。</p>
      </div>
    </footer>
  )
}
