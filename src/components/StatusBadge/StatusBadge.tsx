import type { InvoiceStatus } from '../../types/invoice'
import styles from './StatusBadge.module.css'

interface Props {
  status: InvoiceStatus
}

export default function StatusBadge({ status }: Props) {
  return (
    <div className={`${styles.badge} ${styles[status]}`}>
      <span className={styles.dot} aria-hidden="true" />
      <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </div>
  )
}