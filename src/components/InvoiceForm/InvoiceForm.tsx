import { useState, useEffect, useRef } from 'react'
import { useInvoices } from '../../context/InvoiceContext'
import type { Invoice, InvoiceItem } from '../../types/invoice'
import Button from '../Button/Button'
import styles from './InvoiceForm.module.css'

interface Props {
  isOpen: boolean
  onClose: () => void
  invoiceToEdit?: Invoice | null
}

// A blank item row
function emptyItem(): InvoiceItem {
  return { id: crypto.randomUUID(), name: '', quantity: 1, price: 0, total: 0 }
}

// Calculate payment due date from created date + payment terms
function calcPaymentDue(createdAt: string, terms: number): string {
  const date = new Date(createdAt)
  date.setDate(date.getDate() + terms)
  return date.toISOString().split('T')[0]
}

// Initial empty form state
function emptyForm() {
  const today = new Date().toISOString().split('T')[0]
  return {
    createdAt: today,
    description: '',
    paymentTerms: 30,
    clientName: '',
    clientEmail: '',
    senderAddress: { street: '', city: '', postCode: '', country: '' },
    clientAddress: { street: '', city: '', postCode: '', country: '' },
    items: [emptyItem()],
  }
}

export default function InvoiceForm({ isOpen, onClose, invoiceToEdit }: Props) {
  const { addInvoice, updateInvoice } = useInvoices()
  const [form, setForm] = useState(emptyForm())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const firstInputRef = useRef<HTMLInputElement>(null)

  // When editing, populate form with existing invoice data
  useEffect(() => {
    if (invoiceToEdit) {
      setForm({
        createdAt: invoiceToEdit.createdAt,
        description: invoiceToEdit.description,
        paymentTerms: invoiceToEdit.paymentTerms,
        clientName: invoiceToEdit.clientName,
        clientEmail: invoiceToEdit.clientEmail,
        senderAddress: { ...invoiceToEdit.senderAddress },
        clientAddress: { ...invoiceToEdit.clientAddress },
        items: invoiceToEdit.items.map(i => ({ ...i })),
      })
    } else {
      setForm(emptyForm())
    }
    setErrors({})
  }, [invoiceToEdit, isOpen])

  // Focus first input when form opens (accessibility)
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Close on ESC key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // ── Field updaters ──────────────────────────────

  function setField(field: string, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  function setSenderField(field: string, value: string) {
    setForm(prev => ({
      ...prev,
      senderAddress: { ...prev.senderAddress, [field]: value }
    }))
    setErrors(prev => ({ ...prev, [`sender_${field}`]: '' }))
  }

  function setClientField(field: string, value: string) {
    setForm(prev => ({
      ...prev,
      clientAddress: { ...prev.clientAddress, [field]: value }
    }))
    setErrors(prev => ({ ...prev, [`client_${field}`]: '' }))
  }

  function updateItem(id: string, field: keyof InvoiceItem, value: string | number) {
    setForm(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id !== id) return item
        const updated = { ...item, [field]: value }
        // Auto-calculate total when quantity or price changes
        updated.total = Number(updated.quantity) * Number(updated.price)
        return updated
      })
    }))
  }

  function addItem() {
    setForm(prev => ({ ...prev, items: [...prev.items, emptyItem()] }))
  }

  function removeItem(id: string) {
    setForm(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }))
  }

  // ── Validation ──────────────────────────────────

  function validate(): boolean {
    const newErrors: Record<string, string> = {}

    if (!form.clientName.trim()) newErrors.clientName = 'Required'
    if (!form.clientEmail.trim()) {
      newErrors.clientEmail = 'Required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail)) {
      newErrors.clientEmail = 'Must be a valid email'
    }
    if (!form.description.trim()) newErrors.description = 'Required'
    if (!form.senderAddress.street.trim()) newErrors.sender_street = 'Required'
    if (!form.senderAddress.city.trim()) newErrors.sender_city = 'Required'
    if (!form.senderAddress.postCode.trim()) newErrors.sender_postCode = 'Required'
    if (!form.senderAddress.country.trim()) newErrors.sender_country = 'Required'
    if (!form.clientAddress.street.trim()) newErrors.client_street = 'Required'
    if (!form.clientAddress.city.trim()) newErrors.client_city = 'Required'
    if (!form.clientAddress.postCode.trim()) newErrors.client_postCode = 'Required'
    if (!form.clientAddress.country.trim()) newErrors.client_country = 'Required'

    if (form.items.length === 0) {
      newErrors.items = 'Add at least one item'
    } else {
      form.items.forEach((item, i) => {
        if (!item.name.trim()) newErrors[`item_name_${i}`] = 'Required'
        if (item.quantity <= 0) newErrors[`item_qty_${i}`] = 'Must be > 0'
        if (item.price < 0) newErrors[`item_price_${i}`] = 'Must be ≥ 0'
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ── Submit handlers ─────────────────────────────

  function buildInvoiceData(status: 'draft' | 'pending') {
    const total = form.items.reduce((sum, item) => sum + item.total, 0)
    const paymentDue = calcPaymentDue(form.createdAt, form.paymentTerms)
    return { ...form, status, total, paymentDue }
  }

  function handleSaveDraft() {
    const data = buildInvoiceData('draft')
    if (invoiceToEdit) {
      updateInvoice({ ...invoiceToEdit, ...data })
    } else {
      addInvoice(data)
    }
    onClose()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    const data = buildInvoiceData('pending')
    if (invoiceToEdit) {
      updateInvoice({ ...invoiceToEdit, ...data })
    } else {
      addInvoice(data)
    }
    onClose()
  }

  const isEditing = !!invoiceToEdit

  // ── Render ──────────────────────────────────────

  return (
    <>
      {/* Overlay — clicking it closes the form */}
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={`${styles.drawer} ${isOpen ? styles.open : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={isEditing ? `Edit Invoice #${invoiceToEdit?.id}` : 'Create New Invoice'}
      >
        <div className={styles.inner}>
          <h2 className={styles.title}>
            {isEditing ? (
              <>Edit <span className={styles.hash}>#</span>{invoiceToEdit?.id}</>
            ) : (
              'New Invoice'
            )}
          </h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.scrollArea}>

              {/* ── Bill From ── */}
              <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>Bill From</legend>
                <div className={styles.field}>
                  <label htmlFor="senderStreet">Street Address</label>
                  <input
                    id="senderStreet"
                    ref={firstInputRef}
                    value={form.senderAddress.street}
                    onChange={e => setSenderField('street', e.target.value)}
                    className={errors.sender_street ? styles.inputError : ''}
                    aria-invalid={!!errors.sender_street}
                    aria-describedby={errors.sender_street ? 'senderStreet-error' : undefined}
                  />
                  {errors.sender_street && (
                    <span id="senderStreet-error" className={styles.errorMsg} role="alert">
                      {errors.sender_street}
                    </span>
                  )}
                </div>
                <div className={styles.threeCol}>
                  <div className={styles.field}>
                    <label htmlFor="senderCity">City</label>
                    <input
                      id="senderCity"
                      value={form.senderAddress.city}
                      onChange={e => setSenderField('city', e.target.value)}
                      className={errors.sender_city ? styles.inputError : ''}
                    />
                    {errors.sender_city && <span className={styles.errorMsg}>{errors.sender_city}</span>}
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="senderPostCode">Post Code</label>
                    <input
                      id="senderPostCode"
                      value={form.senderAddress.postCode}
                      onChange={e => setSenderField('postCode', e.target.value)}
                      className={errors.sender_postCode ? styles.inputError : ''}
                    />
                    {errors.sender_postCode && <span className={styles.errorMsg}>{errors.sender_postCode}</span>}
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="senderCountry">Country</label>
                    <input
                      id="senderCountry"
                      value={form.senderAddress.country}
                      onChange={e => setSenderField('country', e.target.value)}
                      className={errors.sender_country ? styles.inputError : ''}
                    />
                    {errors.sender_country && <span className={styles.errorMsg}>{errors.sender_country}</span>}
                  </div>
                </div>
              </fieldset>

              {/* ── Bill To ── */}
              <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>Bill To</legend>
                <div className={styles.field}>
                  <label htmlFor="clientName">Client's Name</label>
                  <input
                    id="clientName"
                    value={form.clientName}
                    onChange={e => setField('clientName', e.target.value)}
                    className={errors.clientName ? styles.inputError : ''}
                    aria-invalid={!!errors.clientName}
                  />
                  {errors.clientName && <span className={styles.errorMsg}>{errors.clientName}</span>}
                </div>
                <div className={styles.field}>
                  <label htmlFor="clientEmail">Client's Email</label>
                  <input
                    id="clientEmail"
                    type="email"
                    value={form.clientEmail}
                    onChange={e => setField('clientEmail', e.target.value)}
                    className={errors.clientEmail ? styles.inputError : ''}
                    aria-invalid={!!errors.clientEmail}
                  />
                  {errors.clientEmail && <span className={styles.errorMsg}>{errors.clientEmail}</span>}
                </div>
                <div className={styles.field}>
                  <label htmlFor="clientStreet">Street Address</label>
                  <input
                    id="clientStreet"
                    value={form.clientAddress.street}
                    onChange={e => setClientField('street', e.target.value)}
                    className={errors.client_street ? styles.inputError : ''}
                  />
                  {errors.client_street && <span className={styles.errorMsg}>{errors.client_street}</span>}
                </div>
                <div className={styles.threeCol}>
                  <div className={styles.field}>
                    <label htmlFor="clientCity">City</label>
                    <input
                      id="clientCity"
                      value={form.clientAddress.city}
                      onChange={e => setClientField('city', e.target.value)}
                      className={errors.client_city ? styles.inputError : ''}
                    />
                    {errors.client_city && <span className={styles.errorMsg}>{errors.client_city}</span>}
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="clientPostCode">Post Code</label>
                    <input
                      id="clientPostCode"
                      value={form.clientAddress.postCode}
                      onChange={e => setClientField('postCode', e.target.value)}
                      className={errors.client_postCode ? styles.inputError : ''}
                    />
                    {errors.client_postCode && <span className={styles.errorMsg}>{errors.client_postCode}</span>}
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="clientCountry">Country</label>
                    <input
                      id="clientCountry"
                      value={form.clientAddress.country}
                      onChange={e => setClientField('country', e.target.value)}
                      className={errors.client_country ? styles.inputError : ''}
                    />
                    {errors.client_country && <span className={styles.errorMsg}>{errors.client_country}</span>}
                  </div>
                </div>
              </fieldset>

              {/* ── Invoice Details ── */}
              <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>Invoice Details</legend>
                <div className={styles.twoCol}>
                  <div className={styles.field}>
                    <label htmlFor="createdAt">Invoice Date</label>
                    <div className={styles.dateWrapper}>
                      <input
                        id="createdAt"
                        type="date"
                        value={form.createdAt}
                        onChange={e => setField('createdAt', e.target.value)}
                      />
                      <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M14 2h-1V0h-2v2H5V0H3v2H2C.9 2 0 2.9 0 4v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H2V6h12v10zM4 8h2v2H4zm0 4h2v2H4zm4-4h2v2H8zm0 4h2v2H8zm4-4h2v2h-2zm0 4h2v2h-2z" fill="#7C5DFA"/>
                      </svg>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="paymentTerms">Payment Terms</label>
                    <select
                      id="paymentTerms"
                      value={form.paymentTerms}
                      onChange={e => setField('paymentTerms', Number(e.target.value))}
                    >
                      <option value={1}>Net 1 Day</option>
                      <option value={7}>Net 7 Days</option>
                      <option value={14}>Net 14 Days</option>
                      <option value={30}>Net 30 Days</option>
                    </select>
                  </div>
                </div>
                <div className={styles.field}>
                  <label htmlFor="description">Project Description</label>
                  <input
                    id="description"
                    value={form.description}
                    onChange={e => setField('description', e.target.value)}
                    className={errors.description ? styles.inputError : ''}
                  />
                  {errors.description && <span className={styles.errorMsg}>{errors.description}</span>}
                </div>
              </fieldset>

              {/* ── Item List ── */}
              <fieldset className={styles.fieldset}>
                <legend className={`${styles.legend} ${styles.itemsLegend}`}>Item List</legend>

                {errors.items && (
                  <span className={styles.errorMsg} role="alert">{errors.items}</span>
                )}

                <div className={styles.itemsHeader} aria-hidden="true">
                  <span>Item Name</span>
                  <span>Qty.</span>
                  <span>Price</span>
                  <span>Total</span>
                  <span></span>
                </div>

                {form.items.map((item, index) => (
                  <div key={item.id} className={styles.itemRow}>
                    <div className={styles.field}>
                      <label htmlFor={`item-name-${item.id}`} className={styles.mobileLabel}>
                        Item Name
                      </label>
                      <input
                        id={`item-name-${item.id}`}
                        value={item.name}
                        onChange={e => updateItem(item.id, 'name', e.target.value)}
                        className={errors[`item_name_${index}`] ? styles.inputError : ''}
                        aria-label="Item name"
                      />
                      {errors[`item_name_${index}`] && (
                        <span className={styles.errorMsg}>{errors[`item_name_${index}`]}</span>
                      )}
                    </div>
                    <div className={styles.field}>
                      <label htmlFor={`item-qty-${item.id}`} className={styles.mobileLabel}>
                        Qty.
                      </label>
                      <input
                        id={`item-qty-${item.id}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))}
                        className={errors[`item_qty_${index}`] ? styles.inputError : ''}
                        aria-label="Quantity"
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor={`item-price-${item.id}`} className={styles.mobileLabel}>
                        Price
                      </label>
                      <input
                        id={`item-price-${item.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={e => updateItem(item.id, 'price', Number(e.target.value))}
                        className={errors[`item_price_${index}`] ? styles.inputError : ''}
                        aria-label="Price"
                      />
                    </div>
                    <div className={styles.itemTotal}>
                      <span className={styles.mobileLabel}>Total</span>
                      <span aria-label="Item total">
                        {item.total.toFixed(2)}
                      </span>
                    </div>
                    <button
                      type="button"
                      className={styles.deleteItem}
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove item ${item.name || index + 1}`}
                    >
                      <svg width="13" height="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889H13v1.778H0V.889h3.64L4.528 0z" fill="#888EB0"/>
                      </svg>
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className={styles.addItemBtn}
                  onClick={addItem}
                >
                  + Add New Item
                </button>
              </fieldset>

            </div>

            {/* ── Form Footer Buttons ── */}
            <div className={styles.footer}>
              {isEditing ? (
                <>
                  <Button variant="secondary" onClick={onClose} type="button">
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="dark" onClick={onClose} type="button">
                    Discard
                  </Button>
                  <div className={styles.footerRight}>
                    <Button variant="secondary" onClick={handleSaveDraft} type="button">
                      Save as Draft
                    </Button>
                    <Button variant="primary" type="submit">
                      Save &amp; Send
                    </Button>
                  </div>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  )
}