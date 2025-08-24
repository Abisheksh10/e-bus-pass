import mongoose from 'mongoose'
const { Schema } = mongoose

const buspassSchema = new Schema({
  fname:     { type: String, required: true },
  lname:     { type: String, required: true },
  year:      { type: String, required: true },
  branch:    { type: String, required: true },
  busno:     { type: String }, // optional; can be assigned by admin
  phno:      { type: String, required: true },
  address:   { type: String, required: true },
  route:     { type: String, required: true }, // "<source> → <destination>"
  source:    { type: String, required: true },
  destination:{ type: String, required: true },
  passType:  { type: String, enum: ['weekly','monthly','yearly'], default: 'monthly' },

  rollno:    { type: String, required: true, unique: true },
  datevalid: { type: String, required: true }, // e.g., 'MMYYYY'

  distanceKm:{ type: Number, default: 0 },
  priceINR:  { type: Number, default: 0 },

  isAvailable:{ type: Boolean, default: false }, // approved by admin
  createdBy: { type: Schema.Types.ObjectId, ref: 'Registration' }, // student who applied
  paid:      { type: Boolean, default: false } // set true via payment webhook (optional)
}, { timestamps: true })

export default mongoose.model('BusPass', buspassSchema)
