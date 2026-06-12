const Invoice = require('../models/Invoice')

async function listInvoices(req, res, next) {
  try {
    const { status } = req.query
    const filter = status ? { status } : {}
    const invoices = await Invoice.find(filter).sort({ createdAt: -1 })
    res.json({ message: 'Invoices fetched', data: invoices })
  } catch (err) {
    next(err)
  }
}

async function getInvoice(req, res, next) {
  try {
    const invoice = await Invoice.findById(req.params.id)
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' })
    res.json({ message: 'Invoice fetched', data: invoice })
  } catch (err) {
    next(err)
  }
}

async function createInvoice(req, res, next) {
  try {
    const { invoiceNo, date, journeyDate, guest, items, description, subTotal, received, status, roomType, acExtraAmount } =
      req.body

    const invoice = await Invoice.create({
      invoiceNo,
      date,
      journeyDate,
      guest,
      items,
      description,
      subTotal: Number(subTotal),
      received: Number(received) || 0,
      status: status || 'Pending',
      roomType: roomType || 'Non AC',
      acExtraAmount: Number(acExtraAmount) || 0,
    })

    res.status(201).json({ message: 'Invoice created', data: invoice })
  } catch (err) {
    next(err)
  }
}

async function updateInvoice(req, res, next) {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' })
    res.json({ message: 'Invoice updated', data: invoice })
  } catch (err) {
    next(err)
  }
}

async function deleteInvoice(req, res, next) {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id)
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' })
    res.json({ message: 'Invoice deleted' })
  } catch (err) {
    next(err)
  }
}

async function getNextInvoiceNumber(req, res, next) {
  try {
    const prefix = (req.query.prefix || 'INV').trim().toUpperCase()
    const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`^${escaped}-`)

    const last = await Invoice.findOne({ invoiceNo: regex }).sort({ invoiceNo: -1 })

    let nextNum = 1
    if (last) {
      const tail = last.invoiceNo.slice(prefix.length + 1)
      const parsed = parseInt(tail, 10)
      if (!Number.isNaN(parsed)) nextNum = parsed + 1
    }

    const invoiceNo = `${prefix}-${String(nextNum).padStart(3, '0')}`
    res.json({ message: 'Next invoice number', data: { prefix, number: nextNum, invoiceNo } })
  } catch (err) {
    next(err)
  }
}

module.exports = { listInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice, getNextInvoiceNumber }
