import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useInvoices } from '../context/InvoiceContext'
import StatusBadge from '../components/StatusBadge/StatusBadge'
import Button from '../components/Button/Button'
import Modal from '../components/Modal/Modal'
import styles from './DetailsPage.module.css'

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

interface Props {
  onEdit: (id: string) => void
}

export default function DetailPage({ onEdit }: Props) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getInvoice, deleteInvoice, markAsPaid, markAsPending } = useInvoices()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const invoice = getInvoice(id ?? '')

  // If invoice doesn't exist, show a friendly message
  if (!invoice) {
    return (
      <div className={styles.notFound}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M6.342.886L2.114 5.114l4.228 4.228" stroke="#7C5DFA" strokeWidth="2" fill="none"/>
          </svg>
          Go Back
        </button>
        <p>Invoice not found.</p>
      </div>
    )
  }

  function handleDelete() {
    deleteInvoice(invoice!.id)
    navigate('/')
  }

  return (
    <div className={styles.page}>
      {/* Back button */}
      <button className={styles.backBtn} onClick={() => navigate('/')}>
        <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M6.342.886L2.114 5.114l4.228 4.228" stroke="#7C5DFA" strokeWidth="2" fill="none"/>
        </svg>
        Go Back
      </button>

      {/* Status bar */}
      <div className={styles.statusBar}>
        <div className={styles.statusLeft}>
          <span className={styles.statusLabel}>Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        <div className={styles.actions}>
          {invoice.status !== 'paid' && (
            <Button variant="edit" onClick={() => onEdit(invoice.id)}>
              Edit
            </Button>
          )}
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            Delete
          </Button>
          {invoice.status === 'pending' && (
            <Button variant="primary" onClick={() => markAsPaid(invoice.id)}>
              Mark as Paid
            </Button>
          )}
          {invoice.status === 'draft' && (
            <Button variant="primary" onClick={() => markAsPending(invoice.id)}>
              Mark as Pending
            </Button>
          )}
        </div>
      </div>

      {/* Invoice body */}
      <div className={styles.card}>
        {/* Top: ID + description + addresses */}
        <div className={styles.topSection}>
          <div>
            <h2 className={styles.invoiceId}>
              <span className={styles.hash}>#</span>{invoice.id}
            </h2>
            <p className={styles.description}>{invoice.description}</p>
          </div>
          <address className={styles.senderAddress}>
            <span>{invoice.senderAddress.street}</span>
            <span>{invoice.senderAddress.city}</span>
            <span>{invoice.senderAddress.postCode}</span>
            <span>{invoice.senderAddress.country}</span>
          </address>
        </div>

        {/* Middle: dates + client info */}
        <div className={styles.metaSection}>
          <div className={styles.metaCol}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Invoice Date</span>
              <span className={styles.metaValue}>{formatDate(invoice.createdAt)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Payment Due</span>
              <span className={styles.metaValue}>{formatDate(invoice.paymentDue)}</span>
            </div>
          </div>

          <div className={styles.metaCol}>
            <span className={styles.metaLabel}>Bill To</span>
            <span className={styles.metaValue}>{invoice.clientName}</span>
            <address className={styles.clientAddress}>
              <span>{invoice.clientAddress.street}</span>
              <span>{invoice.clientAddress.city}</span>
              <span>{invoice.clientAddress.postCode}</span>
              <span>{invoice.clientAddress.country}</span>
            </address>
          </div>

          <div className={styles.metaCol}>
            <span className={styles.metaLabel}>Sent To</span>
            <span className={styles.metaValue}>{invoice.clientEmail}</span>
          </div>
        </div>

        {/* Items table */}
        <div className={styles.itemsTable}>
          <div className={styles.tableHead}>
            <span>Item Name</span>
            <span>QTY.</span>
            <span>Price</span>
            <span>Total</span>
          </div>

          {invoice.items.map(item => (
            <div key={item.id} className={styles.tableRow}>
              <span className={styles.itemName}>{item.name}</span>
              <span className={styles.itemQty}>{item.quantity}</span>
              <span className={styles.itemPrice}>{formatCurrency(item.price)}</span>
              <span className={styles.itemTotal}>{formatCurrency(item.total)}</span>
            </div>
          ))}

          {/* Grand total */}
          <div className={styles.grandTotal}>
            <span>Amount Due</span>
            <span className={styles.grandTotalAmount}>{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Mobile action bar */}
      <div className={styles.mobileActions}>
        {invoice.status !== 'paid' && (
          <Button variant="edit" onClick={() => onEdit(invoice.id)}>
            Edit
          </Button>
        )}
        <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
          Delete
        </Button>
        {invoice.status === 'pending' && (
          <Button variant="primary" onClick={() => markAsPaid(invoice.id)}>
            Mark as Paid
          </Button>
        )}
        {invoice.status === 'draft' && (
          <Button variant="primary" onClick={() => markAsPaid(invoice.id)}>
            Mark as Pending
          </Button>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
      >
        <p className={styles.modalText}>
          Are you sure you want to delete invoice{' '}
          <strong>#{invoice.id}</strong>? This action cannot be undone.
        </p>
        <div className={styles.modalActions}>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}