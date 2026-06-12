import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Eye,
  FileText,
  IndianRupee,
  Loader2,
  Plus,
  Printer,
  Receipt,
  Trash2,
} from 'lucide-react'

import { API_BASE_URL } from '../config/api'
import useAuth from '../hooks/useAuth'

// ─── helpers ────────────────────────────────────────────────────────────────

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
  'Eighteen', 'Nineteen',
]
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

function toWords(num) {
  if (num === 0) return 'Zero Only'
  function h(n) {
    let s = ''
    if (n >= 100) { s += ONES[Math.floor(n / 100)] + ' Hundred '; n %= 100 }
    if (n >= 20) { s += TENS[Math.floor(n / 10)] + ' '; n %= 10 }
    if (n > 0) s += ONES[n] + ' '
    return s
  }
  let result = ''
  let n = num
  if (n >= 100000) { result += h(Math.floor(n / 100000)) + 'Lakh '; n %= 100000 }
  if (n >= 1000) { result += h(Math.floor(n / 1000)) + 'Thousand '; n %= 1000 }
  result += h(n)
  return result.trim() + ' Only'
}

function fmt(n) {
  return '₹ ' + n.toLocaleString('en-IN', { minimumFractionDigits: 2 })
}

function toDisplayDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}-${m}-${y}`
}

function nextInvoiceNo() {
  return `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`
}

// ─── constants ───────────────────────────────────────────────────────────────

const COMPANY = {
  name: 'Sundarban Greenland Tourism',
  addressLine1: '248, Fulbagan Road, Gr. Floor, Shop No-5, P.O.-Baghajatin,',
  addressLine2: 'P.S.-Patuli, Kolkata 700086, West Bengal, India.',
  phone: '+91 62908 86807 / +91 93306 63490',
  email: 'info@sundarbanwildexplorers.com',
  whatsapp: '+916290886807',
}

// ─── sample invoices ─────────────────────────────────────────────────────────

const SAMPLE_INVOICES = [
  {
    id: 'INV-2026-048',
    date: '01-06-2026',
    journeyDate: '08-06-2026',
    guest: { name: 'RAHUL SEN', address: 'Salt Lake, Kolkata', phone: '9800123456' },
    items: [{ sl: 1, name: 'Sundarban 1 Night 2 Days Trip', persons: 4, price: 4625, amount: 18500 }],
    description: 'Kolkata to Kolkata\n1 Night 2 Days\n2 AC Accommodation',
    subTotal: 18500,
    received: 5000,
    status: 'Paid',
  },
  {
    id: 'INV-2026-047',
    date: '03-06-2026',
    journeyDate: '12-06-2026',
    guest: { name: 'ANANYA ROY', address: 'Newtown, Kolkata', phone: '9732100456' },
    items: [{ sl: 1, name: 'Weekend Cruise – 1 Night 2 Days', persons: 3, price: 8000, amount: 24000 }],
    description: 'Kolkata to Kolkata\n1 Night 2 Days\n1 AC Accommodation',
    subTotal: 24000,
    received: 0,
    status: 'Pending',
  },
  {
    id: 'INV-2026-046',
    date: '28-05-2026',
    journeyDate: '05-06-2026',
    guest: { name: 'DAVID MILLER', address: 'Park Street, Kolkata', phone: '9123456789' },
    items: [{ sl: 1, name: 'Birding Tour – 2 Nights 3 Days', persons: 6, price: 5200, amount: 31200 }],
    description: 'Kolkata to Kolkata\n2 Nights 3 Days\n3 AC Accommodation',
    subTotal: 31200,
    received: 5000,
    status: 'Overdue',
  },
  {
    id: 'INV-2026-045',
    date: '25-05-2026',
    journeyDate: '10-06-2026',
    guest: { name: 'MEERA KAPOOR', address: 'Alipore, Kolkata', phone: '9874563210' },
    items: [{ sl: 1, name: 'Luxury Houseboat – 3 Nights 4 Days', persons: 2, price: 21400, amount: 42800 }],
    description: 'Kolkata to Kolkata\n3 Nights 4 Days\nLuxury Houseboat',
    subTotal: 42800,
    received: 15000,
    status: 'Paid',
  },
  {
    id: 'INV-2026-044',
    date: '20-05-2026',
    journeyDate: '28-05-2026',
    guest: { name: 'SOURAV DAS', address: 'Behala, Kolkata', phone: '9012345678' },
    items: [{ sl: 1, name: 'Sundarbans Safari – 1 Night 2 Days', persons: 3, price: 5200, amount: 15600 }],
    description: 'Kolkata to Kolkata\n1 Night 2 Days\n1 AC Accommodation',
    subTotal: 15600,
    received: 3000,
    status: 'Overdue',
  },
  {
    id: 'INV-2026-043',
    date: '18-05-2026',
    journeyDate: '25-05-2026',
    guest: { name: 'PRIYA SHARMA', address: 'Tollygunge, Kolkata', phone: '9900123456' },
    items: [{ sl: 1, name: 'Photography Expedition – 2 Nights 3 Days', persons: 4, price: 7225, amount: 28900 }],
    description: 'Kolkata to Kolkata\n2 Nights 3 Days\n2 AC Accommodation',
    subTotal: 28900,
    received: 10000,
    status: 'Paid',
  },
]

const statusStyle = {
  Paid: 'bg-emerald-50 text-emerald-700',
  Pending: 'bg-amber-50 text-amber-700',
  Overdue: 'bg-red-50 text-red-700',
}

// ─── input / label helpers ────────────────────────────────────────────────────

const inputCls =
  'h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60'

const labelCls = 'mb-1.5 block text-sm font-medium text-slate-700'

// ─── create invoice form ──────────────────────────────────────────────────────

function CreateInvoiceForm({ onBack, onCreated }) {
  const { authFetch } = useAuth()
  const [packages, setPackages] = useState([])
  const [loadingPkgs, setLoadingPkgs] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const [prefix, setPrefix] = useState('INV')
  const [nextNum, setNextNum] = useState(null)
  const [loadingNum, setLoadingNum] = useState(true)

  const invoiceNo = nextNum !== null
    ? `${prefix}-${String(nextNum).padStart(3, '0')}`
    : ''

  const [form, setForm] = useState({
    customerName: '',
    address: '',
    phone: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    journeyDate: '',
    packageId: '',
    packageName: '',
    packagePrice: 0,
    persons: 1,
    description: '',
    received: 0,
    roomType: 'Non AC',
    acExtraAmount: 0,
  })

  const amount =
    Number(form.persons) * Number(form.packagePrice) +
    (form.roomType === 'AC' ? Number(form.acExtraAmount || 0) : 0)

  useEffect(() => {
    authFetch(`${API_BASE_URL}/packages`)
      .then((r) => r.json())
      .then((r) => { setPackages(r.data || []); setLoadingPkgs(false) })
      .catch(() => setLoadingPkgs(false))
  }, [authFetch])

  useEffect(() => {
    if (!prefix.trim()) return
    setLoadingNum(true)
    const trimmed = prefix.trim().toUpperCase()
    authFetch(`${API_BASE_URL}/invoices/next-number?prefix=${encodeURIComponent(trimmed)}`)
      .then((r) => r.json())
      .then((r) => { setNextNum(r.data?.number ?? 1); setLoadingNum(false) })
      .catch(() => { setNextNum(1); setLoadingNum(false) })
  }, [prefix, authFetch])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handlePackageChange(e) {
    const pkg = packages.find((p) => p._id === e.target.value)
    setForm((prev) => ({
      ...prev,
      packageId: e.target.value,
      packageName: pkg?.title || '',
      packagePrice: pkg?.price || 0,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaveError('')
    setSaving(true)

    const baseAmount = Number(form.persons) * Number(form.packagePrice)
    const extraAmount = form.roomType === 'AC' ? Number(form.acExtraAmount || 0) : 0
    const subTotal = baseAmount + extraAmount
    const received = Number(form.received)

    const items = [
      {
        sl: 1,
        name: form.packageName,
        persons: Number(form.persons),
        price: Number(form.packagePrice),
        amount: baseAmount,
      },
    ]

    const payload = {
      invoiceNo,
      date: toDisplayDate(form.invoiceDate),
      journeyDate: toDisplayDate(form.journeyDate),
      guest: {
        name: form.customerName.toUpperCase(),
        address: form.address,
        phone: form.phone,
      },
      items,
      roomType: form.roomType,
      acExtraAmount: extraAmount,
      description: form.description,
      subTotal,
      received,
      status: received >= subTotal ? 'Paid' : 'Pending',
    }

    try {
      const response = await authFetch(`${API_BASE_URL}/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Failed to save invoice')
      onCreated({ ...payload, id: payload.invoiceNo })
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <button
        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Invoices
      </button>

      <div className="flex items-center gap-3">
        <span className="rounded-xl bg-slate-950 p-2.5 text-emerald-400">
          <Receipt aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-semibold text-slate-950">Create New Invoice</h1>
          <p className="text-sm text-slate-500">Fill in the details to generate an invoice</p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>

        {/* Customer details + Invoice meta */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Customer details */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-semibold text-slate-950">Customer Details</h2>
            <div className="space-y-4">
              <div>
                <label className={labelCls} htmlFor="customerName">Customer Name</label>
                <input
                  className={inputCls}
                  id="customerName"
                  name="customerName"
                  onChange={handleChange}
                  placeholder="e.g. Syed Ahmed Ali"
                  required
                  type="text"
                  value={form.customerName}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="address">Address</label>
                <textarea
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  id="address"
                  name="address"
                  onChange={handleChange}
                  placeholder="e.g. Newtown, Kolkata"
                  required
                  rows={2}
                  value={form.address}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="phone">Phone Number</label>
                <input
                  className={inputCls}
                  id="phone"
                  name="phone"
                  onChange={handleChange}
                  placeholder="e.g. 917013912139"
                  required
                  type="text"
                  value={form.phone}
                />
              </div>
            </div>
          </div>

          {/* Invoice meta */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-semibold text-slate-950">Invoice Details</h2>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Invoice Number</label>
                <div className="flex items-center gap-2">
                  {/* Prefix field */}
                  <input
                    className="h-10 w-28 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold uppercase text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                    id="prefix"
                    maxLength={10}
                    onChange={(e) => setPrefix(e.target.value.toUpperCase())}
                    placeholder="INV"
                    required
                    type="text"
                    value={prefix}
                  />
                  <span className="text-slate-400 font-semibold">-</span>
                  {/* Auto number (read-only) */}
                  <input
                    className="h-10 w-20 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-center font-mono text-sm font-bold text-emerald-800 outline-none"
                    disabled
                    readOnly
                    type="text"
                    value={loadingNum ? '…' : String(nextNum ?? 1).padStart(3, '0')}
                  />
                </div>
                {/* Full invoice number preview */}
                {invoiceNo && (
                  <p className="mt-1.5 text-xs text-slate-500">
                    Invoice No: <span className="font-semibold text-slate-900">{invoiceNo}</span>
                  </p>
                )}
              </div>
              <div>
                <label className={labelCls} htmlFor="invoiceDate">Invoice Date</label>
                <input
                  className={inputCls}
                  id="invoiceDate"
                  name="invoiceDate"
                  onChange={handleChange}
                  required
                  type="date"
                  value={form.invoiceDate}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="journeyDate">Journey Date</label>
                <input
                  className={inputCls}
                  id="journeyDate"
                  name="journeyDate"
                  onChange={handleChange}
                  required
                  type="date"
                  value={form.journeyDate}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Item row */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-950">Package / Item</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Tour package */}
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="packageId">Tour Package</label>
              {loadingPkgs ? (
                <div className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading packages…
                </div>
              ) : (
                <select
                  className={inputCls}
                  id="packageId"
                  onChange={handlePackageChange}
                  required
                  value={form.packageId}
                >
                  <option value="">Select a package</option>
                  {packages.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* No of persons */}
            <div>
              <label className={labelCls} htmlFor="persons">No of Persons</label>
              <input
                className={inputCls}
                id="persons"
                min={1}
                name="persons"
                onChange={handleChange}
                required
                type="number"
                value={form.persons}
              />
            </div>

            {/* Package price (read-only) */}
            <div>
              <label className={labelCls} htmlFor="packagePrice">Package Price (per person)</label>
              <input
                className={inputCls}
                disabled
                id="packagePrice"
                placeholder="Auto from package"
                readOnly
                type="text"
                value={form.packagePrice ? fmt(form.packagePrice) : ''}
              />
            </div>

            {/* Room Type Toggle */}
            <div>
              <label className={labelCls}>Room Type</label>
              <div className="flex h-10 rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  className={`flex-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${form.roomType === 'Non AC' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                  onClick={() => setForm(prev => ({ ...prev, roomType: 'Non AC', acExtraAmount: 0 }))}
                >
                  Non-AC
                </button>
                <button
                  type="button"
                  className={`flex-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${form.roomType === 'AC' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                  onClick={() => setForm(prev => ({ ...prev, roomType: 'AC' }))}
                >
                  AC Room
                </button>
              </div>
            </div>

            {/* AC Extra Charge */}
            {form.roomType === 'AC' && (
              <div>
                <label className={labelCls} htmlFor="acExtraAmount">AC Room Extra Charge (₹)</label>
                <input
                  className={inputCls}
                  id="acExtraAmount"
                  min={0}
                  name="acExtraAmount"
                  onChange={handleChange}
                  placeholder="e.g. 1500"
                  required
                  type="number"
                  value={form.acExtraAmount || ''}
                />
              </div>
            )}
          </div>

          {/* Amount display */}
          {amount > 0 && (
            <div className="mt-4 flex items-center justify-end gap-3 rounded-lg bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-500">
                {form.persons} person{Number(form.persons) !== 1 ? 's' : ''} × {fmt(form.packagePrice)}
                {form.roomType === 'AC' && Number(form.acExtraAmount) > 0 && (
                  <span className="font-semibold text-slate-700"> + {fmt(Number(form.acExtraAmount))} AC Charge</span>
                )}
              </span>
              <span className="text-lg font-bold text-slate-950">= {fmt(amount)}</span>
            </div>
          )}
        </div>

        {/* Description + Received */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className={labelCls} htmlFor="description">Description</label>
            <textarea
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              id="description"
              name="description"
              onChange={handleChange}
              placeholder="e.g. Kolkata to Kolkata&#10;1 Night 2 Days&#10;2 AC Accommodation"
              rows={4}
              value={form.description}
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-semibold text-slate-950">Payment Summary</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm">
                <span className="text-slate-600">Sub Total</span>
                <span className="font-semibold text-slate-950">{amount > 0 ? fmt(amount) : '—'}</span>
              </div>
              <div>
                <label className={labelCls} htmlFor="received">Advance Received (₹)</label>
                <input
                  className={inputCls}
                  id="received"
                  min={0}
                  name="received"
                  onChange={handleChange}
                  placeholder="0"
                  type="number"
                  value={form.received}
                />
              </div>
              {amount > 0 && (
                <div
                  className="flex items-center justify-between rounded-lg bg-slate-900 px-4 py-3 text-sm text-white font-bold"
                >
                  <span>Total Due</span>
                  <span>{fmt(amount - Number(form.received))}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        {saveError && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {saveError}
          </p>
        )}
        <div className="flex justify-end gap-3">
          <button
            className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            disabled={saving}
            onClick={onBack}
            type="button"
          >
            Cancel
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-colors disabled:opacity-60"
            disabled={saving}
            type="submit"
          >
            {saving ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
            ) : (
              <><Receipt className="h-4 w-4" /> Generate Invoice</>
            )}
          </button>
        </div>
      </form>
    </section>
  )
}

// ─── invoice document ─────────────────────────────────────────────────────────

function InvoiceDocument({ inv }) {
  const tableTotal = inv.items.reduce((sum, i) => sum + i.amount, 0)
  const total = inv.subTotal - inv.received
  const isAC = inv.roomType === 'AC' || (inv.items && inv.items.some(item => item.name.toLowerCase().includes('ac')))

  return (
    <>
      <style>{`
        @media print {
          aside, header { display: none !important; }
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-card {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
        }
      `}</style>

      <div className="no-print mb-6 flex justify-end gap-3">
        <button
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          onClick={() => window.print()}
          type="button"
        >
          <Printer className="h-4 w-4" />
          Print Invoice
        </button>
        <button
          className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer"
          onClick={() => window.print()}
          type="button"
        >
          <FileText className="h-4 w-4" />
          Save as PDF
        </button>
      </div>

      <div className="print-card mx-auto max-w-3xl rounded-2xl border border-slate-100 bg-white p-8 sm:p-12 shadow-md transition-all">
        {/* Company Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              alt="Sundarban Greenland Tourism"
              className="h-16 w-auto shrink-0 object-contain mix-blend-multiply"
              src="/logo.png"
            />
            <div>
              <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">{COMPANY.name}</h1>
              <p className="mt-1 text-xs text-slate-500">Greenland & Wild Explorers Group</p>
            </div>
          </div>
          <div className="space-y-1 text-xs text-slate-500 sm:text-right leading-normal max-w-sm">
            <p className="font-medium text-slate-700">{COMPANY.addressLine1}</p>
            <p className="font-medium text-slate-700">{COMPANY.addressLine2}</p>
            <p className="pt-1"><span className="font-semibold text-slate-700">Phone:</span> {COMPANY.phone}</p>
            <p>
              <span className="font-semibold text-slate-700">Email:</span>{' '}
              <a className="text-emerald-600 hover:underline" href={`mailto:${COMPANY.email}`}>
                {COMPANY.email}
              </a>
            </p>
          </div>
        </div>

        <div className="my-8 border-t border-slate-100"></div>

        {/* Invoice Title & Metadata */}
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-start">
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bill To</span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">{inv.guest.name}</h2>
            </div>
            <div className="space-y-1 text-sm text-slate-600">
              <p><span className="font-medium text-slate-400">Address:</span> {inv.guest.address || '—'}</p>
              <p><span className="font-medium text-slate-400">Phone:</span> {inv.guest.phone || '—'}</p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50/80 p-4 border border-slate-100/50 min-w-[240px] space-y-2.5">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-slate-900 text-base">INVOICE</span>
              <span className="font-mono text-xs font-semibold text-slate-500">{inv.id}</span>
            </div>
            <div className="border-t border-slate-200/50 my-1.5"></div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Issue Date</span>
                <span className="font-semibold text-slate-800">{inv.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Journey Date</span>
                <span className="font-semibold text-slate-800">{inv.journeyDate}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-400">Accommodation</span>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                  isAC ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-100 text-slate-600'
                }`}>
                  {isAC ? 'AC' : 'Non-AC'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mt-8 overflow-hidden rounded-xl border border-slate-100">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="w-12 py-3.5 text-center font-bold">#</th>
                <th className="px-4 py-3.5 text-left font-bold">Description</th>
                <th className="px-4 py-3.5 text-center font-bold">Persons</th>
                <th className="px-4 py-3.5 text-right font-bold">Unit Price</th>
                <th className="px-6 py-3.5 text-right font-bold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inv.items.map((item, index) => (
                <tr className="hover:bg-slate-50/30 transition-colors" key={item.sl || index}>
                  <td className="py-4 text-center font-mono text-xs text-slate-400">{item.sl || (index + 1)}</td>
                  <td className="px-4 py-4 font-semibold text-slate-900">{item.name}</td>
                  <td className="px-4 py-4 text-center text-slate-600 font-medium">{item.persons || '—'}</td>
                  <td className="px-4 py-4 text-right text-slate-600 font-mono text-xs">{fmt(item.price)}</td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-900 font-mono">{fmt(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Details */}
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 max-w-md">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Notes / Remarks</span>
            <p className="mt-1.5 whitespace-pre-line text-xs leading-relaxed text-slate-500 bg-slate-50/50 rounded-xl p-4 border border-slate-100">
              {inv.description || 'No additional booking remarks.'}
            </p>
          </div>
          <div className="w-full sm:w-72 shrink-0 space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-500 py-1 px-2">
              <span>Sub Total</span>
              <span className="font-semibold text-slate-800 font-mono">{fmt(tableTotal)}</span>
            </div>
            {inv.acExtraAmount > 0 && (
              <div className="flex justify-between items-center text-xs text-slate-500 py-1 px-2">
                <span>AC Room Charge</span>
                <span className="font-semibold text-slate-800 font-mono">+{fmt(inv.acExtraAmount)}</span>
              </div>
            )}
            {inv.acExtraAmount > 0 && (
              <div className="flex justify-between items-center text-xs text-slate-500 py-1 px-2 border-t border-slate-100 mt-1 pt-1.5">
                <span className="font-semibold text-slate-900">Gross Total</span>
                <span className="font-semibold text-slate-900 font-mono">{fmt(inv.subTotal)}</span>
              </div>
            )}
            {inv.received > 0 && (
              <div className="flex justify-between items-center text-xs py-1 px-2 bg-emerald-50/50 rounded-lg text-emerald-800">
                <span className="font-medium">Advance Paid</span>
                <span className="font-bold font-mono">-{fmt(inv.received)}</span>
              </div>
            )}
            <div className="flex justify-between items-center rounded-xl bg-slate-900 px-4 py-3.5 text-white shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Total Due</span>
              <span className="font-extrabold text-base font-mono">{fmt(total)}</span>
            </div>
          </div>
        </div>

        {/* Amount In Words */}
        <div className="mt-8 rounded-xl bg-slate-50/40 p-4 border border-slate-100 text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1">Invoice Amount In Words</span>
          <span className="font-semibold text-slate-800">{toWords(total)}</span>
        </div>

        {/* Signature Section */}
        <div className="mt-12 flex justify-between items-end">
          <div className="text-[10px] uppercase tracking-wider text-slate-400">
            Thank you for choosing Sundarban Greenland Tourism.
          </div>
          <div className="text-right space-y-1.5">
            <div className="w-40 border-b border-slate-200 mx-auto"></div>
            <p className="text-[11px] font-bold text-slate-900">Authorized Signatory</p>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest">{COMPANY.name}</p>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-10 border-t border-slate-100 pt-4 text-center">
          <p className="text-[9px] uppercase tracking-widest text-slate-400 font-medium">
            This is a computer generated invoice and requires no physical signature.
          </p>
        </div>
      </div>
    </>
  )
}

// ─── list view ────────────────────────────────────────────────────────────────

function fmtShort(n) {
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(1) + 'Cr'
  if (n >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L'
  if (n >= 1000) return '₹' + (n / 1000).toFixed(1) + 'K'
  return '₹' + n
}

const toneMap = {
  slate:   { bg: 'bg-slate-50',      icon: 'bg-slate-100 text-slate-700',   val: 'text-slate-950',  lbl: 'text-slate-500',  chg: 'text-slate-400' },
  emerald: { bg: 'bg-emerald-50/50', icon: 'bg-emerald-100 text-emerald-700', val: 'text-emerald-900', lbl: 'text-emerald-700', chg: 'text-emerald-600' },
  amber:   { bg: 'bg-amber-50/50',   icon: 'bg-amber-100 text-amber-700',   val: 'text-amber-900',  lbl: 'text-amber-700',  chg: 'text-amber-600' },
  red:     { bg: 'bg-red-50/50',     icon: 'bg-red-100 text-red-700',       val: 'text-red-900',    lbl: 'text-red-700',    chg: 'text-red-600' },
}

function ListView({ onView, onNew }) {
  const { authFetch } = useAuth()
  const [invoiceList, setInvoiceList] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    authFetch(`${API_BASE_URL}/invoices`)
      .then((r) => r.json())
      .then((r) => { setInvoiceList(r.data || []); setLoading(false) })
      .catch(() => { setInvoiceList(SAMPLE_INVOICES); setLoading(false) })
  }, [authFetch])

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return
    setDeletingId(id)
    try {
      if (typeof id === 'string' && id.startsWith('INV-')) {
        setInvoiceList((prev) => prev.filter((inv) => (inv._id || inv.id) !== id))
        return
      }
      const response = await authFetch(`${API_BASE_URL}/invoices/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.message || 'Failed to delete invoice')
      }
      setInvoiceList((prev) => prev.filter((inv) => (inv._id || inv.id) !== id))
    } catch (err) {
      alert(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const displayList = loading ? [] : invoiceList.length > 0 ? invoiceList : SAMPLE_INVOICES

  const stats = useMemo(() => {
    const byStatus = (s) => displayList.filter((i) => i.status === s)
    const sumDue = (list) =>
      list.reduce((acc, i) => acc + ((i.subTotal || 0) - (i.received || 0)), 0)

    const paid = byStatus('Paid')
    const pending = byStatus('Pending')
    const overdue = byStatus('Overdue')

    return [
      {
        icon: FileText,
        label: 'Total Invoices',
        value: displayList.length,
        change: `${displayList.length} record${displayList.length !== 1 ? 's' : ''}`,
        tone: 'slate',
      },
      {
        icon: IndianRupee,
        label: 'Paid',
        value: paid.length,
        change: paid.length ? `${fmtShort(sumDue(paid))} collected` : 'None yet',
        tone: 'emerald',
      },
      {
        icon: Clock,
        label: 'Pending',
        value: pending.length,
        change: pending.length ? `${fmtShort(sumDue(pending))} awaiting` : 'None',
        tone: 'amber',
      },
      {
        icon: AlertCircle,
        label: 'Overdue',
        value: overdue.length,
        change: overdue.length ? `${fmtShort(sumDue(overdue))} at risk` : 'None',
        tone: 'red',
      },
    ]
  }, [displayList])

  return (
    <section className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Company info card */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 space-y-1">
            <h2 className="text-xl font-bold text-green-700">{COMPANY.name}</h2>
            <p className="text-sm text-gray-600">
              <span className="font-bold text-gray-900">Address:</span>{' '}
              {COMPANY.addressLine1}
            </p>
            <p className="text-sm text-gray-600">{COMPANY.addressLine2}</p>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-700">
                <span className="font-medium text-gray-900">Phone:</span>{' '}
                {COMPANY.phone}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium text-gray-900">E-mail:</span>{' '}
                <a className="text-blue-600 hover:underline" href={`mailto:${COMPANY.email}`}>
                  {COMPANY.email}
                </a>
              </p>
            </div>
          </div>
          <img
            alt="Sundarban Greenland Tourism"
            className="h-20 w-auto shrink-0 object-contain mix-blend-multiply"
            src="/logo.png"
          />
        </div>
      </div>

      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-slate-950 p-2.5 text-emerald-400">
            <Receipt aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-slate-950">Invoices</h1>
            <p className="text-sm text-slate-500">Manage billing and payment records</p>
          </div>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-sm hover:bg-emerald-400 transition-colors"
          onClick={onNew}
          type="button"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          New Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon
          const t = toneMap[s.tone]
          return (
            <div key={s.label} className={`rounded-xl border border-slate-200 ${t.bg} p-5 shadow-sm`}>
              <div className="flex items-center justify-between">
                <span className={`rounded-lg p-2 ${t.icon}`}>
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <span className={`text-xs font-medium ${t.chg}`}>{s.change}</span>
              </div>
              <div className={`mt-4 text-3xl font-semibold ${t.val}`}>{s.value}</div>
              <div className={`mt-1 text-sm font-medium ${t.lbl}`}>{s.label}</div>
            </div>
          )
        })}
      </div>

      {/* Table */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-950">All Invoices</h2>
            <p className="mt-1 text-sm text-slate-500">
              {loading ? 'Loading…' : `${displayList.length} records`}
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Jun 2026
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-215 text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Invoice #</th>
                <th className="px-5 py-3 font-medium">Guest</th>
                <th className="px-5 py-3 font-medium">Tour Package</th>
                <th className="px-5 py-3 font-medium">Issue Date</th>
                <th className="px-5 py-3 font-medium">Journey Date</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td className="px-5 py-8 text-center text-sm text-slate-400" colSpan={8}>
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  </td>
                </tr>
              )}
              {!loading && displayList.map((inv) => (
                <tr className="hover:bg-slate-50/80 transition-colors" key={inv._id || inv.id}>
                  <td className="px-5 py-4">
                    <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-700">
                      {inv.invoiceNo || inv.id}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                        {inv.guest.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                      </div>
                      <span className="font-medium text-slate-900">{inv.guest.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{inv.items[0]?.name}</td>
                  <td className="px-5 py-4 text-slate-600">{inv.date}</td>
                  <td className="px-5 py-4 text-slate-600">{inv.journeyDate}</td>
                  <td className="px-5 py-4 font-semibold text-slate-900">
                    {fmt(inv.subTotal - inv.received)}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle[inv.status]}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        aria-label={`View ${inv.invoiceNo || inv.id}`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                        onClick={() => onView({ ...inv, id: inv.invoiceNo || inv.id })}
                        type="button"
                      >
                        <Eye aria-hidden="true" className="h-3.5 w-3.5" />
                        View
                      </button>
                      <button
                        aria-label={`Delete ${inv.invoiceNo || inv.id}`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer disabled:opacity-60"
                        disabled={deletingId === (inv._id || inv.id)}
                        onClick={() => handleDelete(inv._id || inv.id)}
                        type="button"
                      >
                        <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 px-5 py-4">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-950">{displayList.length}</span> invoice{displayList.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>
    </section>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────

function InvoicePage() {
  const [view, setView] = useState('list')   // 'list' | 'create' | 'detail'
  const [selected, setSelected] = useState(null)

  if (view === 'create') {
    return (
      <CreateInvoiceForm
        onBack={() => setView('list')}
        onCreated={(inv) => { setSelected(inv); setView('detail') }}
      />
    )
  }

  if (view === 'detail' && selected) {
    return (
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <button
          className="no-print mb-4 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors"
          onClick={() => { setSelected(null); setView('list') }}
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Invoices
        </button>
        <InvoiceDocument inv={selected} />
      </section>
    )
  }

  return (
    <ListView
      onNew={() => setView('create')}
      onView={(inv) => { setSelected(inv); setView('detail') }}
    />
  )
}

export default InvoicePage
