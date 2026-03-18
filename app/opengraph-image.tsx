import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const alt = 'codeset — Onboard your coding agent'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const INDIGO = '#6366f1'
const BG = '#ffffff'
const PANEL = '#0f172a'
const MUTED = '#64748b'
const DIM = '#94a3b8'

export default async function Image() {
  const logoBuffer = readFileSync(join(process.cwd(), 'public/favicon-bacalhau.png'))
  const logoSrc = `data:image/png;base64,${logoBuffer.toString('base64')}`
  const notoSans = readFileSync(join(process.cwd(), 'public/fonts/NotoSans-Regular.ttf'))
  const notoSymbols = readFileSync(join(process.cwd(), 'public/fonts/NotoSansSymbols2-Regular.ttf'))

  return new ImageResponse(
    (
      <div
        style={{
          background: BG,
          width: '100%',
          height: '100%',
          display: 'flex',
          fontFamily: 'sans-serif',
          padding: '48px 56px',
          gap: '52px',
        }}
      >
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: '0 0 520px' }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={logoSrc} alt="" style={{ height: 30, width: 30, objectFit: 'contain', filter: 'invert(1)' }} />
            <div style={{ fontSize: 17, fontWeight: 600, color: '#111827', letterSpacing: '-0.01em' }}>
              {'<codeset>'}
            </div>
          </div>

          {/* Headline + tagline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', fontSize: 64, fontWeight: 700, color: '#0f172a', lineHeight: 1.05, letterSpacing: '-0.025em' }}>
              <div>Onboard your</div>
              <div>coding agent</div>
            </div>
            <div style={{ fontSize: 20, color: DIM, lineHeight: 1.4 }}>
              the knowledge your team spent years building.
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { model: 'Haiku 4.5', from: '52%', to: '62%', delta: '+10pp' },
              { model: 'Sonnet 4.5', from: '56%', to: '65.3%', delta: '+9.3pp' },
              { model: 'Opus 4.5', from: '60.7%', to: '68%', delta: '+7.3pp' },
            ].map((s) => (
              <div
                key={s.model}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  padding: '10px 20px',
                  gap: 2,
                }}
              >
                <div style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.04em' }}>{s.model}</div>
                <div style={{ fontSize: 38, fontWeight: 700, color: INDIGO, lineHeight: 1.1 }}>{s.to}</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
                  <span style={{ fontSize: 13, color: MUTED, textDecoration: 'line-through' }}>{s.from}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: INDIGO }}>{s.delta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — terminal */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: PANEL,
            borderRadius: 14,
            padding: '24px 28px',
            fontFamily: 'NotoSans',
            fontSize: 13,
            lineHeight: 1.6,
            color: DIM,
            gap: 0,
          }}
        >
          {/* Terminal header dots */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
            <div style={{ width: 10, height: 10, borderRadius: 5, background: '#ef4444', opacity: 0.6 }} />
            <div style={{ width: 10, height: 10, borderRadius: 5, background: '#f59e0b', opacity: 0.6 }} />
            <div style={{ width: 10, height: 10, borderRadius: 5, background: '#22c55e', opacity: 0.6 }} />
          </div>

          <div style={{ display: 'flex', color: '#e2e8f0' }}>
            <span style={{ color: INDIGO }}>$</span>
            <span style={{ marginLeft: 8 }}>python get_context.py src/payments.ts</span>
          </div>
          <div style={{ color: MUTED, marginTop: 10 }}>-- src/payments.ts --</div>

          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: MUTED }}>History (4 insights):</div>
            <div style={{ color: '#e2e8f0', marginLeft: 2 }}>{'  [Bug Fix] Double-charge on retry'}</div>
            <div style={{ color: DIM, marginLeft: 2 }}>{'    Root cause: idempotency key not persisted'}</div>
            <div style={{ color: DIM, marginLeft: 2 }}>{'    Fix: store key in DB before Stripe call'}</div>
          </div>

          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: MUTED }}>Pitfalls:</div>
            <div style={{ color: '#e2e8f0', marginLeft: 2, display: 'flex' }}>
              <span>{'  '}</span><span style={{ fontFamily: 'NotoSymbols' }}>✗</span><span>{` Don't call charge() inside a DB transaction`}</span>
            </div>
            <div style={{ color: DIM, marginLeft: 2 }}>{'  → Stripe call may succeed but rollback fires'}</div>
          </div>

          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: MUTED }}>Callers (6 files):</div>
            <div style={{ color: '#e2e8f0', marginLeft: 2 }}>{'  api/checkout.ts:88    handleCheckout()'}</div>
            <div style={{ color: '#e2e8f0', marginLeft: 2 }}>{'  api/subscriptions.ts:41  renewSubscription()'}</div>
            <div style={{ color: DIM, marginLeft: 2 }}>{'  ... 4 more'}</div>
          </div>

          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: MUTED }}>{'Co-changes: src/webhooks.ts, src/subscriptions.ts'}</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'NotoSans', data: notoSans, weight: 400 },
        { name: 'NotoSymbols', data: notoSymbols, weight: 400 },
      ],
    }
  )
}
