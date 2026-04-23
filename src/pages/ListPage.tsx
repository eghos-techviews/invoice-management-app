import { useInvoices } from '../context/InvoiceContext'
import InvoiceCard from '../components/InvoiceCard/InvoiceCard'
import FilterDropdown from '../components/FilterDropdown/FilterDropdown'
import styles from './ListPage.module.css'

interface Props {
  onNewInvoice: () => void
}

export default function ListPage({ onNewInvoice }: Props) {
  const { invoices, filter } = useInvoices()

  const filtered = filter === 'all'
    ? invoices
    : invoices.filter(inv => inv.status === filter)

  return (
    <div className={styles.page}>
      {/* Header row */}
      <header className={styles.header}>
        <div>
          <h1>Invoices</h1>
          <p className={styles.count}>
            {filtered.length === 0
              ? filter === 'all'
                ? 'No invoices'
                : `No ${filter} invoices`
              : filter === 'all'
                ? `There are ${filtered.length} total invoice${filtered.length !== 1 ? 's' : ''}`
                : `${filtered.length} ${filter} invoice${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        <div className={styles.controls}>
          <FilterDropdown />
          <button className={styles.newButton} onClick={onNewInvoice} aria-label="Create new invoice">
            <span className={styles.iconWrapper} aria-hidden="true">
              <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.313 10.023v-3.71h3.71v-1.58h-3.71V1.023h-1.58v3.71H.023v1.58h3.71v3.71z" fill="#7C5DFA"/>
              </svg>
            </span>
            <span>New <span className={styles.fullText}>Invoice</span></span>
          </button>
        </div>
      </header>

      {/* Invoice list or empty state */}
      {filtered.length === 0 ? (
        <div className={styles.empty} role="status">
          {/* <svg width="242" height="200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g fill="none" fillRule="evenodd">
              <circle fill="#F8F8FB" cx="121" cy="121" r="121"/>
              <g fillRule="nonzero">
                <path d="M101 79h40a4 4 0 014 4v6h4a4 4 0 014 4v6h2a4 4 0 014 4v50a4 4 0 01-4 4H89a4 4 0 01-4-4V97a4 4 0 014-4h2v-6a4 4 0 014-4h6v-6a4 4 0 014-4z" fill="#252945"/>
                <rect fill="#DFE3FA" x="89" y="93" width="66" height="68" rx="4"/>
                <rect fill="#7C5DFA" x="101" y="79" width="40" height="40" rx="4"/>
                <rect fill="#9277FF" x="107" y="85" width="28" height="28" rx="4"/>
                <rect fill="#7C5DFA" x="113" y="91" width="16" height="16" rx="4"/>
              </g>
            </g>
          </svg> */}
          <img src="/campagne.jpg" alt="" aria-hidden="true" width="242" />
          <h2>Nothing here</h2>
          <p>Create an invoice by clicking the<br/><strong>New Invoice</strong> button</p>
        </div>
      ) : (
        <ul className={styles.list} aria-label="Invoice list">
          {filtered.map(invoice => (
            <li key={invoice.id}>
              <InvoiceCard invoice={invoice} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}