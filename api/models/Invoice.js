const mongoose = require('mongoose')

const invoiceItemSchema = new mongoose.Schema(
  {
    sl: { type: Number, required: true },
    name: { type: String, required: true, trim: true },
    persons: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false },
)

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, required: true, unique: true, trim: true },
    date: { type: String, required: true },
    journeyDate: { type: String, required: true },
    guest: {
      name: { type: String, required: true, trim: true },
      address: { type: String, default: '', trim: true },
      phone: { type: String, default: '', trim: true },
    },
    items: { type: [invoiceItemSchema], required: true, validate: [(v) => v.length > 0, 'At least one item required'] },
    roomType: { type: String, enum: ['AC', 'Non AC'], default: 'Non AC' },
    acExtraAmount: { type: Number, default: 0 },
    description: { type: String, default: '', trim: true },
    subTotal: { type: Number, required: true, min: 0 },
    received: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
  },
  { timestamps: true },
)

invoiceSchema.index({ createdAt: -1 })
invoiceSchema.index({ status: 1 })

module.exports = mongoose.model('Invoice', invoiceSchema)
