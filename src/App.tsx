import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { InvoiceProvider } from './context/InvoiceContext'
import Sidebar from './components/Sidebar/Sidebar'
import ListPage from './pages/ListPage'
import DetailPage from './pages/DetailPage'
import InvoiceForm from './components/InvoiceForm/InvoiceForm'
import { useInvoices } from './context/InvoiceContext'

// Inner component so it can access InvoiceContext
function AppRoutes() {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const { getInvoice } = useInvoices()

  function handleEdit(id: string) {
    setEditingId(id)
    setShowForm(true)
  }

  function handleClose() {
    setShowForm(false)
    setEditingId(null)
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <ListPage onNewInvoice={() => { setEditingId(null); setShowForm(true) }} />
          } />
          <Route path="/invoice/:id" element={
            <DetailPage onEdit={handleEdit} />
          } />
        </Routes>
      </main>

      <InvoiceForm
        isOpen={showForm}
        onClose={handleClose}
        invoiceToEdit={editingId ? getInvoice(editingId) : null}
      />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <InvoiceProvider>
        <AppRoutes />
      </InvoiceProvider>
    </ThemeProvider>
  )
}

export default App