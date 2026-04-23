import { useNavigate } from 'react-router-dom'
import type { Invoice } from '../../types/invoice'
import StatusBadge from '../StatusBadge/StatusBadge'
import styles from './InvoiceCard.module.css'

interface Props {
  invoice: Invoice
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount)
}

export default function InvoiceCard({ invoice }: Props) {
  const navigate = useNavigate()

  return (
    <article
      className={styles.card}
      onClick={() => navigate(`/invoice/${invoice.id}`)}
      role="button"
      tabIndex={0}
      aria-label={`View invoice ${invoice.id} from ${invoice.clientName}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigate(`/invoice/${invoice.id}`)
        }
      }}
    >
      {/* Invoice ID */}
      <span className={styles.id}>
        <span className={styles.hash} aria-hidden="true">#</span>
        {invoice.id}
      </span>

      {/* Due date */}
      <span className={styles.due}>
        Due {formatDate(invoice.paymentDue)}
      </span>

      {/* Client name */}
      <span className={styles.client}>{invoice.clientName}</span>

      {/* Total amount */}
      <span className={styles.total}>{formatCurrency(invoice.total)}</span>

      {/* Status badge */}
      <StatusBadge status={invoice.status} />

      {/* Arrow — desktop only */}
      <svg
        className={styles.arrow}
        width="7" height="10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M1 1l4 4.228L1 9.456" stroke="#7C5DFA" strokeWidth="2" fill="none"/>
      </svg>
    </article>
  )
}