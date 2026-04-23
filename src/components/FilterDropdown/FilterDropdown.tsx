import { useState, useRef, useEffect } from 'react'
import { useInvoices } from '../../context/InvoiceContext'
import type { InvoiceStatus } from '../../types/invoice'
import styles from './FilterDropdown.module.css'

const OPTIONS: { label: string; value: InvoiceStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
]

export default function FilterDropdown() {
  const { filter, setFilter } = useInvoices()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close dropdown when user clicks outside it
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on ESC key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  // const _currentLabel = OPTIONS.find(o => o.value === filter)?.label ?? 'All'

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>
          <span className={styles.fullText}>Filter by status</span>
          <span className={styles.shortText}>Filter</span>
        </span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.open : ''}`}
          width="11" height="7" xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1l4.228 4.228L9.456 1" stroke="#7C5DFA" strokeWidth="2" fill="none"/>
        </svg>
      </button>

      {isOpen && (
        <ul className={styles.dropdown} role="listbox" aria-label="Filter invoices by status">
          {OPTIONS.map(option => (
            <li
              key={option.value}
              role="option"
              aria-selected={filter === option.value}
              className={styles.option}
              onClick={() => { setFilter(option.value); setIsOpen(false) }}
            >
              <span className={`${styles.checkbox} ${filter === option.value ? styles.checked : ''}`}>
                {filter === option.value && (
                  <svg width="10" height="8" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4.304L3.696 7l5.956-6" stroke="#fff" strokeWidth="2" fill="none"/>
                  </svg>
                )}
              </span>
              <span className={styles.optionLabel}>{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}