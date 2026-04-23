import { createContext, useContext, useEffect, useState } from 'react'
import type { Invoice, InvoiceStatus } from '../types/invoice'
import { generateId } from '../utils/generateId'

interface InvoiceContextType {
  invoices: Invoice[]
  filter: InvoiceStatus | 'all'
  setFilter: (filter: InvoiceStatus | 'all') => void
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void
  updateInvoice: (invoice: Invoice) => void
  deleteInvoice: (id: string) => void
  markAsPaid: (id: string) => void
  getInvoice: (id: string) => Invoice | undefined
  markAsPending: (id: string) => void
}

const InvoiceContext = createContext<InvoiceContextType | null>(null)

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('invoices')
    return saved ? JSON.parse(saved) : []
  })

  const [filter, setFilter] = useState<InvoiceStatus | 'all'>('all')

  // Save to localStorage every time invoices change
  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices))
  }, [invoices])

  const addInvoice = (invoiceData: Omit<Invoice, 'id'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: generateId()
    }
    setInvoices(prev => [newInvoice, ...prev])
  }

  const updateInvoice = (updated: Invoice) => {
    setInvoices(prev =>
      prev.map(inv => inv.id === updated.id ? updated : inv)
    )
  }

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id))
  }

  const markAsPaid = (id: string) => {
    setInvoices(prev =>
      prev.map(inv => inv.id === id ? { ...inv, status: 'paid' } : inv)
    )
  }

  const markAsPending = (id: string) => {
  setInvoices(prev =>
    prev.map(inv => inv.id === id ? { ...inv, status: 'pending' } : inv)
  )
}

  const getInvoice = (id: string) => {
    return invoices.find(inv => inv.id === id)
  }

  return (
    <InvoiceContext.Provider value={{
      invoices, filter, setFilter,
      addInvoice, updateInvoice, deleteInvoice, markAsPaid, markAsPending, getInvoice    }}>
      {children}
    </InvoiceContext.Provider>
  )
}

export function useInvoices() {
  const context = useContext(InvoiceContext)
  if (!context) throw new Error('useInvoices must be used inside InvoiceProvider')
  return context
}